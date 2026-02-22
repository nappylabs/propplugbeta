'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Lock, Eye, Globe, Database, UserCheck, Cookie } from 'lucide-react';
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
            We respect your privacy and process personal information lawfully under:
          </p>
          <ul className="list-disc pl-6 text-slate-400 space-y-1">
            <li>South Africa’s POPIA</li>
            <li>Kenya’s Data Protection Act, 2019</li>
            <li>International privacy standards</li>
          </ul>
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
              1. Information We Collect
            </h2>
            <h3 className="font-bold text-white mt-4">Account Information</h3>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Name</li>
              <li>Email address</li>
              <li>Authentication data</li>
            </ul>

            <h3 className="font-bold text-white mt-4">Property & Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Saved listings</li>
              <li>Financial inputs</li>
              <li>Notes and insights</li>
              <li>Interaction history</li>
            </ul>

            <h3 className="font-bold text-white mt-4">Technical Data</h3>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Device information</li>
              <li>IP address</li>
              <li>Browser type</li>
              <li>Extension usage</li>
            </ul>

            <h3 className="font-bold text-white mt-4">Payment Information</h3>
            <p>Processed securely by third-party providers (e.g., Stripe).</p>
            <p>We do NOT store card details.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="text-slate-500" size={24} />
              2. How We Use Your Data
            </h2>
            <p>We process data to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Provide the Service.</li>
              <li>Store and analyze deals.</li>
              <li>Improve functionality.</li>
              <li>Prevent fraud.</li>
              <li>Communicate with users.</li>
              <li>Comply with legal obligations.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="text-slate-500" size={24} />
              3. Legal Basis for Processing
            </h2>
            <p>Processing is based on:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Performance of a contract</li>
              <li>Legitimate interests</li>
              <li>Legal compliance</li>
              <li>User consent (where required)</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Globe className="text-slate-500" size={24} />
              4. Data Sharing
            </h2>
            <p>We share data only with trusted providers necessary to operate the Service, including:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Cloud hosting</li>
              <li>Authentication services</li>
              <li>Payment processors</li>
              <li>Analytics providers</li>
            </ul>
            <p>We do NOT sell personal data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Lock className="text-slate-500" size={24} />
              5. Public Listing Data
            </h2>
            <p>
              Property information saved through the extension comes from publicly accessible listing pages.
            </p>
            <p>
              We store only what you choose to save.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Globe className="text-slate-500" size={24} />
              6. International Transfers
            </h2>
            <p>Data may be processed outside your country using secure safeguards.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Lock className="text-slate-500" size={24} />
              7. Data Security
            </h2>
            <p>We use:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Encryption</li>
              <li>Secure cloud infrastructure</li>
              <li>Access controls</li>
              <li>Industry best practices</li>
            </ul>
            <p>No system is completely secure.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="text-slate-500" size={24} />
              8. Retention
            </h2>
            <p>We retain data only as long as necessary to provide the Service or comply with legal obligations.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <UserCheck className="text-slate-500" size={24} />
              9. Your Rights
            </h2>
            <p>Depending on jurisdiction, you may:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Access your data</li>
              <li>Correct inaccuracies</li>
              <li>Request deletion</li>
              <li>Object to processing</li>
              <li>Withdraw consent</li>
            </ul>
            <p>Contact support to exercise rights.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Shield className="text-slate-500" size={24} />
              10. Children
            </h2>
            <p>The Service is not intended for minors.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Cookie className="text-slate-500" size={24} />
              11. Cookies & Tracking
            </h2>
            <p>We use cookies to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Maintain sessions</li>
              <li>Improve performance</li>
              <li>Analyze usage</li>
            </ul>
            <p>See Cookie Policy below.</p>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
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
