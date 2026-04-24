"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AuthModal from '@/app/components/AuthModal'; // Path depends on your structure
import { 
  X, 
  CreditCard,
  ChevronRight, 
  PlayCircle, 
  Star, 
  Globe, 
  ShieldCheck, 
  Users,
  Plus
} from 'lucide-react';

export default function ParhloPakistan() {
  const [showPaymentModal, setShowPaymentModal] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [transactionId, setTransactionId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState(null);
  const [adminCourses, setAdminCourses] = useState([
    { title: 'WordPress Mastery', slug: 'wordpress-mastery', category: 'Web Development', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller' },
    { title: 'Excel for Accountants', slug: 'excel-for-accountants', category: 'Finance & Accounting', price: '1,500', students: '850', rating: '4.8', tag: 'New' },
    { title: 'Python Programming', slug: 'python-programming', category: 'Software', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending' },
    { title: 'Modern Web Development', slug: 'modern-web-development', category: 'Web Development', price: '5,999', students: '500', rating: '4.9', tag: 'Advanced' },
    { title: 'Graphic Design Basics', slug: 'graphic-design-basics', category: 'Design', price: '1,200', students: '1.1k', rating: '4.6', tag: 'Creative' },
    { title: 'Data Science Fundamentals', slug: 'data-science-fundamentals', category: 'Data Science', price: '3,500', students: '1.8k', rating: '4.7', tag: 'Professional' },
    { title: 'Social Media Marketing', slug: 'social-media-marketing', category: 'Marketing', price: '2,200', students: '1.4k', rating: '4.6', tag: 'Business' }
  ]);
  const [newCourse, setNewCourse] = useState({ title: '', slug: '', category: '', price: '', tag: 'New', students: '0', rating: '0' });

  const handleAddCourse = (e) => {
    e.preventDefault();
    if (!newCourse.title || !newCourse.slug) return;
    setAdminCourses((prev) => [...prev, newCourse]);
    setNewCourse({ title: '', slug: '', category: '', price: '', tag: 'New', students: '0', rating: '0' });
    setShowAddCourseForm(false);
  };

  const handleDeleteCourse = (course) => {
    setPendingDeleteCourse(course);
  };

  const confirmDeleteCourse = () => {
    if (!pendingDeleteCourse) return;
    setAdminCourses((prev) => prev.filter((course) => course.slug !== pendingDeleteCourse.slug));
    setPendingDeleteCourse(null);
  };

  const cancelDeleteCourse = () => {
    setPendingDeleteCourse(null);
  };

  const courses = [
    { title: 'WordPress Mastery', price: '2,500', students: '1.2k', rating: '4.9', tag: 'Bestseller' },
    { title: 'Excel for Accountants', price: '1,500', students: '850', rating: '4.8', tag: 'New' },
    { title: 'Python Programming', price: '3,000', students: '2.1k', rating: '5.0', tag: 'Trending' }
  ];

  const handleLoginSuccess = (adminStatus) => {
    setIsAdmin(adminStatus);
    setShowAuthModal(false);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAdmin = window.localStorage.getItem('parhloAdmin') === 'true';
      setIsAdmin(savedAdmin);

      const storedCourses = JSON.parse(window.localStorage.getItem('adminCourses') || '[]');
      if (storedCourses.length) {
        const persistedCourseData = storedCourses.map((course) => ({
          title: course.name,
          slug: course.slug,
          category: course.category || 'Uncategorized',
          price: course.price || '0',
          students: course.students || '0',
          rating: course.rating || '0',
          tag: course.tag || 'New',
        }));

        setAdminCourses((prev) => {
          const existingSlugs = new Set(prev.map((item) => item.slug));
          return [
            ...prev,
            ...persistedCourseData.filter((item) => !existingSlugs.has(item.slug)),
          ];
        });
      }
    }
  }, []);

  const AdminDashboard = () => {
    const menuItems = [
      { name: 'Dashboard', icon: <Globe size={20}/>, id: 'dashboard' },
      { name: 'Courses', icon: <PlayCircle size={20}/>, id: 'courses' },
      { name: 'Payments', icon: <CreditCard size={20}/>, id: 'payments' },
      { name: 'Settings', icon: <ShieldCheck size={20}/>, id: 'settings' }
    ];

    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
          <div className="p-6 flex items-center gap-3">
            <img src="/logo.png" alt="Logo" className="h-8" />
            <span className="font-bold text-green-800">Admin</span>
          </div>
          <nav className="flex-1 px-4 space-y-2 mt-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAdminTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${adminTab === item.id ? 'bg-[#064e3b] text-white' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {item.icon} {item.name}
              </button>
            ))}
          </nav>
          <button onClick={() => setIsAdmin(false)} className="m-6 flex items-center gap-3 px-4 py-3 text-gray-500 font-bold text-sm hover:text-red-600 transition-colors">
            <X size={20}/> Sign Out
          </button>
        </aside>

        <main className="flex-1 p-10">
          {adminTab === 'dashboard' && (
            <>
              <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
                <p className="text-gray-500 font-medium">Welcome back. Here's what's happening today.</p>
              </header>

              <div className="grid grid-cols-4 gap-6 mb-10">
                {[
                  { label: 'Total Revenue', val: 'PKR 0', color: 'bg-green-50 text-green-600' },
                  { label: 'Total Students', val: '2', color: 'bg-blue-50 text-blue-600' },
                  { label: 'Active Courses', val: String(adminCourses.length), color: 'bg-emerald-50 text-emerald-600' },
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
            </>
          )}

          {adminTab === 'courses' && (
            <div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-3xl font-black text-slate-900">Course Manager</h1>
                  <p className="text-gray-500 mt-2">Manage all courses listed on the site, add new entries, or remove outdated ones.</p>
                </div>
                <Link
                  href="/admin/add-course"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-black hover:bg-green-700 transition-all"
                >
                  <Plus size={16} /> Add New Course
                </Link>
              </div>

              {showAddCourseForm && (
                <form onSubmit={handleAddCourse} className="mb-8 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
                  <div className="grid gap-4 md:grid-cols-2">
                    <input value={newCourse.title} onChange={(e) => setNewCourse({ ...newCourse, title: e.target.value })} placeholder="Course title" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.slug} onChange={(e) => setNewCourse({ ...newCourse, slug: e.target.value })} placeholder="Slug (e.g. wordpress-mastery)" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.category} onChange={(e) => setNewCourse({ ...newCourse, category: e.target.value })} placeholder="Category" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.price} onChange={(e) => setNewCourse({ ...newCourse, price: e.target.value })} placeholder="Price" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.tag} onChange={(e) => setNewCourse({ ...newCourse, tag: e.target.value })} placeholder="Tag" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.students} onChange={(e) => setNewCourse({ ...newCourse, students: e.target.value })} placeholder="Students" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                    <input value={newCourse.rating} onChange={(e) => setNewCourse({ ...newCourse, rating: e.target.value })} placeholder="Rating" className="border border-gray-200 rounded-3xl p-4 outline-none focus:ring-2 focus:ring-green-500" />
                  </div>
                  <button type="submit" className="mt-6 bg-gray-900 text-white px-8 py-4 rounded-full font-black hover:bg-green-600 transition-all">
                    Save Course
                  </button>
                </form>
              )}

              <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
                <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-xs uppercase tracking-[0.2em] text-gray-500">
                  <div className="col-span-4">Course</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1">Price</div>
                  <div className="col-span-1">Students</div>
                  <div className="col-span-1">Rating</div>
                  <div className="col-span-2">Tag</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                {adminCourses.map((course) => (
                  <div key={course.slug} className="grid grid-cols-12 gap-4 px-6 py-5 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                    <div className="col-span-4 font-bold text-slate-900">{course.title}</div>
                    <div className="col-span-2 text-gray-500">{course.category}</div>
                    <div className="col-span-1 text-gray-500">Rs. {course.price}</div>
                    <div className="col-span-1 text-gray-500">{course.students}</div>
                    <div className="col-span-1 text-gray-500">{course.rating}</div>
                    <div className="col-span-2 text-gray-500">{course.tag}</div>
                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleDeleteCourse(course)}
                        className="text-red-600 font-bold hover:text-red-800"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {pendingDeleteCourse && (
                <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
                  <div className="w-full max-w-lg bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8">
                    <h2 className="text-2xl font-black text-slate-900 mb-3">Confirm delete</h2>
                    <p className="text-gray-500 mb-8">Do you want to delete <span className="font-bold text-slate-900">{pendingDeleteCourse.title}</span> from the course list?</p>
                    <div className="flex flex-col sm:flex-row gap-4 sm:justify-end">
                      <button
                        onClick={cancelDeleteCourse}
                        className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-all"
                      >
                        No
                      </button>
                      <button
                        onClick={confirmDeleteCourse}
                        className="w-full sm:w-auto px-6 py-3 rounded-full bg-red-600 text-white font-black hover:bg-red-700 transition-all"
                      >
                        Yes, delete
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {adminTab === 'payments' && (
            <div>
              <h1 className="text-3xl font-black mb-6">Payments</h1>
              <p className="text-gray-500">Payment management is coming soon.</p>
            </div>
          )}

          {adminTab === 'settings' && (
            <div>
              <h1 className="text-3xl font-black mb-6">Settings</h1>
              <p className="text-gray-500">Settings for admin controls will be available here.</p>
            </div>
          )}
        </main>
      </div>
    );
  };

  if (isAdmin) return <AdminDashboard />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-green-100">
      
      {/* Reusable Auth Modal */}
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