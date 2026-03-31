'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';
import { Search, X, Film, Sparkles, Star } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import { API_BASE } from '@/src/lib/api';

interface Movie {
  id: number;
  title: string;
  year: string;
  poster_url: string;
  primary_genre: string;
  rating: number;
}

export default function ManualMode() {
  const [selectedMovies, setSelectedMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();
  const { user } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch(debouncedSearchQuery);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [debouncedSearchQuery, selectedMovies]);

  const performSearch = async (query: string) => {
    setIsSearching(true);
    setShowDropdown(true);
    
    try {
      const response = await fetch(`${API_BASE}/movies/search?q=${encodeURIComponent(query)}&limit=10`);
      if (!response.ok) {
        console.error('Search failed with status:', response.status);
        setSearchResults([]);
        return;
      }
      
      const movies = await response.json();
      
      // Filter out already selected movies
      const filteredMovies = movies.filter((movie: Movie) => 
        !selectedMovies.some(selected => selected.id === movie.id)
      );
      
      setSearchResults(filteredMovies);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const selectMovie = (movie: Movie) => {
    if (selectedMovies.length < 3) {
      setSelectedMovies([...selectedMovies, movie]);
      setSearchQuery('');
      setShowDropdown(false);
    }
  };

  const removeMovie = (movieId: number) => {
    setSelectedMovies(selectedMovies.filter(m => m.id !== movieId));
  };

  const handleSubmit = async () => {
    if (selectedMovies.length !== 3) return;
    
    setLoading(true);
    
    try {
      const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
      
      const response = await fetch(`${API_BASE.replace('/api/v1', '/api/v2')}/manual`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: String(user?.id || 'anonymous'),
          language: preferences.language || 'All',
          era: preferences.era || 'All',
          movie_ids: selectedMovies.map(m => m.id)
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      const data = await response.json();
      
      // Store recommendations and navigate to results
      localStorage.setItem('recommendations', JSON.stringify(data));
      localStorage.setItem('recommendation_mode', 'manual');
      localStorage.setItem('recommendation_context', JSON.stringify({
        selectedMovies: selectedMovies.map(m => m.title),
        explanation: data.explanation
      }));
      
      router.push('/recommendations');
    } catch (error) {
      console.error('Manual mode error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-5xl relative z-10"
      >
        <GlassCard className="p-12 border-white/10">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Film className="w-8 h-8 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                Search 3 movies you <GradientText>love</GradientText>
              </h1>
            </motion.div>
            <p className="text-gray-400 text-lg font-medium">
              We'll find similar movies based on your taste
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <Film size={14} />
              <span>{selectedMovies.length}/3 selected</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-8" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus-within:border-white/20 transition-all">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  placeholder="Search movies..."
                  className="flex-1 bg-transparent outline-none text-white placeholder:text-gray-600"
                  disabled={selectedMovies.length >= 3}
                />
                {isSearching && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                  />
                )}
              </div>

              {/* Search Dropdown */}
              <AnimatePresence>
                {showDropdown && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden z-50 max-h-80 overflow-y-auto"
                  >
                    {searchResults.map((movie) => (
                      <motion.div
                        key={movie.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => selectMovie(movie)}
                        className="flex items-center gap-4 p-4 hover:bg-white/5 cursor-pointer transition-all border-b border-white/5 last:border-b-0"
                      >
                        <img 
                          src={movie.poster_url || 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=' + encodeURIComponent(movie.title.substring(0, 10))} 
                          alt={movie.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x150/1a1a1a/ffffff?text=' + encodeURIComponent(movie.title.substring(0, 10));
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-semibold text-white">{movie.title}</div>
                          <div className="text-sm text-gray-400">{movie.year} • {movie.primary_genre}</div>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-yellow-400">
                          <Star size={12} fill="currentColor" />
                          {movie.rating?.toFixed(1) || 'N/A'}
                        </div>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Selected Movies */}
          {selectedMovies.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-300">Your Selections</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {selectedMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className="relative group"
                  >
                    <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                      <div className="relative">
                        <img 
                          src={movie.poster_url || 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=' + encodeURIComponent(movie.title.substring(0, 15))} 
                          alt={movie.title}
                          className="w-full h-48 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450/1a1a1a/ffffff?text=' + encodeURIComponent(movie.title.substring(0, 15));
                          }}
                        />
                        <button
                          onClick={() => removeMovie(movie.id)}
                          className="absolute top-2 right-2 w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                      <div className="p-4">
                        <div className="font-semibold text-white truncate">{movie.title}</div>
                        <div className="text-sm text-gray-400">{movie.year} • {movie.primary_genre}</div>
                        <div className="flex items-center gap-1 text-sm text-yellow-400 mt-1">
                          <Star size={10} fill="currentColor" />
                          {movie.rating?.toFixed(1) || 'N/A'}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={selectedMovies.length !== 3 || loading}
              className="px-12 py-4 text-lg font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  />
                  Analyzing Your Taste...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Analyze My Taste
                </span>
              )}
            </PrimaryButton>
            
            {selectedMovies.length < 3 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500"
              >
                Select exactly 3 movies to continue
              </motion.p>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
