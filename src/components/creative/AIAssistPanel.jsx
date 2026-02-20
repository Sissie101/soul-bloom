import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Wand2, Image, FlaskConical, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function AIAssistPanel({ creative, onApplyCopy, onApplyImage }) {
  const [copyVariants, setCopyVariants] = useState([]);
  const [abSuggestions, setAbSuggestions] = useState(null);
  const [imagePrompt, setImagePrompt] = useState('');
  const [isGeneratingCopy, setIsGeneratingCopy] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingAB, setIsGeneratingAB] = useState(false);
  const [openSection, setOpenSection] = useState('copy');

  const toggleSection = (s) => setOpenSection(openSection === s ? null : s);

  const generateCopyVariants = async () => {
    if (!creative.copy && !creative.title) {
      toast.error('Add some copy or a title first so AI can create variations.');
      return;
    }
    setIsGeneratingCopy(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a spiritual marketing copywriter for Soul Sync Insights (Sacred Seeds - a 30-day journaling journey for women).

Original ad copy: "${creative.copy || ''}"
Creative title: "${creative.title || ''}"

Generate 3 distinct variations of this ad copy. Each should:
- Keep the spiritual, feminine tone ("sacred", "bloom", "soul", "awaken", "journey")
- Be 1-3 sentences
- Have a different angle: (1) emotional/story-led, (2) curiosity/question-led, (3) transformation/result-led

Return a JSON object with a "variants" array of objects, each with "angle" (string label) and "copy" (the actual copy text).`,
        response_json_schema: {
          type: 'object',
          properties: {
            variants: {
              type: 'array',
              items: { type: 'object', properties: { angle: { type: 'string' }, copy: { type: 'string' } } }
            }
          }
        }
      });
      setCopyVariants(result.variants || []);
    } catch (e) {
      toast.error('Unable to generate variants right now.');
    } finally {
      setIsGeneratingCopy(false);
    }
  };

  const generateImage = async () => {
    if (!imagePrompt.trim()) {
      toast.error('Enter an image description first.');
      return;
    }
    setIsGeneratingImage(true);
    try {
      const result = await base44.integrations.Core.GenerateImage({
        prompt: `Sacred Seeds spiritual journaling brand image: ${imagePrompt}. Style: soft, luminous, feminine, warm golden tones, sage greens, floral elements, peaceful and sacred aesthetic. High quality photography or illustration style.`
      });
      onApplyImage(result.url);
      toast.success('Image generated and applied!');
    } catch (e) {
      toast.error('Image generation unavailable right now.');
    } finally {
      setIsGeneratingImage(false);
    }
  };

  const generateABSuggestions = async () => {
    if (!creative.copy) {
      toast.error('Add ad copy first to get A/B testing suggestions.');
      return;
    }
    setIsGeneratingAB(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a conversion optimization expert for a spiritual women's brand (Sacred Seeds).

Current ad copy: "${creative.copy}"
Current image URL exists: ${!!creative.image_url}

Provide A/B testing recommendations. Focus on high-impact variables.

Return JSON with:
- "copy_tests": array of 2-3 objects with "hypothesis" and "variant_copy"
- "visual_tests": array of 2 objects with "hypothesis" and "visual_direction" (description of what image to try)
- "cta_tests": array of 2 objects with "original_cta" and "test_cta" and "reasoning"`,
        response_json_schema: {
          type: 'object',
          properties: {
            copy_tests: { type: 'array', items: { type: 'object', properties: { hypothesis: { type: 'string' }, variant_copy: { type: 'string' } } } },
            visual_tests: { type: 'array', items: { type: 'object', properties: { hypothesis: { type: 'string' }, visual_direction: { type: 'string' } } } },
            cta_tests: { type: 'array', items: { type: 'object', properties: { original_cta: { type: 'string' }, test_cta: { type: 'string' }, reasoning: { type: 'string' } } } },
          }
        }
      });
      setAbSuggestions(result);
    } catch (e) {
      toast.error('Unable to generate A/B suggestions right now.');
    } finally {
      setIsGeneratingAB(false);
    }
  };

  const Section = ({ id, icon: Icon, title, children, actionLabel, onAction, isLoading }) => (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleSection(id)}
        className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="flex items-center gap-2 font-medium text-sm">
          <Icon className="w-4 h-4 text-indigo-600" /> {title}
        </span>
        {openSection === id ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {openSection === id && (
        <div className="p-3 bg-indigo-50/40 border-t border-gray-200 space-y-3">
          {children}
          {actionLabel && (
            <Button onClick={onAction} disabled={isLoading} size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              {isLoading ? 'Working...' : actionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );

  return (
    <Card className="border-indigo-200">
      <CardHeader className="pb-3 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-t-xl">
        <CardTitle className="flex items-center gap-2 text-base">
          <Wand2 className="w-5 h-5 text-indigo-600" /> AI Creative Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-2">

        {/* Copy Variants */}
        <Section id="copy" icon={Sparkles} title="Generate Copy Variants" actionLabel="Generate 3 Variants" onAction={generateCopyVariants} isLoading={isGeneratingCopy}>
          <p className="text-xs text-gray-500">Creates 3 angle-based variations of your ad copy</p>
          {copyVariants.map((v, i) => (
            <div key={i} className="bg-white rounded-lg p-2.5 border border-indigo-100">
              <Badge variant="outline" className="text-xs mb-1.5 border-indigo-200 text-indigo-700">{v.angle}</Badge>
              <p className="text-xs text-gray-700">{v.copy}</p>
              <Button variant="ghost" size="sm" className="mt-1.5 h-6 text-xs text-indigo-600" onClick={() => { onApplyCopy(v.copy); toast.success('Copy applied!'); }}>
                <Copy className="w-3 h-3 mr-1" /> Use this
              </Button>
            </div>
          ))}
        </Section>

        {/* AI Image Generation */}
        <Section id="image" icon={Image} title="Generate Placeholder Image">
          <div className="space-y-2">
            <Label className="text-xs">Describe your ideal image</Label>
            <Textarea
              placeholder="e.g., Woman meditating in a flower garden at sunrise, golden light, soft and peaceful"
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
              className="text-xs min-h-[70px]"
            />
            <Button onClick={generateImage} disabled={isGeneratingImage} size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700">
              <Image className="w-3.5 h-3.5 mr-1.5" />
              {isGeneratingImage ? 'Generating image...' : 'Generate & Apply Image'}
            </Button>
          </div>
        </Section>

        {/* A/B Testing */}
        <Section id="ab" icon={FlaskConical} title="A/B Testing Suggestions" actionLabel="Get Test Ideas" onAction={generateABSuggestions} isLoading={isGeneratingAB}>
          <p className="text-xs text-gray-500">AI analyzes your copy and suggests high-impact tests</p>
          {abSuggestions && (
            <div className="space-y-3">
              {abSuggestions.copy_tests?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">📝 Copy Tests</p>
                  {abSuggestions.copy_tests.map((t, i) => (
                    <div key={i} className="bg-white rounded p-2 border border-indigo-100 mb-1.5">
                      <p className="text-xs text-blue-700 font-medium">{t.hypothesis}</p>
                      <p className="text-xs text-gray-600 mt-1 italic">Test: "{t.variant_copy}"</p>
                      <Button variant="ghost" size="sm" className="mt-1 h-5 text-xs text-indigo-600 p-0" onClick={() => { onApplyCopy(t.variant_copy); toast.success('Variant applied!'); }}>
                        Use this →
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              {abSuggestions.visual_tests?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">🖼️ Visual Tests</p>
                  {abSuggestions.visual_tests.map((t, i) => (
                    <div key={i} className="bg-white rounded p-2 border border-purple-100 mb-1.5">
                      <p className="text-xs text-purple-700 font-medium">{t.hypothesis}</p>
                      <p className="text-xs text-gray-600 mt-1">{t.visual_direction}</p>
                    </div>
                  ))}
                </div>
              )}
              {abSuggestions.cta_tests?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-600 mb-1.5">🎯 CTA Tests</p>
                  {abSuggestions.cta_tests.map((t, i) => (
                    <div key={i} className="bg-white rounded p-2 border border-green-100 mb-1.5">
                      <p className="text-xs text-gray-500">Current: <span className="line-through">{t.original_cta}</span></p>
                      <p className="text-xs text-green-700 font-medium">Test: {t.test_cta}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{t.reasoning}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Section>

      </CardContent>
    </Card>
  );
}