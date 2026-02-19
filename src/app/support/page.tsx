'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    type: 'bug',
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Dashboard
            </Link>
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <span className="font-bold text-lg">Support & Feedback</span>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
      </nav>

      <main className="max-w-2xl mx-auto p-6 pt-12">
        {submitted ? (
          <div className="bg-[#0F172A] border border-slate-800 rounded-3xl p-12 text-center animate-fade-in">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-500">
              <CheckCircle size={40} />
            </div>
            <h2 className="text-3xl font-black text-white mb-4">Message Received!</h2>
            <p className="text-slate-400 text-lg mb-8">
              Thanks for reaching out. Our team will review your message and get back to you shortly.
            </p>
            <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all">
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h1 className="text-4xl font-black text-white mb-4">How can we help?</h1>
              <p className="text-slate-400 text-lg">Found a bug? Have a feature request? Or just want to say hi?</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-[#0F172A] border border-slate-800 rounded-3xl p-8 space-y-6 shadow-xl">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder="Your Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-colors"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Topic</label>
                <div className="relative">
                  <select 
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-colors appearance-none cursor-pointer"
                  >
                    <option value="bug">Report a Bug</option>
                    <option value="feature">Feature Request</option>
                    <option value="billing">Billing Question</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                    <AlertCircle size={16} />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  required
                  value={formData.message}
                  onChange={e => setFormData({...formData, message: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-indigo-500 transition-colors min-h-[150px] resize-y"
                  placeholder="Tell us more..."
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : (
                  <>
                    Send Message <Send size={18} />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}