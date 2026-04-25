"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  const [userRole, setUserRole] = useState(null);
  const router = useRouter();

  const handleLoginSuccess = (isAdmin) => {
    setShowAuthModal(false);
    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/dashboard');
    }
  };

  const [courses, setCourses] = useState([]);

  const parseStudentCount = (value) => {
    if (value === undefined || value === null) return 0;
    const str = String(value).trim().toLowerCase();
    const match = str.match(/^([0-9,.]+)([km]?)$/);
    if (!match) {
      return parseFloat(str.replace(/,/g, '')) || 0;
    }
    const amount = parseFloat(match[1].replace(/,/g, '')) || 0;
    const suffix = match[2];
    if (suffix === 'k') return amount * 1000;
    if (suffix === 'm') return amount * 1000000;
    return amount;
  };

  const shouldShowRating = (rating) => {
    const parsed = parseFloat(String(rating).replace(/,/g, '.'));
    return !Number.isNaN(parsed) && parsed >= 2;
  };

  const shouldShowStudents = (students) => {
    return parseStudentCount(students) >= 5;
  };

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const isAdmin = window.localStorage.getItem('parhloAdmin') === 'true';
    const email = window.localStorage.getItem('currentUserEmail');
    if (isAdmin) setUserRole('admin');
    else if (email) setUserRole('student');

    const stored = JSON.parse(window.localStorage.getItem('adminCourses') || '[]');
    if (!stored.length) return;

    const persistedCourses = stored.map((course) => ({
      title: course.name,
      price: course.price || '0',
      students: course.students || '0',
      rating: course.rating || '0',
      tag: course.tag || 'New',
      slug: course.slug,
      imageClass: 'from-slate-900 via-slate-700 to-green-600',
      description: course.category ? `${course.category} course` : 'New course content available now.',
    }));

    setCourses(persistedCourses);
  }, []);

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
            onClick={() => setShowAuthModal(true)}
            className="bg-gray-900 text-white px-6 py-2.5 rounded-full font-bold text-sm hover:bg-green-600 transition-all shadow-lg mr-4"
          >
            Join Now
          </button>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-16">
        <div className="mb-16">
          <h2 className="text-5xl font-black tracking-tight text-gray-900 mb-4">Available Courses</h2>
          <p className="text-gray-500 font-medium max-w-xl">Explore our professional course catalog designed for fast career growth and practical skill development.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
          {courses.length > 0 ? courses.map((course, i) => {
            const meta = [];
            if (shouldShowRating(course.rating)) meta.push(course.rating);
            if (shouldShowStudents(course.students)) meta.push(`${course.students} Students`);
            return (
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
                  {meta.length > 0 && (
                    <div className="flex items-center gap-2 mb-4">
                      <Star size={16} className="text-yellow-400" fill="currentColor" />
                      <span className="text-xs font-bold text-gray-400">{meta.join(' • ')}</span>
                    </div>
                  )}
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
            );
          }) : (
            <div className="col-span-full rounded-[3rem] border border-gray-200 bg-white p-16 text-center text-gray-500">
              No courses are currently available. Admin-managed courses will appear here.
            </div>
          )}
        </div>
      </main>

      {showAuthModal && (
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialMode="login"
          onLoginSuccess={handleLoginSuccess}
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
