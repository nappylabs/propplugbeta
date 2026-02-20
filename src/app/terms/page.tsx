'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Scale, AlertCircle } from 'lucide-react';
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
            Please read these terms carefully before using PropPlug. By using our service, you agree to be bound by these terms.
          </p>
          <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Last Updated: February 2026</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-slate-300 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <FileText className="text-slate-500" size={24} />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using the PropPlug Chrome Extension and Web Dashboard ("Service"), you accept and agree to be bound by the terms and provision of this agreement. In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <Scale className="text-slate-500" size={24} />
              2. Use of Service
            </h2>
            <p>
              PropPlug provides real estate analysis tools for informational purposes only. The Service does not constitute financial, legal, or real estate advice. You agree to use the Service only for lawful purposes and in a way that does not infringe the rights of, restrict or inhibit anyone else's use and enjoyment of the Service.
            </p>
            <ul className="list-disc pl-6 space-y-2 marker:text-indigo-500">
              <li>You are responsible for maintaining the confidentiality of your account and password.</li>
              <li>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service.</li>
              <li>Automated scraping of our dashboard or reverse engineering of our extension is strictly prohibited.</li>
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Subscription & Billing</h2>
            <p>
              Certain features of the Service are billed on a subscription basis ("Subscription(s)"). You will be billed in advance on a recurring and periodic basis ("Billing Cycle"). Billing cycles are set either on a monthly or annual basis, depending on the type of subscription plan you select when purchasing a Subscription.
            </p>
            <p>
              You may cancel your Subscription at any time. Your cancellation will take effect at the end of the current paid term.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
              <AlertCircle className="text-slate-500" size={24} />
              4. Disclaimer of Warranties
            </h2>
            <p>
              The Service is provided on an "AS IS" and "AS AVAILABLE" basis. PropPlug makes no representations or warranties of any kind, express or implied, as to the operation of their services, or the information, content, or materials included therein. You expressly agree that your use of these services, their content, and any services or items obtained from us is at your sole risk.
            </p>
            <p>
              We do not guarantee the accuracy of property data scraped from third-party websites, as this data is subject to change and formatting errors on the source sites.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Limitation of Liability</h2>
            <p>
              In no event shall PropPlug, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Contact Us</h2>
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