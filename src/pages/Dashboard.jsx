import React, { useState, useEffect } from "react";
import { JournalEntry, DailySeed, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Flower2, Heart, Sparkles, ArrowRight, BookOpen, Users } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todaysSeed, setTodaysSeed] = useState(null);
  const [recentEntries, setRecentEntries] = useState([]);
  const [journeyStats, setJourneyStats] = useState({
    totalEntries: 0,
    heartsReceived: 0,
    currentDay: 1
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load today's seed (for demo, we'll use day 1)
      const seeds = await DailySeed.list();
      if (seeds.length > 0) {
        setTodaysSeed(seeds[0]);
      }

      // Load recent journal entries
      const entries = await JournalEntry.filter({ created_by: user.email }, '-created_date', 5);
      setRecentEntries(entries);

      // Calculate stats
      const allEntries = await JournalEntry.filter({ created_by: user.email });
      const totalHearts = allEntries.reduce((sum, entry) => sum + (entry.hearts_received || 0), 0);
      
      setJourneyStats({
        totalEntries: allEntries.length,
        heartsReceived: totalHearts,
        currentDay: Math.min(allEntries.length + 1, 30)
      });
    } catch (error) {
      // User not logged in, redirect to login
      await User.loginWithRedirect(window.location.href);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning, sacred soul";
    if (hour < 17) return "Good afternoon, beautiful spirit";
    return "Good evening, divine one";
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-sage"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center petal-float">
              <Flower2 className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-3 bg-gradient-to-r from-sacred-sage via-warm-gold to-sacred-sage bg-clip-text text-transparent">
            {getGreeting()}
          </h1>
          <p className="text-lg text-gray-600 font-light max-w-2xl mx-auto">
            Welcome to your sacred garden of reflection. Each day brings a new seed of wisdom to nurture your soul's journey.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-white/80 to-sage-50/50 border-sage-200/30 sacred-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Journey Day</CardTitle>
              <Sparkles className="w-4 h-4 text-sacred-sage" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-sacred-sage">{journeyStats.currentDay}</div>
              <p className="text-xs text-gray-600 mt-1">of 30 sacred days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/80 to-rose-50/50 border-rose-200/30 sacred-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Gratitude Hearts</CardTitle>
              <Heart className="w-4 h-4 text-warm-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warm-gold">{journeyStats.heartsReceived}</div>
              <p className="text-xs text-gray-600 mt-1">received from community</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/80 to-lavender-50/50 border-lavender-200/30 sacred-glow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Reflections</CardTitle>
              <BookOpen className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-500">{journeyStats.totalEntries}</div>
              <p className="text-xs text-gray-600 mt-1">seeds planted</p>
            </CardContent>
          </Card>
        </div>

        {/* Today's Seed */}
        {todaysSeed && (
          <Card className="mb-12 bg-gradient-to-br from-white/90 to-sage-50/60 border-sage-200/40 sacred-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-serif text-sacred-sage mb-2">
                    Today's Sacred Seed
                  </CardTitle>
                  <p className="text-gray-600 font-light">Day {todaysSeed.day_number}: {todaysSeed.title}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-white/60 rounded-lg p-6 mb-6 border border-sage-200/30">
                <p className="text-gray-700 leading-relaxed italic text-lg">
                  "{todaysSeed.prompt}"
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to={createPageUrl("TodaysSeed")} className="flex-1">
                  <Button className="w-full bg-gradient-to-r from-sacred-sage to-warm-gold hover:from-warm-gold hover:to-sacred-sage text-white font-medium py-3 transition-all duration-300">
                    Begin Today's Reflection
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link to={createPageUrl("SoulBuddy")} className="flex-1">
                  <Button variant="outline" className="w-full border-sacred-sage/30 text-sacred-sage hover:bg-sage-50/50 py-3">
                    <Users className="w-4 h-4 mr-2" />
                    Connect with Soul Sister
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent Reflections */}
        {recentEntries.length > 0 && (
          <Card className="bg-gradient-to-br from-white/80 to-lavender-50/40 border-lavender-200/30 sacred-glow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-serif text-gray-800">Recent Reflections</CardTitle>
                <Link to={createPageUrl("MyJournal")}>
                  <Button variant="ghost" className="text-sacred-sage hover:text-warm-gold">
                    View All
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentEntries.slice(0, 3).map((entry) => (
                  <div key={entry.id} className="bg-white/60 rounded-lg p-4 border border-sage-200/20">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-gray-800">Day {entry.day_number}</h4>
                      <span className="text-xs text-gray-500">
                        {format(new Date(entry.created_date), 'MMM d')}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm line-clamp-2">
                      {entry.written_reflection}
                    </p>
                    {entry.hearts_received > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        <Heart className="w-3 h-3 text-warm-gold fill-current" />
                        <span className="text-xs text-warm-gold font-medium">
                          {entry.hearts_received} hearts
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}