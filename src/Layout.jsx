import React from "react";
import { Link, useLocation } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Flower2, Heart, Users, BookOpen, Sparkles, Home, Lightbulb, Megaphone, PieChart, Bot, Wrench, Mail, MessageCircle, Library } from "lucide-react";
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
  {
    title: "Sacred Garden",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Today's Seed",
    url: createPageUrl("TodaysSeed"),
    icon: Flower2,
  },
  {
    title: "Soul Sister",
    url: createPageUrl("SoulBuddy"),
    icon: Users,
  },
  {
    title: "Blessing Threads",
    url: createPageUrl("Community"),
    icon: Heart,
  },
  {
    title: "My Reflections",
    url: createPageUrl("MyJournal"),
    icon: BookOpen,
  },
];

const marketingStrategyItems = [
  {
    title: "Campaigns",
    url: createPageUrl("CampaignDashboard"),
    icon: Megaphone,
  },
  {
    title: "Analytics",
    url: createPageUrl("Analytics"),
    icon: PieChart,
  },
  {
    title: "Action Center",
    url: createPageUrl("StrategicActionCenter"),
    icon: Lightbulb,
  },
  {
    title: "Agent Studio",
    url: createPageUrl("AgentStudio"),
    icon: Bot,
  },
  {
    title: "Predictive Insights",
    url: createPageUrl("PredictiveInsights"),
    icon: Sparkles,
  },
  {
    title: "Newsletter Generator",
    url: createPageUrl("NewsletterGenerator"),
    icon: Mail,
  },
  {
    title: "Sentiment Analysis",
    url: createPageUrl("SentimentAnalysis"),
    icon: MessageCircle,
  },
  {
    title: "Content Insights",
    url: createPageUrl("ContentInsights"),
    icon: Library,
  },
  {
    title: "Tracking Setup",
    url: createPageUrl("TrackingSetup"),
    icon: Wrench,
  },
];

const pagesWithoutSidebar = ['Home', 'Terms'];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();

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
        }
        
        body {
          background: linear-gradient(135deg, var(--divine-light) 0%, var(--pearl-white) 50%, var(--gentle-lavender) 100%);
          min-height: 100vh;
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
      `}</style>
      
      <div className="min-h-screen flex w-full">
        <Sidebar className="border-r border-sage-200/30 bg-gradient-to-b from-white/80 to-pearl-white/60 backdrop-blur-sm">
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
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gentle-lavender to-soft-rose rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-semibold text-sm">✨</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 text-sm truncate">Sacred Soul</p>
                <p className="text-xs text-gray-600 truncate">Your spiritual journey awaits</p>
              </div>
            </div>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white/60 backdrop-blur-sm border-b border-sage-200/30 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-sage-50 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-serif font-semibold bg-gradient-to-r from-sacred-sage to-warm-gold bg-clip-text text-transparent">
                Sacred Seeds
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}