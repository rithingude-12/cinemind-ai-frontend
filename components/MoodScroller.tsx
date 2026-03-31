'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Cloud, Zap, Coffee, Wind, Sparkles } from 'lucide-react';

interface MoodScrollerProps {
    mood: string;
    energy: string;
    onMoodChange: (val: string) => void;
    onEnergyChange: (val: string) => void;
}

const MoodScroller = ({ mood, energy, onMoodChange, onEnergyChange }: MoodScrollerProps) => {
    const moods = ['dark', 'balanced', 'happy'];
    const energies = ['low', 'mid', 'high'];

    const getMoodIcon = (m: string) => {
      switch (m) {
        case 'dark': return <Moon size={16} />;
        case 'balanced': return <Wind size={16} />;
        case 'happy': return <Sun size={16} />;
        default: return null;
      }
    };

    const getEnergyIcon = (e: string) => {
      switch (e) {
        case 'low': return <Coffee size={16} />;
        case 'mid': return <Sparkles size={16} />;
        case 'high': return <Zap size={16} />;
        default: return null;
      }
    };

    return (
        <div className="glass-card p-10 md:p-12 border-white/5 bg-white/[0.01] relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32">
                {/* Mood Controller */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Emotional DNA</label>
                        <div className="flex items-center gap-2 text-white font-black italic uppercase text-sm tracking-tighter">
                            {getMoodIcon(mood)}
                            <span>{mood}</span>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <input 
                            type="range"
                            min="0"
                            max="2"
                            step="1"
                            value={moods.indexOf(mood)}
                            onChange={(e) => onMoodChange(moods[parseInt(e.target.value)])}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/10 transition-colors"
                        />
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1">
                            {moods.map((m) => (
                                <button 
                                    key={m} 
                                    onClick={() => onMoodChange(m)}
                                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${mood === m ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {m}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Energy Controller */}
                <div className="space-y-10">
                    <div className="flex items-center justify-between">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">Atomic Energy</label>
                        <div className="flex items-center gap-2 text-white font-black italic uppercase text-sm tracking-tighter">
                            {getEnergyIcon(energy)}
                            <span>{energy}</span>
                        </div>
                    </div>
                    
                    <div className="relative group">
                        <input 
                            type="range"
                            min="0"
                            max="2"
                            step="1"
                            value={energies.indexOf(energy)}
                            onChange={(e) => onEnergyChange(energies[parseInt(e.target.value)])}
                            className="w-full h-1 bg-white/5 rounded-full appearance-none cursor-pointer accent-white hover:bg-white/10 transition-colors"
                        />
                        <div className="absolute -bottom-8 left-0 right-0 flex justify-between px-1">
                            {energies.map((e) => (
                                <button 
                                    key={e} 
                                    onClick={() => onEnergyChange(e)}
                                    className={`text-[9px] font-black uppercase tracking-widest transition-colors ${energy === e ? 'text-white' : 'text-gray-700'}`}
                                >
                                    {e}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MoodScroller;
