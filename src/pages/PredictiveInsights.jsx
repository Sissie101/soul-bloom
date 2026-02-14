import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, TrendingDown, AlertTriangle, Target, ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function PredictiveInsights() {
  const [predictions, setPredictions] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => base44.entities.AnalyticsEvent.list('-created_date', 500),
  });

  const { data: creatives = [] } = useQuery({
    queryKey: ['creatives'],
    queryFn: () => base44.entities.Creative.list(),
  });

  const generatePredictions = async () => {
    setIsAnalyzing(true);
    try {
      const activeCampaigns = campaigns.filter(c => c.status === 'active');
      
      if (activeCampaigns.length === 0) {
        toast.error('No active campaigns to analyze');
        setIsAnalyzing(false);
        return;
      }
      
      const performanceData = activeCampaigns.map(campaign => {
        const campaignAnalytics = analytics.filter(a => a.campaign_id === campaign.id);
        const campaignCreatives = creatives.filter(c => c.campaign_id === campaign.id);
        
        return {
          campaign_name: campaign.name,
          campaign_id: campaign.id,
          total_events: campaignAnalytics.length,
          conversions: campaignAnalytics.filter(a => a.event_type === 'conversion').length,
          clicks: campaignAnalytics.filter(a => a.event_type === 'click').length,
          engagement: campaignAnalytics.filter(a => a.event_type === 'engagement').length,
          creatives_count: campaignCreatives.length,
          recent_performance: campaignAnalytics.slice(0, 50)
        };
      });

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a predictive marketing analytics AI. Analyze this campaign performance data and provide:

1. **Performance Predictions (Next 30 Days)**: For each active campaign, predict:
   - Expected conversion rate trend (increasing/stable/declining)
   - Estimated conversion volume
   - Confidence level in prediction

2. **Drop-off Point Analysis**: Identify potential user journey drop-off points:
   - Where users are clicking but not converting
   - Which creatives have high clicks but low engagement
   - Timing patterns that suggest user fatigue

3. **Optimization Recommendations**: Specific actions to improve performance:
   - Which campaigns need immediate attention
   - Creative refresh suggestions
   - Audience targeting adjustments

Campaign Data:
${JSON.stringify(performanceData, null, 2)}

Provide actionable, specific insights that connect to Soul Sync Insights' spiritual mission of guiding women through transformation.`,
        response_json_schema: {
          type: "object",
          properties: {
            predictions: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  campaign_name: { type: "string" },
                  trend: { type: "string", enum: ["increasing", "stable", "declining"] },
                  predicted_conversions: { type: "number" },
                  confidence: { type: "string", enum: ["high", "medium", "low"] },
                  reasoning: { type: "string" }
                }
              }
            },
            dropoff_points: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  location: { type: "string" },
                  severity: { type: "string", enum: ["critical", "moderate", "minor"] },
                  impact: { type: "string" },
                  fix: { type: "string" }
                }
              }
            },
            recommendations: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  priority: { type: "string", enum: ["urgent", "high", "medium"] },
                  action: { type: "string" },
                  expected_impact: { type: "string" }
                }
              }
            }
          }
        }
      });

      setPredictions(result);
    } catch (error) {
      console.error('Prediction error:', error);
      toast.error('Unable to generate predictions. Please try again later.');
      setPredictions(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="p-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Sparkles className="w-8 h-8 text-indigo-600" />
            Predictive Insights
          </h1>
          <p className="text-gray-600 mt-2">AI-powered predictions to guide your marketing journey</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate AI Predictions</CardTitle>
            <CardDescription>
              Analyze your campaigns to predict future performance and identify optimization opportunities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={generatePredictions} 
              disabled={isAnalyzing || campaigns.length === 0}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Analyzing...' : 'Generate Predictions'}
            </Button>
            {campaigns.length === 0 && (
              <p className="text-sm text-gray-500 mt-2">Create campaigns first to generate predictions</p>
            )}
          </CardContent>
        </Card>

        {isAnalyzing && (
          <div className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        )}

        {predictions && !isAnalyzing && (
          <div className="space-y-6">
            {/* Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                  30-Day Performance Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.predictions?.map((pred, idx) => (
                  <div key={idx} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{pred.campaign_name}</h3>
                      <div className="flex items-center gap-2">
                        {pred.trend === 'increasing' && <TrendingUp className="w-4 h-4 text-green-600" />}
                        {pred.trend === 'declining' && <TrendingDown className="w-4 h-4 text-red-600" />}
                        <Badge variant={pred.confidence === 'high' ? 'default' : 'secondary'}>
                          {pred.confidence} confidence
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{pred.reasoning}</p>
                    <p className="text-lg font-bold text-indigo-600">
                      Predicted Conversions: {pred.predicted_conversions}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Drop-off Points */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Journey Drop-off Points
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {predictions.dropoff_points?.map((point, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-l-4 ${
                    point.severity === 'critical' ? 'bg-red-50 border-red-500' :
                    point.severity === 'moderate' ? 'bg-amber-50 border-amber-500' :
                    'bg-blue-50 border-blue-500'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{point.location}</h3>
                      <Badge variant={point.severity === 'critical' ? 'destructive' : 'outline'}>
                        {point.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      <strong>Impact:</strong> {point.impact}
                    </p>
                    <p className="text-sm text-indigo-700 flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <strong>Fix:</strong> {point.fix}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRight className="w-5 h-5 text-green-600" />
                  Strategic Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {predictions.recommendations?.map((rec, idx) => (
                  <div key={idx} className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                    <div className="flex items-start justify-between mb-2">
                      <Badge variant={rec.priority === 'urgent' ? 'destructive' : 'default'}>
                        {rec.priority} priority
                      </Badge>
                    </div>
                    <p className="font-semibold text-gray-900 mb-1">{rec.action}</p>
                    <p className="text-sm text-gray-600">
                      <strong>Expected Impact:</strong> {rec.expected_impact}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </>
  );
}