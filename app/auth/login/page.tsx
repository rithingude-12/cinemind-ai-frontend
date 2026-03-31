'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { GlassCard, PrimaryButton, GradientText } from '@/components/DesignSystem';
import { API_BASE } from '@/src/lib/api';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const validateEmail = (email: string) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        
        if (password.length < 6 || !password.trim()) {
            setError('Password must be at least 6 characters long');
            return;
        }

        setLoading(true);

        try {
            console.log("API CALL:", `${API_BASE}/auth/login`);
            const res = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                login(data.access_token, data.user);
                router.push('/onboarding');
            } else {
                // Handle Pydantic validation errors (often an array) vs simple detail strings
                const errorMsg = Array.isArray(data.detail) 
                    ? data.detail.map((err: any) => err.msg).join(', ')
                    : data.detail;
                setError(errorMsg || 'Invalid email or password');
            }
        } catch (err) {
            setError(`Connection refused. Is the backend server running on ${API_BASE}?`);
            console.error("Auth Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black">
            {/* Subtle Background Glow */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-[440px] relative z-10"
            >
                <GlassCard className="p-10 md:p-12 border-white/10">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-black mb-3 tracking-tighter">Welcome <GradientText>Back</GradientText></h1>
                        <p className="text-gray-500 text-sm font-medium">Continue your cinematic journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Email</label>
                            <input 
                                type="email" 
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-5 py-3.5 outline-none focus:border-white/20 transition-all font-medium text-white placeholder:text-gray-700"
                                placeholder="name@example.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <input 
                                type="password" 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-white/5 border border-white/5 rounded-lg px-5 py-3.5 outline-none focus:border-white/20 transition-all font-medium text-white placeholder:text-gray-700"
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <motion.p 
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-red-400 text-xs font-bold bg-red-400/10 p-3 rounded-lg border border-red-400/20"
                            >
                                {error}
                            </motion.p>
                        )}

                        <PrimaryButton 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 text-sm"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </PrimaryButton>
                    </form>

                    <p className="mt-10 text-center text-sm font-medium text-gray-500">
                        New to CineMind? {' '}
                        <Link href="/auth/register" className="text-white hover:cine-gradient transition-all border-b border-white/10 pb-0.5 ml-1">Create Account</Link>
                    </p>
                </GlassCard>
            </motion.div>
        </div>
    );
}
