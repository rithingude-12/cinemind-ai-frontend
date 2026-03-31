'use client';

import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`glass-card p-6 ${className}`}>
    {children}
  </div>
);

export const PrimaryButton = ({ 
  children, 
  onClick, 
  className = "", 
  disabled = false,
  type = "button"
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}) => (
  <motion.button
    type={type}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    disabled={disabled}
    className={`bg-white text-black font-bold py-3 px-6 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] ${className}`}
  >
    {children}
  </motion.button>
);

export const SecondaryButton = ({ 
  children, 
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode; 
  onClick?: () => void; 
  className?: string;
}) => (
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-transparent text-white border border-white/20 font-bold py-3 px-6 rounded-xl transition-all backdrop-blur-sm ${className}`}
  >
    {children}
  </motion.button>
);

export const GradientText = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <span className={`cine-gradient font-bold ${className}`}>
    {children}
  </span>
);

export const SectionTitle = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-12">
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-black mb-4 tracking-tighter"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-gray-400 text-lg md:text-xl max-w-2xl"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);
