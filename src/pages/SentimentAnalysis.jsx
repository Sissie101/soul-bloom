import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Heart, Frown, Meh, Smile, TrendingUp, MessageCircle, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

export default function SentimentAnalysis() {
  const [newFeedback, setNewFeedback] = useState('');
  const [feedbackSource, setFeedbackSource] = useState('survey');
  const [feedbackCategory, setFeedbackCategory] = useState('general_feedback');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [insights, setInsights] = useState(null);
  
  const queryClient = useQueryClient();

  const { data: feedback = [] } = useQuery({
    queryKey: ['feedback'],
    queryFn: () => base44.entities.Feedback.list('-created_date', 100),
  });

  const createFeedbackMutation = useMutation({
    mutationFn: (data) => base44.entities.Feedback.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedback'] });
      setNewFeedback('');
      toast.success('Feedback added');
    },
  });

  const analyzeSentiment = async (text) => {
    if (!text || text.trim().length < 5) {
      return null;
    }
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the sentiment and extract insights from this user feedback for Sacred Seeds, a spiritual journaling app:

"${text}"

Provide:
1. Sentiment (positive/neutral/negative)
2. Key themes or topics mentioned
3. Actionable insights for product or marketing improvements
4. Suggested response or action`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment: { type: "string", enum: ["positive", "neutral", "negative"] },
            themes: { type: "array", items: { type: "string" } },
            insights: { type: "string" },
            suggested_action: { type: "string" }
          }
        }
      });
      return result;
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      toast.error('AI analysis temporarily unavailable');
      return { sentiment: 'neutral', themes: [], insights: 'Manual review needed', suggested_action: 'Follow up later' };
    }
  };

  const handleAddFeedback = async () => {
    if (!newFeedback.trim()) return;

    const analysis = await analyzeSentiment(newFeedback);
    
    createFeedbackMutation.mutate({
      feedback_text: newFeedback,
      source: feedbackSource,
      category: feedbackCategory,
      sentiment: analysis?.sentiment || 'neutral',
      ai_insights: analysis ? JSON.stringify(analysis) : null
    });
  };

  const generateOverallInsights = async () => {
    setIsAnalyzing(true);
    try {
      const allFeedback = feedback.map(f => ({
        text: f.feedback_text,
        sentiment: f.sentiment,
        source: f.source,
        category: f.category
      }));

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a product and marketing strategist analyzing user feedback for Sacred Seeds. Review this feedback and provide:

1. **Overall Sentiment Summary**: Breakdown of positive/neutral/negative
2. **Top Themes**: What users care about most
3. **Product Recommendations**: Features to build or improve
4. **Marketing Messaging Insights**: What resonates with users, what language they use
5. **Risk Areas**: Any concerns or complaints that need immediate attention

Feedback Data:
${JSON.stringify(allFeedback, null, 2)}`,
        response_json_schema: {
          type: "object",
          properties: {
            sentiment_summary: {
              type: "object",
              properties: {
                positive: { type: "number" },
                neutral: { type: "number" },
                negative: { type: "number" }
              }
            },
            top_themes: { type: "array", items: { type: "string" } },
            product_recommendations: { type: "array", items: { type: "string" } },
            messaging_insights: { type: "array", items: { type: "string" } },
            risk_areas: { type: "array", items: { type: "string" } }
          }
        }
      });

      setInsights(result);
    } catch (error) {
      console.error('Insights generation error:', error);
      toast.error('Unable to generate insights at this time. Please try again later.');
      setInsights(null);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const sentimentIcon = (sentiment) => {
    switch(sentiment) {
      case 'positive': return <Smile className="w-4 h-4 text-green-600" />;
      case 'negative': return <Frown className="w-4 h-4 text-red-600" />;
      default: return <Meh className="w-4 h-4 text-gray-600" />;
    }
  };

  const sentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'bg-green-50 border-green-200';
      case 'negative': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-blue-50 to-teal-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-teal-600" />
            Sentiment Analysis
          </h1>
          <p className="text-gray-600 mt-2">AI-powered insights from user feedback to guide product and marketing decisions</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Add New Feedback</CardTitle>
              <CardDescription>Record user feedback for AI analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Feedback Text</Label>
                <Textarea
                  value={newFeedback}
                  onChange={(e) => setNewFeedback(e.target.value)}
                  placeholder="Enter user feedback here..."
                  className="min-h-[120px]"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Source</Label>
                  <Select value={feedbackSource} onValueChange={setFeedbackSource}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="survey">Survey</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="direct">Direct</SelectItem>
                      <SelectItem value="support">Support</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Category</Label>
                  <Select value={feedbackCategory} onValueChange={setFeedbackCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general_feedback">General</SelectItem>
                      <SelectItem value="feature_request">Feature Request</SelectItem>
                      <SelectItem value="bug_report">Bug Report</SelectItem>
                      <SelectItem value="testimonial">Testimonial</SelectItem>
                      <SelectItem value="complaint">Complaint</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button onClick={handleAddFeedback} className="w-full bg-teal-600 hover:bg-teal-700">
                <Sparkles className="w-4 h-4 mr-2" />
                Add & Analyze
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generate Overall Insights</CardTitle>
              <CardDescription>AI analysis of all collected feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <p className="text-sm text-gray-700">
                  <strong>{feedback.length}</strong> feedback items collected
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {feedback.filter(f => f.sentiment === 'positive').length} positive
                  </Badge>
                  <Badge variant="outline" className="text-gray-700">
                    {feedback.filter(f => f.sentiment === 'neutral').length} neutral
                  </Badge>
                  <Badge variant="outline" className="text-red-700 border-red-300">
                    {feedback.filter(f => f.sentiment === 'negative').length} negative
                  </Badge>
                </div>
              </div>
              <Button 
                onClick={generateOverallInsights} 
                disabled={isAnalyzing || feedback.length === 0}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                {isAnalyzing ? 'Analyzing...' : 'Generate Insights'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {insights && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600" />
                  Top Themes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.top_themes?.map((theme, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-teal-600">•</span>
                      <span className="text-gray-700">{theme}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600" />
                  Product Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.product_recommendations?.map((rec, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-indigo-600">→</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Marketing Messaging Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {insights.messaging_insights?.map((insight, idx) => (
                    <li key={idx} className="p-2 bg-blue-50 rounded text-sm text-gray-700">
                      {insight}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {insights.risk_areas && insights.risk_areas.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-red-700">Risk Areas</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {insights.risk_areas.map((risk, idx) => (
                      <li key={idx} className="p-2 bg-red-50 rounded text-sm text-gray-700 border-l-2 border-red-500">
                        {risk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Feedback</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {feedback.slice(0, 10).map((item) => (
                <div key={item.id} className={`p-4 rounded-lg border ${sentimentColor(item.sentiment)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {sentimentIcon(item.sentiment)}
                      <Badge variant="outline">{item.source}</Badge>
                      <Badge variant="outline">{item.category}</Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{item.feedback_text}</p>
                  {item.ai_insights && (
                    <div className="mt-2 pt-2 border-t text-xs text-gray-600">
                      <strong>AI Insight:</strong> {JSON.parse(item.ai_insights).insights}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}