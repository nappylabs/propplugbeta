'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </Link>
            <div className="h-6 w-[1px] bg-zinc-700"></div>
            <span className="font-bold text-lg">Cookie Policy</span>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12">
        
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">Cookie & Tracking Technologies Policy</h1>
          <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Last Updated: February 2026</p>
        </div>

        {/* Main Content */}
        <div className="space-y-12 text-zinc-300 leading-relaxed">
          
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">1. Introduction</h2>
            <p>
              This Cookie & Tracking Technologies Policy explains how PropPlug (“we”, “us”, “our”) uses cookies, browser storage technologies, and similar tools when you use:
            </p>
            <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
              <li>Our website and web application (“Platform”)</li>
              <li>Our Chrome Extension (“Extension”)</li>
              <li>Any related services</li>
            </ul>
            <p>This Policy should be read together with our Privacy Policy and Terms of Use.</p>
            <p>We comply with the Protection of Personal Information Act, 2013 (POPIA) and, where applicable, international data protection laws.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">2. What Are Cookies and Similar Technologies?</h2>
            <p>Cookies are small data files stored on your device when you visit a website.</p>
            <p>Because our services include a browser extension, we also use <strong>Browser Storage Technologies</strong>. These may store data locally on your device without using traditional cookies:</p>
            <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
              <li>Local Storage</li>
              <li>Session Storage</li>
              <li>Chrome Storage API (local and session)</li>
              <li>IndexedDB (if applicable)</li>
              <li>Secure tokens stored in browser memory</li>
            </ul>
            <p>These technologies are collectively referred to as “Tracking Technologies” in this Policy. They do not access files outside your browser and cannot harm your device.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">3. Why We Use Tracking Technologies</h2>
            <p>We use these technologies to operate our services effectively, securely, and conveniently.</p>
            
            <h3 className="text-lg font-bold text-white mt-4">A. Essential Functionality</h3>
            <p>Required for the Platform or Extension to work properly. Examples:</p>
            <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
              <li>Keeping you logged in</li>
              <li>Saving settings and preferences</li>
              <li>Managing sessions securely</li>
              <li>Preventing fraud or abuse</li>
              <li>Enabling communication between the Extension and web application</li>
              <li>Maintaining saved deals, properties, and insights locally before syncing</li>
            </ul>
            <p className="text-sm text-zinc-500 italic">These technologies cannot be disabled without affecting service functionality.</p>

            <h3 className="text-lg font-bold text-white mt-4">B. Data Transfer Between Extension and Web App</h3>
            <p>Our Extension may capture information displayed on webpages that you choose to analyse (for example, property listing details). This data is:</p>
            <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
              <li>Processed locally in your browser</li>
              <li>Temporarily stored using browser storage</li>
              <li>Transmitted securely to your account on our Platform when you initiate an action (e.g., saving a deal)</li>
            </ul>
            <p>We do not continuously monitor browsing activity.</p>

            <h3 className="text-lg font-bold text-white mt-4">C. Performance and Analytics</h3>
            <p>We may use analytics tools to understand how users interact with our services. Examples include page visits, feature usage, error reporting, and user journey optimisation. Analytics data is typically aggregated and anonymised where possible.</p>

            <h3 className="text-lg font-bold text-white mt-4">D. Personalisation</h3>
            <p>To improve usability and relevance, we use technologies for remembering dashboard settings, saving profile preferences (Tenant, Owner, Investor), retaining comparison selections, and maintaining insight progress indicators.</p>

            <h3 className="text-lg font-bold text-white mt-4">E. Security</h3>
            <p>Tracking technologies help us detect suspicious activity, prevent unauthorised access, protect user accounts, and maintain system integrity.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">4. Types of Cookies and Storage Used</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mt-4">
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <h4 className="font-bold text-white mb-2">Session Technologies</h4>
                    <p className="text-sm mb-2">Temporary storage that exists only while your browser is open.</p>
                    <ul className="list-disc pl-4 space-y-1 text-sm marker:text-orange-500">
                        <li>Login sessions</li>
                        <li>Temporary data processing</li>
                        <li>Navigation continuity</li>
                    </ul>
                </div>
                <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
                    <h4 className="font-bold text-white mb-2">Persistent Technologies</h4>
                    <p className="text-sm mb-2">Stored on your device until deleted or expired.</p>
                    <ul className="list-disc pl-4 space-y-1 text-sm marker:text-orange-500">
                        <li>Preferences</li>
                        <li>Remembering settings</li>
                        <li>Improving return visits</li>
                        <li>Maintaining saved states</li>
                    </ul>
                </div>
            </div>

            <h3 className="text-lg font-bold text-white mt-4">First-Party Technologies</h3>
            <p>Set directly by us and used only for our services.</p>

            <h3 className="text-lg font-bold text-white mt-4">Third-Party Technologies</h3>
            <p>We may use trusted service providers for analytics, infrastructure, error monitoring, and payment processing. These providers may place their own cookies subject to their policies. We do not sell personal data to advertisers.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">5. Chrome Extension–Specific Storage Use</h2>
            <p>Because browser extensions operate differently from websites, our Extension uses Chrome’s secure storage systems:</p>
            <ul className="list-disc pl-6 space-y-2 marker:text-orange-500">
              <li><strong>Chrome Storage API (Local):</strong> Used to store user settings, temporary property data before saving, extension preferences, and authentication tokens.</li>
              <li><strong>Chrome Storage API (Session):</strong> Used for short-term data required during active usage.</li>
              <li><strong>Local / Session Storage:</strong> Used for UI state, caching, and performance improvements.</li>
            </ul>
            <p>These storage areas are sandboxed to the extension and not accessible by other websites.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">6. Screen Content Processing</h2>
            <p>When you activate the Extension on a webpage:</p>
            <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
              <li>The Extension reads content currently displayed on your screen to extract relevant data (e.g., listing information)</li>
              <li>Processing occurs locally in your browser</li>
              <li>Data is only transmitted to our servers when you choose to save or analyse it</li>
            </ul>
            <p>We do not collect unrelated browsing data.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">7. Managing Cookies and Storage</h2>
            <p>You can control cookies through your browser settings, including blocking cookies, deleting stored data, or restricting third-party cookies. However, disabling essential technologies may prevent the Platform or Extension from functioning correctly.</p>
            <p>For Chrome Extension storage, data can be cleared by removing the Extension, clearing browser site data, or logging out of the Platform.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">8. Consent</h2>
            <p>By using our Platform or Extension, you consent to the use of essential cookies and storage technologies necessary for service delivery. Where legally required, we will request consent for non-essential tracking technologies. You may withdraw consent at any time by adjusting browser settings or discontinuing use of the services.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">9. Links to Third-Party Websites</h2>
            <p>Our services may contain links to external websites. We are not responsible for their cookie practices, privacy policies, or data collected on those platforms. Users should review those policies independently.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">10. Data Protection and POPIA Compliance</h2>
            <p>Under POPIA, cookies and device identifiers may constitute personal information where they can identify a user. We process such information in accordance with lawfulness, minimality, purpose limitation, security safeguards, and user rights. Personal information collected through tracking technologies is handled according to our Privacy Policy.</p>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-white">11. Updates to This Policy</h2>
            <p>We may update this Policy periodically to reflect legal changes, technological developments, or service improvements. Material changes will be communicated through the Platform or Extension.</p>
          </section>

        </div>
      </main>
    </div>
  );
}
