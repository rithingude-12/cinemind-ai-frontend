'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: Sparkles,
    title: "Mood-based",
    desc: "Our AI understands how you feel. Just scroll the mood and find your match."
  },
  {
    icon: Shield,
    title: "Personalized",
    desc: "Your Cinema DNA is unique. We build it with every rating and interaction."
  },
  {
    icon: Zap,
    title: "Smart Discovery",
    desc: "Dive into eras you've never explored with intelligent zero-lag discovery."
  }
];

export const LandingPage = () => {
    console.log("LandingPage rendering - APP MOUNTING");
    return (
        <div className="relative min-h-screen bg-black overflow-x-hidden">
            {/* Cinematic Background Layer */}
            <div className="absolute inset-0 z-0 h-[85vh] overflow-hidden">
                {/* Layered Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/70 to-black z-10" />
                
                {/* Bottom Fade Transition */}
                <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-black to-transparent z-20" />

                <motion.img 
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 0.5 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover"
                    alt="Cinematic background"
                />
            </div>

            {/* Main Wrapper */}
            <div className="relative z-30">
                
                {/* Hero Section */}
                <section className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6 relative">
                    {/* Atmospheric Glow Behind Title */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur-3xl opacity-60 pointer-events-none z-0" />

                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        className="space-y-6 flex flex-col items-center relative z-10"
                    >
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight max-w-[900px] selection:bg-purple-500/30">
                            <span className="text-white/90">You control</span> <br /> 
                            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent italic">the vibe.</span>
                        </h1>

                        <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-[600px] leading-relaxed selection:bg-white/10">
                            CineMind AI transforms your current emotional state into a curated cinematic journey. No searching, just feeling.
                        </p>

                        <div className="mt-8 flex justify-center gap-4">
                            <Link href="/auth/login">
                                <button className="px-10 py-4 rounded-2xl bg-white text-black font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-white/10 hover:shadow-2xl hover:shadow-white/20">
                                    Sign In
                                </button>
                            </Link>
                            <Link href="/modes">
                                <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-purple-500 to-blue-500 text-white font-semibold text-lg transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl shadow-purple-500/20 hover:shadow-2xl hover:shadow-purple-500/30">
                                    Try Now
                                </button>
                            </Link>
                        </div>
                    </motion.div>
                </section>

                {/* Features Section - Responsive Grid */}
                <section className="py-20 mt-16">
                    <div className="max-w-[1200px] mx-auto px-6 w-full">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {features.map((feature, i) => (
                                <motion.div
                                    key={feature.title}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-100px" }}
                                    transition={{ duration: 0.8, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className={`group w-full h-[160px] p-6 rounded-2xl bg-white/[0.03] backdrop-blur-md border transition-all duration-500 cursor-default hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden ${
                                        i === 1 ? 'lg:scale-[1.04] border-white/20 z-10' : 'scale-100 border-white/10'
                                    }`}
                                >
                                    <div className="flex flex-col h-full gap-3">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 flex-shrink-0">
                                            <feature.icon size={20} />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                                            <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">
                                                {feature.desc}
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>
        </div>
    );
};

export default LandingPage;
