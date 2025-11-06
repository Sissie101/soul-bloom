import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-divine-light p-6 md:p-12">
      <div className="max-w-4xl mx-auto bg-white/80 p-8 rounded-2xl shadow-lg sacred-glow">
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Home")}>
            <Button variant="ghost" size="icon" className="text-sacred-sage hover:bg-sage-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-sacred-sage">Terms & Community Guidelines</h1>
        </div>

        <div className="prose prose-lg max-w-none text-gray-700">
          <p><em>Last Updated: {new Date().toLocaleDateString()}</em></p>

          <p>Welcome to Sacred Seeds. By accessing or using our application, you agree to be bound by these terms and our community guidelines. This is a space for healing, reflection, and connection. Please read these rules carefully to ensure a safe and supportive environment for all.</p>

          <h2>Community Guidelines</h2>
          <ol>
            <li><strong>Be Kind and Courteous.</strong> We're all in this together to create a welcoming environment. Let's treat everyone with respect. Healthy debates are natural, but kindness is required.</li>
            <li><strong>This is a Sacred Space.</strong> All reflections, especially those shared in Blessing Threads, are expressions of a person's soul journey. Honor them. Do not judge, harass, or belittle others.</li>
            <li><strong>No Promotions or Spam.</strong> Give more than you take in this group. Self-promotion, spam, and irrelevant links aren't allowed. This includes unsolicited private messages to members.</li>
            <li><strong>Respect Everyone's Privacy.</strong> What's shared in the community, stays in the community. Do not take screenshots or share personal stories outside of this application without explicit consent.</li>
          </ol>

          <h2>Terms of Service</h2>
          <h3>1. Use of Service</h3>
          <p>Our service is provided for personal, non-commercial use. You must be at least 18 years old to use this application. You are responsible for your account and all the activity that occurs while using it.</p>
          
          <h3>2. User Content</h3>
          <p>You retain all rights to the content you create (your journal entries, reflections, etc.). By choosing to share content publicly (e.g., as a "Blessing Thread"), you grant us a non-exclusive, worldwide license to display that content within the application for the purpose of operating the service.</p>

          <h3>3. Disclaimer</h3>
          <p>Sacred Seeds is a tool for personal reflection and peer support. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical or mental health condition.</p>

          <h3>4. Termination</h3>
          <p>We may terminate or suspend your account, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms or Community Guidelines.</p>
          
          <h3>5. Changes to Terms</h3>
          <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. We will provide notice of any changes by posting the new Terms on this page.</p>

          <p>If you have any questions about these terms, please contact us at support@soulsyncinsights.com.</p>
        </div>
      </div>
    </div>
  );
}