"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Globe,
  PlayCircle,
  CreditCard,
  Users,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { supabase } from '@/utils/supabase';

export default function TeacherDashboard() {
  const router = useRouter();
  const [isTeacher, setIsTeacher] = useState(false);
  const [teacherProfile, setTeacherProfile] = useState(null);
  const [courses, setCourses] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const role = window.localStorage.getItem('parhloRole');
    const email = window.localStorage.getItem('currentUserEmail');
    
    if (role !== 'teacher' || !email) {
      router.replace('/');
      return;
    }
    setIsTeacher(true);
    fetchTeacherData(email);
  }, []);

  const fetchTeacherData = async (email) => {
    setLoading(true);

    // 1. Fetch teacher profile to get their full_name
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('full_name, email')
      .eq('email', email)
      .single();

    if (userError || !user) {
      console.error('Error fetching user:', userError);
      setLoading(false);
      return;
    }
    setTeacherProfile(user);

    // 2. Fetch courses assigned to this teacher
    const { data: myCourses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .ilike('instructor', user.full_name); // Case-insensitive match on instructor name

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
      setLoading(false);
      return;
    }

    const courseSlugs = (myCourses || []).map(c => c.slug);
    
    // 3. Fetch all approved purchases for these courses
    let totalRev = 0;
    let studentsCount = 0;
    const enrichedCourses = [...(myCourses || [])];

    if (courseSlugs.length > 0) {
      const { data: purchases, error: purchasesError } = await supabase
        .from('purchases')
        .select('*')
        .in('course_slug', courseSlugs)
        .eq('status', 'approved');
        
      if (!purchasesError && purchases) {
        // Calculate per-course stats
        enrichedCourses.forEach(course => {
          const coursePurchases = purchases.filter(p => p.course_slug === course.slug);
          
          const originalPrice = parseFloat(String(course.price || '0').replace(/[^0-9.]/g, '')) || 0;
          const discountPercent = parseFloat(String(course.discount || '0').replace(/[^0-9.]/g, '')) || 0;
          const finalPrice = discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;
          
          const courseRevenue = coursePurchases.length * finalPrice;
          course.earnedRevenue = courseRevenue;
          course.enrolledStudents = coursePurchases.length;
          
          totalRev += courseRevenue;
          studentsCount += coursePurchases.length;
        });
      }
    }

    setCourses(enrichedCourses);
    setRevenue(totalRev);
    setTotalStudents(studentsCount);
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('parhloRole');
      window.localStorage.removeItem('currentUserEmail');
    }
    router.push('/');
  };

  if (!isTeacher) return null;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex-col hidden md:flex">
        <div className="p-6 flex items-center gap-3">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-10 logo-outline" />
          </Link>
          <span className="font-bold text-blue-800">Teacher</span>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all bg-blue-600 text-white">
            <Globe size={20} /> Dashboard
          </button>
        </nav>
        <button onClick={handleLogout} className="m-6 flex items-center gap-3 px-4 py-3 text-gray-500 font-bold text-sm hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen relative">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-500 hover:text-gray-900"><Menu size={24}/></button>
            <img src="/logo.png" alt="Logo" className="h-10 md:h-10 logo-outline" />
          </div>
          <button onClick={handleLogout} className="text-gray-500 hover:text-red-600"><LogOut size={20}/></button>
        </div>

        {/* Mobile Sidebar Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-[100] flex">
            <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col h-full relative z-10 shadow-2xl transition-transform">
              <button 
                onClick={() => setIsMobileMenuOpen(false)} 
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <div className="p-6 flex items-center gap-3">
                <Link href="/">
                  <img src="/logo.png" alt="Logo" className="h-10 logo-outline" />
                </Link>
                <span className="font-bold text-blue-800">Teacher</span>
              </div>
              <nav className="flex-1 px-4 space-y-2 mt-4">
                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all bg-blue-600 text-white">
                  <Globe size={20} /> Dashboard
                </button>
              </nav>
              <button onClick={handleLogout} className="m-6 flex items-center gap-3 px-4 py-3 text-gray-500 font-bold text-sm hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                <LogOut size={20} /> Sign Out
              </button>
            </aside>
          </div>
        )}

        <header className="mb-10">
          <h1 className="text-3xl font-black text-slate-900">Welcome, {teacherProfile?.full_name}</h1>
          <p className="text-gray-500 font-medium">Here is the overview of your courses and students.</p>
        </header>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className="p-4 rounded-2xl bg-blue-50 text-blue-600"><PlayCircle size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Your Courses</p>
                  <p className="text-xl font-black text-gray-900">{courses.length}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600"><Users size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Enrolled Students</p>
                  <p className="text-xl font-black text-gray-900">{totalStudents}</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                <div className="p-4 rounded-2xl bg-amber-50 text-amber-600"><CreditCard size={24} /></div>
                <div>
                  <p className="text-[10px] font-black uppercase text-gray-400 tracking-wider">Total Revenue Generated</p>
                  <p className="text-xl font-black text-gray-900">Rs. {revenue.toLocaleString()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                <PlayCircle className="text-blue-600" /> My Assigned Courses
              </h2>
              {courses.length === 0 ? (
                <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                  <PlayCircle size={40} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-medium">No courses have been assigned to you yet.</p>
                  <p className="text-xs text-gray-400 mt-2">The Admin will assign courses to your account.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {courses.map(course => (
                    <div key={course.slug} className="flex flex-col md:flex-row justify-between items-center bg-gray-50 p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow gap-4">
                      <div className="flex items-center gap-4 w-full md:w-auto">
                        {course.thumbnail ? (
                          <img src={course.thumbnail} alt={course.name} className="w-16 h-16 rounded-xl object-cover" />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-blue-100 flex items-center justify-center text-blue-500">
                            <PlayCircle size={24} />
                          </div>
                        )}
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{course.name}</h3>
                          <p className="text-sm text-gray-500">Category: {course.category} • Level: {course.level}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 w-full md:w-auto justify-end">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Students</p>
                          <p className="font-black text-gray-900 text-lg">{course.enrolledStudents}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Revenue</p>
                          <p className="font-black text-green-600 text-lg">Rs. {course.earnedRevenue.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
