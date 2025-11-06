import React, { useState, useEffect } from "react";
import { User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SoundscapeLibrary from "../components/audio/SoundscapeLibrary";

export default function SacredSoundscapes() {
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedMood, setSelectedMood] = useState("");

  useEffect(() => {
    const loadUser = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        await User.loginWithRedirect(window.location.href);
      }
    };
    loadUser();
  }, []);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-divine-light via-pearl-white to-gentle-lavender">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon" className="text-sacred-sage hover:bg-sage-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-sacred-sage">Sacred Soundscapes</h1>
            <p className="text-gray-600 font-light">Immersive audio experiences for your spiritual journey</p>
          </div>
        </div>

        <SoundscapeLibrary 
          selectedMood={selectedMood}
          onSoundscapeSelect={(soundscape) => console.log('Selected:', soundscape)}
        />
      </div>
    </div>
  );
}