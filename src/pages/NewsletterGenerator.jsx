import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Mail, Sparkles, Copy, RefreshCw, Instagram, Facebook, Linkedin } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'from-pink-500 to-purple-600', charLimit: '2200 chars, hook-first, 3-5 hashtags, story-driven' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'from-blue-600 to-blue-700', charLimit: '250-500 chars, conversational, community-focused, question CTA' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'from-sky-600 to-blue-800', charLimit: '1300 chars, professional yet personal, insight-first, no hashtag spam' },
];

export default function NewsletterGenerator() {
  const [newsletter, setNewsletter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('inspiring');
  const [socialPosts, setSocialPosts] = useState({});
  const [isGeneratingSocial, setIsGeneratingSocial] = useState(false);

  const { data: campaigns = [] } = useQuery({ queryKey: ['campaigns'], queryFn: () => base44.entities.Campaign.list() });
  const { data: analytics = [] } = useQuery({ queryKey: ['analytics'], queryFn: () => base44.entities.AnalyticsEvent.list('-created_date', 100) });
  const { data: creatives = [] } = useQuery({ queryKey: ['creatives'], queryFn: () => base44.entities.Creative.list() });
  const { data: blessings = [] } = useQuery({ queryKey: ['blessings'], queryFn: () => base44.entities.JournalEntry.filter({ is_blessing_thread: true }, '-hearts_received', 10) });

  const getContextData = () => {
    const topCreatives = creatives.sort((a, b) => (b.conversions || 0) - (a.conversions || 0)).slice(0, 3);
    const recentConversions = analytics.filter(a => a.event_type === 'conversion').length;
    const topBlessings = blessings.slice(0, 3);
    return { topCreatives, recentConversions, topBlessings };
  };

  const generateNewsletter = async () => {
    setIsGenerating(true);
    try {
      const { topCreatives, recentConversions, topBlessings } = getContextData();
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a heart-centered content creator for Soul Sync Insights. Generate an engaging email newsletter.

**Tone**: ${tone}
**Content**:
- ${recentConversions} new souls joined Sacred Seeds recently
- Top campaigns: ${topCreatives.map(c => c.title).join(', ')}
- Community reflections: ${topBlessings.map(b => `"${b.written_reflection?.substring(0, 120)}..."`).join('\n')}

Use spiritual feminine language ("sacred", "bloom", "soul sister"). 300-500 words. Include subject line. Personal, not corporate.`,
      });
      setNewsletter(result);
    } catch (error) {
      toast.error('Unable to generate newsletter. Please try again later.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateSocialPosts = async () => {
    setIsGeneratingSocial(true);
    try {
      const { topCreatives, recentConversions, topBlessings } = getContextData();
      const contextSummary = `
- ${recentConversions} new sacred seeds members
- Winning campaigns: ${topCreatives.map(c => c.title).join(', ')}
- Community highlight: "${topBlessings[0]?.written_reflection?.substring(0, 200) || 'Soul sisters on a 30-day journey of reflection'}"`;

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a social media strategist for Soul Sync Insights (Sacred Seeds - a 30-day spiritual journaling journey for women).

Based on these campaign/community highlights:${contextSummary}

Generate one platform-optimized post for each:

**Instagram** (hook-first, story-driven, 3-5 relevant hashtags, emojis, 2200 chars max):
Write a captivating post that starts with a powerful hook line, tells a mini story, and ends with a CTA.

**Facebook** (conversational, community-feel, question CTA, 250-400 chars):
Write a warm, relatable post that invites discussion and feels like it's from a friend.

**LinkedIn** (professional yet personal, insight-first, 1300 chars max, 1-2 hashtags):
Write a thought-leadership style post connecting personal transformation to the business/wellness space.

Tone is ${tone}. Use spiritual language naturally ("sacred", "bloom", "awaken", "soul", "journey").`,
        response_json_schema: {
          type: 'object',
          properties: {
            instagram: { type: 'string' },
            facebook: { type: 'string' },
            linkedin: { type: 'string' },
          }
        }
      });
      setSocialPosts(result);
    } catch (error) {
      toast.error('Unable to generate social posts. Please try again later.');
    } finally {
      setIsGeneratingSocial(false);
    }
  };

  const copyText = (text, label) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="p-4 md:p-8 bg-gradient-to-br from-rose-50 to-purple-50 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Mail className="w-7 h-7 text-rose-600 flex-shrink-0" />
              AI Content Generator
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">Craft newsletters & social posts from your campaign insights and community highlights</p>
          </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
                <div className="flex-1 w-full">
                  <Label className="mb-1 block">Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inspiring">Inspiring & Uplifting</SelectItem>
                      <SelectItem value="educational">Educational & Guiding</SelectItem>
                      <SelectItem value="conversational">Conversational & Warm</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="email">
            <TabsList className="w-full mb-6 grid grid-cols-2">
              <TabsTrigger value="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" /> Email Newsletter
              </TabsTrigger>
              <TabsTrigger value="social" className="flex items-center gap-2">
                <Instagram className="w-4 h-4" /> Social Media
              </TabsTrigger>
            </TabsList>

            {/* EMAIL TAB */}
            <TabsContent value="email">
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Generate Email Newsletter</CardTitle>
                  <CardDescription>Create a personalized email from recent performance and community highlights</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={generateNewsletter} disabled={isGenerating} className="bg-rose-600 hover:bg-rose-700 w-full sm:w-auto">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Newsletter'}
                  </Button>
                </CardContent>
              </Card>

              {newsletter && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex flex-wrap items-center justify-between gap-2">
                      <span>Your Newsletter</span>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => copyText(newsletter, 'Newsletter')}>
                          <Copy className="w-4 h-4 mr-1" /> Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={generateNewsletter} disabled={isGenerating}>
                          <RefreshCw className="w-4 h-4 mr-1" /> Redo
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea value={newsletter} onChange={(e) => setNewsletter(e.target.value)} className="min-h-[400px] font-serif text-gray-700 leading-relaxed text-sm" />
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* SOCIAL MEDIA TAB */}
            <TabsContent value="social">
              <Card className="mb-6">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Generate Social Media Posts</CardTitle>
                  <CardDescription>Creates optimized posts for Instagram, Facebook & LinkedIn simultaneously</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={generateSocialPosts} disabled={isGeneratingSocial} className="bg-purple-600 hover:bg-purple-700 w-full sm:w-auto">
                    <Sparkles className="w-4 h-4 mr-2" />
                    {isGeneratingSocial ? 'Crafting posts...' : 'Generate All 3 Platforms'}
                  </Button>
                </CardContent>
              </Card>

              {Object.keys(socialPosts).length > 0 && (
                <div className="space-y-4">
                  {PLATFORMS.map(({ id, label, icon: Icon, color }) => (
                    <Card key={id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            <span>{label}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => copyText(socialPosts[id] || '', label)}>
                              <Copy className="w-4 h-4 mr-1" /> Copy
                            </Button>
                          </div>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Textarea
                          value={socialPosts[id] || ''}
                          onChange={(e) => setSocialPosts(prev => ({ ...prev, [id]: e.target.value }))}
                          className="min-h-[180px] text-sm text-gray-700 leading-relaxed"
                        />
                        <p className="text-xs text-gray-400 mt-2">{(socialPosts[id] || '').length} characters</p>
                      </CardContent>
                    </Card>
                  ))}
                  <Button variant="outline" onClick={generateSocialPosts} disabled={isGeneratingSocial} className="w-full">
                    <RefreshCw className="w-4 h-4 mr-2" /> Regenerate All Posts
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}