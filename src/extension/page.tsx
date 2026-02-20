'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </Link>
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <span className="font-bold text-lg">Privacy Policy</span>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Protecting Your Privacy</h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            At PropPlug, we believe your data belongs to you. This policy outlines how we collect, use, and protect your information when you use our Chrome Extension and Web Dashboard.
          </p>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Last Updated: February 2026</p>
        </div>

        {/* Limited Use Disclosure */}
        <div className="bg-indigo-900/20 border border-indigo-500/30 p-8 rounded-3xl">
          <div className="flex items-start gap-4">
            <Shield className="text-indigo-400 shrink-0 mt-1" size={24} />
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-white">Limited Use Disclosure</h3>
              <p className="text-slate-300 leading-relaxed">
                The use of information received from Google APIs will adhere to the <a href="https://developer.chrome.com/docs/webstore/user-data/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Chrome Web Store User Data Policy</a>, including the Limited Use requirements. We do not transfer, sell, or use your data for personalized advertisements or credit-worthiness checks.
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-slate-300 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Eye className="text-slate-500" size={24} />
              1. Data Collection
            </h2>
            <p>We collect the minimum amount of data necessary to provide our services:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li><strong>Account Information:</strong> When you sign up, we collect your email address and name via Firebase Authentication to manage your account and subscription.</li>
              <li><strong>Property Data:</strong> When you use the extension to "Save Deal", we collect the public property data (price, address, features) from the webpage you are viewing. This is done only at your explicit request.</li>
              <li><strong>User Inputs:</strong> Financial assumptions (interest rates, rent, expenses) you enter into the calculator are stored to provide your analysis.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Lock className="text-slate-500" size={24} />
              2. How We Use Your Data
            </h2>
            <p>Your data is used strictly for the functionality of the product:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>To calculate financial metrics (Yield, ROI, Cashflow).</li>
              <li>To build your personal deal repository dashboard.</li>
              <li>To improve the accuracy of our scraping algorithms.</li>
            </ul>
            <p className="font-bold text-white mt-4">We do not sell your data to third parties, data brokers, or advertisers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Data Sharing & Third Parties</h2>
            <p>We only share data with trusted service providers necessary to run our application:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li><strong>Google Firebase:</strong> For secure authentication, database storage, and hosting.</li>
              <li><strong>Stripe (if applicable):</strong> For processing subscription payments. We do not store your credit card details.</li>
            </ul>
            <p>We may disclose data if required by law, or to protect against fraud and abuse.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
            <p>
              We employ industry-standard security measures. All data is transmitted via HTTPS using modern cryptography. 
              Authentication information is handled securely by Google Firebase. We do not store passwords in plain text.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Your Rights</h2>
            <p>
              You have the right to access, correct, or delete your data. You can delete specific property analyses directly from your dashboard. 
              To delete your entire account and all associated data, please contact us or use the delete account option in your settings.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy or our data practices, please contact us at:
            </p>
            <a href="mailto:support@propplug.com" className="text-indigo-400 hover:text-indigo-300 font-bold text-lg">
              support@propplug.com
            </a>
          </section>

        </div>
      </main>
    </div>
  );
}