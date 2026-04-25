"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ShareModal from '@/app/components/ShareModal';
import {
  PlayCircle,
  Lock,
  ChevronLeft,
  Clock,
  BarChart,
  User,
  CheckCircle2,
  Share2
} from 'lucide-react';

const parsePriceValue = (value) => {
  if (value === undefined || value === null) return 0;
  const numeric = String(value).replace(/[^0-9.]/g, '');
  return parseFloat(numeric) || 0;
};

const formatCurrency = (value) => {
  if (value === undefined || value === null || Number.isNaN(value)) return '0';
  return Number(value).toLocaleString('en-US', { maximumFractionDigits: 0 });
};

export default function DynamicCourseDetail() {
  const params = useParams();
  const slug = params?.slug;
  const [courseData, setCourseData] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [previewLecture, setPreviewLecture] = useState(null);
  const [showPreviewOverlay, setShowPreviewOverlay] = useState(false);

  const previewItem = previewLecture !== null ? courseData?.curriculum?.[previewLecture] : null;
  const previewUrl = previewItem?.videoId
    ? `https://www.youtube-nocookie.com/embed/${previewItem.videoId}?autoplay=1&rel=0&modestbranding=1&controls=0&showinfo=0&iv_load_policy=3&disablekb=1&playsinline=1&playlist=${previewItem.videoId}`
    : null;

  const openPreview = (index) => {
    setPreviewLecture(index);
    setShowPreviewOverlay(true);
  };

  const closePreview = () => {
    setShowPreviewOverlay(false);
    setPreviewLecture(null);
  };

  useEffect(() => {
    if (!slug) return;

    const stored = typeof window !== 'undefined'
      ? JSON.parse(window.localStorage.getItem('adminCourses') || '[]')
      : [];

    const adminCourse = stored.find((course) => course.slug === slug);

    if (adminCourse) {
      const originalPrice = parsePriceValue(adminCourse.price);
      const discountPercent = parseFloat(String(adminCourse.discount || '').replace(/[^0-9.]/g, '')) || 0;
      const salePriceValue = discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;
      const savings = discountPercent > 0 ? originalPrice - salePriceValue : 0;

      setCourseData({
        title: adminCourse.name || 'New Course',
        category: adminCourse.category || 'New Course',
        price: adminCourse.price || '0',
        originalPrice: formatCurrency(originalPrice),
        salePrice: formatCurrency(salePriceValue),
        discount: discountPercent > 0 ? discountPercent : 0,
        savings: savings > 0 ? formatCurrency(savings) : null,
        instructor: adminCourse.instructor || 'Admin Instructor',
        instructorIntro: adminCourse.instructorIntro || `Learn ${adminCourse.name} with practical video lectures and real examples.`,
        level: adminCourse.level || 'All Levels',
        duration: `${adminCourse.lectures?.length || 0} Lectures`,
        description: adminCourse.description || `Learn ${adminCourse.name} with practical video lectures and real examples.`,
        curriculum: adminCourse.lectures?.map((lecture, idx) => ({
          id: idx + 1,
          title: lecture.title || `Lecture ${idx + 1}`,
          duration: '25 min',
          isFree: lecture.type === 'demo',
          videoId: lecture.videoId || '',
          sub: lecture.type === 'demo'
            ? 'Free demo preview available for every student.'
            : 'Paid lecture content available after approval.',
        })) || []
      });
      return;
    }

    setCourseData(null);
  }, [slug]);

  // Security measures to deter simple URL extraction
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    const handleKeyDown = (e) => {
      // Prevent F12
      if (e.key === 'F12') {
        e.preventDefault();
      }
      // Prevent Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i' || e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
      }
      if (e.ctrlKey && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!courseData) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-8 py-24 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400 mb-4">Course Not Found</p>
          <h1 className="text-4xl font-black text-slate-900 mb-6">That course does not exist yet.</h1>
          <p className="text-gray-500 mb-10">Make sure the admin created the course and the slug matches the URL exactly.</p>
          <Link href="/courses" className="inline-flex items-center gap-2 rounded-full bg-[#064e3b] px-8 py-4 text-white font-black hover:bg-green-600 transition-all">
            Back to Courses
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="border-b border-gray-100 p-4 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link href="/courses" className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Courses
          </Link>
          <div className="flex gap-4">
            <button onClick={() => setShowShareModal(true)} className="p-2 text-gray-400 hover:text-gray-900"><Share2 size={20} /></button>
          </div>
        </div>
      </nav>

      <section className="bg-[#064e3b] text-white pt-16 pb-24 px-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 skew-x-12 translate-x-20" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 relative z-10">
          <div className="lg:col-span-2">
            <span className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/20">
              {courseData.category}
            </span>
            <h1 className="text-5xl md:text-6xl font-black mt-6 mb-8 tracking-tighter leading-tight">
              {courseData.title}
            </h1>
            <p className="text-emerald-100/80 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-10">
              {courseData.description}
            </p>

            <div className="flex flex-wrap gap-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><PlayCircle size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Content</p>
                  <p className="font-bold text-sm">{courseData.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><BarChart size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Level</p>
                  <p className="font-bold text-sm">{courseData.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><User size={20} /></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Instructor</p>
                  <p className="font-bold text-sm">{courseData.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:absolute lg:right-0 lg:top-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 text-slate-900 w-full lg:w-[380px] hover:translate-y-[-4px] transition-transform duration-500">
              <div className="flex flex-col gap-3 mb-4">
                <div className="flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-4xl font-black tracking-tighter text-gray-900 font-mono">PKR {courseData.salePrice}</p>
                    {courseData.discount > 0 && (
                      <p className="text-sm text-gray-500 line-through">PKR {courseData.originalPrice}</p>
                    )}
                  </div>
                  {courseData.discount > 0 && (
                    <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-emerald-800">
                      Save {courseData.discount}%{courseData.savings ? ` · PKR ${courseData.savings}` : ''}
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-sm font-medium">One-time payment for lifetime access</p>
              </div>

              <button className="w-full bg-[#064e3b] text-white py-5 rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-900/10 mb-6">
                Sign In to Enroll
              </button>

              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600" /> Full Lifetime Access
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600" /> Certificate of Completion
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600" /> Support from Instructor
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-8 py-24">
        <div className="lg:w-2/3">
          <div className="flex gap-8 border-b border-gray-100 mb-12">
            <button className="pb-4 border-b-4 border-green-600 text-lg font-black tracking-tight">
              Course Content <span className="ml-2 text-sm text-gray-300 font-medium px-2 py-0.5 bg-gray-50 rounded-lg">{courseData.curriculum.length} Lectures</span>
            </button>
          </div>

          {previewLecture !== null && courseData.curriculum[previewLecture] && (
            <div className="mb-10 rounded-[2rem] border border-green-200 bg-green-50 p-8">
              <h3 className="text-xl font-black text-green-900">Free Preview</h3>
              <p className="mt-3 text-base font-bold text-slate-900">{courseData.curriculum[previewLecture].title}</p>
              <p className="mt-2 text-sm text-green-700">{courseData.curriculum[previewLecture].sub}</p>
              <button type="button" onClick={closePreview} className="mt-6 rounded-full border border-green-200 bg-white px-6 py-3 text-green-700 font-bold hover:bg-green-100 transition-all">
                Close Preview
              </button>
            </div>
          )}

          <div className="space-y-4">
            {courseData.curriculum.map((item, idx) => (
              <div
                key={item.id}
                className={`group flex items-start gap-6 p-6 rounded-3xl transition-all duration-300 border ${idx === 0 ? 'bg-gray-50 border-gray-100 shadow-sm' : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50/50'}`}
              >
                <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${item.isFree ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400 group-hover:bg-white'}`}>
                  {item.isFree ? <PlayCircle size={24} /> : <Lock size={20} />}
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="text-lg font-bold text-gray-900 tracking-tight">
                      {idx + 1}. {item.title}
                    </h4>
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Clock size={12} /> {item.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">{item.sub}</p>
                </div>

                {item.isFree && (
                  <button
                    type="button"
                    onClick={() => item.videoId ? openPreview(idx) : null}
                    disabled={!item.videoId}
                    className={`bg-white border border-gray-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm hover:border-green-600 transition-colors ${!item.videoId ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {item.videoId ? 'Free Preview' : 'Preview unavailable'}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[3rem] flex flex-col md:flex-row gap-10 items-center border border-gray-100">
            <div className="w-32 h-32 bg-gray-200 rounded-full shrink-0 overflow-hidden border-4 border-white shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={40} /></div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-green-600 tracking-[0.2em] mb-2">Taught by</p>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">{courseData.instructor}</h3>
              <p className="text-gray-500 font-medium leading-relaxed italic">
                {courseData.instructorIntro}
              </p>
            </div>
          </div>
        </div>
      </section>

      {showPreviewOverlay && previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <div className="relative w-full max-w-5xl overflow-hidden rounded-[2rem] bg-slate-950 shadow-2xl">
            <button
              type="button"
              onClick={closePreview}
              className="absolute right-4 top-4 z-10 rounded-full bg-white/90 px-4 py-2 text-sm font-black text-slate-900 shadow-lg hover:bg-white"
            >
              Close
            </button>
            <div className="aspect-video bg-black relative">
              <iframe
                src={previewUrl}
                title="Course preview"
                className="h-full w-full"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            </div>
          </div>
        </div>
      )}

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          title={courseData.title}
          description={courseData.description}
        />
      )}

      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">© 2026 Parhlo Pakistan</p>
      </footer>
    </div>
  );
}
