"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  CreditCard,
  ChevronRight,
  PlayCircle,
  Star,
  Globe,
  ShieldCheck,
  Users,
  Plus,
  BookOpen,
  CheckCircle2,
  LogOut,
  Clock
} from 'lucide-react';

import { supabase } from '@/utils/supabase';

export default function AdminDashboard() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminTab, setAdminTab] = useState('dashboard');
  const [adminCourses, setAdminCourses] = useState([]);
  const [payments, setPayments] = useState([]);
  const [pendingDeleteCourse, setPendingDeleteCourse] = useState(null);
  const [viewingReceipt, setViewingReceipt] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');
  
  const [adminPhone, setAdminPhone] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const admin = window.localStorage.getItem('parhloAdmin') === 'true';
    if (!admin) {
      router.replace('/');
      return;
    }
    setIsAdmin(true);

    fetchData();
    
    // Fetch admin phone from users table
    const fetchAdminProfile = async () => {
      const { data } = await supabase.from('users').select('phone').eq('email', 'parhlo.pakistan.edu@gmail.com').single();
      if (data && data.phone) {
        setAdminPhone(data.phone);
      }
    };
    fetchAdminProfile();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    // Fetch courses from Supabase
    const { data: courses, error: coursesError } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });

    if (coursesError) {
      console.error('Error fetching courses:', coursesError);
    } else {
      setAdminCourses(courses || []);
    }

    // Fetch payments from Supabase 'purchases' table
    const { data: purchases, error: purchasesError } = await supabase
      .from('purchases')
      .select('*')
      .order('created_at', { ascending: false });

    if (purchasesError) {
      console.error('Error fetching payments:', purchasesError);
    } else if (purchases) {
      // Map purchases to include course names for display
      const mappedPayments = purchases.map(p => {
        const course = (courses || []).find(c => c.slug === p.course_slug);
        
        const originalPrice = parseFloat(String(course?.price || '0').replace(/[^0-9.]/g, '')) || 0;
        const discountPercent = parseFloat(String(course?.discount || '0').replace(/[^0-9.]/g, '')) || 0;
        const finalPrice = discountPercent > 0 ? Math.round(originalPrice * (1 - discountPercent / 100)) : originalPrice;

        return {
          id: p.id,
          userEmail: p.student_email,
          courseSlug: p.course_slug,
          courseName: course ? course.name : p.course_slug,
          coursePrice: finalPrice,
          status: p.status,
          receiptImage: p.payment_screenshot_url,
          date: new Date(p.created_at).toLocaleDateString(),
          transactionId: 'N/A' // Not explicitly in schema, but can be added
        };
      });
      setPayments(mappedPayments);
    }

    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('parhloAdmin');
    }
    router.push('/');
  };

  const handleDeleteCourse = (course) => {
    setPendingDeleteCourse(course);
  };

  const confirmDeleteCourse = async () => {
    if (!pendingDeleteCourse) return;

    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('slug', pendingDeleteCourse.slug);

    if (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course from database.');
    } else {
      setAdminCourses(adminCourses.filter((course) => course.slug !== pendingDeleteCourse.slug));
    }

    setPendingDeleteCourse(null);
  };

  const cancelDeleteCourse = () => {
    setPendingDeleteCourse(null);
  };

  const handleApprovePayment = async (paymentId) => {
    const { error } = await supabase
      .from('purchases')
      .update({ status: 'approved' })
      .eq('id', paymentId);

    if (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment in database.');
      return;
    } 

    const payment = payments.find(p => p.id === paymentId);
    if (payment && payment.courseSlug) {
      // Fetch current course student count
      const { data: courseData } = await supabase
        .from('courses')
        .select('students')
        .eq('slug', payment.courseSlug)
        .single();
        
      if (courseData) {
        const currentStudents = parseInt(courseData.students) || 0;
        await supabase
          .from('courses')
          .update({ students: String(currentStudents + 1) })
          .eq('slug', payment.courseSlug);
      }
    }

    const updatedPayments = payments.map(p =>
      p.id === paymentId ? { ...p, status: 'approved' } : p
    );
    setPayments(updatedPayments);
  };

  const handleRevokeAccess = async (paymentId) => {
    if (!window.confirm("Are you sure you want to completely remove this student's access to this course?")) return;

    const payment = payments.find(p => p.id === paymentId);
    
    const { error } = await supabase
      .from('purchases')
      .delete()
      .eq('id', paymentId);

    if (error) {
      alert("Failed to remove access");
      return;
    }

    // Do not decrement the course student count as requested by the user.

    const updatedPayments = payments.filter(p => p.id !== paymentId);
    setPayments(updatedPayments);
    
    // Update viewingStudent state live
    setViewingStudent(prev => {
      if (!prev) return null;
      return {
        ...prev,
        activeCourses: prev.activeCourses.filter(c => c.id !== paymentId)
      };
    });
  };

  if (!isAdmin) return null;

  const pendingApprovals = payments.filter(p => p.status === 'pending');
  const approvedPayments = payments.filter(p => p.status === 'approved');

  const getEnrollments = () => {
    let studentEmails = [...new Set(payments.filter(p => p.status === 'approved').map(p => p.userEmail))];
    studentEmails = studentEmails.filter(email => email !== 'parhlo.pakistan.edu@gmail.com');
    return studentEmails.map(email => {
      const studentPayments = payments.filter(p => p.userEmail === email);
      return {
        email,
        activeCourses: studentPayments.filter(p => p.status === 'approved'),
        pendingCourses: studentPayments.filter(p => p.status === 'pending')
      };
    });
  };

  const menuItems = [
    { name: 'Dashboard', icon: <Globe size={20} />, id: 'dashboard' },
    { name: 'Subjects', icon: <PlayCircle size={20} />, id: 'courses' },
    { name: 'Enrollments', icon: <Users size={20} />, id: 'enrollments' },
    { name: 'Payments', icon: <CreditCard size={20} />, id: 'payments' },
    { name: 'Settings', icon: <ShieldCheck size={20} />, id: 'settings' }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-6 flex items-center gap-3">
          <Link href="/">
            <img src="/logo.png" alt="Logo" className="h-8" />
          </Link>
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
        <button onClick={handleLogout} className="m-6 flex items-center gap-3 px-4 py-3 text-gray-500 font-bold text-sm hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut size={20} /> Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto h-screen">
        {adminTab === 'dashboard' && (
          <>
            <header className="mb-10">
              <h1 className="text-3xl font-black text-slate-900">Dashboard Overview</h1>
              <p className="text-gray-500 font-medium">Welcome back. Here's what's happening today.</p>
            </header>

            <div className="grid grid-cols-4 gap-6 mb-10">
              {[
                { label: 'Total Revenue', val: `PKR ${approvedPayments.reduce((sum, p) => sum + (p.coursePrice || 0), 0).toLocaleString()}`, color: 'bg-green-50 text-green-600' },
                { label: 'Total Students', val: approvedPayments.length, color: 'bg-blue-50 text-blue-600' },
                { label: 'Active Subjects', val: String(adminCourses.length), color: 'bg-emerald-50 text-emerald-600' },
                { label: 'Pending Approvals', val: String(pendingApprovals.length), color: 'bg-amber-50 text-amber-600' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 flex items-center gap-4 shadow-sm">
                  <div className={`p-4 rounded-2xl ${stat.color}`}><CreditCard size={24} /></div>
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
                  <p className="text-5xl font-black mb-4">{pendingApprovals.length}</p>
                  <p className="text-emerald-200/60 text-sm font-medium">Payments waiting for verification.</p>
                </div>
                <button onClick={() => setAdminTab('payments')} className="w-full bg-white text-[#064e3b] py-4 rounded-2xl font-black mt-8 hover:bg-emerald-50 transition-all">
                  Review Payments
                </button>
              </div>

              <div className="col-span-2 bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-sm">
                <h3 className="text-xl font-black mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {payments.slice(-4).reverse().map((activity, i) => (
                    <div key={i} className="flex justify-between items-center pb-6 border-b border-gray-50 last:border-0">
                      <div className="flex gap-4 items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.status === 'approved' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}>
                          {activity.status === 'approved' ? <CheckCircle2 size={18} /> : <Clock size={18} />}
                        </div>
                        <div>
                          <p className="font-bold text-sm text-gray-900">
                            {activity.status === 'approved' ? 'Payment Approved' : `Payment Pending — TID: ${activity.transactionId}`}
                          </p>
                          <p className="text-xs text-gray-400">{activity.userEmail} • {activity.courseName}</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-black text-gray-400">{activity.date}</span>
                    </div>
                  ))}
                  {payments.length === 0 && (
                    <p className="text-gray-500 text-sm italic">No recent activity found.</p>
                  )}
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

            <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-white shadow-sm">
              <div className="grid grid-cols-12 gap-4 bg-gray-50 px-6 py-4 text-xs uppercase tracking-[0.2em] text-gray-500">
                <div className="col-span-4">Course</div>
                <div className="col-span-2">Category</div>
                <div className="col-span-1">Price</div>
                <div className="col-span-2">Instructor</div>
                <div className="col-span-2">Level</div>
                <div className="col-span-1 text-right">Action</div>
              </div>
              {adminCourses.map((course) => (
                <div key={course.slug} className="grid grid-cols-12 gap-4 px-6 py-5 border-t border-gray-100 items-center hover:bg-gray-50 transition-colors">
                  <div className="col-span-4 font-bold text-slate-900">{course.name}</div>
                  <div className="col-span-2 text-gray-500">{course.category}</div>
                  <div className="col-span-1 text-gray-500">Rs. {course.price}</div>
                  <div className="col-span-2 text-gray-500">{course.instructor}</div>
                  <div className="col-span-2 text-gray-500">
                    <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-bold">{course.level}</span>
                  </div>
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleDeleteCourse(course)}
                      className="text-red-600 font-bold hover:text-red-800 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {adminCourses.length === 0 && (
                <div className="p-8 text-center text-gray-500">No courses available. Add one above.</div>
              )}
            </div>

            {pendingDeleteCourse && (
              <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4">
                <div className="w-full max-w-lg bg-white rounded-[2rem] border border-gray-100 shadow-2xl p-8">
                  <h2 className="text-2xl font-black text-slate-900 mb-3">Confirm delete</h2>
                  <p className="text-gray-500 mb-8">Do you want to delete <span className="font-bold text-slate-900">{pendingDeleteCourse.name}</span> from the course list?</p>
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
            <h1 className="text-3xl font-black text-slate-900 mb-2">Payment Approvals</h1>
            <p className="text-gray-500 mb-8">Review submitted receipts and approve access for students.</p>

            <div className="space-y-4">
              {pendingApprovals.map(payment => (
                <div key={payment.id} className="bg-white rounded-[2rem] border border-amber-200 p-6 flex flex-col md:flex-row justify-between items-center shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-2 bg-amber-400"></div>
                  <div className="pl-4">
                    <h3 className="text-xl font-black text-gray-900">{payment.courseName}</h3>
                    <p className="text-gray-500 font-medium">Student: <span className="font-bold text-gray-900">{payment.userEmail}</span></p>
                    <p className="text-gray-500 text-sm mt-2">Transaction ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-900">{payment.transactionId}</span></p>
                    <p className="text-xs text-gray-400 mt-2">Submitted: {payment.date}</p>
                  </div>
                  <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <button
                      onClick={() => payment.receiptImage ? setViewingReceipt(payment.receiptImage) : alert('No receipt was attached to this older payment.')}
                      className={`text-sm font-bold underline ${payment.receiptImage ? 'text-blue-600 hover:text-blue-800' : 'text-gray-400 cursor-not-allowed'}`}
                    >
                      View Receipt
                    </button>
                    <button
                      onClick={() => handleApprovePayment(payment.id)}
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-black hover:bg-green-700 transition-all shadow-lg"
                    >
                      Approve Access
                    </button>
                  </div>
                </div>
              ))}

              {pendingApprovals.length === 0 && (
                <div className="bg-white rounded-[3rem] border border-dashed border-gray-200 p-16 text-center">
                  <CheckCircle2 size={40} className="text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-black text-gray-900 mb-2">All Caught Up!</h3>
                  <p className="text-gray-500">There are no pending payment approvals at the moment.</p>
                </div>
              )}
            </div>

            {approvedPayments.length > 0 && (
              <div className="mt-16">
                <h2 className="text-xl font-black text-slate-900 mb-6">Recently Approved</h2>
                <div className="bg-white rounded-[2rem] border border-gray-100 p-6">
                  {approvedPayments.map(payment => (
                    <div key={payment.id} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0">
                      <div>
                        <p className="font-bold text-gray-900">{payment.courseName}</p>
                        <p className="text-xs text-gray-500">{payment.userEmail} • TID: {payment.transactionId}</p>
                      </div>
                      <span className="text-xs font-black text-green-600 uppercase tracking-widest bg-green-50 px-3 py-1 rounded-full">Approved</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {adminTab === 'enrollments' && (
          <div>
            <h1 className="text-3xl font-black mb-6">Enrollments</h1>
            <p className="text-gray-500 mb-10">Manage active students and their course access.</p>
            
            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              {getEnrollments().length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-gray-500">No active students enrolled yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {getEnrollments().map(student => (
                    <div key={student.email} className="border border-gray-100 rounded-2xl p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setViewingStudent(student)}>
                      <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-xl mb-4 uppercase">
                        {student.email.charAt(0)}
                      </div>
                      <h3 className="font-bold text-gray-900 truncate mb-1" title={student.email}>{student.email.split('@')[0]}</h3>
                      <p className="text-xs text-gray-500 truncate mb-4">{student.email}</p>
                      <div className="flex gap-2 text-[10px] font-bold uppercase tracking-wider">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full">{student.activeCourses.length} Active</span>
                        {student.pendingCourses.length > 0 && <span className="bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">{student.pendingCourses.length} Pending</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {adminTab === 'settings' && (
          <div className="max-w-2xl">
            <h1 className="text-3xl font-black mb-6">Settings</h1>
            <p className="text-gray-500 mb-10">Manage your administrative settings and security.</p>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm mb-10">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Globe size={24} className="text-green-600" /> Profile Details
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number (WhatsApp)</label>
                  <input 
                    type="text" 
                    value={adminPhone}
                    onChange={(e) => setAdminPhone(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                    placeholder="Enter admin WhatsApp number"
                  />
                </div>
                <button 
                  onClick={async () => {
                    const { error } = await supabase.from('users').update({ phone: adminPhone }).eq('email', 'parhlo.pakistan.edu@gmail.com');
                    if (error) {
                      alert("Error updating phone. Ensure 'users' table exists.");
                    } else {
                      alert("Admin phone number updated successfully!");
                    }
                  }}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black hover:bg-green-600 transition-all shadow-lg w-full md:w-auto"
                >
                  Save Profile
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <ShieldCheck size={24} className="text-green-600" /> Security
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                  <input 
                    type="password" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                    placeholder="Enter new admin password"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Confirm New Password</label>
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 p-4 rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                    placeholder="Confirm new password"
                  />
                </div>

                {passwordMessage && (
                  <div className={`p-4 rounded-xl text-sm font-medium ${passwordMessage.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {passwordMessage}
                  </div>
                )}

                <button 
                  onClick={async () => {
                    if (!newPassword) {
                      setPasswordMessage("Password cannot be empty.");
                      return;
                    }
                    if (newPassword !== confirmPassword) {
                      setPasswordMessage("Passwords do not match.");
                      return;
                    }
                    
                    const { error } = await supabase.from('users').update({ password: newPassword }).eq('email', 'parhlo.pakistan.edu@gmail.com');
                    if (error) {
                      setPasswordMessage("Error updating password.");
                    } else {
                      setPasswordMessage("Password successfully updated!");
                      setNewPassword('');
                      setConfirmPassword('');
                      setTimeout(() => setPasswordMessage(''), 3000);
                    }
                  }}
                  className="bg-gray-900 text-white px-8 py-4 rounded-xl font-black hover:bg-green-600 transition-all shadow-lg w-full md:w-auto"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Receipt Modal */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-[150] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-4 rounded-3xl max-w-2xl w-full relative">
            <button
              onClick={() => setViewingReceipt(null)}
              className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-700 transition-colors shadow-lg"
            >
              <X size={24} />
            </button>
            <div className="w-full flex justify-center bg-gray-50 rounded-2xl overflow-hidden min-h-[300px]">
              <img src={viewingReceipt} alt="Student Receipt" className="max-h-[80vh] object-contain" />
            </div>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {viewingStudent && (
        <div className="fixed inset-0 z-[150] bg-gray-900/40 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white p-8 rounded-3xl max-w-2xl w-full relative max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100">
            <button
              onClick={() => setViewingStudent(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
            >
              <X size={24} />
            </button>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-black text-2xl uppercase">
                {viewingStudent.email.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-black text-gray-900 truncate">{viewingStudent.email.split('@')[0]}</h3>
                <p className="text-gray-500">{viewingStudent.email}</p>
              </div>
            </div>

            <div className="space-y-8">
              {/* Active Courses */}
              <div>
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Active Courses</h4>
                {viewingStudent.activeCourses.length === 0 ? (
                  <p className="text-sm text-gray-500 italic">No active courses.</p>
                ) : (
                  <div className="space-y-3">
                    {viewingStudent.activeCourses.map(course => (
                      <div key={course.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <div>
                          <p className="font-bold text-gray-900">{course.courseName}</p>
                          <p className="text-xs text-gray-500">Approved on {course.date}</p>
                        </div>
                        <button 
                          onClick={() => handleRevokeAccess(course.id)}
                          className="text-xs font-bold text-red-600 hover:text-red-800 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg transition-colors"
                        >
                          Remove Access
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Pending Courses */}
              {viewingStudent.pendingCourses.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Pending Courses</h4>
                  <div className="space-y-3">
                    {viewingStudent.pendingCourses.map(course => (
                      <div key={course.id} className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-gray-100 opacity-70">
                        <div>
                          <p className="font-bold text-gray-900">{course.courseName}</p>
                          <p className="text-xs text-gray-500">Requested on {course.date}</p>
                        </div>
                        <span className="text-xs font-bold text-yellow-600 uppercase tracking-widest">Pending</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
