import { cn } from '@/lib/utils';
import { Brain, TrendingUp, Wrench, AlertTriangle, Zap, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { AIPrediction } from '@/hooks/useIoTData';

interface AIInsightsPanelProps {
  predictions: AIPrediction[];
  loading?: boolean;
}

const predictionTypeConfig = {
  predictive_maintenance: { icon: Wrench, color: 'text-warning', label: 'Maintenance' },
  anomaly_detection: { icon: AlertTriangle, color: 'text-destructive', label: 'Anomaly' },
  energy_optimization: { icon: Zap, color: 'text-success', label: 'Energy' },
  failure_prediction: { icon: TrendingUp, color: 'text-info', label: 'Failure' },
};

export function AIInsightsPanel({ predictions, loading }: AIInsightsPanelProps) {
  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-24 rounded-lg bg-muted/50 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin">
      {predictions.slice(0, 8).map((prediction, index) => {
        const config = predictionTypeConfig[prediction.prediction_type as keyof typeof predictionTypeConfig] 
          || predictionTypeConfig.predictive_maintenance;
        const Icon = config.icon;
        const riskScore = prediction.predicted_value.risk_score || 0;
        
        return (
          <div
            key={prediction.id}
            className={cn(
              'p-4 rounded-xl border border-border bg-gradient-to-br from-card/80 to-card/40',
              'backdrop-blur-sm hover:border-primary/30 transition-all duration-300',
              'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 80}ms` }}
          >
            <div className="flex items-start gap-3">
              <div className={cn(
                'p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5'
              )}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <Badge variant="secondary" className="text-[10px]">
                    {config.label}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {Math.round(prediction.confidence_score * 100)}% confidence
                  </span>
                </div>
                
                <p className="text-sm font-medium mb-2">
                  {prediction.predicted_value.recommended_action || 'Analysis in progress...'}
                </p>

                {/* Risk Score Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">Risk Score</span>
                    <span className={cn(
                      riskScore > 70 ? 'text-destructive' :
                      riskScore > 40 ? 'text-warning' : 'text-success'
                    )}>
                      {riskScore.toFixed(0)}%
                    </span>
                  </div>
                  <Progress 
                    value={riskScore} 
                    className="h-1.5"
                  />
                </div>

                {/* Additional info */}
                <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                  {prediction.predicted_value.estimated_rul_days && (
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {prediction.predicted_value.estimated_rul_days} days RUL
                    </div>
                  )}
                  {prediction.predicted_value.potential_savings && (
                    <div className="flex items-center gap-1">
                      <Zap className="h-3 w-3" />
                      ₹{prediction.predicted_value.potential_savings.toLocaleString()} savings
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
