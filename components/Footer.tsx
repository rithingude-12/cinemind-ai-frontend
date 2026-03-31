'use client';

import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="py-20 border-t border-white/5 mt-20">
      <div className="max-w-[1400px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex flex-col items-center md:items-start gap-2">
          <div className="text-xl font-black tracking-tighter">
            CineMind<span className="text-gray-500">AI</span>
          </div>
          <p className="text-gray-500 text-sm italic">
            &quot;Movie experience perfected.&quot;
          </p>
        </div>

        <div className="flex gap-8 text-sm font-medium text-gray-500">
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          <Link href="#" className="hover:text-white transition-colors">Help</Link>
          <Link href="#" className="hover:text-white transition-colors">Feedback</Link>
        </div>

        <div className="text-gray-600 text-xs tabular-nums">
          © 2026 CineMind AI. High-End Data Product.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
