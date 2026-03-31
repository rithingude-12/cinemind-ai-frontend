'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const Shimmer = ({ className = "" }: { className?: string }) => (
  <div className={`relative overflow-hidden bg-white/5 rounded-xl ${className}`}>
    <motion.div
      initial={{ x: '-100%' }}
      animate={{ x: '100%' }}
      transition={{
        repeat: Infinity,
        duration: 1.5,
        ease: "linear",
      }}
      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
    />
  </div>
);

export const MovieCardSkeleton = () => (
  <div className="flex-none w-[220px] md:w-[260px] space-y-4">
    <Shimmer className="aspect-[2/3]" />
    <div className="space-y-2 px-1">
      <Shimmer className="h-4 w-3/4" />
      <Shimmer className="h-3 w-1/2" />
    </div>
  </div>
);

export const MovieRowSkeleton = () => (
  <div className="mb-20">
    <div className="flex items-center justify-between mb-8">
      <Shimmer className="h-8 w-48 md:w-64" />
      <div className="h-px bg-white/5 flex-1 ml-8 hidden md:block" />
    </div>
    <div className="flex gap-6 overflow-hidden px-4">
      {[...Array(6)].map((_, i) => (
        <MovieCardSkeleton key={i} />
      ))}
    </div>
  </div>
);

export const InsightChartSkeleton = () => (
  <div className="space-y-8">
    <div className="space-y-4">
      <Shimmer className="h-10 w-64" />
      <Shimmer className="h-4 w-96" />
    </div>
    <Shimmer className="h-[400px] w-full" />
  </div>
);
