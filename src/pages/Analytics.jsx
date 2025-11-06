
import React, { useState, useEffect, useCallback } from "react";
import { AnalyticsEvent, Campaign, Creative, Audience, ConversionGoal } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, Target, Heart, DollarSign, Eye, MousePointer, UserPlus, Calendar } from "lucide-react";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

const COLORS = ['#8B5CF6', '#10B981', '#F59E0B', '#EF4444', '#3B82F6', '#8B5A2B'];

export default function Analytics() {
  const [events, setEvents] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [creatives, setCreatives] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [goals, setGoals] = useState([]);
  const [selectedCampaign, setSelectedCampaign] = useState('all');
  const [dateRange, setDateRange] = useState('30');
  const [isLoading, setIsLoading] = useState(true);
  const [metrics, setMetrics] = useState({
    totalClicks: 0,
    totalConversions: 0,
    totalRevenue: 0,
    conversionRate: 0,
    ctr: 0,
    avgEngagementTime: 0
  });

  const loadAnalyticsData = useCallback(async () => {
    setIsLoading(true);
    
    // Load base data
    const [eventData, campData, creativeData, audData, goalData] = await Promise.all([
      AnalyticsEvent.list('-created_date'),
      Campaign.list(),
      Creative.list(),
      Audience.list(),
      ConversionGoal.list()
    ]);

    setCampaigns(campData || []);
    setCreatives(creativeData || []);
    setAudiences(audData || []);
    setGoals(goalData || []);

    // Filter events by date range
    const daysBack = parseInt(dateRange, 10);
    const cutoffDate = startOfDay(subDays(new Date(), daysBack));
    let filteredEvents = (eventData || []).filter(event => 
      event && new Date(event.created_date) >= cutoffDate
    );

    // Filter by campaign if selected
    if (selectedCampaign !== 'all') {
      filteredEvents = filteredEvents.filter(event => 
        event.campaign_id === selectedCampaign
      );
    }

    setEvents(filteredEvents);

    // Calculate metrics
    const clicks = filteredEvents.filter(e => e.event_type === 'click').length;
    const conversions = filteredEvents.filter(e => e.event_type === 'conversion').length;
    const views = filteredEvents.filter(e => e.event_type === 'view').length;
    const revenue = filteredEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);
    const engagementEvents = filteredEvents.filter(e => e.metadata?.session_duration);
    const avgEngagement = engagementEvents.length > 0 
      ? engagementEvents.reduce((sum, e) => sum + e.metadata.session_duration, 0) / engagementEvents.length 
      : 0;

    setMetrics({
      totalClicks: clicks,
      totalConversions: conversions,
      totalRevenue: revenue,
      conversionRate: clicks > 0 ? (conversions / clicks * 100).toFixed(2) : 0,
      ctr: views > 0 ? (clicks / views * 100).toFixed(2) : 0,
      avgEngagementTime: Math.round(avgEngagement)
    });

    setIsLoading(false);
  }, [selectedCampaign, dateRange]); // Dependencies for useCallback

  useEffect(() => {
    loadAnalyticsData();
  }, [loadAnalyticsData]); // Dependency for useEffect

  // Prepare chart data
  const getTimeSeriesData = () => {
    const days = parseInt(dateRange, 10);
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = subDays(new Date(), i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);
      
      const dayEvents = events.filter(event => {
        const eventDate = new Date(event.created_date);
        return eventDate >= dayStart && eventDate <= dayEnd;
      });

      data.push({
        date: format(date, 'MMM dd'),
        clicks: dayEvents.filter(e => e.event_type === 'click').length,
        conversions: dayEvents.filter(e => e.event_type === 'conversion').length,
        views: dayEvents.filter(e => e.event_type === 'view').length
      });
    }
    return data;
  };

  const getCreativePerformanceData = () => {
    const creativeMetrics = {};
    
    (creatives || []).forEach(creative => {
      if (!creative || !creative.id) return; // Ensure creative and its ID exist
      const creativeEvents = events.filter(e => e.creative_id === creative.id);
      const clicks = creativeEvents.filter(e => e.event_type === 'click').length;
      const conversions = creativeEvents.filter(e => e.event_type === 'conversion').length;
      const revenue = creativeEvents.reduce((sum, e) => sum + (e.revenue || 0), 0);
      
      creativeMetrics[creative.id] = {
        name: creative.title || 'Untitled', // Fallback for creative title
        clicks,
        conversions,
        revenue,
        conversionRate: clicks > 0 ? (conversions / clicks * 100).toFixed(1) : 0
      };
    });

    return Object.values(creativeMetrics)
      .filter(c => c.clicks > 0)
      .sort((a, b) => b.clicks - a.clicks)
      .slice(0, 10);
  };

  const getAudienceBreakdownData = () => {
    const audienceMetrics = {};
    
    (audiences || []).forEach(audience => {
      if (!audience || !audience.id) return; // Ensure audience and its ID exist
      const audienceEvents = events.filter(e => e.audience_id === audience.id);
      const conversions = audienceEvents.filter(e => e.event_type === 'conversion').length;
      
      if (conversions > 0) {
        audienceMetrics[audience.id] = {
          name: audience.name || 'Unnamed', // Fallback for audience name
          conversions,
          fill: COLORS[Object.keys(audienceMetrics).length % COLORS.length]
        };
      }
    });

    return Object.values(audienceMetrics);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const timeSeriesData = getTimeSeriesData();
  const creativePerformanceData = getCreativePerformanceData();
  const audienceBreakdownData = getAudienceBreakdownData();

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Campaign Analytics</h1>
            <p className="text-gray-500">Track authentic connections and meaningful engagement</p>
          </div>
          <div className="flex gap-4">
            <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Campaigns</SelectItem>
                {campaigns.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7">7 days</SelectItem>
                <SelectItem value="30">30 days</SelectItem>
                <SelectItem value="90">90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
              <MousePointer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalClicks.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                CTR: {metrics.ctr}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sacred Conversions</CardTitle>
              <Heart className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-600">{metrics.totalConversions.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Rate: {metrics.conversionRate}%
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Soul Connection Time</CardTitle>
              <Eye className="h-4 w-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{metrics.avgEngagementTime}s</div>
              <p className="text-xs text-muted-foreground">
                Average engagement
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">${metrics.totalRevenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                Total attributed
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Time Series Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Engagement Flow</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timeSeriesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#8B5CF6" name="Clicks" />
                  <Line type="monotone" dataKey="conversions" stroke="#10B981" name="Conversions" />
                  <Line type="monotone" dataKey="views" stroke="#F59E0B" name="Views" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Audience Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Resonance Ring Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={audienceBreakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="conversions"
                  >
                    {audienceBreakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Creatives */}
        <Card>
          <CardHeader>
            <CardTitle>Creative Performance Leaderboard</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={creativePerformanceData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} />
                <Tooltip />
                <Bar dataKey="clicks" fill="#8B5CF6" name="Clicks" />
                <Bar dataKey="conversions" fill="#10B981" name="Conversions" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Insights & Recommendations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-green-500" />
                Sacred Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {creativePerformanceData.length > 0 && (
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-semibold text-green-800 mb-2">✨ High Performer Alert</h4>
                    <p className="text-sm text-green-700">
                      "{creativePerformanceData[0]?.name}" is resonating deeply with {creativePerformanceData[0]?.clicks} clicks. 
                      Consider boosting this creative for wider reach.
                    </p>
                  </div>
                )}
                
                {metrics.conversionRate > 5 && (
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-semibold text-purple-800 mb-2">🎯 Conversion Magic</h4>
                    <p className="text-sm text-purple-700">
                      Your {metrics.conversionRate}% conversion rate shows authentic connection. 
                      This resonance is creating real transformation.
                    </p>
                  </div>
                )}

                {metrics.avgEngagementTime > 30 && (
                  <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-800 mb-2">💫 Deep Engagement</h4>
                    <p className="text-sm text-blue-700">
                      Average engagement time of {metrics.avgEngagementTime}s indicates meaningful connection. 
                      People are truly absorbing your message.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-indigo-500" />
                Strategic Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="font-semibold text-indigo-800 mb-2">📈 Scale What Works</h4>
                  <p className="text-sm text-indigo-700">
                    Create variants of your top-performing creatives. Test different visuals while keeping the resonant messaging.
                  </p>
                </div>

                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">🔄 Echo Post Strategy</h4>
                  <p className="text-sm text-amber-700">
                    For users who clicked but didn't convert, create warm retargeting content that deepens the connection.
                  </p>
                </div>

                <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                  <h4 className="font-semibold text-pink-800 mb-2">💖 Gracie-Inspired Content</h4>
                  <p className="text-sm text-pink-700">
                    Personal stories consistently perform well. Share more authentic moments to build deeper community bonds.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
