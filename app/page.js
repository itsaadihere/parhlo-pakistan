"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  X, 
  CreditCard, 
  ChevronRight, 
  PlayCircle, 
  Star, 
  Globe, 
  ShieldCheck, 
  Users,
  Mail,
  Lock,
  User
} from 'lucide-react';

export default function ParhloPakistan() {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [transactionId, setTransactionId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  const courses = [
    { title: 'WordPress Mastery', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller' },
    { title: 'Excel for Accountants', price: '1,500', students: '850', rating: '4.8', tag: 'New' },
    { title: 'Python Programming', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending' }
  ];

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (email === "binmusharrafsyedsaad@gmail.com" && password === "SyedSaadi@97") {
      setIsAdmin(true);
      setShowAuthModal(false);
    } else {
      alert("Login successful!");
      setShowAuthModal(false);
    }
  };

  const AdminDashboard = () => (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <img src="/logo.png" alt="Logo" className="h-8" />
          <span className="font-bold text-green-800">Admin</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {[
            { name: 'Dashboard', icon: <Globe size={20}/>, active: true },
            { name: 'Courses', icon: <PlayCircle size={20}/> },
            { name: 'Payments', icon: <CreditCard size={20}/> },
            { name: 'Settings', icon: <ShieldCheck size={20}/> },
          ].map((item) => (
            <button key={item.name} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${item.active ? 'bg-[#064e3b] text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        <button onClick={() => setIsAdmin(false)} className="m-6 flex items-center gap-3 px-4 py-3 text-gray-500 font-bold text-sm hover:text-red-600 transition-colors">
          <X size={20}/> Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10">
        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium">Welcome back. Here's what's happening today.</p>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Total Revenue', val: 'PKR 0', color: 'bg-green-50 text-green-600' },
            { label: 'Total Students', val: '2', color: 'bg-blue-50 text-blue-600' },
            { label: 'Active Courses', val: '6', color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Total Enrollments', val: '-', color: 'bg-purple-50 text-purple-600' },
          ].map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
              <div className={`p-4 rounded-2xl ${stat.color}`}><CreditCard size={24}/></div>
              <div>
                <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-gray-900">{stat.val}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-8">
          <div className="bg-[#064e3b] rounded-[2.5rem] p-10 text-white flex flex-col justify-between">
            <div>
              <PlayCircle size={40} className="mb-6 opacity-80" />
              <h2 className="text-xl font-bold mb-2">Pending Approvals</h2>
              <p className="text-5xl font-black mb-4">3</p>
              <p className="text-emerald-200/60 text-sm font-medium">Payments waiting for verification.</p>
            </div>
            <button className="w-full bg-white text-[#064e3b] py-4 rounded-2xl font-black mt-8 hover:bg-emerald-50 transition-all">
              Review Payments
            </button>
          </div>

          <div className="col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
            <h3 className="text-xl font-black mb-6">Recent Activity</h3>
            <div className="space-y-6">
              {[
                { email: 'saadi@mockup.media', amount: '1,999', course: 'FSc Math Board Exam Prep', date: '4/23/2026' },
                { email: 'binmusharrafsyedsaad@gmail.com', amount: '1,999', course: 'FSc Math Board Exam Prep', date: '4/23/2026' },
                { email: 'saadi@mockup.media', amount: '5,999', course: 'Modern Web Development with React', date: '4/22/2026' },
              ].map((activity, i) => (
                <div key={i} className="flex justify-between items-center pb-6 border-b border-gray-50 last:border-0">
                  <div className="flex gap-4 items-center">
                    <div className="w-10 h-10 bg-amber-50 rounded-full flex items-center justify-center text-amber-600"><CreditCard size={18}/></div>
                    <div>
                      <p className="font-bold text-sm text-gray-900">Payment pending — Rs. {activity.amount}</p>
                      <p className="text-xs text-gray-400">{activity.email} • {activity.course}</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-gray-400">{activity.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );

  const AuthModal = () => (
    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white p-10 rounded-[2.5rem] max-w-md w-full relative shadow-2xl border border-gray-100">
        <button 
          onClick={() => setShowAuthModal(false)} 
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>
        
        <div className="mb-8 text-center">
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">
            {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h3>
          <p className="text-gray-500 text-sm font-medium mt-2">
            {authMode === 'login' ? 'Continue your learning journey' : 'Join Pakistan’s elite skill platform'}
          </p>
        </div>

        <button className="w-full mb-6 flex items-center justify-center gap-3 bg-white border border-gray-200 py-4 rounded-xl font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {authMode === 'login' ? 'Login with Google' : 'Sign up with Google'}
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-white px-4 text-gray-400 font-bold tracking-widest">Or with email</span></div>
        </div>

        <form className="space-y-4" onSubmit={handleLogin}>
          {authMode === 'signup' && (
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={20} />
              <input type="text" placeholder="Full Name" className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
            </div>
          )}
          <div className="relative">
            <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
            <input name="email" type="email" required placeholder="Email Address" className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
          </div>
          <div className="relative">
            <Lock className="absolute left-4 top-4 text-gray-400" size={20} />
            <input name="password" type="password" required placeholder="Password" className="w-full bg-gray-50 border border-gray-200 p-4 pl-12 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium" />
          </div>

          <button type="submit" className="w-full bg-gray-900 text-white py-4 rounded-xl font-black hover:bg-green-600 transition-all shadow-xl mt-4 uppercase tracking-wider">
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-500 font-medium">
            {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
              className="ml-2 text-green-600 font-bold hover:underline"
            >
              {authMode === 'login' ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );

  if (isAdmin) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      {showAuthModal && <AuthModal />}
      
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
          <Link href="/" className="hover:text-green-600 transition-colors">Home</Link>
          <Link href="/courses" className="hover:text-green-600 transition-colors cursor-pointer">Courses</Link>
          <Link href="/about" className="hover:text-green-600 transition-colors">About</Link>
        </div>
        <button 
          onClick={() => { setAuthMode('signup'); setShowAuthModal(true); }}
          className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
        >
          Join Now
        </button>
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
          {courses.map((course, i) => (
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
                  <button 
                    onClick={() => setShowPaymentModal(course)}
                    className="bg-gray-100 hover:bg-green-600 hover:text-white px-8 py-3 rounded-2xl font-bold transition-all text-gray-900"
                  >
                    Enroll
                  </button>
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
                <li className="hover:text-green-600 cursor-pointer">Become an Instructor</li>
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