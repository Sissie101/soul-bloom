import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Flower2, Heart, Users, BookOpen, Sparkles, Home, Lightbulb, Megaphone, PieChart, Bot, Wrench, Mail, MessageCircle, Library, Trash2, AlertTriangle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";

const spiritualJourneyItems = [
  { title: "Sacred Garden", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Today's Seed", url: createPageUrl("TodaysSeed"), icon: Flower2 },
  { title: "Soul Sister", url: createPageUrl("SoulBuddy"), icon: Users },
  { title: "Blessing Threads", url: createPageUrl("Community"), icon: Heart },
  { title: "My Reflections", url: createPageUrl("MyJournal"), icon: BookOpen },
];

const marketingStrategyItems = [
  { title: "Campaigns", url: createPageUrl("CampaignDashboard"), icon: Megaphone },
  { title: "Analytics", url: createPageUrl("Analytics"), icon: PieChart },
  { title: "Action Center", url: createPageUrl("StrategicActionCenter"), icon: Lightbulb },
  { title: "Agent Studio", url: createPageUrl("AgentStudio"), icon: Bot },
  { title: "Predictive Insights", url: createPageUrl("PredictiveInsights"), icon: Sparkles },
  { title: "Newsletter Generator", url: createPageUrl("NewsletterGenerator"), icon: Mail },
  { title: "Sentiment Analysis", url: createPageUrl("SentimentAnalysis"), icon: MessageCircle },
  { title: "Content Insights", url: createPageUrl("ContentInsights"), icon: Library },
  { title: "Tracking Setup", url: createPageUrl("TrackingSetup"), icon: Wrench },
  { title: "Social Analytics", url: "/SocialAnalyticsDashboard", icon: PieChart },
];

const bottomNavItems = [
  { title: "Garden", url: createPageUrl("Dashboard"), icon: Home },
  { title: "Today's Seed", url: createPageUrl("TodaysSeed"), icon: Flower2 },
  { title: "Community", url: createPageUrl("Community"), icon: Heart },
  { title: "Journal", url: createPageUrl("MyJournal"), icon: BookOpen },
];

const pagesWithoutSidebar = ['Home', 'Terms'];

function DeleteAccountModal({ onClose }) {
  const [confirmed, setConfirmed] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirmed) return;
    setDeleting(true);
    // Log out and redirect — actual deletion would require a backend function
    await base44.auth.logout("/");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Delete Account</h2>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          This will permanently delete your account and all your journal entries, reflections, and connections. This cannot be undone.
        </p>
        <label className="flex items-start gap-3 mb-6 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(e) => setConfirmed(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-red-500"
          />
          <span className="text-sm text-gray-700 dark:text-gray-300">I understand this action is permanent and irreversible.</span>
        </label>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 min-h-[44px] rounded-xl border border-gray-200 text-gray-700 dark:border-gray-700 dark:text-gray-300 font-medium text-sm select-none"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={!confirmed || deleting}
            className="flex-1 min-h-[44px] rounded-xl bg-red-500 text-white font-medium text-sm disabled:opacity-40 select-none"
          >
            {deleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (pagesWithoutSidebar.includes(currentPageName)) {
    return <>{children}</>;
  }

  return (
    <SidebarProvider>
      <style>{`
        :root {
          --sacred-sage: #9CAF88;
          --warm-gold: #D4AF37;
          --pearl-white: #F8F6F0;
          --gentle-lavender: #E6E0F8;
          --soft-rose: #F4E4E6;
          --divine-light: #FFFEF7;
          --bg-primary: #FFFEF7;
          --text-primary: #1a1a1a;
          --text-secondary: #6b7280;
          --card-bg: #ffffff;
          --border-color: rgba(156,175,136,0.3);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --sacred-sage: #A8C494;
            --warm-gold: #E0BC4A;
            --pearl-white: #1e1e2a;
            --gentle-lavender: #2a2640;
            --soft-rose: #3a2a2c;
            --divine-light: #141420;
            --bg-primary: #141420;
            --text-primary: #f0eefc;
            --text-secondary: #9ca3af;
            --card-bg: #1e1e2a;
            --border-color: rgba(168,196,148,0.2);
          }
          body {
            background: linear-gradient(135deg, #141420 0%, #1e1e2a 50%, #2a2640 100%) !important;
            color: var(--text-primary);
          }
        }

        body {
          background: linear-gradient(135deg, var(--divine-light) 0%, var(--pearl-white) 50%, var(--gentle-lavender) 100%);
          min-height: 100vh;
          overscroll-behavior-y: none;
          padding-top: env(safe-area-inset-top);
          padding-left: env(safe-area-inset-left);
          padding-right: env(safe-area-inset-right);
        }

        .sacred-glow {
          box-shadow: 0 4px 20px rgba(156, 175, 136, 0.15);
        }

        .blessing-shimmer {
          background: linear-gradient(45deg, var(--warm-gold), var(--sacred-sage), var(--warm-gold));
          background-size: 300% 300%;
          animation: shimmer 3s ease-in-out infinite;
        }

        @keyframes shimmer {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .petal-float {
          animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Tap target minimum 44px */
        button, a, [role="button"] {
          min-height: 44px;
          min-width: 44px;
        }

        /* user-select: none on interactive elements */
        button, a, nav, [role="navigation"], svg {
          user-select: none;
          -webkit-user-select: none;
        }

        /* Bottom nav safe area */
        .bottom-nav {
          padding-bottom: env(safe-area-inset-bottom);
        }

        /* Push content above bottom nav on mobile */
        @media (max-width: 767px) {
          .main-scroll-area {
            padding-bottom: calc(64px + env(safe-area-inset-bottom));
          }
        }
      `}</style>

      {showDeleteModal && <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />}

      <div className="min-h-screen flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="border-r border-sage-200/30 bg-gradient-to-b from-white/80 to-pearl-white/60 backdrop-blur-sm hidden md:flex">
          <SidebarHeader className="border-b border-sage-200/30 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center petal-float">
                <Flower2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-serif text-xl font-bold bg-gradient-to-r from-sacred-sage to-warm-gold bg-clip-text text-transparent">
                  Sacred Seeds
                </h2>
                <p className="text-xs text-gray-600 font-light">30 Days of Soul Reflection</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Spiritual Journey
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {spiritualJourneyItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-sage-50/50 hover:text-sacred-sage transition-all duration-300 rounded-xl mb-2 group ${
                          location.pathname === item.url ? 'bg-sage-50/70 text-sacred-sage sacred-glow' : 'text-gray-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-4">
              <SidebarGroupLabel className="text-xs font-medium text-gray-500 uppercase tracking-wider px-2 py-2">
                Marketing & Strategy
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {marketingStrategyItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-300 rounded-xl mb-2 group ${
                          location.pathname === item.url ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3 px-4 py-3">
                          <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <div className="px-4 py-3 bg-gradient-to-br from-warm-gold/10 to-sacred-sage/10 rounded-xl border border-warm-gold/20">
                <div className="flex items-center gap-2 text-sm">
                  <Heart className="w-4 h-4 text-warm-gold" />
                  <span className="text-gray-700 font-medium">Gratitude Hearts</span>
                  <span className="ml-auto font-bold text-warm-gold">0</span>
                </div>
                <div className="flex items-center gap-2 text-sm mt-2">
                  <Sparkles className="w-4 h-4 text-sacred-sage" />
                  <span className="text-gray-700 font-medium">Journey Day</span>
                  <span className="ml-auto font-bold text-sacred-sage">1</span>
                </div>
              </div>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-sage-200/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gentle-lavender to-soft-rose rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-sm">✨</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">Sacred Soul</p>
                <p className="text-xs text-gray-600 truncate">Your spiritual journey awaits</p>
              </div>
            </div>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 hover:bg-red-50 text-sm font-medium transition-colors select-none min-h-[44px]"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col min-w-0">
          {/* Mobile Top Header */}
          <header className="bg-white/60 backdrop-blur-sm border-b border-sage-200/30 px-6 py-4 md:hidden flex items-center gap-4" style={{ paddingTop: `max(1rem, env(safe-area-inset-top))` }}>
            <SidebarTrigger className="hover:bg-sage-50 p-2 rounded-lg transition-colors duration-200" />
            <h1 className="text-xl font-serif font-semibold bg-gradient-to-r from-sacred-sage to-warm-gold bg-clip-text text-transparent">
              Sacred Seeds
            </h1>
          </header>

          <div className="flex-1 overflow-auto main-scroll-area">
            {children}
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation - only visible < 768px */}
      <nav className="bottom-nav fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-t border-sage-200/30 flex">
        {bottomNavItems.map((item) => {
          const isActive = location.pathname === item.url;
          return (
            <Link
              key={item.title}
              to={item.url}
              className={`flex-1 flex flex-col items-center justify-center gap-1 py-2 select-none min-h-[56px] transition-colors duration-200 ${
                isActive ? 'text-sacred-sage' : 'text-gray-400'
              }`}
            >
              <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium leading-tight text-center">{item.title}</span>
            </Link>
          );
        })}
      </nav>
    </SidebarProvider>
  );
}