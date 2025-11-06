
import React, { useState, useEffect } from "react";
import { JournalEntry, User } from "@/entities/all";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { BookOpen, Heart, Calendar, Search, Filter, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

const moodColors = {
  radiant: "bg-yellow-100 text-yellow-800",
  peaceful: "bg-blue-100 text-blue-800",
  searching: "bg-purple-100 text-purple-800",
  flowing: "bg-cyan-100 text-cyan-800",
  grateful: "bg-green-100 text-green-800",
  transforming: "bg-pink-100 text-pink-800"
};

export default function MyJournal() {
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [moodFilter, setMoodFilter] = useState("all");
  const [stats, setStats] = useState({
    totalEntries: 0,
    totalHearts: 0,
    averageMood: "peaceful",
    completionRate: 0
  });

  const applyFilters = React.useCallback(() => {
    let filtered = entries;

    if (searchTerm) {
      filtered = filtered.filter(entry =>
        entry.written_reflection?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        entry.seed_prompt?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (moodFilter !== "all") {
      filtered = filtered.filter(entry => entry.mood === moodFilter);
    }

    setFilteredEntries(filtered);
  }, [entries, searchTerm, moodFilter]);

  useEffect(() => {
    loadJournalData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadJournalData = async () => {
    try {
      const user = await User.me();
      setCurrentUser(user);

      const userEntries = await JournalEntry.filter({ created_by: user.email }, '-created_date');
      setEntries(userEntries);

      // Calculate stats
      const totalHearts = userEntries.reduce((sum, entry) => sum + (entry.hearts_received || 0), 0);
      const completionRate = Math.round((userEntries.length / 30) * 100);
      
      setStats({
        totalEntries: userEntries.length,
        totalHearts,
        averageMood: userEntries.length > 0 ? userEntries[0].mood || "peaceful" : "peaceful",
        completionRate
      });
    } catch (error) {
      await User.loginWithRedirect(window.location.href);
    }
    setIsLoading(false);
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
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link to={createPageUrl("Dashboard")}>
            <Button variant="ghost" size="icon" className="text-sacred-sage hover:bg-sage-50">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-serif font-bold text-sacred-sage">My Sacred Reflections</h1>
            <p className="text-gray-600 font-light">Your journey of self-discovery and growth</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-white/80 to-sage-50/50 border-sage-200/30 sacred-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Reflections</p>
                  <p className="text-2xl font-bold text-sacred-sage">{stats.totalEntries}</p>
                </div>
                <BookOpen className="w-8 h-8 text-sacred-sage opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/80 to-rose-50/50 border-rose-200/30 sacred-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Hearts Received</p>
                  <p className="text-2xl font-bold text-warm-gold">{stats.totalHearts}</p>
                </div>
                <Heart className="w-8 h-8 text-warm-gold opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/80 to-purple-50/50 border-purple-200/30 sacred-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Journey Progress</p>
                  <p className="text-2xl font-bold text-purple-600">{stats.completionRate}%</p>
                </div>
                <Calendar className="w-8 h-8 text-purple-600 opacity-60" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-white/80 to-blue-50/50 border-blue-200/30 sacred-glow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Current Mood</p>
                  <p className="text-lg font-semibold capitalize text-blue-600">{stats.averageMood}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600">✨</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-8 bg-gradient-to-br from-white/90 to-pearl-white/60 border-sage-200/30">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search your reflections..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-sage-200/50 focus:border-sacred-sage"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <Select value={moodFilter} onValueChange={setMoodFilter}>
                  <SelectTrigger className="w-40 border-sage-200/50">
                    <SelectValue placeholder="Filter by mood" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Moods</SelectItem>
                    <SelectItem value="radiant">Radiant</SelectItem>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="searching">Searching</SelectItem>
                    <SelectItem value="flowing">Flowing</SelectItem>
                    <SelectItem value="grateful">Grateful</SelectItem>
                    <SelectItem value="transforming">Transforming</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Journal Entries */}
        <div className="grid gap-6">
          {filteredEntries.map((entry) => (
            <Card key={entry.id} className="bg-gradient-to-br from-white/90 to-pearl-white/60 border-sage-200/30 sacred-glow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl font-serif text-gray-800">
                      Day {entry.day_number}
                    </CardTitle>
                    <p className="text-sm text-sacred-sage font-medium mt-1">
                      "{entry.seed_prompt}"
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {format(new Date(entry.created_date), 'EEEE, MMMM do, yyyy')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {entry.mood && (
                      <Badge className={`${moodColors[entry.mood]} capitalize`}>
                        {entry.mood}
                      </Badge>
                    )}
                    {entry.hearts_received > 0 && (
                      <Badge variant="outline" className="text-warm-gold border-warm-gold">
                        <Heart className="w-3 h-3 mr-1 fill-current" />
                        {entry.hearts_received}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {entry.written_reflection}
                </p>
                
                {entry.voice_note_url && (
                  <div className="mt-4 p-3 bg-sage-50/50 rounded-lg border border-sage-200/30">
                    <p className="text-sm text-gray-600 mb-2">Voice Reflection:</p>
                    <audio controls className="w-full">
                      <source src={entry.voice_note_url} type="audio/wav" />
                    </audio>
                  </div>
                )}

                {entry.is_blessing_thread && (
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-purple-600 font-medium">Shared as Blessing Thread</span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredEntries.length === 0 && (
          <Card className="text-center p-12 bg-gradient-to-br from-white/80 to-sage-50/40 border-sage-200/30">
            <BookOpen className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
              {entries.length === 0 ? "Begin Your Sacred Journey" : "No reflections match your search"}
            </h3>
            <p className="text-gray-600 mb-6">
              {entries.length === 0 
                ? "Your journal awaits your first sacred reflection. Each entry is a step toward deeper self-understanding."
                : "Try adjusting your search or filter to find the reflections you're looking for."
              }
            </p>
            <Link to={createPageUrl("TodaysSeed")}>
              <Button className="bg-gradient-to-r from-sacred-sage to-warm-gold text-white">
                <BookOpen className="w-4 h-4 mr-2" />
                {entries.length === 0 ? "Start Reflecting" : "Add New Reflection"}
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
