'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';
import { Film, Search, Sparkles, Brain, Heart } from 'lucide-react';

export default function ModeSelectionPage() {
  const router = useRouter();

  const modes = [
    {
      id: 'questionnaire',
      title: 'Questionnaire Mode',
      subtitle: 'Tell us what you feel like watching',
      description: 'Select your favorite genres and let our AI find the perfect movies for your mood.',
      icon: Brain,
      emoji: '🧠',
      gradient: 'from-purple-500 to-pink-500',
      features: ['Quick genre selection', 'Mood-based matching', 'Instant results'],
      route: '/questionnaire'
    },
    {
      id: 'manual',
      title: 'Manual Mode',
      subtitle: 'Pick movies you already love',
      description: 'Choose 3 movies you enjoy and we\'ll find similar ones based on your taste.',
      icon: Heart,
      emoji: '❤️',
      gradient: 'from-blue-500 to-cyan-500',
      features: ['Personalized recommendations', 'Similarity-based matching', 'Taste profile analysis'],
      route: '/manual'
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-6">
      {/* Background Effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-6xl relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Film className="w-10 h-10 text-purple-400" />
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter">
              Choose Your <GradientText>Experience</GradientText>
            </h1>
          </motion.div>
          <p className="text-gray-400 text-xl font-medium max-w-2xl mx-auto">
            Select how you want to discover your next favorite movie
          </p>
        </div>

        {/* Mode Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {modes.map((mode, index) => {
            const IconComponent = mode.icon;
            
            return (
              <motion.div
                key={mode.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                <GlassCard className={`p-8 border-white/10 hover:border-white/20 transition-all duration-300 h-full`}>
                  {/* Header */}
                  <div className="text-center mb-8">
                    <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r ${mode.gradient} flex items-center justify-center`}>
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    <div className="text-4xl mb-4">{mode.emoji}</div>
                    <h2 className="text-2xl md:text-3xl font-black mb-2">{mode.title}</h2>
                    <p className="text-lg text-gray-400">{mode.subtitle}</p>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-center mb-8 leading-relaxed">
                    {mode.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-3 mb-8">
                    {mode.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${mode.gradient}`} />
                        <span className="text-sm text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="text-center">
                    <PrimaryButton
                      onClick={() => router.push(mode.route)}
                      className={`w-full py-4 text-base font-bold bg-gradient-to-r ${mode.gradient} text-white border-none hover:shadow-lg hover:shadow-purple-500/25`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Sparkles size={20} />
                        Start {mode.title.split(' ')[0]}
                      </span>
                    </PrimaryButton>
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-12"
        >
          <p className="text-gray-500 text-sm">
            Both modes use our advanced AI to deliver personalized recommendations
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}
