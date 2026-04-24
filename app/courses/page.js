"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/app/components/AuthModal';
import { 
  PlayCircle, 
  Star, 
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

export default function AllCourses() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const courses = [
    { title: 'WordPress Mastery', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller', slug: 'wordpress-mastery', imageClass: 'from-slate-900 via-slate-700 to-green-600', description: 'Launch professional WordPress websites and start freelancing with a proven workflow.' },
    { title: 'Excel for Accountants', price: '1,500', students: '850', rating: '4.8', tag: 'New', slug: 'excel-for-accountants', imageClass: 'from-emerald-900 via-emerald-700 to-lime-500', description: 'Build fast accounting workflows with Excel and prepare client-ready financial reports.' },
    { title: 'Python Programming', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending', slug: 'python-programming', imageClass: 'from-sky-900 via-sky-600 to-cyan-400', description: 'Master Python scripting, automation, and practical programming skills for digital work.' },
    { title: 'Modern Web Development', price: '5,999', students: '500', rating: '4.9', tag: 'Advanced', slug: 'modern-web-development', imageClass: 'from-indigo-900 via-violet-700 to-fuchsia-500', description: 'Learn modern web development practices to build real websites and web apps.' },
    { title: 'Graphic Design Basics', price: '1,200', students: '1.1k', rating: '4.6', tag: 'Creative', slug: 'graphic-design-basics', imageClass: 'from-rose-900 via-pink-700 to-orange-400', description: 'Design eye-catching visuals, social posts, and brand content with confidence.' },
    { title: 'Data Science Fundamentals', price: '3,500', students: '1.8k', rating: '4.7', tag: 'Professional', slug: 'data-science-fundamentals', imageClass: 'from-slate-900 via-blue-700 to-emerald-400', description: 'Use data analysis and visualization to make smarter decisions in business.' },
    { title: 'Social Media Marketing', price: '2,200', students: '1.4k', rating: '4.6', tag: 'Business', slug: 'social-media-marketing', imageClass: 'from-amber-900 via-orange-600 to-red-400', description: 'Grow brands and campaigns with practical social media marketing skills.' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      <nav className="border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="pl-8">
          <Link href="/">
            <img src="/logo.png" alt="Parhlo Pakistan Logo" className="h-20 w-auto object-contain cursor-pointer" />
          </Link>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-bold text-gray-600">
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link href="/courses" className="text-green-600 transition-colors cursor-pointer">Courses</Link>
          <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
        </div>
        <button 
          onClick={() => setShowAuthModal(true)}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
        >
          Join Now
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-4">Available Courses</h2>
          <p className="text-gray-500 font-medium max-w-xl">Explore our professional course catalog designed for fast career growth and practical skill development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {courses.map((course, i) => (
            <div key={i} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className={`h-56 overflow-hidden relative bg-gradient-to-br ${course.imageClass}`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm">{course.tag}</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 z-10">
                  <h3 className="text-2xl font-black text-white leading-tight">{course.title}</h3>
                </div>
              </div>
              <div className="p-10 pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-bold text-gray-400">{course.rating} • {course.students} Students</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">Rs. {course.price}</span>
                  <Link href={`/courses/${course.slug}`}>
                    <button className="bg-gray-100 hover:bg-[#064e3b] hover:text-white px-8 py-3 rounded-2xl font-black transition-all text-gray-900 uppercase text-[10px] tracking-widest">
                      View Course
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="signup"
        />
      )}

      <footer className="bg-white border-t border-gray-200 pt-16 pb-10 mt-20">
        <div className="max-w-6xl mx-auto px-8 text-center">
           <img src="/logo.png" alt="Logo" className="h-16 mb-6 mx-auto" />
           <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Designed & Developed by</p>
            <a href="https://mockup.media" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400 hover:text-green-600 transition-all font-light text-base mb-6">
              Mockup Media (SMC-Private) Limited
            </a>
            <p className="text-black text-[10px] font-bold">© 2026 Parhlo Pakistan. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
}
