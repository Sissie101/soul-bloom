import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flower2, Heart, Sparkles, ArrowRight, BookOpen, Users, Star, CheckCircle } from 'lucide-react';
import { toast, Toaster } from 'sonner';

const features = [
  {
    icon: BookOpen,
    color: 'from-sacred-sage to-emerald-400',
    title: '30 Daily Seeds',
    desc: 'Guided prompts that spark deep reflection, one sacred day at a time.',
  },
  {
    icon: Users,
    color: 'from-warm-gold to-amber-400',
    title: 'Soul Buddy Matching',
    desc: 'AI pairs you with a sister soul based on your mood and journal themes.',
  },
  {
    icon: Heart,
    color: 'from-rose-400 to-pink-500',
    title: 'Blessing Threads',
    desc: 'Share reflections and receive gratitude hearts from your community.',
  },
  {
    icon: Sparkles,
    color: 'from-violet-400 to-purple-500',
    title: 'Sacred Soundscapes',
    desc: 'Binaural beats and healing frequencies to deepen your practice.',
  },
];

const testimonials = [
  { name: 'Amara J.', text: 'Sacred Seeds transformed my mornings. My soul buddy and I still check in every day, even after the 30 days.' },
  { name: 'Priya K.', text: 'The AI matching was uncanny — my buddy and I are so aligned. We laugh about how the app just knew.' },
  { name: 'Sofia M.', text: 'I cried writing Day 12. In the best way. This journey cracked me open beautifully.' },
];

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) { toast.error('Please enter a valid email address.'); return; }
    setIsSubmitting(true);
    try {
      await base44.entities.WaitlistEntry.create({ email, name });
      setSubmitted(true);
      toast.success("You're on the list! We'll notify you when we launch.");
    } catch {
      toast.error('Something went wrong. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen w-full bg-gradient-to-br from-[#FFFEF7] via-[#F8F6F0] to-[#E6E0F8] text-gray-900">

        {/* ── HERO ── */}
        <section className="relative flex flex-col items-center justify-center text-center px-6 pt-20 pb-16 overflow-hidden">
          {/* decorative blobs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-warm-gold/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-sacred-sage/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-warm-gold/10 border border-warm-gold/30 rounded-full px-4 py-1.5 text-sm font-medium text-warm-gold mb-6">
              <Sparkles className="w-3.5 h-3.5" /> Now accepting early access
            </div>

            <div className="w-24 h-24 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl petal-float">
              <Flower2 className="w-12 h-12 text-white" />
            </div>

            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight bg-gradient-to-r from-sacred-sage via-warm-gold to-sacred-sage bg-clip-text text-transparent">
              Sacred Seeds
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 font-light max-w-2xl mx-auto mb-4">
              A 30-day guided journey of <span className="text-sacred-sage font-medium">soul reflection</span>, community, and spiritual awakening — built for women ready to bloom.
            </p>
            <p className="text-gray-500 text-base mb-10 max-w-xl mx-auto">
              Each day unlocks a sacred seed: a prompt, a soundscape, and a soul buddy who mirrors your journey.
            </p>

            {/* Waitlist form */}
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto mb-6">
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/80 border-sage-200/50 flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-sacred-sage to-warm-gold text-white font-semibold px-6 whitespace-nowrap hover:shadow-lg transition-all"
                >
                  {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sacred-sage font-semibold text-lg mb-6">
                <CheckCircle className="w-6 h-6" /> You're on the list — we'll be in touch!
              </div>
            )}

            <p className="text-xs text-gray-400 mb-10">No spam. Unsubscribe any time.</p>

            <div className="flex flex-wrap gap-6 justify-center text-sm text-gray-500">
              <div className="flex items-center gap-1.5"><Star className="w-4 h-4 text-warm-gold fill-warm-gold" /> 4.9 / 5 avg. rating</div>
              <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-sacred-sage" /> 2,000+ souls on waitlist</div>
              <div className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-400 fill-rose-400" /> 30 days, life-changing</div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-center text-gray-800 mb-4">
              Everything your soul needs to bloom
            </h2>
            <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
              Sacred Seeds weaves together daily prompts, AI-matched companions, and immersive soundscapes into one transformative experience.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map(({ icon: Icon, color, title, desc }) => (
                <div key={title} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <div className={`w-12 h-12 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mb-4 shadow`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SOUL BUDDY HIGHLIGHT ── */}
        <section className="py-20 px-6 bg-gradient-to-r from-sacred-sage/10 via-warm-gold/10 to-gentle-lavender/30">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-warm-gold/20 text-warm-gold rounded-full px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles className="w-3 h-3" /> AI-Powered Matching
              </div>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4 leading-snug">
                Meet your Soul Buddy —<br /> she's been waiting for you
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our AI reads between the lines of your journal entries — your mood trends, the words you reach for, the themes your soul keeps returning to — and finds the sister who resonates most deeply with your journey.
              </p>
              <ul className="space-y-2 text-gray-600 text-sm">
                {['Matched by mood & reflection themes', 'Private shared space to exchange blessings', 'Connection that outlasts the 30 days'].map(item => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-sacred-sage shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 bg-gradient-to-br from-warm-gold/20 to-sacred-sage/20 rounded-full animate-pulse" />
                <div className="absolute inset-4 bg-gradient-to-br from-warm-gold/30 to-sacred-sage/30 rounded-full flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-16 h-16 text-sacred-sage mx-auto mb-3" />
                    <p className="text-sacred-sage font-serif font-bold text-lg">Soul Sisters</p>
                    <p className="text-gray-500 text-xs">AI-matched with love</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center text-gray-800 mb-12">
              Words from our sacred community
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map(({ name, text }) => (
                <div key={name} className="bg-white/70 rounded-2xl p-6 border border-white/60 shadow-sm">
                  <div className="flex gap-0.5 mb-3">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-warm-gold fill-warm-gold" />)}
                  </div>
                  <p className="text-gray-700 text-sm leading-relaxed italic mb-4">"{text}"</p>
                  <p className="text-gray-500 text-xs font-semibold">— {name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="py-20 px-6 text-center">
          <div className="max-w-xl mx-auto">
            <Flower2 className="w-12 h-12 text-warm-gold mx-auto mb-4 petal-float" />
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-800 mb-4">
              Your 30-day bloom starts with one seed.
            </h2>
            <p className="text-gray-500 mb-8">Join the waitlist and be first through the garden gate.</p>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 justify-center max-w-sm mx-auto">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-white/80 border-sage-200/50 flex-1"
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-sacred-sage to-warm-gold text-white font-semibold px-6 whitespace-nowrap hover:shadow-lg"
                >
                  {isSubmitting ? 'Joining...' : 'Join Now'}
                </Button>
              </form>
            ) : (
              <div className="flex items-center justify-center gap-2 text-sacred-sage font-semibold text-lg">
                <CheckCircle className="w-6 h-6" /> You're on the list!
              </div>
            )}
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="border-t border-sage-200/30 py-8 px-6 text-center text-gray-400 text-sm">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a href="https://soulsyncinsights.com" target="_blank" rel="noopener noreferrer" className="hover:text-sacred-sage transition-colors">
              SoulSyncInsights.com
            </a>
            <span>|</span>
            <Link to={createPageUrl("Terms")} className="hover:text-sacred-sage transition-colors">
              Terms & Guidelines
            </Link>
            <span>|</span>
            <span>© {new Date().getFullYear()} Soul Sync Insights</span>
          </div>
        </footer>
      </div>
    </>
  );
}