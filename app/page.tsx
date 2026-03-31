'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import MovieRow from '@/components/MovieRow';
import MoodScroller from '@/components/MoodScroller';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Info, Star, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

import LandingPage from '@/components/LandingPage';
import { GlassCard, PrimaryButton, SecondaryButton, GradientText } from '@/components/DesignSystem';
import { MovieRowSkeleton } from '@/components/Skeleton';
import { API_BASE_URL } from '@/lib/constants';

export default function HomePage() {
    console.log("HomePage rendering - APP MOUNTING");
    const { isAuthenticated, user } = useAuth();
    const router = useRouter();
    const [preferences, setPreferences] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<any>(null);
    const [heroMovie, setHeroMovie] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [mood, setMood] = useState('balanced');
    const [energy, setEnergy] = useState('mid');

    useEffect(() => {
        const storedPrefs = localStorage.getItem('preferences');
        if (isAuthenticated && !storedPrefs) {
            router.push('/onboarding');
            return;
        }
        if (storedPrefs) {
            setPreferences(JSON.parse(storedPrefs));
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!preferences) return;

        const timer = setTimeout(() => {
            fetchRecommendations();
        }, 300);

        return () => clearTimeout(timer);
    }, [preferences, mood, energy]);

    const fetchRecommendations = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/recommend/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    language: preferences.language,
                    era: preferences.era,
                    mode: preferences.mode === 'mood' ? 'mood' : (preferences.mode || 'mood'),
                    mood: mood,
                    energy: energy,
                    questionnaire_genres: []
                }),
            });
            const data = await res.json();
            if (data.movies && data.movies.length > 0) {
                setRecommendations(data.movies);
                setHeroMovie(data.movies[0]);
            }
        } catch (err) {
            console.error('Failed to fetch recommendations', err);
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return <LandingPage />;
    }

    // Check if user has preferences, if not redirect to onboarding
    const storedPrefs = localStorage.getItem('preferences');
    if (isAuthenticated && !storedPrefs) {
        router.push('/onboarding');
        return null;
    }

    // Show mode selection if no recommendations are present
    const hasRecommendations = recommendations && recommendations.length > 0;
    
    if (!hasRecommendations && !loading) {
        router.push('/modes');
        return null;
    }

    if (loading && !recommendations) {
        return (
            <div className="min-h-screen bg-black pt-32 px-6 md:px-12 space-y-20">
                <div className="max-w-[800px] space-y-6 mb-20 animate-pulse">
                    <div className="h-4 w-32 bg-white/5 rounded-full" />
                    <div className="h-16 w-full bg-white/5 rounded-2xl" />
                    <div className="h-4 w-96 bg-white/5 rounded-full" />
                </div>
                <MovieRowSkeleton />
                <MovieRowSkeleton />
            </div>
        );
    }

    return (
        <div className="bg-black text-white min-h-screen">
            {/* Cinematic Hero */}
            <AnimatePresence mode="wait">
                {heroMovie && (
                    <motion.div 
                        key={heroMovie.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="relative w-full h-[75vh] min-h-[600px] overflow-hidden"
                    >
                        {/* Perfect Fade Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent z-10" />
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black z-10" />
                        
                        {/* Background Blurred Image */}
                        <motion.img 
                            initial={{ scale: 1.1 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 1.5 }}
                            src={heroMovie.poster_url || `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(heroMovie.title)}`} 
                            alt={heroMovie.title}
                            className="absolute inset-0 w-full h-full object-cover opacity-40 blur-[4px]"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://via.placeholder.com/1920x1080/1a1a1a/ffffff?text=${encodeURIComponent(heroMovie.title)}`;
                            }}
                          />

                        {/* Content Container */}
                        <div className="relative z-20 h-full flex flex-col justify-center px-6 md:px-12 max-w-4xl">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                <div className="flex items-center gap-4 mb-6">
                                   <div className="bg-white/10 px-3 py-1 rounded border border-white/10 backdrop-blur-md">
                                     <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white">{heroMovie.rating} Rating</span>
                                   </div>
                                   <div className="flex items-center gap-1.5 text-xs font-bold text-green-400">
                                       <Sparkles size={14} />
                                       <span>{recommendations?.[0] === heroMovie ? '98% Match' : 'High Confidence'}</span>
                                   </div>
                                </div>
                                
                                <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter leading-[0.95] line-clamp-2 uppercase italic">{heroMovie.title}</h1>
                                
                                <div className="flex items-center gap-3 mb-8 text-xs font-bold text-gray-400 uppercase tracking-widest">
                                    <span>{heroMovie.year}</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span>{heroMovie.primary_genre}</span>
                                    <span className="w-1 h-1 bg-gray-700 rounded-full" />
                                    <span className="text-white">{heroMovie.language}</span>
                                </div>

                                <p className="text-lg text-gray-400 mb-10 max-w-xl line-clamp-2 font-medium leading-relaxed">
                                    {heroMovie.overview}
                                </p>

                                <div className="flex flex-wrap gap-4">
                                    <PrimaryButton className="flex items-center gap-2 text-sm uppercase px-8">
                                        <Play size={18} fill="black" />
                                        Watch Trailer
                                    </PrimaryButton>
                                    <SecondaryButton className="flex items-center gap-2 text-sm uppercase px-8">
                                        <Plus size={18} />
                                        Watchlist
                                    </SecondaryButton>
                                </div>
                                
                                <motion.div 
                                  initial={{ opacity: 0, y: 20 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: 0.6 }}
                                  className="mt-12 group cursor-default"
                                >
                                  <GlassCard className="max-w-md p-6 border-white/5 bg-white/[0.03] hover:bg-white/[0.05] hover:border-white/10 transition-all">
                                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/30 mb-2">AI Insight</p>
                                      <p className="text-sm font-medium text-gray-400 leading-relaxed italic group-hover:text-white transition-colors">
                                        &quot;Because you prefer <strong className="text-white">{preferences?.era} era</strong> films in <strong className="text-white">{preferences?.language}</strong>, this {heroMovie.primary_genre} strongly matches your current DNA.&quot;
                                      </p>
                                  </GlassCard>
                                </motion.div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="px-6 md:px-12 relative z-30 space-y-16 lg:space-y-24 mb-32 -mt-10">
                {/* Mode Specific Controls */}
                {preferences?.mode === 'mood' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <MoodScroller 
                          mood={mood} 
                          energy={energy} 
                          onMoodChange={setMood} 
                          onEnergyChange={setEnergy} 
                      />
                    </motion.div>
                )}

                {/* Rows */}
                <div className="space-y-16">
                  {recommendations && recommendations.length > 0 ? (
                    <>
                      <MovieRow 
                          title="Recommended For You" 
                          movies={recommendations} 
                          onMovieClick={(m) => setHeroMovie(m)} 
                      />
                      <MovieRow 
                          title={`Best of ${preferences?.language}`} 
                          movies={[...recommendations].reverse()} 
                          onMovieClick={(m) => setHeroMovie(m)} 
                      />
                    </>
                  ) : loading ? (
                    <div className="text-center py-20">
                      <p className="text-gray-400 font-bold uppercase tracking-widest animate-pulse">Loading recommendations...</p>
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <p className="text-gray-500 font-bold uppercase tracking-widest">No results found — try adjusting your vibe</p>
                    </div>
                  )}
                </div>
            </div>
        </div>
    );
}
