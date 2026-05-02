import React, { useState, useEffect, useCallback } from "react";
import { SoulBuddy, User, BuddyOptIn } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Heart, Users, Sparkles, Link2, GitPullRequestArrow, MessageSquareQuote } from "lucide-react";
import { motion } from "framer-motion";

// Matchmaking Component
const MatchmakingCard = ({ onMatch, isMatching, hasOptedIn }) => (
  <Card className="text-center bg-gradient-to-br from-white/90 to-pearl-white/80 border-sage-200/40 sacred-glow p-8">
    <CardHeader>
      <div className="mx-auto w-20 h-20 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center petal-float mb-4">
        <Users className="w-10 h-10 text-white" />
      </div>
      <CardTitle className="text-3xl font-serif text-sacred-sage">Find Your Soul Sister</CardTitle>
      <CardDescription className="text-gray-600 max-w-md mx-auto mt-2">
        A Soul Sister is a companion on this sacred journey, here to support, celebrate, and amplify your reflections. Opt-in to be matched with another beautiful soul.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {hasOptedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-8 rounded-2xl relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, #4c1d95 0%, #3730a3 50%, #5b21b6 100%)',
            boxShadow: '0 0 30px rgba(167, 139, 250, 0.4), 0 0 60px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
            border: '1px solid rgba(196, 181, 253, 0.4)',
          }}
        >
          {/* Shimmer overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.06) 50%, transparent 70%)',
              backgroundSize: '200% 100%',
              animation: 'shimmerSlide 3s ease-in-out infinite',
            }}
          />
          <style>{`
            @keyframes shimmerSlide {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            @keyframes goldenPulse {
              0%, 100% { filter: drop-shadow(0 0 4px rgba(212,175,55,0.8)); transform: scale(1); }
              50% { filter: drop-shadow(0 0 12px rgba(212,175,55,1)); transform: scale(1.15); }
            }
          `}</style>
          <Sparkles
            className="w-10 h-10 mx-auto mb-4 text-yellow-300"
            style={{ animation: 'goldenPulse 2s ease-in-out infinite' }}
          />
          <h3 className="font-serif font-bold text-2xl text-white mb-2" style={{ textShadow: '0 0 20px rgba(212,175,55,0.6)' }}>
            You're on the list!
          </h3>
          <p className="text-purple-200 mt-1 leading-relaxed">
            The universe is aligning your connection. We'll notify you when your Soul Sister is found.
          </p>
        </motion.div>
      ) : (
        <Button
          onClick={onMatch}
          disabled={isMatching}
          size="lg"
          className="mt-6 bg-gradient-to-r from-sacred-sage to-warm-gold text-white font-medium px-12 py-7 text-lg hover:shadow-xl transition-shadow duration-300"
        >
          {isMatching ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
              Seeking a Connection...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5 mr-3" />
              Match Me with a Soul Sister
            </>
          )}
        </Button>
      )}
    </CardContent>
  </Card>
);

// Connected Buddy Component
const BuddyProfileCard = ({ buddy, buddyUser }) => (
  <Card className="text-center bg-gradient-to-br from-white/90 to-pearl-white/80 border-sage-200/40 sacred-glow p-8">
    <CardHeader>
      <div className="relative inline-block mb-4">
        <div className="w-24 h-24 bg-gradient-to-br from-gentle-lavender to-soft-rose rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl font-serif text-white">{buddyUser?.full_name?.charAt(0) || 'S'}</span>
        </div>
        <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center border-4 border-white">
          <Heart className="w-5 h-5 text-white fill-current" />
        </div>
      </div>
      <CardTitle className="text-3xl font-serif text-sacred-sage">
        You are connected with {buddyUser?.full_name || "a Soul Sister"}
      </CardTitle>
      <CardDescription className="text-gray-600 max-w-md mx-auto mt-2">
        Nurture this sacred bond. Your journey is now intertwined.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/* Connection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
        <div className="p-4 bg-white/50 rounded-lg border border-sage-200/20">
          <p className="text-sm font-medium text-gray-500">Connection Strength</p>
          <p className="text-xl font-bold capitalize text-sacred-sage">{buddy.connection_strength}</p>
        </div>
        <div className="p-4 bg-white/50 rounded-lg border border-sage-200/20">
          <p className="text-sm font-medium text-gray-500">Mutual Hearts</p>
          <p className="text-xl font-bold text-warm-gold">{buddy.mutual_hearts_given}</p>
        </div>
        <div className="p-4 bg-white/50 rounded-lg border border-sage-200/20">
          <p className="text-sm font-medium text-gray-500">Shared Blessings</p>
          <p className="text-xl font-bold text-purple-500">{buddy.shared_reflections}</p>
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to={createPageUrl("Community")} className="flex-1">
          <Button variant="outline" className="w-full py-6 border-sacred-sage/40 text-sacred-sage hover:bg-sage-50/50">
            <MessageSquareQuote className="w-5 h-5 mr-2" />
            Send a Blessing
          </Button>
        </Link>
      </div>
    </CardContent>
  </Card>
);

export default function SoulBuddyPage() {
  const [currentUser, setCurrentUser] = useState(null);
  const [soulBuddy, setSoulBuddy] = useState(null);
  const [buddyUser, setBuddyUser] = useState(null);
  const [hasOptedIn, setHasOptedIn] = useState(false);
  const [isMatching, setIsMatching] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadBuddyData = useCallback(async (user) => {
    setIsLoading(true);
    // Check if user is already paired
    const buddyRecords = await SoulBuddy.filter({ created_by: user.email });
    if (buddyRecords.length > 0) {
      const buddy = buddyRecords[0];
      setSoulBuddy(buddy);
      const buddyUserDetails = await User.filter({ email: buddy.buddy_user_email });
      if (buddyUserDetails.length > 0) {
        setBuddyUser(buddyUserDetails[0]);
      }
    } else {
      // Check if user has opted in
      const optInRecords = await BuddyOptIn.filter({ created_by: user.email });
      if (optInRecords.length > 0) {
        setHasOptedIn(true);
      }
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        await loadBuddyData(user);
      } catch (error) {
        await User.loginWithRedirect(window.location.href);
      }
    };
    init();
  }, [loadBuddyData]);

  const handleMatch = async () => {
    if (!currentUser) return;
    setIsMatching(true);

    const potentialMatches = await BuddyOptIn.filter({ created_by: { $ne: currentUser.email } });
    
    if (potentialMatches.length > 0) {
      // Found a match
      const matchRecord = potentialMatches[0];
      const matchEmail = matchRecord.created_by;

      // Create the two-way connection
      const today = new Date().toISOString();
      await SoulBuddy.create({ buddy_user_email: matchEmail, connection_date: today });
      await SoulBuddy.create({ created_by: matchEmail, buddy_user_email: currentUser.email, connection_date: today });

      // Clean up opt-in records
      await BuddyOptIn.delete(matchRecord.id);
      const myOptIn = await BuddyOptIn.filter({ created_by: currentUser.email });
      if (myOptIn.length > 0) await BuddyOptIn.delete(myOptIn[0].id);
      
      await loadBuddyData(currentUser);
    } else {
      // No match found, so opt-in the current user
      await BuddyOptIn.create({ opted_in_date: new Date().toISOString() });
      setHasOptedIn(true);
    }

    setIsMatching(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sacred-sage"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {soulBuddy && buddyUser ? (
            <BuddyProfileCard buddy={soulBuddy} buddyUser={buddyUser} />
          ) : (
            <MatchmakingCard onMatch={handleMatch} isMatching={isMatching} hasOptedIn={hasOptedIn} />
          )}
        </motion.div>
      </div>
    </div>
  );
}