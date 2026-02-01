-- IoT Device Types Enum
CREATE TYPE device_category AS ENUM ('smart_home', 'industrial', 'environmental', 'fleet', 'healthcare', 'energy', 'railway');
CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance', 'error');
CREATE TYPE device_type AS ENUM ('sensor', 'actuator', 'gateway', 'hybrid');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');

-- IoT Devices Table
CREATE TABLE public.iot_devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_name VARCHAR(255) NOT NULL,
  device_type device_type NOT NULL DEFAULT 'sensor',
  category device_category NOT NULL DEFAULT 'railway',
  location JSONB DEFAULT '{}',
  status device_status NOT NULL DEFAULT 'active',
  firmware_version VARCHAR(50),
  last_seen TIMESTAMP WITH TIME ZONE DEFAULT now(),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Sensor Data Table (time-series style)
CREATE TABLE public.sensor_data (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.iot_devices(id) ON DELETE CASCADE,
  sensor_type VARCHAR(100) NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  unit VARCHAR(50),
  quality DOUBLE PRECISION DEFAULT 1.0 CHECK (quality >= 0 AND quality <= 1),
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'
);

-- IoT Alerts Table
CREATE TABLE public.iot_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.iot_devices(id) ON DELETE CASCADE,
  alert_type alert_severity NOT NULL DEFAULT 'info',
  severity INTEGER CHECK (severity BETWEEN 1 AND 10) DEFAULT 5,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  is_acknowledged BOOLEAN DEFAULT FALSE,
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Alert Rules Table
CREATE TABLE public.iot_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_name VARCHAR(255) NOT NULL,
  device_id UUID REFERENCES public.iot_devices(id) ON DELETE SET NULL,
  condition JSONB NOT NULL DEFAULT '{}',
  action JSONB NOT NULL DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  priority INTEGER DEFAULT 5,
  trigger_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- AI Predictions Table
CREATE TABLE public.ai_predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES public.iot_devices(id) ON DELETE CASCADE,
  prediction_type VARCHAR(100) NOT NULL,
  predicted_value JSONB NOT NULL DEFAULT '{}',
  confidence_score DOUBLE PRECISION CHECK (confidence_score >= 0 AND confidence_score <= 1),
  actual_value JSONB,
  prediction_timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  outcome_timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_sensor_data_device_time ON public.sensor_data(device_id, timestamp DESC);
CREATE INDEX idx_sensor_data_timestamp ON public.sensor_data(timestamp DESC);
CREATE INDEX idx_iot_alerts_device ON public.iot_alerts(device_id);
CREATE INDEX idx_iot_alerts_created ON public.iot_alerts(created_at DESC);
CREATE INDEX idx_iot_devices_status ON public.iot_devices(status);
CREATE INDEX idx_iot_devices_category ON public.iot_devices(category);
CREATE INDEX idx_ai_predictions_device ON public.ai_predictions(device_id);

-- Enable RLS
ALTER TABLE public.iot_devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensor_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.iot_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_predictions ENABLE ROW LEVEL SECURITY;

-- Public read access policies for dashboard display
CREATE POLICY "Public read access for devices" ON public.iot_devices FOR SELECT USING (true);
CREATE POLICY "Public read access for sensor data" ON public.sensor_data FOR SELECT USING (true);
CREATE POLICY "Public read access for alerts" ON public.iot_alerts FOR SELECT USING (true);
CREATE POLICY "Public read access for rules" ON public.iot_rules FOR SELECT USING (true);
CREATE POLICY "Public read access for predictions" ON public.ai_predictions FOR SELECT USING (true);

-- Public insert/update policies for device data ingestion
CREATE POLICY "Public insert for sensor data" ON public.sensor_data FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update for devices" ON public.iot_devices FOR UPDATE USING (true);
CREATE POLICY "Public update for alerts" ON public.iot_alerts FOR UPDATE USING (true);
CREATE POLICY "Public insert for alerts" ON public.iot_alerts FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert for predictions" ON public.ai_predictions FOR INSERT WITH CHECK (true);

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.iot_devices;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sensor_data;
ALTER PUBLICATION supabase_realtime ADD TABLE public.iot_alerts;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_iot_devices_updated_at
  BEFORE UPDATE ON public.iot_devices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_iot_rules_updated_at
  BEFORE UPDATE ON public.iot_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();