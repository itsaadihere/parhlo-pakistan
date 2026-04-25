"use client";

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ChevronLeft, ChevronDown, PlayCircle, Plus, X } from 'lucide-react';

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
  const [levelDropdownOpen, setLevelDropdownOpen] = useState(false);
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [instructorDropdownOpen, setInstructorDropdownOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [instructorIntroMap, setInstructorIntroMap] = useState({});
  const levelWrapperRef = useRef(null);
  const categoryWrapperRef = useRef(null);
  const instructorWrapperRef = useRef(null);
  const levelOptions = ['Basic', 'Medium', 'Advance'];
  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    level: 'Basic',
    category: '',
    instructor: '',
    instructorIntro: '',
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (levelWrapperRef.current && !levelWrapperRef.current.contains(event.target)) {
        setLevelDropdownOpen(false);
      }
      if (categoryWrapperRef.current && !categoryWrapperRef.current.contains(event.target)) {
        setCategoryDropdownOpen(false);
      }
      if (instructorWrapperRef.current && !instructorWrapperRef.current.contains(event.target)) {
        setInstructorDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = JSON.parse(window.localStorage.getItem('adminCourses') || '[]');
    const categorySet = new Set();
    const instructorSet = new Set();
    const introMap = {};

    stored.forEach((course) => {
      const category = String(course.category || '').trim();
      const instructor = String(course.instructor || '').trim();
      const intro = String(course.instructorIntro || '').trim();
      if (category) categorySet.add(category);
      if (instructor) instructorSet.add(instructor);
      if (instructor && intro && !introMap[instructor.toLowerCase()]) {
        introMap[instructor.toLowerCase()] = intro;
      }
    });

    setCategories(Array.from(categorySet));
    setInstructors(Array.from(instructorSet));
    setInstructorIntroMap(introMap);
  }, []);

  useEffect(() => {
    const key = String(form.instructor || '').trim().toLowerCase();
    if (key && instructorIntroMap[key]) {
      setForm((prev) => ({ ...prev, instructorIntro: instructorIntroMap[key] }));
    }
  }, [form.instructor, instructorIntroMap]);

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

  const handleCategoryInput = (value) => {
    updateField('category', value);
    setCategoryDropdownOpen(true);
  };

  const handleInstructorInput = (value) => {
    updateField('instructor', value);
    setInstructorDropdownOpen(true);
  };

  const filteredCategories = categories
    .filter((category) => category.toLowerCase().includes(String(form.category || '').trim().toLowerCase()))
    .slice(0, 5);

  const filteredInstructors = instructors
    .filter((instructor) => instructor.toLowerCase().includes(String(form.instructor || '').trim().toLowerCase()))
    .slice(0, 5);

  const isKnownCategory = categories.some((category) => category.toLowerCase() === String(form.category || '').trim().toLowerCase());
  const isKnownInstructor = instructors.some((instructor) => instructor.toLowerCase() === String(form.instructor || '').trim().toLowerCase());

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
    if (!form.name || !form.slug || !form.description || !form.level || !form.category || !form.instructor || !form.instructorIntro || !form.price) {
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
      const slugExists = stored.some((course) => course.slug === form.slug);
      if (slugExists) {
        setError('This course already exists. Change the course name so the slug is unique.');
        return;
      }
      window.localStorage.setItem('adminCourses', JSON.stringify([...stored, form]));
      if (form.category && !categories.some((cat) => cat.toLowerCase() === form.category.trim().toLowerCase())) {
        setCategories((prev) => [...prev, form.category.trim()]);
      }
      if (form.instructor && !instructors.some((inst) => inst.toLowerCase() === form.instructor.trim().toLowerCase())) {
        setInstructors((prev) => [...prev, form.instructor.trim()]);
      }
      if (form.instructor && form.instructorIntro) {
        setInstructorIntroMap((prev) => ({
          ...prev,
          [form.instructor.trim().toLowerCase()]: form.instructorIntro.trim(),
        }));
      }
      router.push('/admin');
      return;
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
              <label className="block lg:col-span-2">
                <span className="text-sm font-bold text-gray-700">Course Description</span>
                <textarea
                  value={form.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Enter a short course description"
                  rows={4}
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
                />
              </label>
              <label className="block" ref={levelWrapperRef}>
                <span className="text-sm font-bold text-gray-700">Course Level</span>
                <div className="relative mt-3">
                  <button
                    type="button"
                    onClick={() => setLevelDropdownOpen((prev) => !prev)}
                    className="w-full rounded-[2rem] border border-green-200 bg-white px-5 py-4 pr-12 text-left text-gray-900 font-semibold shadow-sm transition duration-200 hover:border-green-300 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-100"
                  >
                    <span>{form.level}</span>
                    <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-green-700" />
                  </button>

                  {levelDropdownOpen && (
                    <div className="absolute left-0 right-0 z-20 mt-2 rounded-[2rem] border border-green-200 bg-white shadow-2xl">
                      <ul className="overflow-hidden rounded-[2rem]">
                        {levelOptions.map((option) => (
                          <li key={option}>
                            <button
                              type="button"
                              onClick={() => {
                                updateField('level', option);
                                setLevelDropdownOpen(false);
                              }}
                              className="w-full text-left px-5 py-4 text-gray-900 transition hover:bg-green-50 hover:text-green-700"
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </label>
              <label className="block" ref={categoryWrapperRef}>
                <span className="text-sm font-bold text-gray-700">Category</span>
                <div className="relative mt-3">
                  <input
                    value={form.category}
                    onChange={(e) => handleCategoryInput(e.target.value)}
                    onFocus={() => setCategoryDropdownOpen(true)}
                    placeholder="Enter category"
                    className="w-full rounded-[2rem] border border-green-200 bg-white px-5 py-4 outline-none text-gray-900 shadow-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  {categoryDropdownOpen && filteredCategories.length > 0 && (
                    <div className="absolute left-0 right-0 z-20 mt-2 rounded-[2rem] border border-green-200 bg-white shadow-2xl">
                      <ul className="overflow-hidden rounded-[2rem]">
                        {filteredCategories.map((category) => (
                          <li key={category}>
                            <button
                              type="button"
                              onClick={() => {
                                updateField('category', category);
                                setCategoryDropdownOpen(false);
                              }}
                              className="w-full text-left px-5 py-4 text-gray-900 transition hover:bg-green-50 hover:text-green-700"
                            >
                              {category}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {!isKnownCategory && form.category.trim() !== '' && (
                  <p className="mt-2 text-sm text-green-700">Adding new category</p>
                )}
              </label>
              <label className="block" ref={instructorWrapperRef}>
                <span className="text-sm font-bold text-gray-700">Instructor Name</span>
                <div className="relative mt-3">
                  <input
                    value={form.instructor}
                    onChange={(e) => handleInstructorInput(e.target.value)}
                    onFocus={() => setInstructorDropdownOpen(true)}
                    placeholder="Enter instructor name"
                    className="w-full rounded-[2rem] border border-green-200 bg-white px-5 py-4 outline-none text-gray-900 shadow-sm transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
                  />
                  {instructorDropdownOpen && filteredInstructors.length > 0 && (
                    <div className="absolute left-0 right-0 z-20 mt-2 rounded-[2rem] border border-green-200 bg-white shadow-2xl">
                      <ul className="overflow-hidden rounded-[2rem]">
                        {filteredInstructors.map((instructor) => (
                          <li key={instructor}>
                            <button
                              type="button"
                              onClick={() => {
                                updateField('instructor', instructor);
                                setInstructorDropdownOpen(false);
                              }}
                              className="w-full text-left px-5 py-4 text-gray-900 transition hover:bg-green-50 hover:text-green-700"
                            >
                              {instructor}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                {!isKnownInstructor && form.instructor.trim() !== '' && (
                  <p className="mt-2 text-sm text-green-700">Adding new instructor</p>
                )}
              </label>
              <label className="block lg:col-span-2">
                <span className="text-sm font-bold text-gray-700">Instructor Intro</span>
                <textarea
                  value={form.instructorIntro}
                  onChange={(e) => updateField('instructorIntro', e.target.value)}
                  placeholder="Write a brief intro for the instructor"
                  rows={3}
                  className="mt-3 w-full rounded-3xl border border-gray-200 bg-white px-5 py-4 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 resize-none"
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
              <label className="block">
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
                    <div className="h-48 rounded-3xl bg-black/5 overflow-hidden">
                    {lecture.videoId ? (
                      <img
                        src={`https://img.youtube.com/vi/${lecture.videoId}/hqdefault.jpg`}
                        alt="YouTube thumbnail preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500 text-sm">
                        Enter a valid URL to preview
                      </div>
                    )}
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
