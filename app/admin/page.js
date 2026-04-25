"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, ChevronRight, BookOpen, User, Tag } from 'lucide-react';

export default function AdminCourseListPage() {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const admin = window.localStorage.getItem('parhloAdmin') === 'true';
    if (!admin) {
      router.replace('/');
      return;
    }
    setIsAdmin(true);

    const stored = JSON.parse(window.localStorage.getItem('adminCourses') || '[]');
    setCourses(stored);
  }, [router]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-green-100">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div>
            <p className="text-sm uppercase font-black tracking-[0.3em] text-green-700 mb-3">Admin Panel</p>
            <h1 className="text-4xl font-black text-slate-900">Course Management</h1>
            <p className="text-gray-500 max-w-2xl mt-3">View and manage the current course catalog. Add new courses, review categories, and inspect instructors from one place.</p>
          </div>
          <Link
            href="/admin/add-course"
            className="inline-flex items-center gap-3 rounded-full bg-green-600 px-6 py-3 text-white font-bold shadow-lg shadow-green-600/20 hover:bg-green-700 transition-all"
          >
            <Plus size={18} /> Add New Course
          </Link>
        </div>

        <div className="grid gap-6">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.slug || course.name} className="rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm transition hover:shadow-lg">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                        <BookOpen size={16} /> {course.category || 'Uncategorized'}
                      </span>
                      <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-semibold text-slate-700">
                        <User size={16} /> {course.instructor || 'Unknown Instructor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h2 className="text-2xl font-black text-slate-900">{course.name}</h2>
                      {course.level && <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-green-700">{course.level}</span>}
                    </div>
                    <p className="text-gray-500 max-w-2xl">{course.description || 'No description available.'}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="rounded-3xl bg-slate-100 px-5 py-4 text-right">
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">Price</p>
                      <p className="text-2xl font-black text-slate-900">Rs. {course.price || '0'}</p>
                    </div>
                    <Link
                      href={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-slate-900 hover:bg-green-50 transition-all"
                    >
                      View course <ChevronRight size={16} />
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[2rem] border border-dashed border-gray-300 bg-white p-16 text-center text-gray-500">
              <p className="text-xl font-bold text-slate-900 mb-3">No courses found</p>
              <p className="max-w-xl mx-auto">When you save a course, it will appear here in the admin list. Click the button above to add your first course.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
