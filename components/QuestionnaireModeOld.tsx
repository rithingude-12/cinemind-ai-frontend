'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';
import { Search, Sparkles, Film } from 'lucide-react';
import { mockQuestionnaireRecommendation } from '@/lib/mockApi';

const genres = [
  { id: 'action', name: 'Action', emoji: '💥' },
  { id: 'drama', name: 'Drama', emoji: '🎭' },
  { id: 'thriller', name: 'Thriller', emoji: '🔍' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'comedy', name: 'Comedy', emoji: '😂' },
  { id: 'horror', name: 'Horror', emoji: '😱' },
  { id: 'sci-fi', name: 'Sci-Fi', emoji: '🚀' },
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'fantasy', name: 'Fantasy', emoji: '✨' },
  { id: 'mystery', name: 'Mystery', emoji: '🔮' },
  { id: 'animation', name: 'Animation', emoji: '🎨' },
  { id: 'documentary', name: 'Documentary', emoji: '📹' }
];

export default function QuestionnaireMode() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { user } = useAuth();

  const toggleGenre = (genreId: string) => {
    if (selectedGenres.includes(genreId)) {
      setSelectedGenres(selectedGenres.filter(g => g !== genreId));
    } else if (selectedGenres.length < 3) {
      setSelectedGenres([...selectedGenres, genreId]);
    }
  };

  const handleSubmit = async () => {
    if (selectedGenres.length === 0) return;
    
    setLoading(true);
    
    try {
      const preferences = JSON.parse(localStorage.getItem('preferences') || '{}');
      
      // Use mock API for now
      const data = await mockQuestionnaireRecommendation({
        user_id: user?.id || 'anonymous',
        language: preferences.language || 'English',
        era: preferences.era || '2020s',
        genres: selectedGenres
      });
      
      // Store recommendations and navigate to results
      localStorage.setItem('recommendations', JSON.stringify(data));
      localStorage.setItem('recommendation_mode', 'questionnaire');
      localStorage.setItem('recommendation_context', JSON.stringify({
        selectedGenres,
        explanation: data.explanation
      }));
      
      router.push('/recommendations');
    } catch (error) {
      console.error('Questionnaire error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-4xl relative z-10"
      >
        <GlassCard className="p-12 border-white/10">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-3 mb-6"
            >
              <Film className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                What do you feel like <GradientText>watching?</GradientText>
              </h1>
            </motion.div>
            <p className="text-gray-400 text-lg font-medium">
              Pick 1–3 genres that match your mood right now
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <Sparkles size={14} />
              <span>{selectedGenres.length}/3 selected</span>
            </div>
          </div>

          {/* Genre Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {genres.map((genre, index) => {
              const isSelected = selectedGenres.includes(genre.id);
              const canSelect = selectedGenres.length < 3 || isSelected;
              
              return (
                <motion.div
                  key={genre.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: canSelect ? 1.05 : 1 }}
                  whileTap={{ scale: canSelect ? 0.95 : 1 }}
                  onClick={() => canSelect && toggleGenre(genre.id)}
                  className={`
                    relative p-6 rounded-2xl border-2 cursor-pointer transition-all duration-300
                    ${isSelected 
                      ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20' 
                      : canSelect
                        ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                        : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                    }
                  `}
                >
                  <div className="text-center">
                    <div className="text-3xl mb-2">{genre.emoji}</div>
                    <div className="font-semibold text-white">{genre.name}</div>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center"
                      >
                        <span className="text-xs text-white">✓</span>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <PrimaryButton
              onClick={handleSubmit}
              disabled={selectedGenres.length === 0 || loading}
              className="px-12 py-4 text-lg font-bold"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-5 h-5 border-2 border-black border-t-transparent rounded-full"
                  />
                  Finding Your Movies...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Find My Movies
                </span>
              )}
            </PrimaryButton>
            
            {selectedGenres.length === 0 && (
              <p className="mt-4 text-sm text-gray-500">
                Select at least one genre to continue
              </p>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
