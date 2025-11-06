import React, { useState, useEffect } from "react";
import { JournalEntry, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Sparkles, Users, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function Community() {
  const [blessingThreads, setBlessingThreads] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, []);

  const loadCommunityData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Load shared blessing threads (public reflections)
      const sharedEntries = await JournalEntry.filter({ is_blessing_thread: true }, '-created_date', 20);
      
      // Get user details for each entry
      const entriesWithUsers = await Promise.all(
        sharedEntries.map(async (entry) => {
          const entryUser = await User.filter({ email: entry.created_by });
          return {
            ...entry,
            user: entryUser[0] || { full_name: "Sacred Soul", email: entry.created_by }
          };
        })
      );

      setBlessingThreads(entriesWithUsers);
    } catch (error) {
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
  };

  const handleSendHeart = async (entryId) => {
    // In a real app, you'd update the hearts_received count
    console.log("Sending heart to entry:", entryId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-sage"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon" className="text-sacred-sage hover:bg-sage-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-sacred-sage">Blessing Threads</h1>
            <p className="text-gray-600 font-light">Sacred reflections shared by our soul community</p>
          </div>
        </div>

        {/* Community Stats */}
        <Card className="mb-8 bg-gradient-to-br from-white/90 to-sage-50/60 border-sage-200/40 sacred-glow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sacred-sage">{blessingThreads.length}</div>
                  <p className="text-sm text-gray-600">Shared Reflections</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-warm-gold">
                    {blessingThreads.reduce((sum, entry) => sum + (entry.hearts_received || 0), 0)}
                  </div>
                  <p className="text-sm text-gray-600">Hearts Shared</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-purple-600">
                <Users className="w-5 h-5" />
                <span className="text-sm font-medium">Sacred Community</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blessing Threads */}
        <div className="space-y-6">
          {blessingThreads.map((entry) => (
            <Card key={entry.id} className="bg-gradient-to-br from-white/90 to-pearl-white/60 border-sage-200/30 sacred-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-gentle-lavender to-soft-rose rounded-full flex items-center justify-center">
                      <span className="text-lg font-serif text-gray-700">
                        {entry.user.full_name?.charAt(0) || 'S'}
                      </span>
                    </div>
                    <div>
                      <CardTitle className="text-lg font-serif text-gray-800">
                        {entry.user.full_name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Day {entry.day_number} • {format(new Date(entry.created_date), 'MMM d')}
                      </p>
                    </div>
                  </div>
                  {entry.mood && (
                    <Badge className="capitalize bg-lavender-100 text-purple-800">
                      {entry.mood}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-medium text-sacred-sage mb-2">"{entry.seed_prompt}"</p>
                  <p className="text-gray-700 leading-relaxed">{entry.written_reflection}</p>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-sage-200/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSendHeart(entry.id)}
                    className="text-warm-gold hover:text-warm-gold hover:bg-sage-50/50"
                  >
                    <Heart className="w-4 h-4 mr-2" />
                    Send Heart {entry.hearts_received > 0 && `(${entry.hearts_received})`}
                  </Button>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Sparkles className="w-4 h-4" />
                    <span>Sacred reflection</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {blessingThreads.length === 0 && (
          <Card className="text-center p-12 bg-gradient-to-br from-white/80 to-sage-50/40 border-sage-200/30">
            <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
              The Sacred Circle Awaits
            </h3>
            <p className="text-gray-600 mb-6">
              No blessing threads have been shared yet. Be the first to offer your sacred reflection to the community.
            </p>
            <Link to={createPageUrl("TodaysSeed")}>
              <Button className="bg-gradient-to-r from-sacred-sage to-warm-gold text-white">
                Share Your Reflection
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}