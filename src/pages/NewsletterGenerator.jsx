import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Sparkles, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function NewsletterGenerator() {
  const [newsletter, setNewsletter] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState('inspiring');

  const { data: campaigns = [] } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => base44.entities.Campaign.list(),
  });

  const { data: analytics = [] } = useQuery({
    queryKey: ['analytics'],
    queryFn: () => base44.entities.AnalyticsEvent.list('-created_date', 100),
  });

  const { data: creatives = [] } = useQuery({
    queryKey: ['creatives'],
    queryFn: () => base44.entities.Creative.list(),
  });

  const { data: blessings = [] } = useQuery({
    queryKey: ['blessings'],
    queryFn: () => base44.entities.JournalEntry.filter({ is_blessing_thread: true }, '-hearts_received', 10),
  });

  const generateNewsletter = async () => {
    setIsGenerating(true);
    try {
      const topPerformingCreatives = creatives
        .sort((a, b) => (b.conversions || 0) - (a.conversions || 0))
        .slice(0, 3);

      const recentConversions = analytics.filter(a => a.event_type === 'conversion').length;
      const topBlessings = blessings.slice(0, 3);

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a heart-centered content creator for Soul Sync Insights, crafting newsletters for the Sacred Seeds community. Generate an engaging email newsletter that:

**Tone**: ${tone} (${tone === 'inspiring' ? 'uplifting and motivational' : tone === 'educational' ? 'informative and guiding' : 'warm and conversational'})

**Content to Include**:
1. **Opening** - A warm greeting that honors the reader's spiritual journey
2. **Community Highlights** - Celebrate recent successes:
   - ${recentConversions} new souls joined the Sacred Seeds journey recently
   - Top-performing campaign insights: ${topPerformingCreatives.map(c => c.title).join(', ')}
3. **Blessing Thread Feature** - Highlight 1-2 powerful community reflections (anonymized):
   ${topBlessings.map(b => `"${b.written_reflection?.substring(0, 150)}..."`).join('\n')}
4. **Call to Action** - Invite readers to join the 30-day journey or share with a friend
5. **Closing** - A blessing or affirmation

**Style Guidelines**:
- Use spiritual, feminine language ("sacred", "bloom", "illuminate", "soul sister")
- Keep it concise (300-500 words)
- Include a clear subject line
- Make it feel personal, not corporate
- Celebrate both data (growth numbers) and heart (community stories)

Format as a complete email ready to send, including subject line.`,
      });

      setNewsletter(result);
    } catch (error) {
      console.error('Newsletter generation error:', error);
      toast.error('Unable to generate newsletter at this time. Please try again later.');
      setNewsletter('');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newsletter);
    toast.success('Newsletter copied to clipboard!');
  };

  return (
    <div className="p-8 bg-gradient-to-br from-rose-50 to-purple-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Mail className="w-8 h-8 text-rose-600" />
            AI Newsletter Generator
          </h1>
          <p className="text-gray-600 mt-2">Automatically craft engaging newsletters from your campaign insights and community highlights</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Generate Newsletter</CardTitle>
            <CardDescription>
              Create personalized email content based on recent campaign performance and community engagement
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Newsletter Tone</Label>
              <Select value={tone} onValueChange={setTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="inspiring">Inspiring & Uplifting</SelectItem>
                  <SelectItem value="educational">Educational & Guiding</SelectItem>
                  <SelectItem value="conversational">Conversational & Warm</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button 
              onClick={generateNewsletter} 
              disabled={isGenerating}
              className="bg-rose-600 hover:bg-rose-700"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Newsletter'}
            </Button>
          </CardContent>
        </Card>

        {newsletter && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Your Newsletter</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={generateNewsletter}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Regenerate
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={newsletter}
                onChange={(e) => setNewsletter(e.target.value)}
                className="min-h-[500px] font-serif text-gray-700 leading-relaxed"
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}