import React, { useState } from 'react';
import { WaitlistEntry } from '@/entities/WaitlistEntry';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Flower2, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Toaster, toast } from 'sonner';

export default function HomePage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter a valid email address.');
      return;
    }
    setIsSubmitting(true);
    try {
      await WaitlistEntry.create({ email, name });
      toast.success("You're on the list! We'll notify you when we launch.");
      setEmail('');
      setName('');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
      console.error("Waitlist submission error:", error);
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center petal-float">
              <Flower2 className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-4 bg-gradient-to-r from-sacred-sage via-warm-gold to-sacred-sage bg-clip-text text-transparent">
            Your Journey Begins Soon
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-light max-w-2xl mx-auto mb-10">
            Welcome to Sacred Seeds, a 30-day guided journey of soul reflection. Awaken your inner wisdom, connect with a supportive community, and watch your spirit bloom. The experience is being carefully cultivated and will launch soon.
          </p>

          <Card className="max-w-lg mx-auto bg-white/60 backdrop-blur-sm border-sage-200/30 sacred-glow">
            <CardContent className="p-8">
              <h3 className="text-xl font-serif font-semibold text-sacred-sage mb-4">Join the Waitlist</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-white/80"
                />
                <Input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/80"
                  required
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-sacred-sage to-warm-gold text-white font-medium py-3 transition-all duration-300 hover:shadow-lg"
                >
                  {isSubmitting ? 'Joining...' : 'Notify Me When You Launch'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-12">
            <a 
              href="https://soulsyncinsights.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-sacred-sage hover:text-warm-gold font-medium transition-colors"
            >
              Visit our main site at SoulSyncInsights.com
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </div>
        </div>

        <footer className="absolute bottom-0 left-0 right-0 p-6 text-center text-gray-500 text-sm">
          <Link to={createPageUrl("Terms")} className="hover:text-sacred-sage transition-colors">
            Terms & Community Guidelines
          </Link>
          <span className="mx-2">|</span>
          <span>© {new Date().getFullYear()} Soul Sync Insights. All rights reserved.</span>
        </footer>
      </div>
    </>
  );
}