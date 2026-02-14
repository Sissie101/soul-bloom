import React, { useState, useEffect } from 'react';
import { AnalyticsEvent, Creative, Audience } from '@/entities/all';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Lightbulb, TrendingUp, Filter, HeartHandshake, Zap, ExternalLink, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const getPerformanceScore = (creative, events) => {
  const creativeEvents = events.filter(e => e.creative_id === creative.id);
  const clicks = creativeEvents.filter(e => e.event_type === 'click').length;
  const conversions = creativeEvents.filter(e => e.event_type === 'conversion').length;
  const engagementEvents = creativeEvents.filter(e => e.metadata?.session_duration);
  const avgEngagement = engagementEvents.length > 0 
    ? engagementEvents.reduce((sum, e) => sum + e.metadata.session_duration, 0) / engagementEvents.length 
    : 0;

  // Weighted score: conversions are most important, then engagement, then clicks.
  return (conversions * 10) + (avgEngagement * 0.1) + clicks;
};

export default function StrategicActionCenter() {
  const [isLoading, setIsLoading] = useState(true);
  const [topCreative, setTopCreative] = useState(null);
  const [topAudience, setTopAudience] = useState(null);
  const [leakyCreative, setLeakyCreative] = useState(null);
  const [metrics, setMetrics] = useState({ clicks: 0, conversions: 0 });

  useEffect(() => {
    const runAnalysis = async () => {
      setIsLoading(true);
      try {
        const [events, creatives, audiences] = await Promise.all([
          AnalyticsEvent.list(),
          Creative.list(),
          Audience.list()
        ]);

      setMetrics({
        clicks: events.filter(e => e.event_type === 'click').length,
        conversions: events.filter(e => e.event_type === 'conversion').length
      });

      // --- Play #1: Find the Top Performer ---
      if (creatives.length > 0) {
        const scoredCreatives = creatives.map(c => ({
          ...c,
          score: getPerformanceScore(c, events)
        })).sort((a, b) => b.score - a.score);
        setTopCreative(scoredCreatives[0]);
      }

      // --- Play #2: Find the Top Audience ---
      if (audiences.length > 0) {
        const audienceConversions = audiences.map(aud => {
          const count = events.filter(e => e.audience_id === aud.id && e.event_type === 'conversion').length;
          return { ...aud, conversionCount: count };
        }).sort((a, b) => b.conversionCount - a.conversionCount);
        setTopAudience(audienceConversions[0]);
      }

      // --- Play #3: Find the Leaky Creative ---
      const leakyCandidates = creatives.map(c => {
        const creativeEvents = events.filter(e => e.creative_id === c.id);
        const clicks = creativeEvents.filter(e => e.event_type === 'click').length;
        const conversions = creativeEvents.filter(e => e.event_type === 'conversion').length;
        const leakScore = clicks > 5 ? clicks / (conversions + 1) : 0; // High clicks, low conversions
        return { ...c, leakScore, clicks, conversions };
      }).sort((a,b) => b.leakScore - a.leakScore);
      
      if(leakyCandidates.length > 0 && leakyCandidates[0].leakScore > 10){
          setLeakyCreative(leakyCandidates[0]);
      }

      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    runAnalysis();
  }, []);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div><p className="ml-4">Analyzing sacred data...</p></div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center justify-center gap-3"><Lightbulb className="w-10 h-10 text-amber-500"/>Strategic Action Center</h1>
          <p className="text-lg text-gray-500 mt-2">Turn your sacred data into inspired action.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Play #1: Amplifier */}
          <Card className="border-2 border-green-500 shadow-lg shadow-green-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><TrendingUp className="text-green-500"/>Play #1: Amplify Your Winners</CardTitle>
              <CardDescription>This is your most resonant creative. Scale its message.</CardDescription>
            </CardHeader>
            <CardContent>
              {topCreative ? (
                <>
                  <img src={topCreative.image_url} alt={topCreative.title} className="rounded-md mb-4 aspect-video object-cover"/>
                  <h3 className="font-semibold">{topCreative.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-1">{topCreative.copy}</p>
                   <Link to={createPageUrl(`CreativeStudio?variant_of=${topCreative.id}`)} className="mt-4 block">
                    <Button className="w-full bg-green-600 hover:bg-green-700"><Zap className="w-4 h-4 mr-2"/>Create Variants</Button>
                  </Link>
                </>
              ) : <p>No creative data yet.</p>}
            </CardContent>
          </Card>

          {/* Play #2: Refiner */}
          <Card className="border-2 border-purple-500 shadow-lg shadow-purple-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Filter className="text-purple-500"/>Play #2: Refine Your Rings</CardTitle>
              <CardDescription>This audience is connecting most deeply. Nurture them.</CardDescription>
            </CardHeader>
            <CardContent>
              {topAudience ? (
                <>
                 <div className="p-6 bg-purple-50 rounded-lg text-center">
                    <Target className="w-8 h-8 text-purple-600 mx-auto mb-2"/>
                    <h3 className="font-bold text-xl text-purple-800">{topAudience.name}</h3>
                    <p className="text-sm text-purple-700">{topAudience.conversionCount} Sacred Conversions</p>
                 </div>
                 <p className="text-sm text-center my-4 text-gray-600">They're ready for deeper connection. Create a warm "Echo Post" just for them.</p>
                 <Link to={createPageUrl(`CreativeStudio?campaign_id=${topCreative?.campaign_id}&audience_id=${topAudience.id}`)} className="mt-4 block">
                    <Button className="w-full bg-purple-600 hover:bg-purple-700"><Zap className="w-4 h-4 mr-2"/>Craft Echo Post</Button>
                  </Link>
                </>
              ) : <p>No audience data yet.</p>}
            </CardContent>
          </Card>

          {/* Play #3: Healer */}
          <Card className="border-2 border-red-500 shadow-lg shadow-red-500/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><HeartHandshake className="text-red-500"/>Play #3: Heal The Journey</CardTitle>
              <CardDescription>Find and fix disconnects in your conversion path.</CardDescription>
            </CardHeader>
            <CardContent>
              {leakyCreative ? (
                <>
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <h3 className="font-semibold text-red-800">Potential Disconnect Found</h3>
                    <p className="text-sm text-red-700 mt-1">"{leakyCreative.title}" has high clicks ({leakyCreative.clicks}) but low conversions ({leakyCreative.conversions}).</p>
                  </div>
                  <p className="text-sm text-center my-4 text-gray-600">The ad's promise might not match the landing page's experience. Let's analyze it.</p>
                   <Link to={createPageUrl(`LandingPageOptimizer?creative_id=${leakyCreative.id}`)} className="mt-4 block">
                    <Button className="w-full bg-red-600 hover:bg-red-700"><Zap className="w-4 h-4 mr-2"/>Analyze Landing Page</Button>
                  </Link>
                </>
              ) : (
                <div className="p-6 bg-green-50 rounded-lg text-center">
                  <h3 className="font-semibold text-green-800">Flow is Healthy!</h3>
                  <p className="text-sm text-green-700 mt-1">Your click-to-conversion rate is strong. No major journey disconnects detected.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}