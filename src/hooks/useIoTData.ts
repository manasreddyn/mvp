import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface IoTDevice {
  id: string;
  device_name: string;
  device_type: 'sensor' | 'actuator' | 'gateway' | 'hybrid';
  category: 'smart_home' | 'industrial' | 'environmental' | 'fleet' | 'healthcare' | 'energy' | 'railway';
  location: {
    latitude?: number;
    longitude?: number;
    zone?: string;
  };
  status: 'active' | 'inactive' | 'maintenance' | 'error';
  firmware_version: string | null;
  last_seen: string;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface SensorReading {
  id: string;
  device_id: string;
  sensor_type: string;
  value: number;
  unit: string;
  quality: number;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface IoTAlert {
  id: string;
  device_id: string;
  alert_type: 'info' | 'warning' | 'critical';
  severity: number;
  title: string;
  message: string | null;
  is_acknowledged: boolean;
  acknowledged_at: string | null;
  resolved_at: string | null;
  created_at: string;
  device?: IoTDevice;
}

export interface AIPrediction {
  id: string;
  device_id: string;
  prediction_type: string;
  predicted_value: {
    risk_score?: number;
    recommended_action?: string;
    estimated_rul_days?: number;
    potential_savings?: number;
  };
  confidence_score: number;
  prediction_timestamp: string;
  device?: IoTDevice;
}

export function useIoTDevices() {
  const [devices, setDevices] = useState<IoTDevice[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchDevices();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('iot-devices-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'iot_devices' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setDevices(prev => [...prev, payload.new as IoTDevice]);
          } else if (payload.eventType === 'UPDATE') {
            setDevices(prev => prev.map(d => 
              d.id === payload.new.id ? payload.new as IoTDevice : d
            ));
          } else if (payload.eventType === 'DELETE') {
            setDevices(prev => prev.filter(d => d.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchDevices = async () => {
    try {
      const { data, error } = await supabase
        .from('iot_devices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setDevices((data || []) as IoTDevice[]);
    } catch (error) {
      toast({
        title: 'Error fetching devices',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const deviceStats = {
    total: devices.length,
    active: devices.filter(d => d.status === 'active').length,
    maintenance: devices.filter(d => d.status === 'maintenance').length,
    error: devices.filter(d => d.status === 'error').length,
    inactive: devices.filter(d => d.status === 'inactive').length,
  };

  return { devices, loading, deviceStats, refetch: fetchDevices };
}

export function useSensorData(deviceId?: string, limit = 50) {
  const [readings, setReadings] = useState<SensorReading[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReadings();

    // Subscribe to realtime sensor updates
    const channel = supabase
      .channel('sensor-data-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'sensor_data' },
        (payload) => {
          if (!deviceId || payload.new.device_id === deviceId) {
            setReadings(prev => [payload.new as SensorReading, ...prev.slice(0, limit - 1)]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [deviceId, limit]);

  const fetchReadings = async () => {
    try {
      let query = supabase
        .from('sensor_data')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);

      if (deviceId) {
        query = query.eq('device_id', deviceId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReadings((data || []) as SensorReading[]);
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  };

  return { readings, loading, refetch: fetchReadings };
}

export function useIoTAlerts() {
  const [alerts, setAlerts] = useState<IoTAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchAlerts();

    // Subscribe to realtime alert updates
    const channel = supabase
      .channel('iot-alerts-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'iot_alerts' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setAlerts(prev => [payload.new as IoTAlert, ...prev]);
            toast({
              title: `New ${(payload.new as IoTAlert).alert_type} alert`,
              description: (payload.new as IoTAlert).title,
              variant: (payload.new as IoTAlert).alert_type === 'critical' ? 'destructive' : 'default',
            });
          } else if (payload.eventType === 'UPDATE') {
            setAlerts(prev => prev.map(a => 
              a.id === payload.new.id ? payload.new as IoTAlert : a
            ));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchAlerts = async () => {
    try {
      const { data, error } = await supabase
        .from('iot_alerts')
        .select('*, device:iot_devices(*)')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setAlerts((data || []) as IoTAlert[]);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const acknowledgeAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('iot_alerts')
        .update({ is_acknowledged: true, acknowledged_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      toast({ title: 'Alert acknowledged' });
    } catch (error) {
      toast({
        title: 'Error acknowledging alert',
        variant: 'destructive',
      });
    }
  };

  const resolveAlert = async (alertId: string) => {
    try {
      const { error } = await supabase
        .from('iot_alerts')
        .update({ resolved_at: new Date().toISOString() })
        .eq('id', alertId);

      if (error) throw error;
      toast({ title: 'Alert resolved' });
    } catch (error) {
      toast({
        title: 'Error resolving alert',
        variant: 'destructive',
      });
    }
  };

  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.alert_type === 'critical' && !a.resolved_at).length,
    warning: alerts.filter(a => a.alert_type === 'warning' && !a.resolved_at).length,
    info: alerts.filter(a => a.alert_type === 'info' && !a.resolved_at).length,
    unacknowledged: alerts.filter(a => !a.is_acknowledged && !a.resolved_at).length,
  };

  return { alerts, loading, alertStats, acknowledgeAlert, resolveAlert, refetch: fetchAlerts };
}

export function useAIPredictions() {
  const [predictions, setPredictions] = useState<AIPrediction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPredictions();
  }, []);

  const fetchPredictions = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_predictions')
        .select('*, device:iot_devices(*)')
        .order('prediction_timestamp', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPredictions((data || []) as AIPrediction[]);
    } catch (error) {
      console.error('Error fetching predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  return { predictions, loading, refetch: fetchPredictions };
}
