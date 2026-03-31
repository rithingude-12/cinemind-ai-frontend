'use client';

import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, TrendingUp, Globe, Clock, Star, ArrowRight } from 'lucide-react';
import { GlassCard, GradientText, SectionTitle } from '@/components/DesignSystem';
import { InsightChartSkeleton } from '@/components/Skeleton';
import { API_BASE_URL } from '@/lib/constants';

const COLORS = ['#A855F7', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#6366F1'];

export default function InsightsPage() {
    const [userData, setUserData] = useState<any>(null);
    const [globalData, setGlobalData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [hoveredTimeline, setHoveredTimeline] = useState<number | null>(null);

    useEffect(() => {
        fetchInsights();
    }, []);

    const fetchInsights = async () => {
        setLoading(true);
        try {
            const [userRes, globalRes] = await Promise.all([
                fetch(`${API_BASE_URL}/insights/user`),
                fetch(`${API_BASE_URL}/insights/global`)
            ]);
            
            const [uData, gData] = await Promise.all([userRes.json(), globalRes.json()]);
            setUserData(uData);
            setGlobalData(gData);
        } catch (err) {
            console.error('Failed to fetch insights', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !userData) {
      return (
        <div className="min-h-screen bg-black pt-32 px-6 md:px-12 space-y-24 max-w-[1400px] mx-auto">
            <div className="space-y-4 mb-20 animate-pulse">
                <div className="h-16 w-3/4 bg-white/5 rounded-2xl" />
                <div className="h-4 w-1/2 bg-white/5 rounded-full" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <InsightChartSkeleton />
                <InsightChartSkeleton />
            </div>
        </div>
      );
    }

    const hasData = userData && userData.total_interactions > 0;

    return (
        <div className="min-h-screen bg-black pt-32 px-6 md:px-12 pb-32 max-w-[1400px] mx-auto overflow-hidden">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-20 text-center md:text-left"
            >
              <h1 className="text-6xl md:text-7xl font-black tracking-tighter mb-4 uppercase italic">Your <GradientText>Cinema DNA</GradientText></h1>
              <p className="text-gray-500 text-lg md:text-xl font-medium max-w-2xl leading-relaxed">
                How your taste evolves through genres, languages, and eras. Analyzed by CineMind AI.
              </p>
            </motion.div>

            {!hasData ? (
              <GlassCard className="p-20 text-center border-dashed border-white/10">
                <Sparkles className="mx-auto mb-6 text-gray-700" size={48} />
                <h2 className="text-2xl font-bold mb-3">Your profile is a blank canvas</h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">Start rating movies and building your watchlist to unlock high-end analytics.</p>
                <div className="flex justify-center">
                  <PrimaryButton onClick={() => window.location.href = '/'}>Start Exploring</PrimaryButton>
                </div>
              </GlassCard>
            ) : (
              <div className="space-y-24">
                {/* Section 1: User Analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  <div className="space-y-8">
                    <SectionTitle title="Taste Breakdown" subtitle="Your most frequent genre alignments." />
                    <GlassCard className="h-[400px] p-8 border-white/5 bg-white/[0.02]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart layout="vertical" data={userData.favorite_genres} margin={{ left: 20, right: 40, top: 10, bottom: 10 }}>
                          <XAxis type="number" hide />
                          <YAxis 
                            dataKey="genre" 
                            type="category" 
                            axisLine={false} 
                            tickLine={false} 
                            fontSize={12} 
                            fontWeight="bold"
                            tick={{ fill: '#888', textAnchor: 'start', dx: -60 }}
                          />
                          <Tooltip 
                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                            contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          />
                          <Bar dataKey="count" fill="url(#barGradient)" radius={[0, 4, 4, 0]} barSize={24}>
                            <defs>
                              <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                                <stop offset="0%" stopColor="#A855F7" />
                                <stop offset="100%" stopColor="#3B82F6" />
                              </linearGradient>
                            </defs>
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </GlassCard>
                  </div>

                  <div className="space-y-8">
                    <SectionTitle title="Linguistic Reach" subtitle="Diversity of languages in your library." />
                    <GlassCard className="h-[400px] p-8 border-white/5 bg-white/[0.02] flex items-center justify-center relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={userData.language_distribution}
                            innerRadius={80}
                            outerRadius={120}
                            paddingAngle={8}
                            dataKey="count"
                            nameKey="language"
                            stroke="none"
                          >
                            {userData.language_distribution.map((entry: any, index: number) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <Globe size={24} className="text-gray-500 mb-1" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Global</span>
                      </div>
                      <div className="absolute bottom-8 flex flex-wrap justify-center gap-6">
                         {userData.language_distribution.map((item: any, i: number) => (
                           <div key={item.language} className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                             <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.language}</span>
                           </div>
                         ))}
                      </div>
                    </GlassCard>
                  </div>
                </div>

                {/* Section 2: Hybrid Activity Timeline */}
                <div className="space-y-12">
                   <SectionTitle title="Activity Timeline" subtitle="Intelligent tracking of your evolving preferences." />
                   <div className="relative pl-8 border-l border-white/5 space-y-16">
                      {userData.timeline.map((item: any) => (
                        <div key={item.id} className="relative">
                          <div className="absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-black border-4 border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]" />
                          
                          <motion.div 
                            onMouseEnter={() => setHoveredTimeline(item.id)}
                            onMouseLeave={() => setHoveredTimeline(null)}
                            className="glass-card max-w-2xl p-8 cursor-default group hover:bg-white/[0.03] transition-all"
                          >
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-500 mb-2 block">Taste Shift</span>
                                <h4 className="text-2xl font-bold uppercase italic tracking-tighter">{item.title}</h4>
                              </div>
                              <Clock size={20} className="text-gray-700" />
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed mb-6">
                              {item.description}
                            </p>

                            <AnimatePresence>
                              {(hoveredTimeline === item.id) && (
                                <motion.div 
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="overflow-hidden"
                                >
                                  <div className="pt-6 border-t border-white/5 flex gap-4">
                                    {item.movies.map((movie: any, idx: number) => (
                                      <div key={idx} className="w-24 group/movie relative">
                                        <div className="aspect-[2/3] rounded-lg overflow-hidden border border-white/10 mb-2">
                                          <img src={movie.poster_url || `https://via.placeholder.com/300x450/1a1a1a/ffffff?text=${encodeURIComponent(movie.title.substring(0, 10))}`} className="w-full h-full object-cover grayscale group-hover/movie:grayscale-0 transition-all" />
                                        </div>
                                        <p className="text-[9px] font-bold uppercase tracking-widest truncate text-gray-500 group-hover/movie:text-white">{movie.title}</p>
                                      </div>
                                    ))}
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                            
                            {!hoveredTimeline && (
                              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700 mt-4 group-hover:text-white transition-colors">
                                <span>Hover to reveal shift origin</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                              </div>
                            )}
                          </motion.div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Section 3: Global Benchmarks */}
                <div className="pt-24 border-t border-white/5">
                  <SectionTitle title="Global Benchmarks" subtitle="How your cinema DNA compares to the world." />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="glass-card p-8 text-center bg-white/[0.01]">
                        <TrendingUp size={24} className="mx-auto mb-4 text-gray-600" />
                        <h5 className="text-3xl font-black mb-1">{globalData.genres?.[0]?.genre || '--'}</h5>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Most Popular Genre</p>
                     </div>
                     <div className="glass-card p-8 text-center bg-white/[0.01]">
                        <Star size={24} className="mx-auto mb-4 text-gray-600" />
                        <h5 className="text-3xl font-black mb-1">{userData.avg_rating}</h5>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Your Avg Rating</p>
                     </div>
                     <div className="glass-card p-8 text-center bg-white/[0.01]">
                        <ArrowRight size={24} className="mx-auto mb-4 text-gray-600 rotate-[-45deg]" />
                        <h5 className="text-3xl font-black mb-1">92%</h5>
                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Algorithm Confidence</p>
                     </div>
                  </div>
                </div>
              </div>
            )}
        </div>
    );
}

// Reusable Button inside this file if not exported from DesignSystem yet
const PrimaryButton = ({ children, onClick }: { children: React.ReactNode; onClick: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="bg-white text-black font-black px-12 py-4 rounded-lg uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(255,255,255,0.1)]"
  >
    {children}
  </motion.button>
);
