'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';

import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';

const steps = [
    {
        id: 'language',
        title: 'Choose Language',
        description: 'Which language do you prefer for your films?',
        options: [
            { id: 'telugu', label: 'Telugu', sub: 'Regional Excellence' },
            { id: 'tamil', label: 'Tamil', sub: 'Cultural Depth' },
            { id: 'hindi', label: 'Hindi', sub: 'Universal Reach' },
            { id: 'english', label: 'English', sub: 'Global Vision' }
        ]
    },
    {
        id: 'era',
        title: 'Select Era',
        description: 'What time period of cinema interests you most?',
        options: [
            { id: 'early', label: '2001 – 2010', sub: 'Early Classics' },
            { id: 'mid', label: '2011 – 2016', sub: 'Modern Era' },
            { id: 'genz', label: '2017 – Present', sub: 'New Wave' }
        ]
    },
    {
        id: 'mode',
        title: 'Choose Mode',
        description: 'How do you want to find your next movie?',
        options: [
            { id: 'questionnaire', label: 'Questionnaire', desc: 'Select genres manually' },
            { id: 'mood', label: 'Mood Scroller', desc: 'Find movies by energy & feeling' },
            { id: 'manual', label: 'Manual Search', desc: 'Based on movies you like' }
        ]
    }
];

export default function OnboardingPage() {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [selections, setSelections] = useState<any>({});
    const router = useRouter();

    const currentStep = steps[currentStepIndex];

    const handleSelect = (optionId: string) => {
        setSelections({ ...selections, [currentStep.id]: optionId });
    };

    const handleNext = () => {
        if (!selections[currentStep.id]) return;
        
        if (currentStepIndex < steps.length - 1) {
            setCurrentStepIndex(currentStepIndex + 1);
        } else {
            localStorage.setItem('preferences', JSON.stringify(selections));
            router.push('/');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center px-6">
            <div className="w-full max-w-[1200px] mx-auto flex flex-col items-center">
                
                {/* PROGRESS BAR */}
                <div className="w-full mb-12">
                    <div className="h-[2px] bg-white/10 relative">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
                            className="absolute left-0 top-0 h-full bg-white"
                            transition={{ duration: 0.8, ease: "circOut" }}
                        />
                    </div>
                </div>

                {/* TITLE SECTION */}
                <div className="text-center space-y-4 mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h1 className="text-5xl md:text-6xl font-bold">
                            {currentStep.title.split(' ')[0]} <GradientText>{currentStep.title.split(' ').slice(1).join(' ')}</GradientText>
                        </h1>
                        <p className="text-gray-400 text-lg">
                            {currentStep.description}
                        </p>
                    </motion.div>
                </div>

                {/* CARDS GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full mb-20">
                    {currentStep.options.map((option: any, i: number) => (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.05 }}
                            key={option.id}
                        >
                            <button
                                onClick={() => handleSelect(option.id)}
                                className={`
                                    h-[150px]
                                    rounded-2xl
                                    bg-white/5
                                    border border-white/10
                                    flex flex-col justify-center items-center
                                    transition hover:scale-105
                                    relative w-full group
                                    ${
                                        selections[currentStep.id] === option.id 
                                            ? 'bg-white/10 border-white shadow-[0_0_40px_rgba(255,255,255,0.1)]' 
                                            : 'bg-white/[0.02] border-white/5 text-white hover:border-white/20'
                                    }
                                `}
                            >
                                {selections[currentStep.id] === option.id && (
                                    <motion.div 
                                        layoutId="step-glow"
                                        className="absolute inset-0 rounded-2xl border border-white/20 opacity-40 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                                    />
                                )}
                                
                                <div className="space-y-2">
                                    <h2 className={`text-xl font-semibold transition-colors ${
                                        selections[currentStep.id] === option.id ? 'text-white' : 'text-gray-300'
                                    }`}>
                                        {option.label}
                                    </h2>
                                    {option.sub && (
                                        <p className={`text-sm text-gray-400 tracking-wide transition-colors ${
                                            selections[currentStep.id] === option.id ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {option.sub}
                                        </p>
                                    )}
                                    {option.desc && (
                                        <p className={`text-sm font-medium leading-relaxed transition-colors mt-2 ${
                                            selections[currentStep.id] === option.id ? 'text-gray-400' : 'text-gray-500'
                                        }`}>
                                            {option.desc}
                                        </p>
                                    )}
                                </div>
                            </button>
                        </motion.div>
                    ))}
                </div>

                {/* BUTTON SECTION */}
                <div className="mt-20 flex flex-col items-center space-y-4">
                    <PrimaryButton
                        onClick={handleNext}
                        disabled={!selections[currentStep.id]}
                        className="px-12 py-4 rounded-2xl bg-white text-black text-lg font-semibold shadow-lg shadow-white/10 transition-all duration-300 hover:scale-105 hover:shadow-white/20"
                    >
                        {currentStepIndex === steps.length - 1 ? 'Start Exploring' : 'Continue →'}
                    </PrimaryButton>
                    <p className="text-xs text-gray-500 tracking-widest mt-2">
                        STEP {currentStepIndex + 1} OF {steps.length}
                    </p>
                </div>

            </div>
        </div>
    );
}
