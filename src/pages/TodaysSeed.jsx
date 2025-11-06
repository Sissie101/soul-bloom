
import React, { useState, useEffect } from "react";
import { JournalEntry, DailySeed, User } from "@/entities/all";
import { UploadFile } from "@/integrations/Core";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Flower2, Mic, Video, Save, Heart, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import SoundscapeLibrary from "../components/audio/SoundscapeLibrary";

const moodOptions = [
  { value: "radiant", label: "Radiant ✨", color: "bg-yellow-100 text-yellow-800" },
  { value: "peaceful", label: "Peaceful 🕊️", color: "bg-blue-100 text-blue-800" },
  { value: "searching", label: "Searching 🔍", color: "bg-purple-100 text-purple-800" },
  { value: "flowing", label: "Flowing 🌊", color: "bg-cyan-100 text-cyan-800" },
  { value: "grateful", label: "Grateful 🙏", color: "bg-green-100 text-green-800" },
  { value: "transforming", label: "Transforming 🦋", color: "bg-pink-100 text-pink-800" }
];

export default function TodaysSeed() {
  const [currentUser, setCurrentUser] = useState(null);
  const [todaysSeed, setTodaysSeed] = useState(null);
  const [reflection, setReflection] = useState("");
  const [selectedMood, setSelectedMood] = useState("");
  const [isRecording, setIsRecording] = useState({ voice: false, video: false });
  const [recordings, setRecordings] = useState({ voice: null, video: null });
  const [isSaving, setIsSaving] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [showSoundscapes, setShowSoundscapes] = useState(false);
  const [selectedSoundscape, setSelectedSoundscape] = useState(null);

  useEffect(() => {
    loadTodaysData();
  }, []);

  const loadTodaysData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      // Get current day based on user's entries
      const userEntries = await JournalEntry.filter({ created_by: user.email });
      const day = Math.min(userEntries.length + 1, 30);
      setCurrentDay(day);

      // Load seed for current day
      const seeds = await DailySeed.filter({ day_number: day });
      if (seeds.length > 0) {
        setTodaysSeed(seeds[0]);
      }
    } catch (error) {
      await User.loginWithRedirect(window.location.href);
    }
  };

  const handleVoiceRecord = async () => {
    if (!isRecording.voice) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const chunks = [];

        mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorder.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/wav' });
          const file = new File([blob], `voice-reflection-${Date.now()}.wav`, { type: 'audio/wav' });
          const { file_url } = await UploadFile({ file });
          setRecordings(prev => ({ ...prev, voice: file_url }));
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(prev => ({ ...prev, voice: true }));

        setTimeout(() => {
          mediaRecorder.stop();
          setIsRecording(prev => ({ ...prev, voice: false }));
        }, 30000); // 30 second limit
      } catch (error) {
        console.error("Error accessing microphone:", error);
      }
    }
  };

  const handleSaveReflection = async () => {
    if (!reflection.trim() && !recordings.voice && !recordings.video) {
      return;
    }

    setIsSaving(true);
    try {
      await JournalEntry.create({
        day_number: currentDay,
        seed_prompt: todaysSeed?.title || `Day ${currentDay} Reflection`,
        written_reflection: reflection,
        voice_note_url: recordings.voice,
        video_note_url: recordings.video,
        mood: selectedMood,
        is_blessing_thread: false,
        hearts_received: 0
      });

      // Reset form
      setReflection("");
      setSelectedMood("");
      setRecordings({ voice: null, video: null });
      
      // Navigate back to dashboard
      window.location.href = createPageUrl("Dashboard");
    } catch (error) {
      console.error("Error saving reflection:", error);
    }
    setIsSaving(false);
  };

  if (!currentUser || !todaysSeed) {
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
            <h1 className="text-3xl font-serif font-bold text-sacred-sage">
              Day {currentDay} Reflection
            </h1>
            <p className="text-gray-600 font-light">Plant today's seed of wisdom</p>
          </div>
        </div>

        {/* Today's Seed Prompt */}
        <Card className="mb-8 bg-gradient-to-br from-white/90 to-sage-50/60 border-sage-200/40 sacred-glow">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-warm-gold to-sacred-sage rounded-full flex items-center justify-center">
                  <Flower2 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-serif text-sacred-sage">
                    {todaysSeed.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600">Sacred Seed for Today</p>
                </div>
              </div>
              <Button
                variant="outline"
                onClick={() => setShowSoundscapes(!showSoundscapes)}
                className="text-purple-600 border-purple-200 hover:bg-purple-50"
              >
                {showSoundscapes ? 'Hide' : 'Sacred Sounds'} 🎵
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white/60 rounded-lg p-6 border border-sage-200/30">
              <p className="text-gray-700 leading-relaxed italic text-lg">
                "{todaysSeed.prompt}"
              </p>
            </div>
            {todaysSeed.fractal_mission && (
              <div className="mt-4 p-4 bg-lavender-50/50 rounded-lg border border-lavender-200/30">
                <p className="text-sm font-medium text-gray-700 mb-1">Fractal Mission (Optional):</p>
                <p className="text-sm text-gray-600">{todaysSeed.fractal_mission}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sacred Soundscapes Section */}
        {showSoundscapes && (
          <div className="mb-8">
            <SoundscapeLibrary 
              selectedMood={selectedMood}
              onSoundscapeSelect={(soundscape) => {
                setSelectedSoundscape(soundscape);
                console.log('Playing soundscape for reflection:', soundscape);
              }}
            />
          </div>
        )}

        {/* Reflection Form */}
        <Card className="bg-gradient-to-br from-white/90 to-pearl-white/60 border-sage-200/30 sacred-glow">
          <CardHeader>
            <CardTitle className="text-xl font-serif text-gray-800">Your Sacred Reflection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Written Reflection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Written Reflection
              </label>
              <Textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Let your soul speak through your words..."
                className="min-h-[200px] border-sage-200/50 focus:border-sacred-sage focus:ring-sacred-sage/20 bg-white/80"
              />
            </div>

            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                How does your soul feel today?
              </label>
              <Select value={selectedMood} onValueChange={setSelectedMood}>
                <SelectTrigger className="border-sage-200/50 focus:border-sacred-sage bg-white/80">
                  <SelectValue placeholder="Choose your spiritual mood..." />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((mood) => (
                    <SelectItem key={mood.value} value={mood.value}>
                      {mood.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMood && (
                <div className="mt-2">
                  <Badge className={moodOptions.find(m => m.value === selectedMood)?.color}>
                    {moodOptions.find(m => m.value === selectedMood)?.label}
                  </Badge>
                </div>
              )}
            </div>

            {/* Voice & Video Recording */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Voice Note (Optional)
                </label>
                <Button
                  variant="outline"
                  onClick={handleVoiceRecord}
                  disabled={isRecording.voice}
                  className="w-full border-sage-200/50 hover:bg-sage-50/50"
                >
                  <Mic className={`w-4 h-4 mr-2 ${isRecording.voice ? 'text-red-500' : ''}`} />
                  {isRecording.voice ? 'Recording...' : recordings.voice ? 'Recorded ✓' : 'Record Voice'}
                </Button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Video Note (Optional)
                </label>
                <Button
                  variant="outline"
                  disabled
                  className="w-full border-sage-200/50 text-gray-400"
                >
                  <Video className="w-4 h-4 mr-2" />
                  Coming Soon
                </Button>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-4">
              <Button
                onClick={handleSaveReflection}
                disabled={isSaving || (!reflection.trim() && !recordings.voice)}
                className="bg-gradient-to-r from-sacred-sage to-warm-gold hover:from-warm-gold hover:to-sacred-sage text-white font-medium px-8 py-3"
              >
                {isSaving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving Sacred Reflection...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Reflection
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
