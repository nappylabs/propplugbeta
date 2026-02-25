'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, Download } from 'lucide-react';
import { Logo } from '@/shared/components/Logo';

export default function PaiaManualPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans selection:bg-orange-500/30">
      <nav className="border-b border-zinc-800 bg-zinc-900 px-6 py-4 flex justify-between items-center sticky top-0 z-50 print:hidden">
        <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors">
                <ArrowLeft size={20} /> Back to Home
            </Link>
            <div className="h-6 w-[1px] bg-zinc-700"></div>
            <span className="font-bold text-lg">PAIA Manual</span>
        </div>
        <div className="h-8 w-8 flex items-center justify-center text-white"><Logo /></div>
      </nav>

      <main className="max-w-4xl mx-auto p-6 py-12 space-y-12 print:py-12 print:px-8 print:max-w-none">
        
        {/* Header */}
        <div className="space-y-6 border-b border-zinc-800 pb-12">
          <div className="flex items-center gap-3 text-orange-500 mb-2 print:hidden">
            <FileText size={32} />
            <span className="font-bold tracking-widest uppercase">Regulatory Compliance</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-zinc-900 print:text-black dark:text-white">PAIA MANUAL</h1>
          <p className="text-xl text-zinc-400">Prepared in terms of Section 51 of the Promotion of Access to Information Act, 2000</p>
          
          <div className="flex flex-col md:flex-row gap-6 text-sm text-zinc-500 font-mono mt-8">
            <div>
                <span className="block text-zinc-600 uppercase text-xs font-bold mb-1">Entity</span>
                PROPLUG (PTY) LTD
            </div>
            <div>
                <span className="block text-zinc-600 uppercase text-xs font-bold mb-1">Last Updated</span>
                February 2026
            </div>
            <button onClick={() => window.print()} className="md:ml-auto flex items-center gap-2 text-orange-500 hover:text-orange-400 transition-colors print:hidden font-bold">
                <Download size={16} /> Download / Print PDF
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-12 text-zinc-300 leading-relaxed print:text-black">
            {/* Section 1 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">01</span>
                    Business and Contact Details
                </h2>
                <div className="grid md:grid-cols-2 gap-8 bg-zinc-900/50 print:bg-transparent p-6 rounded-2xl border border-zinc-800 print:border-gray-300">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">General Information</h3>
                            <ul className="space-y-2 text-sm">
                                <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Name:</span> PropPlug (Proprietary) Limited</li>
                                <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Reg No:</span> [Insert Reg Number]</li>
                                <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Website:</span> [Insert URL]</li>
                                <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Email:</span> [Insert Email]</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Address</h3>
                            <p className="text-sm text-zinc-400">[Insert Physical Address]</p>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-wider mb-1">Information Officer</h3>
                        <p className="text-sm text-zinc-400 mb-4">In terms of POPIA, the CEO acts as the Information Officer.</p>
                        <ul className="space-y-2 text-sm">
                            <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Name:</span> [Founder/CEO Name]</li>
                            <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Email:</span> [Insert compliance email]</li>
                            <li className="flex gap-2"><span className="text-zinc-500 w-24 shrink-0">Tel:</span> [Insert number]</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 2 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">02</span>
                    Introduction
                </h2>
                <p>This Manual is prepared in accordance with Section 51 of the Promotion of Access to Information Act (“PAIA”). PAIA gives effect to Section 32 of the Constitution of the Republic of South Africa.</p>
                <p>PropPlug (Pty) Ltd is a private body providing property analysis software through:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-orange-500">
                    <li>A web-based software-as-a-service platform</li>
                    <li>A Chrome browser extension</li>
                    <li>Associated digital services</li>
                </ul>
            </section>

            {/* Section 3 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">03</span>
                    Guide Issued by the Information Regulator
                </h2>
                <p>The Information Regulator has compiled a Guide in terms of Section 10 of PAIA. The Guide is available from:</p>
                <div className="bg-zinc-900 print:bg-gray-100 p-4 rounded-xl border border-zinc-800 print:border-gray-300 inline-block">
                    <p className="font-bold text-white print:text-black">Information Regulator South Africa</p>
                    <a href="https://inforegulator.org.za" target="_blank" className="block text-orange-500 hover:underline text-sm mt-1">https://inforegulator.org.za</a>
                    <a href="mailto:enquiries@inforegulator.org.za" className="block text-zinc-400 hover:text-white print:text-black text-sm mt-1">enquiries@inforegulator.org.za</a>
                </div>
            </section>

            {/* Section 4 */}
            <section className="space-y-6 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">04</span>
                    Records Held by PropPlug
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <RecordCategory title="Corporate Records" items={["Company registration documents", "Memorandum of Incorporation", "Shareholder records", "Board resolutions", "Statutory returns"]} />
                    <RecordCategory title="Financial Records" items={["Annual financial statements", "Tax & VAT records", "Banking records", "Subscription billing records", "Payment processor reports"]} />
                    <RecordCategory title="Operational & Client Records" items={["User account registration data", "Saved property analyses", "User-generated notes", "Support requests", "Client agreements"]} />
                    <RecordCategory title="IT Records" items={["System architecture", "Security policies", "Access control logs", "Backup procedures", "Chrome extension configuration"]} />
                    <RecordCategory title="Product Records" items={["Product specifications", "Feature roadmaps", "Source code repositories (restricted)", "R&D documentation"]} />
                </div>
            </section>

            {/* Section 5 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">05</span>
                    Processing of Personal Information (POPIA)
                </h2>
                <p>PropPlug processes personal information in accordance with POPIA.</p>
                
                <div className="space-y-6 mt-4">
                    <div>
                        <h3 className="text-lg font-bold text-white print:text-black mb-2">Categories of Data Subjects</h3>
                        <div className="flex flex-wrap gap-2">
                            {["Registered users", "Prospective users", "Website visitors", "Employees", "Service providers"].map((item, i) => (
                                <span key={i} className="px-3 py-1 bg-zinc-800 print:bg-gray-200 print:text-black rounded-full text-xs text-zinc-300 border border-zinc-700 print:border-gray-300">{item}</span>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-white print:text-black mb-2">Purpose of Processing</h3>
                        <ul className="list-disc pl-6 space-y-1 marker:text-orange-500 text-sm">
                            <li>Providing SaaS services</li>
                            <li>Managing subscriptions</li>
                            <li>Improving platform functionality</li>
                            <li>Customer support</li>
                            <li>Legal compliance</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Section 6 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">06</span>
                    Records Available Without Request
                </h2>
                <ul className="grid sm:grid-cols-2 gap-2">
                    {["Privacy Policy", "Terms of Use", "Cookie Policy", "Product descriptions", "Marketing materials", "Website content"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-zinc-400 print:text-black">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> {item}
                        </li>
                    ))}
                </ul>
            </section>

            {/* Section 7 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">07</span>
                    Request Procedure
                </h2>
                <div className="bg-zinc-900 print:bg-gray-100 p-6 rounded-2xl border border-zinc-800 print:border-gray-300">
                    <p className="mb-4">Requests must be submitted in writing to the Information Officer at: <span className="text-orange-500 font-bold">[Insert PAIA email]</span></p>
                    <p className="text-sm text-zinc-500 font-bold uppercase tracking-wider mb-2">The request must:</p>
                    <ul className="list-disc pl-6 space-y-1 marker:text-zinc-600 text-sm text-zinc-400 print:text-black">
                        <li>Identify the record requested</li>
                        <li>Identify the requester</li>
                        <li>Specify the right to be exercised or protected</li>
                        <li>Explain why the record is required</li>
                        <li>Provide proof of authority if acting on behalf of another person</li>
                    </ul>
                </div>
            </section>

            {/* Section 8 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">08</span>
                    Grounds for Refusal
                </h2>
                <p>Access may be refused where disclosure would:</p>
                <ul className="list-disc pl-6 space-y-1 marker:text-rose-500 text-sm">
                    <li>Unreasonably disclose personal information</li>
                    <li>Reveal trade secrets or harm commercial interests</li>
                    <li>Breach confidentiality obligations</li>
                    <li>Compromise security measures</li>
                </ul>
            </section>

            {/* Section 9 */}
            <section className="space-y-4 break-inside-avoid">
                <h2 className="text-2xl font-bold text-white print:text-black flex items-center gap-3">
                    <span className="bg-zinc-800 print:bg-gray-200 print:text-black w-8 h-8 flex items-center justify-center rounded-lg text-sm text-zinc-400">09</span>
                    Fees
                </h2>
                <p>Fees are prescribed by regulations under PAIA.</p>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between border-b border-zinc-800 print:border-gray-300 pb-2">
                        <span>Request Fee</span>
                        <span className="text-zinc-500">Payable for non-personal requests</span>
                    </li>
                    <li className="flex justify-between border-b border-zinc-800 print:border-gray-300 pb-2">
                        <span>Access Fee</span>
                        <span className="text-zinc-500">For reproduction/preparation</span>
                    </li>
                </ul>
            </section>

        </div>
      </main>
    </div>
  );
}

function RecordCategory({ title, items }: { title: string, items: string[] }) {
    return (
        <div className="bg-zinc-900/30 print:bg-gray-50 p-5 rounded-xl border border-zinc-800/50 print:border-gray-300 hover:border-zinc-700 transition-colors break-inside-avoid">
            <h3 className="font-bold text-white print:text-black mb-3 text-sm">{title}</h3>
            <ul className="space-y-1.5">
                {items.map((item, i) => (
                    <li key={i} className="text-xs text-zinc-400 print:text-black flex items-start gap-2">
                        <span className="text-zinc-600 mt-0.5">•</span> {item}
                    </li>
                ))}
            </ul>
        </div>
    );
}
