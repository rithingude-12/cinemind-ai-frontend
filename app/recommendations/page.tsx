'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Play, Plus, Star, ArrowLeft, Heart, Bookmark, TrendingUp } from 'lucide-react';
import { GlassCard, PrimaryButton, SecondaryButton, GradientText } from '@/components/DesignSystem';
import MovieRow from '@/components/MovieRow';

interface Movie {
  id: number;
  title: string;
  year: string;
  poster_url: string;
  primary_genre: string;
  rating: number;
  overview: string;
  language: string;
}

interface RecommendationData {
  hero: Movie;
  primary: Movie[];
  extended: Movie[];
  explanation: string;
  confidence_score: number;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [watchlist, setWatchlist] = useState<number[]>([]);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('recommendations');
    const context = localStorage.getItem('recommendation_context');
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        setRecommendations(data);
        setHeroMovie(data.hero);
      } catch (error) {
        console.error('Error parsing recommendations:', error);
        router.push('/');
      }
    } else {
      router.push('/');
    }
    
    setLoading(false);
  }, [router]);

  const addToWatchlist = (movieId: number) => {
    setWatchlist(prev => [...prev, movieId]);
    // In real app, this would call API
    console.log('Added to watchlist:', movieId);
  };

  const goBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!recommendations) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">No recommendations found</h2>
          <button onClick={() => router.push('/')} className="text-purple-400 underline">
            Go back home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={goBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-400">
              {recommendations.confidence_score}% Match
            </div>
            <div className="flex items-center gap-1 text-yellow-400">
              <TrendingUp size={16} />
              <span className="text-sm">AI Curated</span>
            </div>
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <AnimatePresence mode="wait">
        {heroMovie && (
          <motion.div 
            key={heroMovie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="relative w-full h-[75vh] min-h-[600px] overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0">
              <img 
                src={heroMovie.poster_url || `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(heroMovie.title)}`} 
                alt={heroMovie.title}
                className="w-full h-full object-cover opacity-40"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(heroMovie.title)}`;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
            </div>

            {/* Content */}
            <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-4xl pt-20">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-white/10 px-3 py-1 rounded border border-white/10 backdrop-blur-md">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      {heroMovie.rating} Rating
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                    <Star size={14} fill="currentColor" />
                    <span>{recommendations.confidence_score}% Match</span>
                  </div>
                  <div className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded">
                    <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">
                      Top Pick
                    </span>
                  </div>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.95] line-clamp-2 uppercase italic">
                  {heroMovie.title}
                </h1>
                
                <div className="flex items-center gap-3 mb-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <span>{heroMovie.year}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <span>{heroMovie.primary_genre}</span>
                  <span className="w-1 h-1 bg-gray-700 rounded-full" />
                  <span className="text-white">{heroMovie.language}</span>
                </div>

                <p className="text-lg text-gray-400 mb-10 max-w-xl line-clamp-3 font-medium leading-relaxed">
                  {heroMovie.overview}
                </p>

                <div className="flex flex-wrap gap-4 mb-12">
                  <PrimaryButton className="flex items-center gap-2 text-sm uppercase px-8">
                    <Play size={18} fill="black" />
                    Watch Trailer
                  </PrimaryButton>
                  <SecondaryButton 
                    onClick={() => addToWatchlist(heroMovie.id)}
                    className="flex items-center gap-2 text-sm uppercase px-8"
                  >
                    <Plus size={18} />
                    Watchlist
                  </SecondaryButton>
                </div>
                
                {/* AI Explanation */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="max-w-md"
                >
                  <GlassCard className="p-6 border-white/5 bg-white/[0.03]">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <Star size={16} className="text-white" fill="currentColor" />
                      </div>
                      <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">AI Insight</h3>
                    </div>
                    <p className="text-sm font-medium text-gray-400 leading-relaxed">
                      {recommendations.explanation}
                    </p>
                  </GlassCard>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* RECOMMENDATION ROWS */}
      <div className="px-6 md:px-12 relative z-30 space-y-16 lg:space-y-24 mb-32 -mt-10">
        
        {/* Top Picks */}
        {recommendations.primary && recommendations.primary.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">
                Top Picks for <GradientText>You</GradientText>
              </h2>
              <p className="text-gray-400 text-lg">
                Handpicked based on your unique taste profile
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {recommendations.primary.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setHeroMovie(movie)}
                >
                  <div className="relative overflow-hidden rounded-xl">
                    <img 
                      src={movie.poster_url || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 15))}`} 
                      alt={movie.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 15))}`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    
                    {/* Quick Actions */}
                    <div className="absolute bottom-2 left-2 right-2 flex justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setHeroMovie(movie);
                        }}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
                      >
                        <Play size={14} className="text-black" fill="black" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addToWatchlist(movie.id);
                        }}
                        className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center"
                      >
                        <Plus size={14} className="text-black" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <h3 className="font-semibold text-white text-sm line-clamp-1">{movie.title}</h3>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-400">{movie.year}</span>
                      <div className="flex items-center gap-1 text-xs text-yellow-400">
                        <Star size={10} fill="currentColor" />
                        {movie.rating}
                      </div>
                    </div>
                    <div className="mt-1">
                      <span className="text-xs px-2 py-1 bg-white/10 rounded text-gray-300">
                        {movie.primary_genre}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* More Like This */}
        {recommendations.extended && recommendations.extended.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tighter">
                More Like <GradientText>This</GradientText>
              </h2>
              <p className="text-gray-400 text-lg">
                Expand your cinematic horizons
              </p>
            </div>
            
            <div className="overflow-x-auto">
              <div className="flex gap-4 pb-4">
                {recommendations.extended.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.03 }}
                    className="flex-shrink-0 w-40 group cursor-pointer"
                    onClick={() => setHeroMovie(movie)}
                  >
                    <div className="relative overflow-hidden rounded-xl">
                      <img 
                        src={movie.poster_url || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 15))}`} 
                        alt={movie.title}
                        className="w-full h-60 object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 15))}`;
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="mt-3">
                      <h3 className="font-semibold text-white text-sm line-clamp-1">{movie.title}</h3>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-gray-400">{movie.year}</span>
                        <div className="flex items-center gap-1 text-xs text-yellow-400">
                          <Star size={10} fill="currentColor" />
                          {movie.rating}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
