'use client';

import React from 'react';
import { Star, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { GlassCard } from './DesignSystem';

interface Movie {
  id: number;
  title: string;
  year: number;
  rating: number;
  primary_genre: string;
  poster_url: string;
  language: string;
}

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onMovieClick: (movie: Movie) => void;
}

const MovieRow = ({ title, movies, onMovieClick }: MovieRowProps) => {
  return (
    <div className="mb-20">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic">{title}</h2>
        <div className="h-px bg-white/10 flex-1 ml-8 hidden md:block" />
      </div>
      
      <div className="flex overflow-x-auto gap-6 hide-scrollbar pb-8 -mx-4 px-4">
        {movies.map((movie, index) => (
          <motion.div
            key={movie.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex-none w-[220px] md:w-[260px] group cursor-pointer"
            onClick={() => onMovieClick(movie)}
          >
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden mb-4 bg-white/[0.02] border border-white/5 transition-all duration-500 group-hover:scale-[1.03] group-hover:border-white/20 group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
              <img 
                src={movie.poster_url} 
                alt={movie.title}
                className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x450?text=CineMind+AI';
                }}
              />
              
              {/* Premium Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 p-6 flex flex-col justify-end">
                  <div className="flex gap-2 mb-4">
                      <button className="bg-white text-black p-2.5 rounded-lg hover:scale-110 transition-transform shadow-xl">
                          <Play size={18} fill="black" />
                      </button>
                      <button className="bg-white/10 text-white p-2.5 rounded-lg border border-white/10 hover:bg-white/20 transition-all backdrop-blur-md">
                          <Plus size={18} />
                      </button>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                      <span className="flex items-center gap-1 text-green-400">
                          <Star size={10} fill="currentColor" />
                          {movie.rating}
                      </span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span>{movie.year}</span>
                  </div>
              </div>
            </div>
            
            <div className="px-1">
                <h3 className="text-sm font-bold truncate mb-1 group-hover:text-white transition-colors uppercase tracking-tight">{movie.title}</h3>
                <div className="flex items-center gap-2 text-[10px] text-gray-500 uppercase font-black tracking-widest">
                    <span>{movie.primary_genre}</span>
                    <span className="w-1 h-1 bg-gray-800 rounded-full" />
                    <span>{movie.language}</span>
                </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MovieRow;
