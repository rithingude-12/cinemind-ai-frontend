'use client';

import React from 'react';
import { useAuth } from '@/components/AuthProvider';
import { GlassCard, GradientText, SectionTitle, PrimaryButton, SecondaryButton } from '@/components/DesignSystem';
import { User, Mail, Globe, Clock, Shield, LogOut, ChevronRight, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, logout } = useAuth();

    const profileItems = [
        { icon: Mail, label: 'Email Address', value: user?.email || 'authenticated@cinemind.ai', action: 'Update' },
        { icon: Globe, label: 'Preferred Language', value: 'Telugu', action: 'Change' },
        { icon: Clock, label: 'Cinema Era', value: 'Modern (2011 – 2016)', action: 'Change' },
        { icon: Shield, label: 'Security', value: 'Verified Member', action: 'Manage' }
    ];

    return (
        <div className="min-h-screen bg-black pt-32 px-6 md:px-12 pb-32 max-w-[1400px] mx-auto">
            {/* Header / Intro */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="flex flex-col md:flex-row items-center gap-12 mb-24 text-center md:text-left"
            >
                <div className="relative group">
                    <div className="w-32 h-32 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-white/20 transition-all group-hover:border-white/30 group-hover:rotate-3">
                        <User size={64} strokeWidth={1} />
                        {/* Shimmer Border */}
                        <div className="absolute inset-0 rounded-3xl border border-white/20 opacity-0 group-hover:opacity-100 transition-opacity animate-pulse pointer-events-none" />
                    </div>
                    <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center border-4 border-black">
                        <Settings size={18} />
                    </div>
                </div>
                
                <div className="flex-1">
                    <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic">Your <GradientText>DNA Profile</GradientText></h1>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                           Tier: <span className="text-white">Collector</span>
                        </div>
                        <div className="bg-white/5 border border-white/10 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-400">
                           Rank: <span className="text-white">Cinephile</span>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                      onClick={logout}
                      className="p-4 bg-red-400/10 border border-red-400/20 text-red-400 rounded-2xl hover:bg-red-400 hover:text-white transition-all shadow-xl group"
                    >
                      <LogOut size={24} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Profile Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {profileItems.map((item, i) => (
                    <motion.div
                       initial={{ opacity: 0, y: 20 }}
                       animate={{ opacity: 1, y: 0 }}
                       transition={{ delay: i * 0.05 }}
                       key={item.label}
                    >
                        <GlassCard className="p-8 group hover:bg-white/[0.03] transition-all cursor-pointer">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-black transition-all">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600 group-hover:text-gray-400 transition-colors mb-1">{item.label}</p>
                                        <p className="text-lg font-bold text-white/90 group-hover:text-white transition-colors">{item.value}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-600 opacity-0 group-hover:opacity-100 transition-all">{item.action}</span>
                                    <ChevronRight size={16} className="text-gray-700 group-hover:text-white transition-colors" />
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                ))}
            </div>

            {/* Subscription Section */}
            <div className="mt-20">
               <GlassCard className="p-12 relative overflow-hidden bg-gradient-to-br from-white/[0.03] to-transparent border-white/5">
                  <div className="relative z-10 max-w-2xl">
                     <h3 className="text-3xl font-black mb-4 uppercase italic">Collector <GradientText>Pass</GradientText></h3>
                     <p className="text-gray-400 text-lg font-medium leading-relaxed mb-8">
                        Unlock early access to high-fidelity analytics, 4K poster downloads, and unlimited smart discovery.
                     </p>
                     <PrimaryButton className="px-12">Upgrade Now</PrimaryButton>
                  </div>
                  {/* Decorative Sparkle Gradient */}
                  <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />
               </GlassCard>
            </div>
            
            <div className="mt-20 text-center">
                <button className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-800 hover:text-red-500 transition-colors">
                    Permanently delete cinemind account
                </button>
            </div>
        </div>
    );
}
