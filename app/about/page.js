"use client";

import React, { useState } from 'react'; // Added useState
import Link from 'next/link';
import AuthModal from '@/app/components/AuthModal'; // Import your AuthModal component
import { 
  Users, 
  Target, 
  Rocket, 
  ShieldCheck, 
  Heart, 
  Award,
  ChevronRight
} from 'lucide-react';

export default function AboutPage() {
  // State to control the visibility of the login/signup popup
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleJoin = () => {
    setShowAuthModal(true); // Triggers the modal to open
  };

  const LandingNav = () => (
    <nav className="border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4">
      <div className="pl-8">
        <Link href="/">
          <img 
            src="/logo.png" 
            alt="Parhlo Pakistan Logo" 
            className="h-20 w-auto object-contain cursor-pointer" 
          />
        </Link>
      </div>
      
      <div className="hidden md:flex gap-10 text-sm font-bold text-gray-600">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
        <Link href="/courses" className="hover:text-green-600 transition-colors cursor-pointer">Courses</Link>
        <Link href="/about" className="text-green-600 transition-colors">About</Link>
      </div>
      
      <button 
        onClick={handleJoin}
        className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
      >
        Join Now
      </button>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-10 mt-20">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-6" />
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
          Designed & Developed by
        </p>
        <a 
          href="https://mockup.media" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block text-gray-400 hover:text-green-600 transition-all font-light text-base mb-6"
        >
          Mockup Media (SMC-Private) Limited
        </a>
        <p className="text-black text-[10px] font-bold">© 2026 Parhlo Pakistan. All Rights Reserved.</p>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      <LandingNav />

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-8 py-20 md:py-32 text-center">
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
          OUR <span className="text-green-600">MISSION.</span>
        </h1>
        <p className="text-xl text-gray-500 font-medium leading-relaxed">
          We aren't just an EdTech platform. We are a movement dedicated to bridging the gap 
          between traditional education and the modern digital economy for the youth of Pakistan.
        </p>
      </section>

      {/* Core Values Grid */}
      <section className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {[
          { 
            title: "Expert Mentorship", 
            desc: "Learn directly from industry leaders who have already paved the way in freelancing and tech.",
            icon: <Users className="text-green-600" size={32} />
          },
          { 
            title: "Result Oriented", 
            desc: "Our courses are designed to help you start earning within weeks, not years.",
            icon: <Target className="text-green-600" size={32} />
          },
          { 
            title: "Innovation First", 
            desc: "We stay ahead of the curve, teaching the latest tools like AI, WordPress, and Finance.",
            icon: <Rocket className="text-green-600" size={32} />
          }
        ].map((value, i) => (
          <div key={i} className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-500">
            <div className="mb-6 bg-green-50 w-16 h-16 rounded-2xl flex items-center justify-center">
              {value.icon}
            </div>
            <h3 className="text-2xl font-black mb-4">{value.title}</h3>
            <p className="text-gray-500 font-medium leading-relaxed">{value.desc}</p>
          </div>
        ))}
      </section>

      {/* Story Section */}
      <section className="bg-white py-32 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
          <div className="relative">
            <div className="aspect-square bg-gray-100 rounded-[4rem] overflow-hidden">
               <div className="w-full h-full flex items-center justify-center text-gray-300 font-black text-2xl italic">
                 Parhlo Pakistan HQ
               </div>
            </div>
            <div className="absolute -bottom-10 -right-10 bg-green-600 text-white p-10 rounded-[2.5rem] hidden md:block">
              <p className="text-4xl font-black italic">5,000+</p>
              <p className="text-xs font-bold uppercase tracking-widest opacity-80">Students Empowered</p>
            </div>
          </div>
          
          <div>
            <h2 className="text-5xl font-black tracking-tight mb-8">Why We Started</h2>
            <div className="space-y-6 text-gray-500 font-medium leading-relaxed">
              <p>
                In a rapidly changing world, traditional degrees are often not enough. Pakistan has the 
                world's third-largest freelance community, yet many struggle to find proper guidance.
              </p>
              <p>
                Parhlo Pakistan was born to change that. We provide high-quality, Urdu-based professional 
                training that focuses on practical skills over theory.
              </p>
              <div className="pt-6 grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-green-600" />
                  <span className="text-sm font-bold text-gray-900">Secure Payments</span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="text-green-600" />
                  <span className="text-sm font-bold text-gray-900">Certified Courses</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="max-w-4xl mx-auto px-8 py-32 text-center">
        <Heart className="mx-auto text-red-500 mb-8" size={48} fill="currentColor" />
        <h2 className="text-4xl font-black mb-8">Ready to grow with us?</h2>
        <button 
          onClick={handleJoin}
          className="bg-gray-900 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-green-600 transition-all shadow-2xl"
        >
          Join the Community
        </button>
      </section>

      <Footer />

      {/* ACTUAL MODAL RENDERING: This is what was missing */}
      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
        />
      )}
    </div>
  );
}