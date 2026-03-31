'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';
import { Film, Sparkles } from 'lucide-react';
import { API_BASE } from '@/src/lib/api';

const genres = [
  { id: 'action', name: 'Action', emoji: '💥' },
  { id: 'adventure', name: 'Adventure', emoji: '🗺️' },
  { id: 'animation', name: 'Animation', emoji: '�' },
  { id: 'comedy', name: 'Comedy', emoji: '😂' },
  { id: 'crime', name: 'Crime', emoji: '�' },
  { id: 'documentary', name: 'Documentary', emoji: '📹' },
  { id: 'drama', name: 'Drama', emoji: '🎭' },
  { id: 'family', name: 'Family', emoji: '�‍👩‍👧‍👦' },
  { id: 'fantasy', name: 'Fantasy', emoji: '✨' },
  { id: 'history', name: 'History', emoji: '�' },
  { id: 'horror', name: 'Horror', emoji: '😱' },
  { id: 'music', name: 'Music', emoji: '🎵' },
  { id: 'mystery', name: 'Mystery', emoji: '🔍' },
  { id: 'romance', name: 'Romance', emoji: '💕' },
  { id: 'science fiction', name: 'Science Fiction', emoji: '🚀' },
  { id: 'thriller', name: 'Thriller', emoji: '😰' },
  { id: 'tv movie', name: 'TV Movie', emoji: '📺' },
  { id: 'war', name: 'War', emoji: '⚔️' },
  { id: 'western', name: 'Western', emoji: '🤠' }
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
      
      console.log('Submitting questionnaire with genres:', selectedGenres);
      
      const apiUrl = `${API_BASE.replace('/api/v1', '/api/v2')}/questionnaire`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: String(user?.id || 'anonymous'),
          language: preferences.language || 'All',
          era: preferences.era || 'All',
          genres: selectedGenres
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        throw new Error(`Failed to get recommendations: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('API Response Data:', data);
      
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
      alert('Error getting recommendations. Please try again.');
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
              <Film className="w-8 h-8 text-purple-400" />
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter">
                What do you want to <GradientText>watch today?</GradientText>
              </h1>
            </motion.div>
            <p className="text-gray-400 text-lg font-medium">
              Pick up to 3 genres
            </p>
            <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
              <Sparkles size={14} />
              <span>{selectedGenres.length}/3 selected</span>
            </div>
          </div>

          {/* Genre Grid */}
          <div className="max-h-96 overflow-y-auto mb-12">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${isSelected 
                        ? 'border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-lg shadow-purple-500/30' 
                        : canSelect
                          ? 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                          : 'border-white/5 bg-white/5 opacity-50 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{genre.emoji}</div>
                      <div className="font-semibold text-white text-sm">{genre.name}</div>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
                        >
                          <span className="text-xs text-white">✓</span>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
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
                  Getting Recommendations...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Sparkles size={20} />
                  Get Recommendations
                </span>
              )}
            </PrimaryButton>
            
            {selectedGenres.length === 0 && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-sm text-gray-500"
              >
                Select at least one genre to continue
              </motion.p>
            )}
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}
