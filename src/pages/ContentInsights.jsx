import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Sparkles, BookOpen, Tag, Heart, Lightbulb, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export default function ContentInsights() {
  const [insights, setInsights] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const { data: blessings = [], isLoading } = useQuery({
    queryKey: ['blessing-threads'],
    queryFn: () => base44.entities.JournalEntry.filter({ is_blessing_thread: true }, '-hearts_received', 50),
  });

  const analyzeContent = async () => {
    if (blessings.length === 0) {
      toast.error('No blessing threads found to analyze yet.');
      return;
    }
    setIsAnalyzing(true);
    try {
      const entriesText = blessings
        .slice(0, 30)
        .map(b => b.written_reflection)
        .filter(Boolean)
        .join('\n---\n');

      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a brand strategist and content analyst for Soul Sync Insights (Sacred Seeds), a 30-day spiritual journaling journey for women.

Analyze the following community journal entries (blessing threads) written by real users:

---
${entriesText}
---

Provide deep insights to inform future marketing copy and content strategy:

1. **themes**: The top 5-7 emotional/spiritual themes that appear most frequently (e.g., "release", "self-worth", "community"). Each theme should have a name and a short description.

2. **power_words**: 10-15 specific words or short phrases that users naturally use when expressing their transformation. These are authentic voice words perfect for marketing copy.

3. **emotional_patterns**: 3-4 key emotional journeys or arc patterns (e.g., "from fear to freedom", "isolation to belonging"). Each should have a pattern name and a 1-sentence description.

4. **marketing_phrases**: 5 ready-to-use marketing copy snippets (1-2 sentences each) that authentically reflect user language and would resonate with the target audience. These should NOT sound like ads but like truths.

5. **content_gaps**: 2-3 topics or themes users seem to be searching for but haven't fully expressed yet - opportunities for future content.`,
        response_json_schema: {
          type: 'object',
          properties: {
            themes: {
              type: 'array',
              items: { type: 'object', properties: { name: { type: 'string' }, description: { type: 'string' } } }
            },
            power_words: { type: 'array', items: { type: 'string' } },
            emotional_patterns: {
              type: 'array',
              items: { type: 'object', properties: { pattern: { type: 'string' }, description: { type: 'string' } } }
            },
            marketing_phrases: { type: 'array', items: { type: 'string' } },
            content_gaps: {
              type: 'array',
              items: { type: 'object', properties: { topic: { type: 'string' }, opportunity: { type: 'string' } } }
            }
          }
        }
      });
      setInsights(result);
    } catch (error) {
      toast.error('Unable to analyze content at this time. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyPhrase = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Phrase copied!');
  };

  const themeColors = [
    'bg-rose-100 text-rose-800 border-rose-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-amber-100 text-amber-800 border-amber-200',
    'bg-emerald-100 text-emerald-800 border-emerald-200',
    'bg-sky-100 text-sky-800 border-sky-200',
    'bg-orange-100 text-orange-800 border-orange-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
  ];

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="p-4 md:p-8 bg-gradient-to-br from-amber-50 to-rose-50 min-h-screen">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <BookOpen className="w-7 h-7 text-amber-600 flex-shrink-0" />
              Content Insights
            </h1>
            <p className="text-gray-600 mt-1 text-sm md:text-base">
              Analyze community blessing threads to extract authentic language, themes, and marketing copy
            </p>
          </div>

          {/* Stats + Trigger */}
          <Card className="mb-6 border-amber-200/50">
            <CardContent className="p-4 md:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-semibold text-gray-800">Community Journal Pool</p>
                  {isLoading ? (
                    <Skeleton className="h-4 w-48 mt-1" />
                  ) : (
                    <p className="text-sm text-gray-500 mt-1">
                      <span className="font-bold text-amber-700">{blessings.length}</span> blessing threads available for analysis
                      {blessings.length === 0 && ' — encourage users to share reflections first'}
                    </p>
                  )}
                </div>
                <Button
                  onClick={analyzeContent}
                  disabled={isAnalyzing || isLoading || blessings.length === 0}
                  className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Community Voice'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading Skeletons */}
          {isAnalyzing && (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <Card key={i}>
                  <CardContent className="p-6 space-y-3">
                    <Skeleton className="h-5 w-40" />
                    <div className="flex flex-wrap gap-2">
                      {[1,2,3,4,5].map(j => <Skeleton key={j} className="h-7 w-20 rounded-full" />)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Results */}
          {insights && !isAnalyzing && (
            <div className="space-y-6">

              {/* Themes */}
              {insights.themes?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Heart className="w-5 h-5 text-rose-500" /> Top Emotional Themes
                    </CardTitle>
                    <CardDescription>Core themes your community is working through — use these in your messaging</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {insights.themes.map((theme, i) => (
                        <div key={i} className={`p-3 rounded-xl border ${themeColors[i % themeColors.length]}`}>
                          <p className="font-semibold text-sm">{theme.name}</p>
                          <p className="text-xs mt-1 opacity-80">{theme.description}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Power Words */}
              {insights.power_words?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Tag className="w-5 h-5 text-purple-500" /> Power Words & Phrases
                    </CardTitle>
                    <CardDescription>Authentic language straight from your community — use these in ad copy, CTAs, and captions</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {insights.power_words.map((word, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="cursor-pointer hover:bg-purple-50 border-purple-200 text-purple-700 px-3 py-1 text-sm"
                          onClick={() => copyPhrase(word)}
                        >
                          {word}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Click any word to copy it</p>
                  </CardContent>
                </Card>
              )}

              {/* Emotional Patterns */}
              {insights.emotional_patterns?.length > 0 && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Sparkles className="w-5 h-5 text-amber-500" /> Transformation Arcs
                    </CardTitle>
                    <CardDescription>Emotional journey patterns — frame your story arc around these in campaigns</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.emotional_patterns.map((p, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                          <span className="font-bold text-amber-600 text-lg leading-tight">→</span>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm">{p.pattern}</p>
                            <p className="text-xs text-gray-600 mt-0.5">{p.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Ready-to-use Marketing Phrases */}
              {insights.marketing_phrases?.length > 0 && (
                <Card className="border-green-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Lightbulb className="w-5 h-5 text-green-600" /> Ready-to-Use Marketing Copy
                    </CardTitle>
                    <CardDescription>AI-crafted phrases based on authentic community voice — copy and use directly</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.marketing_phrases.map((phrase, i) => (
                        <div key={i} className="flex items-start justify-between gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                          <p className="text-sm text-gray-800 italic flex-1">"{phrase}"</p>
                          <Button variant="ghost" size="icon" className="h-7 w-7 flex-shrink-0" onClick={() => copyPhrase(phrase)}>
                            <Copy className="w-3.5 h-3.5 text-green-600" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Content Gaps */}
              {insights.content_gaps?.length > 0 && (
                <Card className="border-sky-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="w-5 h-5 text-sky-600" /> Content Opportunities
                    </CardTitle>
                    <CardDescription>Topics your audience is seeking but haven't found yet — create content here</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {insights.content_gaps.map((gap, i) => (
                        <div key={i} className="p-3 bg-sky-50 rounded-lg border border-sky-100">
                          <p className="font-semibold text-sky-800 text-sm">{gap.topic}</p>
                          <p className="text-xs text-sky-700 mt-1">{gap.opportunity}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Button variant="outline" onClick={analyzeContent} disabled={isAnalyzing} className="w-full">
                <Sparkles className="w-4 h-4 mr-2" /> Re-analyze Community Voice
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}