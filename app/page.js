"use client";

import React, { useState } from 'react';
import { Lock, Play, Upload, CheckCircle } from 'lucide-react';

export default function ParhloPakistan() {
// This is a simplified version of your main logic
  const [isAdmin, setIsAdmin] = useState(false); // Toggle for demo purposes

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans">
      {/* Navigation */}
      <nav className="p-6 border-b border-purple-500/20 flex justify-between items-center">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
          PARHLO PAKISTAN
        </h1>
        <button className="bg-purple-600 hover:bg-purple-700 px-6 py-2 rounded-full transition-all">
          Logout
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-8">
        {isAdmin ? (
          /* ADMIN INTERFACE */
          <div className="space-y-8">
            <h2 className="text-3xl font-extrabold italic">ADMIN CONTROL CENTER</h2>
            <div className="bg-[#1e293b] p-8 rounded-2xl border border-purple-500/30 shadow-xl">
              <h3 className="text-xl mb-4 flex items-center gap-2"><Upload /> Upload New Lecture</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input className="bg-slate-700 p-3 rounded-lg" placeholder="Lecture Title" />
                <input className="bg-slate-700 p-3 rounded-lg" placeholder="Price (PKR)" />
                <input className="bg-slate-700 p-3 rounded-lg col-span-2" placeholder="Video URL (Vimeo/YouTube)" />
                <button className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg font-bold">PUBLISH LECTURE</button>
              </div>
            </div>
          </div>
        ) : (
          /* STUDENT INTERFACE */
          <div className="space-y-8">
            <header className="text-center space-y-4">
              <h2 className="text-5xl font-black tracking-tighter">SKILL UP, <span className="text-purple-500">PAKISTAN.</span></h2>
              <p className="text-slate-400">Premium education at your fingertips.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Example Course Card */}
              <div className="bg-[#1e293b] rounded-3xl overflow-hidden border border-slate-700 hover:border-purple-500 transition-all group">
                <div className="h-48 bg-slate-800 flex items-center justify-center">
                   <Lock className="text-slate-500 group-hover:text-purple-500 transition-all" size={48} />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">WordPress Mastery 2026</h3>
                  <p className="text-slate-400 text-sm mt-2">Learn to build professional websites.</p>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-2xl font-bold text-pink-500">Rs. 2,500</span>
                    <button className="bg-white text-black px-4 py-2 rounded-lg font-bold hover:bg-purple-500 hover:text-white transition-all">
                      BUY NOW
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}