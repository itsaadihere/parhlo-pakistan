"use client";

import React, { useState } from 'react';
import Link from 'next/link';
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

export default function CourseDetail() {
  const [activeTab, setActiveTab] = useState('curriculum');
  const [showShareModal, setShowShareModal] = useState(false);

  const courseData = {
    title: "Graphic Design Basics",
    category: "Design",
    price: "1,200",
    instructor: "Zara Malik",
    level: "Beginner",
    duration: "7 Lectures",
    description: "Create stunning graphics, social media posts, and branding assets using simple design principles.",
    curriculum: [
      { id: 1, title: "Design Fundamentals & Typography", duration: "18 min", isFree: true, sub: "Learn layout, fonts, and color systems for professional visuals." },
      { id: 2, title: "Branding & Visual Identity", duration: "28 min", isFree: false, sub: "Build consistent branding for startups and small businesses." },
      { id: 3, title: "Social Media Graphics", duration: "24 min", isFree: false, sub: "Create attention-grabbing posts and ads." },
      { id: 4, title: "Presentation Design", duration: "26 min", isFree: false, sub: "Design clean and impactful slides for clients." },
      { id: 5, title: "Design Portfolio Preparation", duration: "20 min", isFree: false, sub: "Prepare your work to attract freelance clients." }
    ]
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <nav className="border-b border-gray-100 p-4 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-4">
          <Link href="/courses" className="flex items-center gap-2 text-gray-500 hover:text-green-600 font-bold transition-colors">
            <ChevronLeft size={20} /> Back to Courses
          </Link>
          <div className="flex gap-4">
            <button onClick={() => setShowShareModal(true)} className="p-2 text-gray-400 hover:text-gray-900"><Share2 size={20}/></button>
          </div>
        </div>
      </nav>

      <section className="bg-[#064e3b] text-white pt-16 pb-24 px-8 relative overflow-hidden">
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
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><PlayCircle size={20}/></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Content</p>
                  <p className="font-bold text-sm">{courseData.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><BarChart size={20}/></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Level</p>
                  <p className="font-bold text-sm">{courseData.level}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center"><User size={20}/></div>
                <div>
                  <p className="text-[10px] uppercase font-black opacity-50 tracking-widest">Instructor</p>
                  <p className="font-bold text-sm">{courseData.instructor}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:absolute lg:right-0 lg:top-0">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100 text-slate-900 w-full lg:w-[380px] hover:translate-y-[-4px] transition-transform duration-500">
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-4xl font-black tracking-tighter text-gray-900 font-mono">PKR {courseData.price}</span>
              </div>
              <p className="text-gray-400 text-sm font-medium mb-8">One-time payment for lifetime access</p>
              <button className="w-full bg-[#064e3b] text-white py-5 rounded-2xl font-black text-lg hover:bg-green-600 transition-all shadow-xl shadow-green-900/10 mb-6">
                Sign In to Enroll
              </button>
              <div className="space-y-4 pt-6 border-t border-gray-50">
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600"/> Full Lifetime Access
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600"/> Certificate of Completion
                </div>
                <div className="flex items-center gap-3 text-sm font-bold text-gray-600">
                  <CheckCircle2 size={18} className="text-green-600"/> Support from Instructor
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
                    <span className="text-xs font-bold text-gray-400 flex items-center gap-1.5"><Clock size={12}/> {item.duration}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-md">{item.sub}</p>
                </div>
                {item.isFree && (
                  <button className="bg-white border border-gray-200 px-4 py-1.5 rounded-full text-[10px] font-black uppercase text-gray-900 shadow-sm hover:border-green-600 transition-colors">
                    Free Preview
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-20 p-10 bg-gray-50 rounded-[3rem] flex flex-col md:flex-row gap-10 items-center border border-gray-100">
            <div className="w-32 h-32 bg-gray-200 rounded-full shrink-0 overflow-hidden border-4 border-white shadow-lg">
              <div className="w-full h-full flex items-center justify-center text-gray-400"><User size={40}/></div>
            </div>
            <div>
              <p className="text-[10px] uppercase font-black text-green-600 tracking-[0.2em] mb-2">Taught by</p>
              <h3 className="text-3xl font-black text-gray-900 mb-4 tracking-tighter">{courseData.instructor}</h3>
              <p className="text-gray-500 font-medium leading-relaxed italic">
                "Design beautiful visuals quickly, even if you're new to graphic tools." 
              </p>
            </div>
          </div>
        </div>
      </section>

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
