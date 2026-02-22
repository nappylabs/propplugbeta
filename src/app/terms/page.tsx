'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertCircle, CreditCard, Database, ShieldAlert, Cookie, Users, Gavel, Lock } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-indigo-500/30">
      <nav className="border-b border-slate-800 bg-[#0F172A] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </Link>
            <div className="h-6 w-[1px] bg-slate-700"></div>
            <span className="font-bold text-lg">Terms of Service</span>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Terms of Service</h1>
          <p className="text-xl text-slate-400 leading-relaxed">
            These Terms govern your use of PropPlug’s Chrome Extension, web dashboard, mobile interfaces, and related services (“Service”). By using the Service, you agree to these Terms.
          </p>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Last Updated: February 2026</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-slate-300 leading-relaxed">
          
          {/* 1) TERMS OF SERVICE */}
          <section className="space-y-4">
            <h2 className="text-3xl font-black text-white mb-6 border-b border-slate-800 pb-4">1. Terms of Service</h2>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold text-white mb-2">1. Who We Are</h3>
                <p>PropPlug is a software platform that analyzes publicly available real estate listings and user-provided data to generate financial insights.</p>
                <p>The Service is for informational purposes only.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">2. Eligibility</h3>
                <p>You must:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Be at least 18 years old</li>
                  <li>Have legal capacity to enter contracts</li>
                  <li>Provide accurate information</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">3. Accounts</h3>
                <p>You are responsible for:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Maintaining account security</li>
                  <li>All activity under your account</li>
                  <li>Keeping login credentials confidential</li>
                </ul>
                <p className="mt-2">We may suspend accounts for misuse or violations.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">4. Subscription & Billing</h3>
                <p>Subscriptions are billed:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Monthly or annually in advance</li>
                  <li>Automatically renewed unless cancelled</li>
                </ul>
                <p className="mt-2">Cancellation stops future billing but does not retroactively refund prior payments.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">5. Free Trials</h3>
                <p>If a trial converts to paid:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Billing begins automatically unless cancelled before trial end</li>
                  <li>One trial per user unless otherwise stated</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">6. Refund Policy</h3>
                <p>Except where required by law:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Fees are non-refundable</li>
                  <li>No refunds for partial periods</li>
                  <li>See Refund Policy below for details</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">7. Permitted Use</h3>
                <p>You may use PropPlug for personal or business decision support.</p>
                <p className="mt-2">You may NOT:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Reverse engineer the software</li>
                  <li>Resell or redistribute the Service</li>
                  <li>Scrape PropPlug systems</li>
                  <li>Use the Service for illegal activity</li>
                  <li>Interfere with system integrity</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">8. Data Accuracy & Third-Party Sources</h3>
                <p>Property data is collected from publicly available listings.</p>
                <p className="mt-2">We do not guarantee:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Accuracy</li>
                  <li>Completeness</li>
                  <li>Timeliness</li>
                  <li>Availability</li>
                </ul>
                <p className="mt-2">You must independently verify all information.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">9. No Professional Advice</h3>
                <p>PropPlug does NOT provide:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Financial advice</li>
                  <li>Investment advice</li>
                  <li>Legal advice</li>
                  <li>Real estate advice</li>
                </ul>
                <p className="mt-2">Use at your own risk.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">10. Intellectual Property</h3>
                <p>All software, design, algorithms, and content belong to PropPlug.</p>
                <p>You receive a limited, non-exclusive license to use the Service.</p>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">11. Limitation of Liability</h3>
                <p>To the maximum extent permitted by law:</p>
                <p className="mt-2">PropPlug is not liable for:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Investment losses</li>
                  <li>Business losses</li>
                  <li>Indirect or consequential damages</li>
                  <li>Loss of profits or opportunities</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">12. Termination</h3>
                <p>We may suspend or terminate access for:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-indigo-500">
                  <li>Terms violations</li>
                  <li>Fraudulent activity</li>
                  <li>Abuse of the platform</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-2">13. Governing Law</h3>
                <p>For South African users: laws of South Africa</p>
                <p>For Kenyan users: laws of Kenya</p>
                <p className="mt-2">Disputes resolved in competent courts of the applicable jurisdiction.</p>
              </div>
            </div>
          </section>

          {/* 3) REFUND & BILLING POLICY */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <CreditCard className="text-slate-500" size={24} />
              Refund & Billing Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Subscriptions are billed in advance</li>
              <li>No refunds for unused time</li>
              <li>Cancellation stops future billing only</li>
              <li>Refunds may be issued at our discretion for technical failures</li>
              <li>If local law requires refunds, those provisions apply.</li>
            </ul>
          </section>

          {/* 4) DATA & SCRAPING USE POLICY */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Database className="text-slate-500" size={24} />
              Public Listing Data Policy
            </h2>
            <p>PropPlug processes property data from publicly available listing pages solely to provide analytics for users.</p>
            <p>We:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Do not republish listing content</li>
              <li>Do not claim ownership of listing data</li>
              <li>Store only user-saved information</li>
              <li>Respect website terms where applicable</li>
            </ul>
            <p>Users remain responsible for compliance with listing site terms.</p>
          </section>

          {/* 5) ACCEPTABLE USE POLICY */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <ShieldAlert className="text-slate-500" size={24} />
              Acceptable Use Policy
            </h2>
            <p>Users must not:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Use PropPlug for illegal purposes</li>
              <li>Upload harmful content</li>
              <li>Attempt unauthorized access</li>
              <li>Interfere with service operations</li>
              <li>Use automated tools against PropPlug</li>
            </ul>
            <p>Violations may result in account termination.</p>
          </section>

          {/* 6) FINANCIAL & REAL ESTATE DISCLAIMER */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertCircle className="text-slate-500" size={24} />
              Financial & Real Estate Disclaimer
            </h2>
            <p>PropPlug provides analytical tools only.</p>
            <p>We do not guarantee investment outcomes.</p>
            <p>Real estate involves risk, including loss of capital.</p>
            <p>Always consult qualified professionals before making decisions.</p>
          </section>

          {/* 7) COOKIE POLICY */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Cookie className="text-slate-500" size={24} />
              Cookie Policy
            </h2>
            <p>We use cookies and similar technologies to:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Enable login sessions</li>
              <li>Store preferences</li>
              <li>Analyze usage</li>
              <li>Improve performance</li>
            </ul>
            <p>You may disable cookies via browser settings, though functionality may be affected.</p>
          </section>

          {/* 8) AFFILIATE TERMS */}
          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Users className="text-slate-500" size={24} />
              Affiliate Terms (Optional)
            </h2>
            <p>If you plan affiliate marketing:</p>
            <p>Affiliates must:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>Disclose promotional relationships</li>
              <li>Avoid misleading claims</li>
              <li>Not impersonate PropPlug</li>
              <li>Not engage in spam marketing</li>
            </ul>
            <p>Commissions may be withheld for fraud or policy violations.</p>
          </section>

          <section className="space-y-4 pt-8 border-t border-slate-800">
            <h2 className="text-xl font-bold text-white">Contact Us</h2>
            <p>
              If you have any questions about these Terms, please contact us at:
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