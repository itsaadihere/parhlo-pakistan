"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  CreditCard, 
  ChevronRight, 
  PlayCircle, 
  Star, 
  Search,
  Filter,
  Clock,
  BookOpen
} from 'lucide-react';

export default function CoursesPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [transactionId, setTransactionId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const allCourses = [
    { id: 1, title: 'WordPress Mastery', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller', duration: '8 Weeks', category: 'Development' },
    { id: 2, title: 'Excel for Accountants', price: '1,500', students: '850', rating: '4.8', tag: 'New', duration: '4 Weeks', category: 'Finance' },
    { id: 3, title: 'Python Programming', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending', duration: '10 Weeks', category: 'Data Science' },
    { id: 4, title: 'Digital Marketing Pro', price: '2,000', students: '900', rating: '4.7', tag: 'Popular', duration: '6 Weeks', category: 'Marketing' },
    { id: 5, title: 'UI/UX Design Basics', price: '2,800', students: '1.5k', rating: '4.9', tag: 'Bestseller', duration: '8 Weeks', category: 'Design' },
    { id: 6, title: 'Freelancing Success', price: '1,000', students: '3k', rating: '4.8', tag: 'Essential', duration: '3 Weeks', category: 'Business' },
  ];

  const filteredCourses = allCourses.filter(course => 
    course.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const LandingNav = () => (
    <nav className="border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4">
      <div className="pl-8">
        <Link href="/">
          <img src="/logo.png" alt="Logo" className="h-20 w-auto object-contain cursor-pointer" />
        </Link>
      </div>
      <div className="hidden md:flex gap-10 text-sm font-bold text-gray-600">
        <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
        <Link href="/courses" className="text-green-600">Courses</Link>
        <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
      </div>
      <button className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all mr-4">
        Join Now
      </button>
    </nav>
  );

  const Footer = () => (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-10 mt-20">
      <div className="max-w-6xl mx-auto px-8 text-center">
        <img src="/logo.png" alt="Logo" className="h-16 mx-auto mb-6" />
        <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Designed & Developed by</p>
        <a href="https://mockup.media" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400 hover:text-green-600 transition-all font-light text-base">
          Mockup Media (SMC-Private) Limited
        </a>
        <p className="mt-4 text-black text-[10px] font-medium">© 2026 Parhlo Pakistan. All Rights Reserved.</p>
      </div>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full relative shadow-2xl border border-gray-100">
            <button onClick={() => setShowPaymentModal(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900"><X /></button>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6"><CreditCard size={28} /></div>
            <h3 className="text-2xl font-black mb-1">Enroll in {showPaymentModal.title}</h3>
            <p className="text-gray-500 mb-8 text-sm">Send <span className="font-bold text-gray-900">Rs. {showPaymentModal.price}</span> to 03xx-xxxxxxx (Syed Saad)</p>
            <input type="text" placeholder="Transaction ID" className="w-full border border-gray-200 p-4 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-green-500" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            <button onClick={() => { alert("Verifying..."); setShowPaymentModal(null); }} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-green-600 transition-all">ACTIVATE NOW</button>
          </div>
        </div>
      )}

      <LandingNav />

      {/* Header & Search */}
      <section className="max-w-6xl mx-auto px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 uppercase">Explore <span className="text-green-600">Skills</span></h1>
          <p className="text-gray-500 font-medium max-w-xl mx-auto">High-impact curriculum designed to turn beginners into professionals. Your career starts here.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 mb-12">
          <div className="relative w-full md:w-2/3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="What do you want to learn?" 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-gray-50 border-none focus:ring-2 focus:ring-green-500 font-medium transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold w-full md:w-auto justify-center hover:bg-green-600 transition-all">
            <Filter size={18} /> Filters
          </button>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="h-48 bg-gray-100 flex items-center justify-center relative">
                <span className="absolute top-6 left-6 bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm">{course.tag}</span>
                <PlayCircle size={48} className="text-white opacity-40 group-hover:opacity-100 transition-all scale-110" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Clock size={14}/> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen size={14}/> {course.category}</span>
                </div>
                <h3 className="text-2xl font-black mb-6 leading-tight min-h-[64px]">{course.title}</h3>
                <div className="flex items-center gap-2 mb-6">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-sm font-bold text-gray-900">{course.rating}</span>
                  <span className="text-sm text-gray-400 font-medium">({course.students})</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">Rs. {course.price}</span>
                  <button 
                    onClick={() => setShowPaymentModal(course)}
                    className="bg-gray-100 hover:bg-green-600 hover:text-white px-6 py-3 rounded-xl font-bold transition-all"
                  >
                    Enroll
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredCourses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 font-bold text-xl">No courses found matching your search.</p>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
}