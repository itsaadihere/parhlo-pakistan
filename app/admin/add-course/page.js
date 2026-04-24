"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, PlayCircle, Plus, X } from 'lucide-react';

const extractYouTubeId = (value) => {
  try {
    const url = new URL(value);
    if (url.hostname.includes('youtu.be')) {
      return url.pathname.slice(1);
    }
    if (url.hostname.includes('youtube.com')) {
      const v = url.searchParams.get('v');
      if (v) return v;
      const parts = url.pathname.split('/').filter(Boolean);
      return parts.length ? parts[parts.length - 1] : '';
    }
  } catch {
    return '';
  }
  return '';
};

export default function AdminAddCoursePage() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [form, setForm] = useState({
    name: '',
    slug: '',
    category: '',
    price: '',
    discount: '',
    lectures: [
      { title: 'Demo Lecture', url: '', videoId: '', type: 'demo' },
      { title: 'Lecture 1', url: '', videoId: '', type: 'lecture' }
    ]
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const admin = window.localStorage.getItem('parhloAdmin') === 'true';
    if (!admin) {
      router.replace('/');
      return;
    }
    setIsAdmin(true);
  }, [router]);

  const slugFromName = useMemo(() => {
    return form.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }, [form.name]);

  useEffect(() => {
    setForm((prev) => ({ ...prev, slug: slugFromName }));
  }, [slugFromName]);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateLecture = (index, field, value) => {
    setForm((prev) => {
      const lectures = [...prev.lectures];
      lectures[index] = { ...lectures[index], [field]: value };
      if (field === 'url') {
        lectures[index].videoId = extractYouTubeId(value);
      }
      return { ...prev, lectures };
    });
  };

  const addLecture = () => {
    setForm((prev) => ({
      ...prev,
      lectures: [
        ...prev.lectures,
        {
          title: `Lecture ${prev.lectures.length + 1}`,
          url: '',
          videoId: '',
          type: 'lecture'
        }
      ]
    }));
  };

  const validateForm = () => {
    if (!form.name || !form.slug || !form.category || !form.price) {
      setError('Please fill all required course fields.');
      return false;
    }
    if (form.lectures.length < 2) {
      setError('Please add at least one demo and one lecture.');
      return false;
    }
    const brokenLecture = form.lectures.find((lecture) => !lecture.title || !lecture.url || !lecture.videoId);
    if (brokenLecture) {
      setError('Please enter a valid YouTube URL for every lecture.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    if (typeof window !== 'undefined') {
      const stored = JSON.parse(window.localStorage.getItem('adminCourses') || '[]');
      window.localStorage.setItem('adminCourses', JSON.stringify([...stored, form]));
      setSuccess('Course saved successfully. It will appear in the admin course list.');
      window.setTimeout(() => setSuccess(''), 3000);
      setForm({
        name: '',
        slug: '',
        category: '',
        price: '',
        discount: '',
        lectures: [
          { title: 'Demo Lecture', url: '', videoId: '', type: 'demo' },
          { title: 'Lecture 1', url: '', videoId: '', type: 'lecture' }
        ]
      });
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-green-100">
      <div className="max-w-7xl mx-auto px-8 py-10">
        <Link href="/" className="inline-flex items-center gap-2 mb-8 text-sm font-bold text-gray-600 hover:text-green-600">
          <ChevronLeft size={18} /> Back to Admin
        </Link>

        <div className="bg-white rounded-[2rem] border border-gray-200 p-10 shadow-sm">
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 mb-3">Add New Course</h1>
            <p className="text-gray-500 max-w-2xl">Enter course details and private YouTube lecture links. Demo content is available before payment, and paid lectures will unlock after admin approval.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="grid gap-4 lg:grid-cols-2">
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Course Name</span>
                <input
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="Enter course name"
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Slug</span>
                <input
                  value={form.slug}
                  readOnly
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-gray-100 px-5 py-4 text-gray-500"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Category</span>
                <input
                  value={form.category}
                  onChange={(e) => updateField('category', e.target.value)}
                  placeholder="Enter category"
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <label className="block">
                <span className="text-sm font-bold text-gray-700">Price</span>
                <input
                  value={form.price}
                  onChange={(e) => updateField('price', e.target.value)}
                  placeholder="Enter price"
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
              <label className="block lg:col-span-2">
                <span className="text-sm font-bold text-gray-700">Discount (optional)</span>
                <input
                  value={form.discount}
                  onChange={(e) => updateField('discount', e.target.value)}
                  placeholder="Enter discount percentage"
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                />
              </label>
            </div>

            <div className="rounded-[2rem] border border-gray-200 bg-gray-50 p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900">Videos</h2>
                  <p className="text-gray-500 text-sm">Add one demo lecture plus at least one paid lecture. Student sees demo before payment.</p>
                </div>
                <button
                  type="button"
                  onClick={addLecture}
                  className="inline-flex items-center gap-2 rounded-full bg-green-600 px-5 py-3 text-white font-bold hover:bg-green-700 transition-all"
                >
                  <Plus size={16} /> Add Lecture
                </button>
              </div>

              <div className="space-y-6">
                {form.lectures.map((lecture, index) => (
                  <div key={index} className="grid gap-4 md:grid-cols-12 items-end rounded-3xl border border-gray-200 bg-white p-6">
                    <div className="md:col-span-4">
                      <label className="block text-sm font-bold text-gray-700">Lecture Name</label>
                      <input
                        value={lecture.title}
                        onChange={(e) => updateLecture(index, 'title', e.target.value)}
                        placeholder={`Lecture ${index + 1} title`}
                        className="mt-3 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                    <div className="md:col-span-6">
                      <label className="block text-sm font-bold text-gray-700">YouTube URL</label>
                      <input
                        value={lecture.url}
                        onChange={(e) => updateLecture(index, 'url', e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        className="mt-3 w-full rounded-3xl border border-gray-200 bg-gray-50 px-4 py-3 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
                      />
                    </div>
                    <div className="md:col-span-2 text-right">
                      <div className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{lecture.type === 'demo' ? 'Demo' : 'Paid'}</div>
                      <div className="mt-3 text-sm text-gray-500">{lecture.videoId ? 'Valid video' : 'Invalid URL'}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">{error}</div>}
            {success && <div className="rounded-3xl border border-green-200 bg-green-50 px-6 py-4 text-green-700">{success}</div>}

            <div className="flex flex-col gap-4 sm:flex-row sm:justify-end">
              <Link href="/" className="inline-flex justify-center rounded-full border border-gray-200 px-8 py-4 font-bold text-gray-700 hover:bg-gray-100 transition-all">
                Cancel
              </Link>
              <button type="submit" className="inline-flex justify-center rounded-full bg-[#064e3b] px-8 py-4 font-black text-white hover:bg-green-600 transition-all">
                Save course
              </button>
            </div>
          </form>

          <div className="mt-14 rounded-[2rem] border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-black mb-4">Secure portal preview</h3>
            <p className="text-gray-500 mb-4">Students will play your YouTube lecture content in a portal-style player without exposing the raw URL in the interface.</p>
            <div className="grid gap-6 md:grid-cols-2">
              {form.lectures.map((lecture, idx) => (
                <div key={idx} className="rounded-3xl border border-gray-200 p-4 bg-gray-50">
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900">{lecture.title || `Lecture ${idx + 1}`}</p>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-400">{lecture.type === 'demo' ? 'Demo playable before payment' : 'Paid lecture'}</p>
                    </div>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">{lecture.type === 'demo' ? 'Demo' : 'Paid'}</span>
                  </div>
                  <div className="rounded-3xl border border-gray-200 bg-white p-4">
                    <div className="mb-3 flex items-center gap-2 text-sm text-gray-500">
                      <PlayCircle size={16} /> Secure player preview
                    </div>
                    <div className="h-48 rounded-3xl bg-black/5 flex items-center justify-center text-gray-500 text-sm">
                      {lecture.videoId ? 'Private YouTube video will play here' : 'Enter a valid URL to preview'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
