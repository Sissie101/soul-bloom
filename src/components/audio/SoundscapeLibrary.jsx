import React, { useState, useEffect } from "react";
import { Soundscape } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Music, Search, Filter, Waves, Heart, Sparkles, Brain, Leaf, Mountain } from "lucide-react";
import SoundscapePlayer from "./SoundscapePlayer";

const typeIcons = {
  binaural_beats: Brain,
  nature_sounds: Leaf,
  aurora_music: Sparkles,
  ambient: Waves,
  guided_meditation: Heart,
  sacred_frequencies: Mountain
};

const moodColors = {
  radiant: "bg-yellow-100 text-yellow-800",
  peaceful: "bg-blue-100 text-blue-800",
  searching: "bg-purple-100 text-purple-800",
  flowing: "bg-cyan-100 text-cyan-800",
  grateful: "bg-green-100 text-green-800",
  transforming: "bg-pink-100 text-pink-800"
};

export default function SoundscapeLibrary({ selectedMood, onSoundscapeSelect, showPlayer = true }) {
  const [soundscapes, setSoundscapes] = useState([]);
  const [filteredSoundscapes, setFilteredSoundscapes] = useState([]);
  const [selectedSoundscape, setSelectedSoundscape] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSoundscapes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [soundscapes, typeFilter, searchTerm, selectedMood]);

  const loadSoundscapes = async () => {
    const data = await Soundscape.list();
    setSoundscapes(data);
    setIsLoading(false);
  };

  const applyFilters = () => {
    let filtered = soundscapes;

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(s => s.type === typeFilter);
    }

    // Filter by mood if provided
    if (selectedMood) {
      filtered = filtered.filter(s => 
        s.mood_resonance && s.mood_resonance.includes(selectedMood)
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.intention?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredSoundscapes(filtered);
  };

  const handleSelectSoundscape = (soundscape) => {
    setSelectedSoundscape(soundscape);
    onSoundscapeSelect && onSoundscapeSelect(soundscape);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
        <span className="ml-3 text-gray-600">Loading sacred soundscapes...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-white/80 border-sage-200/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Music className="w-5 h-5 text-purple-500" />
            Sacred Soundscape Library
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search soundscapes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="binaural_beats">Binaural Beats</SelectItem>
                  <SelectItem value="nature_sounds">Nature Sounds</SelectItem>
                  <SelectItem value="aurora_music">Aurora Music</SelectItem>
                  <SelectItem value="ambient">Ambient</SelectItem>
                  <SelectItem value="guided_meditation">Guided Meditation</SelectItem>
                  <SelectItem value="sacred_frequencies">Sacred Frequencies</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {selectedMood && (
            <div className="mt-3 text-center">
              <Badge className={`${moodColors[selectedMood]} text-sm`}>
                Tuned for {selectedMood} energy
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Current Player */}
      {selectedSoundscape && showPlayer && (
        <SoundscapePlayer 
          soundscape={selectedSoundscape}
          onComplete={() => console.log('Soundscape completed')}
        />
      )}

      {/* Soundscape Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSoundscapes.map((soundscape) => {
          const TypeIcon = typeIcons[soundscape.type] || Music;
          
          return (
            <Card 
              key={soundscape.id} 
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                selectedSoundscape?.id === soundscape.id 
                  ? 'ring-2 ring-purple-500 bg-purple-50/50' 
                  : 'bg-white/80 border-sage-200/30 hover:bg-purple-50/30'
              }`}
              onClick={() => handleSelectSoundscape(soundscape)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
                    <TypeIcon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-800 truncate">{soundscape.title}</h3>
                    <p className="text-sm text-gray-600 line-clamp-2">{soundscape.description}</p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{soundscape.duration_minutes}min</span>
                    {soundscape.frequency && <span>{soundscape.frequency}</span>}
                  </div>
                  
                  <div className="flex gap-1 flex-wrap">
                    {soundscape.mood_resonance?.map((mood) => (
                      <Badge key={mood} className={`${moodColors[mood]} text-xs`}>
                        {mood}
                      </Badge>
                    ))}
                  </div>
                  
                  {soundscape.intention && (
                    <Badge variant="outline" className="text-xs w-full justify-center">
                      {soundscape.intention}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSoundscapes.length === 0 && (
        <Card className="text-center p-12">
          <CardContent>
            <Music className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No soundscapes found</h3>
            <p className="text-gray-600">
              {selectedMood 
                ? `No soundscapes match your ${selectedMood} mood and current filters.`
                : "Try adjusting your search or filters to find the perfect soundscape."
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}