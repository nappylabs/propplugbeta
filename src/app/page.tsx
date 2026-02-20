'use client';
import { useState } from 'react';
import { Logo } from "@/shared/components/Logo";
import { 
  Check, ArrowRight, Zap, Shield, Database, 
  BarChart3, ChevronDown, Plus, Minus,
  Twitter, Linkedin, Github
} from 'lucide-react';
import Link from 'next/link';

const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25'%3E%3Crect width='100%25' height='100%25' fill='%23e2e8f0'/%3E%3C/svg%3E";

export default function LandingPage() {
  const [activeBenefit, setActiveBenefit] = useState(0);
  const [activeProfile, setActiveProfile] = useState('investor');
  const [isAnnual, setIsAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // --- DATA OBJECTS ---
  const benefits = [
    { title: "Automated Scraper", desc: "Instantly pull data from Property24 or Private Property without lifting a finger.", icon: <Zap />, img: "benefit_1_scrapper.png" },
    { title: "Red-Flag Detection", desc: "Identify low-yield or high-cost traps before you even click 'Contact Agent'.", icon: <Shield />, img: "benefit_2_insights.png" },
    { title: "Deal Repository", desc: "A central hub for every property you've ever screened. No more lost tabs.", icon: <Database />, img: "benefit_3_repository.png" },
    { title: "Advanced Projections", desc: "10-year wealth modeling that factors in SARB hikes and inflation.", icon: <BarChart3 />, img: "benefit_4_analysis.png" },
  ];

  const profiles = {
    investor: { title: "The Investor", points: ["Net/Gross Yield", "Velocity ROI (Flips)", "Cash-on-Cash"], img: "investor_view.png" },
    owner: { title: "The Homeowner", points: ["Interest Rate Shield", "Equity Growth", "Affordability Stress Test"], img: "owner_view.png" },
    tenant: { title: "The Tenant", points: ["Rent vs. Buy Analysis", "Opportunity Cost", "Savings Goals"], img: "tenant_view.png" }
  };

  const faqs = [
    { q: "Is the data accurate for the South African market?", a: "Yes. PropPlug is specifically calibrated for SA lending rates, transfer duties, and property taxes. We sync directly with SARB interest rate trends." },
    { q: "Do I need a paid account to use the Chrome Extension?", a: "The extension is free to install and use for live screening. Saving deals and deep-dashboard analysis require a Core subscription." },
    { q: "Can I cancel my subscription anytime?", a: "Absolutely. No contracts, no friction. You can switch between monthly and annual plans or cancel directly from your dashboard." },
    { q: "Does it work on international sites?", a: "While we support global currency detection, our deep logic (tax/levies) is currently optimized for South Africa, the UK, and Kenya." }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 selection:bg-indigo-100 scroll-smooth">
      
      {/* 🎀 Navigation Ribbon */}
      <nav className="max-w-5xl mx-auto mt-6 px-6 py-3 flex justify-between items-center bg-white/90 backdrop-blur-xl sticky top-6 z-[100] border border-slate-200 rounded-full shadow-xl">
        <Logo />
        <div className="flex items-center gap-6">
          <a href="#demo" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">Demo</a>
          <a href="#pricing" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden md:block">Pricing</a>
          <div className="h-4 w-[1px] bg-slate-200 hidden md:block"></div>
          <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors">
            Login
          </Link>
          <Link href="/signup" className="group flex items-center gap-2 px-5 py-2.5 bg-[#0F172A] text-white rounded-full font-bold text-xs hover:bg-slate-800 hover:scale-105 transition-all shadow-md">
            Start Free Trial <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* 🎯 Section 1: Hero */}
      <header className="max-w-7xl mx-auto px-6 pt-24 pb-32 grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
            <Zap size={14} className="animate-pulse" /> Stop Guessing, Start Winning
          </div>
          <h1 className="text-6xl md:text-8xl font-black leading-[0.95] tracking-tighter text-[#0F172A]">
            Kill Analysis Paralysis. <br />
            Find That <span className="text-indigo-600 inline-block hover:animate-vibrate hover:scale-105 transition-transform cursor-help">10/10 Deal</span> Fast.
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-lg">
            PropPlug is the high-fidelity bridge between a property listing and a profitable decision. Screen deals in seconds, not hours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="https://chrome.google.com/webstore" target="_blank" className="px-8 py-4 bg-white text-[#0F172A] border-2 border-slate-200 rounded-3xl font-bold text-lg hover:border-[#0F172A] hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
              Install Extension <Zap size={20} />
            </a>
            <Link href="/signup" className="px-8 py-4 bg-[#0F172A] text-white rounded-3xl font-bold text-lg hover:-translate-y-1 hover:shadow-card-hover transition-all flex items-center justify-center gap-2 group">
              Start Free 5-day Trial <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
        <div className="relative group">
          <div className="absolute -inset-10 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-3xl rounded-full"></div>
          <div className="relative bg-white border border-slate-200 rounded-[3rem] shadow-2xl overflow-hidden aspect-[4/3]">
             <img src="/hero_preview.png" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} alt="PropPlug Dashboard Preview" className="w-full h-full object-cover" />
          </div>
        </div>
      </header>

      {/* 🛑 Section 2: Benefits Carousel (The Red Flag Detector) */}
      <section id="demo" className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-5xl font-black text-[#0F172A] mb-4">Avoid shady deals. <br/>Find red flags fast.</h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Professional-grade intelligence for the everyday buyer.</p>
          </div>

          <div className="grid lg:grid-cols-12 gap-16 items-start">
            <div className="lg:col-span-5 space-y-4">
              {benefits.map((b, i) => (
                <button 
                  key={i}
                  onClick={() => setActiveBenefit(i)}
                  className={`w-full text-left p-8 rounded-[2rem] transition-all flex items-start gap-6 border-2 ${activeBenefit === i ? 'bg-indigo-50 border-indigo-600 shadow-lg' : 'bg-transparent border-transparent hover:bg-slate-50'}`}
                >
                  <div className={`p-3 rounded-2xl ${activeBenefit === i ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400 border border-slate-200'}`}>
                    {b.icon}
                  </div>
                  <div>
                    <h4 className="font-black text-lg mb-1">{b.title}</h4>
                    <p className={`text-sm leading-relaxed ${activeBenefit === i ? 'text-indigo-900/70 font-medium' : 'text-slate-400'}`}>{b.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <div className="lg:col-span-7 aspect-video bg-slate-50 rounded-[3rem] border border-slate-200 overflow-hidden shadow-inner flex items-center justify-center relative">
               <img src={`/${benefits[activeBenefit].img}`} onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} alt={benefits[activeBenefit].title} className="w-[90%] rounded-2xl shadow-2xl transition-all duration-700" />
            </div>
          </div>
        </div>
      </section>

      {/* 👤 Section 3: Profile Switcher */}
      <section className="py-32 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black mb-4 uppercase tracking-tight">Pick Your Persona</h2>
            <div className="flex justify-center gap-4 bg-white p-2 rounded-full w-fit mx-auto shadow-sm border border-slate-200">
              {Object.keys(profiles).map((p) => (
                <button 
                  key={p} 
                  onClick={() => setActiveProfile(p)}
                  className={`px-8 py-3 rounded-full font-bold text-sm transition-all ${activeProfile === p ? 'bg-[#0F172A] text-white shadow-lg' : 'text-slate-500 hover:text-indigo-600'}`}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center bg-white p-12 rounded-[4rem] shadow-xl border border-slate-100">
            <div className="space-y-8">
              <h3 className="text-5xl font-black text-indigo-600 tracking-tighter">{profiles[activeProfile as keyof typeof profiles].title}</h3>
              <ul className="space-y-4">
                {profiles[activeProfile as keyof typeof profiles].points.map((pt, i) => (
                  <li key={i} className="flex items-center gap-4 font-bold text-xl text-slate-700">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center text-green-600"><Check size={14} strokeWidth={4} /></div>
                    {pt}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-[2.5rem] overflow-hidden shadow-2xl">
               <img src={`/${profiles[activeProfile as keyof typeof profiles].img}`} onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} alt="Profile Preview" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* 🚀 Section 4: Step-by-Step Guide */}
      <section className="py-32 bg-white overflow-hidden">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-6xl font-black text-[#0F172A] tracking-tighter">Screen and build your <br/>deal book in seconds.</h2>
          </div>
          <div className="space-y-40">
            <Step number="01" title="Plug In" desc="Launch the extension on Property24 or Private Property." img="step_1_extension.png" />
            <Step number="02" title="Screen" desc="Confirm price and rent to see instant yield and cashflow." img="step_2_screen.png" reverse />
            <Step number="03" title="Save" desc="Add potential wins to your repository for deep analysis." img="step_3_save.png" />
            <Step number="04" title="Analyze" desc="Stress-test every variable in the Pro Dashboard." img="step_4_dashboard.png" reverse />
          </div>
        </div>
      </section>

      {/* 💰 Section 5: Pricing */}
      <section id="pricing" className="py-32 bg-[#F8FAFC]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-5xl font-black mb-16">Simple, Honest Pricing.</h2>
          <div className="flex items-center justify-center gap-6 mb-20 bg-white p-3 rounded-full w-fit mx-auto shadow-sm border border-slate-200">
            <span className={`text-sm font-bold ${!isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Monthly</span>
            <button onClick={() => setIsAnnual(!isAnnual)} className="w-16 h-9 bg-slate-200 rounded-full relative p-1 transition-all">
              <div className={`w-7 h-7 bg-white rounded-full shadow-lg transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-sm font-bold ${isAnnual ? 'text-indigo-600' : 'text-slate-400'}`}>Annual <span className="text-[10px] bg-indigo-100 text-indigo-700 px-2 py-1 rounded-md ml-2 font-black uppercase tracking-widest">SAVE 20%</span></span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PriceCard name="Free" price="0" features={['Extension Access', 'Quick Screen View', 'Limited Dashboard']} cta="Install Free" />
            <PriceCard name="Core" price={isAnnual ? '199' : '249'} popular features={['Save Unlimited Projects', 'Advanced Flip Logic', '10-Yr Projections', 'Custom Assumptions']} cta="Get Full Access" />
          </div>
        </div>
      </section>

      {/* 🙋‍♂️ Section 6: FAQ Accordion */}
      <section className="py-32 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-4xl font-black text-center mb-16 uppercase tracking-widest">Questions?</h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-slate-200 rounded-[2rem] overflow-hidden transition-all">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 text-left flex justify-between items-center hover:bg-slate-50 transition-colors"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  {openFaq === i ? <Minus size={20} /> : <Plus size={20} />}
                </button>
                <div className={`px-8 transition-all duration-300 ease-in-out ${openFaq === i ? 'pb-8 max-h-40 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                  <p className="text-slate-500 font-medium leading-relaxed">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 🏁 Footer */}
      <footer className="bg-[#0F172A] text-white py-20">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <Logo variant="full" />
            <p className="text-slate-400 text-sm font-medium">Helping South African property buyers make data-driven decisions since 2024.</p>
            <div className="flex gap-4">
              <Twitter size={20} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Linkedin size={20} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
              <Github size={20} className="text-slate-500 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-indigo-400">Product</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li className="hover:text-white cursor-pointer">Chrome Extension</li>
              <li className="hover:text-white cursor-pointer">Web Dashboard</li>
              <li className="hover:text-white cursor-pointer">Pricing</li>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-6 uppercase tracking-widest text-xs text-indigo-400">Company</h4>
            <ul className="space-y-4 text-slate-400 text-sm font-bold">
              <li className="hover:text-white cursor-pointer">About Us</li>
              <li>
                <Link href="/privacy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</Link>
              </li>
              <li className="hover:text-white cursor-pointer">Terms of Service</li>
            </ul>
          </div>
          <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700">
            <h4 className="font-black mb-2 uppercase tracking-widest text-xs">Stay Sharp</h4>
            <p className="text-slate-400 text-xs mb-4 font-bold">Get monthly property market insights.</p>
            <div className="flex gap-2">
              <input type="email" placeholder="Email" className="bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-sm w-full outline-none focus:border-indigo-500 transition-all" />
              <button className="bg-indigo-600 p-2 rounded-xl hover:bg-indigo-700 transition-all"><ArrowRight size={18} /></button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-20 pt-8 border-t border-slate-800 text-center text-slate-500 text-xs font-bold">
          © 2026 PropPlug. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

// --- Helper Components ---

function Step({ number, title, desc, img, reverse }: any) {
  return (
    <div className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-24 group`}>
      <div className="flex-1 text-left space-y-6">
        <span className="text-8xl font-black text-slate-100 group-hover:text-indigo-50 transition-colors">{number}</span>
        <h3 className="text-4xl font-black text-[#0F172A] tracking-tighter">{title}</h3>
        <p className="text-xl text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
      <div className="flex-1 bg-white p-4 rounded-[3.5rem] shadow-2xl border border-slate-100 transform group-hover:scale-105 transition-transform duration-500">
        <img src={`/${img}`} onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} alt={title} className="w-full h-full object-contain rounded-[2.5rem]" />
      </div>
    </div>
  );
}

function PriceCard({ name, price, features, cta, popular }: any) {
  return (
    <div className={`p-12 rounded-[3.5rem] text-left border-2 transition-all hover:-translate-y-4 ${popular ? 'border-indigo-600 bg-white shadow-card-hover relative' : 'border-slate-100 bg-slate-50'}`}>
      {popular && <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest">Growth Plan</span>}
      <h3 className="text-2xl font-black mb-4">{name}</h3>
      <div className="mb-10">
        <span className="text-5xl font-black">R {price}</span>
        <span className="text-slate-400 font-bold ml-1">/month</span>
      </div>
      <ul className="space-y-5 mb-12">
        {features.map((f: any) => (
          <li key={f} className="flex items-center gap-4 text-slate-600 font-bold">
            <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center"><Check size={12} strokeWidth={4} /></div>
            {f}
          </li>
        ))}
      </ul>
      <button className={`w-full py-6 rounded-3xl font-black text-xl transition-all ${popular ? 'bg-indigo-600 text-white shadow-lg hover:bg-indigo-700' : 'bg-[#0F172A] text-white hover:bg-slate-800'}`}>
        {cta}
      </button>
    </div>
  );
}
