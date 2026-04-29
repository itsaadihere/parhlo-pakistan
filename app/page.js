"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AuthModal from '@/app/components/AuthModal';
import { 
  X, 
  CreditCard,
  ChevronRight, 
  PlayCircle, 
  Star, 
  Globe, 
  ShieldCheck, 
  Users
} from 'lucide-react';

import { supabase } from '@/utils/supabase';

export default function ParhloPakistan() {
  const router = useRouter();
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [transactionId, setTransactionId] = useState('');
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleLoginSuccess = (isAdmin) => {
    setShowAuthModal(false);
    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isAdmin = window.localStorage.getItem('parhloAdmin') === 'true';
      const email = window.localStorage.getItem('currentUserEmail');
      if (isAdmin) setUserRole('admin');
      else if (email) setUserRole('student');

      fetchFeaturedCourses();
    }
  }, []);

  const fetchFeaturedCourses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('courses')
      .select('name, slug, thumbnail, price, students, rating, tag')
      .limit(3)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching featured courses:', error);
      // Fallback to empty if DB fails
      setFeaturedCourses([]);
    } else if (data && data.length > 0) {
      const mappedCourses = data.map(course => ({
        title: course.name,
        slug: course.slug,
        thumbnail: course.thumbnail,
        price: course.price || '0',
        students: course.students || '0',
        rating: course.rating || '5.0',
        tag: course.tag || 'New'
      }));
      setFeaturedCourses(mappedCourses);
    } else {
      setFeaturedCourses([]);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        initialMode={authMode}
        onLoginSuccess={handleLoginSuccess}
      />
      
      {showPaymentModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full relative shadow-2xl border border-gray-100">
            <button onClick={() => setShowPaymentModal(null)} className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"><X /></button>
            <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 mb-6"><CreditCard size={28} /></div>
            <h3 className="text-2xl font-black mb-1 text-slate-900">Get {showPaymentModal.title}</h3>
            <p className="text-gray-500 mb-8 text-sm font-medium">Send <span className="font-bold text-gray-900 text-lg">Rs. {showPaymentModal.price}</span> to the details below.</p>
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8">
              <p className="text-[10px] text-green-600 font-black uppercase tracking-widest mb-1">EasyPaisa / JazzCash</p>
              <p className="text-xl font-mono text-gray-900 font-bold tracking-tight">03xx-xxxxxxx</p>
              <p className="text-xs text-gray-400 mt-1">Title: Syed Saad</p>
            </div>
            <input type="text" placeholder="Enter Transaction ID" className="w-full bg-white border border-gray-200 p-4 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-green-500 font-medium" value={transactionId} onChange={(e) => setTransactionId(e.target.value)} />
            <button onClick={() => setShowPaymentModal(null)} className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-green-600 transition-all shadow-xl">ACTIVATE NOW</button>
          </div>
        </div>
      )}
      
      <nav className="border-b border-gray-100 flex justify-between items-center bg-white/90 backdrop-blur-md sticky top-0 z-50 p-4">
        <div className="pl-8">
          <Link href="/">
            <img src="/logo.png" alt="Parhlo Pakistan Logo" className="h-20 w-auto object-contain cursor-pointer" />
          </Link>
        </div>
        <div className="hidden md:flex gap-10 text-sm font-bold text-gray-600">
          <Link href="/" className="text-green-600 transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-green-600 transition-colors cursor-pointer">Courses</Link>
          <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
        </div>
        {userRole === 'admin' ? (
          <Link href="/admin" className="mr-4">
            <button className="bg-[#064e3b] text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg">
              Admin Panel
            </button>
          </Link>
        ) : userRole === 'student' ? (
          <Link href="/dashboard" className="mr-4">
            <button className="bg-green-600 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-700 transition-all shadow-lg">
              My Dashboard
            </button>
          </Link>
        ) : (
          <button 
            onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
          >
            Join Now
          </button>
        )}
      </nav>

      <header className="max-w-6xl mx-auto px-8 py-20 md:py-32 text-center">
        <div className="inline-block px-5 py-2 bg-white border border-gray-200 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-500 mb-8 shadow-sm">
          🚀 Pakistan's High-Impact Skill Platform
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-10 leading-[0.85] text-gray-900">
          LEARN. EARN. <br /><span className="text-green-600">REPEAT.</span>
        </h1>
        <p className="text-gray-500 text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed">
          Professional courses built for the next generation of Pakistani digital experts.
        </p>
        <Link href="/courses">
          <button className="bg-gray-900 text-white px-12 py-5 rounded-full font-black text-lg hover:bg-green-600 transition-all shadow-2xl hover:-translate-y-1">
            Browse Courses
          </button>
        </Link>
      </header>

      <section className="max-w-6xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-32">
        {[
          { label: 'Students', val: '5,000+', icon: <Users size={22}/> },
          { label: 'Courses', val: '12+', icon: <PlayCircle size={22}/> },
          { label: 'Success Rate', val: '94%', icon: <ShieldCheck size={22}/> },
          { label: 'Global reach', val: '12', icon: <Globe size={22}/> }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 md:p-8 rounded-[2rem] border border-gray-100 text-center shadow-sm">
            <div className="text-green-600 flex justify-center mb-3">{stat.icon}</div>
            <div className="text-xl md:text-2xl font-black text-gray-900 break-words">{stat.val}</div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">{stat.label}</div>
          </div>
        ))}
      </section>

      <section className="max-w-6xl mx-auto px-8 pb-40">
        <div className="flex justify-between items-end mb-16">
          <h2 className="text-5xl font-black tracking-tight text-gray-900">Featured Courses</h2>
          <Link href="/courses" className="text-gray-900 font-bold flex items-center gap-2 hover:text-green-600 transition-colors">
            View All <ChevronRight size={20} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {featuredCourses.map((course, i) => (
            <div key={i} className="bg-white rounded-[3rem] border border-gray-100 overflow-hidden group hover:shadow-2xl transition-all duration-500">
              <div className="h-56 relative bg-gradient-to-br from-slate-900 via-slate-700 to-green-600 flex items-center justify-center overflow-hidden">
                {course.thumbnail && (
                  <img src={course.thumbnail} alt={course.title} className="absolute inset-0 w-full h-full object-cover" />
                )}
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute top-6 left-6 z-10">
                  <span className="bg-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm">{course.tag}</span>
                </div>
                <PlayCircle size={60} className="text-white opacity-40 group-hover:opacity-80 transition-all group-hover:scale-110 z-10 relative" />
              </div>
              <div className="p-10">
                <div className="flex items-center gap-2 mb-4">
                  <Star size={16} className="text-yellow-400" fill="currentColor" />
                  <span className="text-xs font-bold text-gray-400">{course.rating || '5.0'} • {course.students || '0'} Students</span>
                </div>
                <h3 className="text-2xl font-black mb-10 leading-tight group-hover:text-green-600 transition-colors">{course.title}</h3>
                <div className="flex justify-between items-center pt-6 border-t border-gray-50">
                  <span className="text-2xl font-black text-gray-900">Rs. {course.price}</span>
                  <Link href={`/courses/${course.slug}`}>
                    <button className="bg-gray-100 hover:bg-[#064e3b] hover:text-white px-8 py-3 rounded-2xl font-black transition-all text-gray-900 uppercase text-[10px] tracking-widest">
                      Detail
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="bg-white border-t border-gray-200 pt-16 pb-10">
        <div className="max-w-6xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="col-span-2">
              <img src="/logo.png" alt="Logo" className="h-16 mb-6" />
              <p className="text-gray-500 max-w-sm leading-relaxed font-medium">
                Empowering the youth of Pakistan with digital skills that matter. Join the revolution of online learning today.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Quick Links</h4>
              <ul className="space-y-4 text-gray-500 text-sm font-semibold">
                <li><Link href="/courses" className="hover:text-green-600 cursor-pointer">Browse Courses</Link></li>
                <li className="hover:text-green-600 cursor-pointer">Privacy Policy</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-6 uppercase tracking-wider text-xs">Support</h4>
              <p className="text-gray-500 text-sm font-semibold">help@parhlopakistan.com</p>
            </div>
          </div>
          <div className="pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-[10px] uppercase tracking-[0.2em] font-black mb-2">Designed & Developed by</p>
            <a href="https://mockup.media" target="_blank" rel="noopener noreferrer" className="inline-block text-gray-400 hover:text-green-600 transition-all font-light text-base">
              Mockup Media (SMC-Private) Limited
            </a>
            <p className="mt-4 text-black text-[10px] font-bold">© 2026 Parhlo Pakistan. All Rights Reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}