"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  PlayCircle, 
  Star, 
  Search,
  Filter,
  ChevronRight
} from 'lucide-react';

export default function AllCourses() {
  // Local state for the "Join Now" trigger if you want to keep it consistent with Home
  const [showAuthModal, setShowAuthModal] = useState(false);

  const allCourses = [
    { title: 'WordPress Mastery', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller' },
    { title: 'Excel for Accountants', price: '1,500', students: '850', rating: '4.8', tag: 'New' },
    { title: 'Python Programming', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending' },
    { title: 'FSc Math Board Exam Prep', price: '1,999', students: '3.4k', rating: '4.7', tag: 'Academic' },
    { title: 'Modern Web Development', price: '5,999', students: '500', rating: '4.9', tag: 'Advanced' },
    { title: 'Graphic Design Basics', price: '1,200', students: '1.1k', rating: '4.6', tag: 'Creative' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      
      {/* SHARED HEADER - MATCHES HOME/ABOUT */}
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
          onClick={() => { /* Logic to open modal if shared */ }}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
        >
          Join Now
        </button>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16">
        {/* Page Title & Intro */}
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-4">Explore All Courses</h2>
          <p className="text-gray-500 font-medium max-w-xl">Master the most in-demand digital skills in Pakistan with our expert-led curriculum.</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 mb-16">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-4 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for a skill (e.g. WordPress, Math...)" 
              className="w-full bg-white border border-gray-100 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-green-500 shadow-sm font-medium"
            />
          </div>
          <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 px-8 py-4 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm">
            <Filter size={20}/> Filters
          </button>
        </div>

        {/* Course Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allCourses.map((course, i) => (
            <div key={i} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="h-56 bg-gray-100 flex items-center justify-center relative">
                <div className="absolute top-6 left-6">
                  <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm">{course.tag}</span>
                </div>
                <PlayCircle size={60} className="text-white opacity-40 group-hover:opacity-80 transition-all group-hover:scale-110" />
              </div>
              <div className="p-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-bold text-gray-400">{course.rating} • {course.students} Students</span>
                </div>
                <h3 className="text-2xl font-black mb-10 leading-tight group-hover:text-green-600 transition-colors">{course.title}</h3>
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">Rs. {course.price}</span>
                  <Link href={`/courses/${course.title.toLowerCase().replace(/ /g, '-')}`}>
                    <button className="bg-gray-100 hover:bg-[#064e3b] hover:text-white px-8 py-3 rounded-2xl font-black transition-all text-gray-900 uppercase text-[10px] tracking-widest">
                      Detail
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* FOOTER - MATCHES HOME */}
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