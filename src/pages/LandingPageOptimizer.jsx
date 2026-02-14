import React, { useState, useEffect } from 'react';
import { Creative } from '@/entities/all';
import { InvokeLLM } from '@/integrations/Core';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Wand2, Lightbulb, Megaphone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";

export default function LandingPageOptimizer() {
  const [creative, setCreative] = useState(null);
  const [pageUrl, setPageUrl] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const fetchCreative = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search || '');
        const creativeId = urlParams.get('creative_id');
        
        // Fix: Ensure creativeId is a non-empty string before attempting to fetch
        if (creativeId && creativeId.trim() !== '') {
          const data = await Creative.get(creativeId.trim());
          setCreative(data || null);
        } else {
          // If creativeId is missing or empty, ensure creative state is null
          setCreative(null);
        }
      } catch (error) {
        console.error('Error fetching creative:', error);
        // Optionally set creative to null or show an error message to the user
        setCreative(null);
      }
      setIsLoading(false);
    };
    fetchCreative();
  }, []);

  const handleAnalyze = async () => {
    if (!pageUrl || !creative) return;
    setIsAnalyzing(true);
    setAnalysis(null);

    const prompt = `
      You are a conversion rate optimization expert with a deep understanding of spiritual and wellness brands.
      The user is coming from an ad with the following copy: "${creative.copy || 'No copy provided'}".
      Analyze the content of the landing page at this URL: ${pageUrl}.
      Provide actionable recommendations to improve alignment between the ad and the page. Focus on:
      1. Headline & Ad Scent: Does the headline immediately confirm the user is in the right place based on the ad?
      2. Emotional Tone: Is the feeling of the page consistent with the feeling of the ad?
      3. Call-to-Action (CTA) Clarity: Is the primary action clear, compelling, and easy to take?
      4. Trust & Authenticity: Does the page build trust and feel authentic to the brand's promise?
      
      Return a JSON object with four keys: "headline_alignment", "emotional_tone", "cta_clarity", and "trust_authenticity".
      For each key, provide a sub-object with "score" (1-10), "analysis" (a brief explanation), and "recommendation" (a concrete, actionable tip).
    `;

    try {
      const result = await InvokeLLM({
        prompt: prompt,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            headline_alignment: { type: "object", properties: { score: {type: "number"}, analysis: {type: "string"}, recommendation: {type: "string"}}},
            emotional_tone: { type: "object", properties: { score: {type: "number"}, analysis: {type: "string"}, recommendation: {type: "string"}}},
            cta_clarity: { type: "object", properties: { score: {type: "number"}, analysis: {type: "string"}, recommendation: {type: "string"}}},
            trust_authenticity: { type: "object", properties: { score: {type: "number"}, analysis: {type: "string"}, recommendation: {type: "string"}}},
          }
        }
      });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      setAnalysis({ error: "Unable to complete analysis at this time. This may be due to rate limits or connectivity issues. Please try again in a few moments." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  }

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("StrategicActionCenter")}>
            <Button variant="outline" size="icon"><ArrowLeft className="w-4 h-4" /></Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Landing Page Optimizer</h1>
            <p className="text-gray-500">Heal the journey from click to conversion.</p>
          </div>
        </div>

        <Card className="mb-8 sacred-glow border-sage-200/30">
          <CardHeader>
            <CardTitle>Journey Alignment Setup</CardTitle>
            <CardDescription>Align the energy of your ad with the promise of your landing page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label>Source Ad Creative</Label>
              <div className="p-4 bg-sage-50/50 rounded-lg mt-1 border border-sage-200/40">
                <p className="font-semibold text-sacred-sage flex items-center gap-2">
                  <Megaphone className="w-4 h-4" />
                  {creative?.title || 'No Creative Selected'}
                </p>
                <blockquote className="mt-2 pl-3 border-l-2 border-warm-gold text-sm text-gray-600 italic">
                  "{creative?.copy || 'No creative copy available. Please select a creative from the Action Center.'}"
                </blockquote>
              </div>
            </div>
            <div>
              <Label htmlFor="url">Landing Page URL</Label>
              <Input id="url" type="url" placeholder="https://yourdomain.com/landing-page" value={pageUrl} onChange={(e) => setPageUrl(e.target.value)}/>
            </div>
            <Button onClick={handleAnalyze} disabled={isAnalyzing || !pageUrl || !creative} className="bg-indigo-600 hover:bg-indigo-700">
              <Wand2 className="w-4 h-4 mr-2"/>
              {isAnalyzing ? 'Analyzing...' : 'Analyze Resonance'}
            </Button>
          </CardContent>
        </Card>

        {isAnalyzing && (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Our AI is reading the energy of your page...</p>
          </div>
        )}

        {analysis && (
          <Card>
            <CardHeader>
              <CardTitle>Optimization Insights</CardTitle>
              <CardDescription>Actionable recommendations to improve resonance and conversion.</CardDescription>
            </CardHeader>
            <CardContent>
              {analysis.error ? (
                <p className="text-red-500">{analysis.error}</p>
              ) : (
                <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
                  {Object.entries(analysis).map(([key, value], index) => (
                     <AccordionItem key={key} value={`item-${index+1}`}>
                      <AccordionTrigger className="text-lg font-semibold">
                        <div className="flex items-center gap-3">
                          <Badge className="text-lg">{value.score}/10</Badge>
                          <span className="capitalize">{key.replace(/_/g, ' ')}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4 space-y-3">
                        <p><strong className="text-gray-700">Analysis:</strong> {value.analysis}</p>
                        <div className="flex items-start gap-2 p-3 bg-green-50 rounded-md border border-green-200">
                          <Lightbulb className="w-5 h-5 text-green-600 mt-1 flex-shrink-0"/>
                          <p><strong className="text-green-800">Recommendation:</strong> {value.recommendation}</p>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}