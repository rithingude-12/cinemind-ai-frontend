'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { motion } from 'framer-motion';
import { GlassCard, GradientText, SectionTitle, PrimaryButton } from '@/components/DesignSystem';
import { Bookmark, Trash2, Play, Info } from 'lucide-react';
import Link from 'next/link';
import { API_BASE_URL } from '@/lib/constants';

export default function WatchlistPage() {
    const { isAuthenticated } = useAuth();
    const [watchlist, setWatchlist] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isAuthenticated) {
            fetchWatchlist();
        }
    }, [isAuthenticated]);

    const fetchWatchlist = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/watchlist/`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            const data = await res.json();
            setWatchlist(data.watchlist || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWatchlist = async (movieId: number) => {
        try {
            await fetch(`${API_BASE_URL}/watchlist/${movieId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                }
            });
            setWatchlist(watchlist.filter(m => m.id !== movieId));
        } catch (err) {
            console.error(err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-500 font-bold uppercase tracking-widest">Please sign in to view your watchlist</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black pt-32 px-6 md:px-12 pb-32 max-w-[1400px] mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-16"
            >
                <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4 uppercase italic">Your <GradientText>Watchlist</GradientText></h1>
                <p className="text-gray-500 text-lg font-medium max-w-xl">Movies you have saved for the perfect vibe.</p>
            </motion.div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : watchlist.length === 0 ? (
                <GlassCard className="py-24 text-center border-dashed border-white/10">
                    <Bookmark size={48} className="mx-auto mb-6 text-gray-800" />
                    <h2 className="text-2xl font-bold mb-3">Your library is empty</h2>
                    <p className="text-gray-500 mb-8 max-w-sm mx-auto">Found something interesting? Add it to your watchlist to track your cinema DNA.</p>
                    <Link href="/">
                      <PrimaryButton>Find Movies</PrimaryButton>
                    </Link>
                </GlassCard>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {watchlist.map((movie, i) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="group relative"
                        >
                            <div className="aspect-[2/3] rounded-xl overflow-hidden border border-white/5 bg-white/[0.02] transition-all duration-500 group-hover:scale-[1.03] group-hover:border-white/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                                <img 
                                    src={movie.poster_url || 'https://via.placeholder.com/500x750?text=No+Poster'} 
                                    alt={movie.title}
                                    className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-500"
                                />
                                
                                {/* Hover Overlay */}
                                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                                   <div className="flex gap-2 mb-3">
                                      <button className="p-2 bg-white text-black rounded-lg hover:scale-110 transition-transform">
                                         <Play size={14} fill="currentColor" />
                                      </button>
                                      <button 
                                        onClick={() => removeFromWatchlist(movie.id)}
                                        className="p-2 bg-red-500/20 text-red-500 border border-red-500/30 rounded-lg hover:bg-red-500 hover:text-white transition-all shadow-lg"
                                      >
                                         <Trash2 size={14} />
                                      </button>
                                   </div>
                                   <p className="text-[10px] font-black uppercase tracking-widest text-white truncate">{movie.title}</p>
                                   <p className="text-[8px] font-bold uppercase tracking-widest text-gray-500">{movie.year} • {movie.language}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
