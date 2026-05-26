import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Brain, FileSearch, Video, ShieldCheck, LineChart, Sparkles, Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Button from '@/components/Button';
import GlassCard from '@/components/GlassCard';

export default function LandingPage() {
  const features = [
    { icon: FileSearch, title: 'Resume Screening', desc: 'AI automatically analyzes and ranks resumes based on JD matching.' },
    { icon: Brain, title: 'AI Interviewer', desc: 'Context-aware dynamic questioning simulating a real human interviewer.' },
    { icon: Video, title: 'Real-Time Monitoring', desc: 'Live behavior and engagement tracking during video interviews.' },
    { icon: ShieldCheck, title: 'Anti-Cheating Detection', desc: 'Advanced eye-tracking and tab-switch detection to ensure integrity.' },
    { icon: LineChart, title: 'AI Evaluation Reports', desc: 'Detailed scoring on technical, communication, and confidence metrics.' },
    { icon: Sparkles, title: 'JD-Based Questions', desc: 'Automatically generated technical questions tailored to your job description.' },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#fafbfe]">
      <Navbar />
      
      {/* Background Orbs */}
      <div className="absolute top-[-5%] left-[-10%] w-[32rem] h-[32rem] bg-blue-400/20 gradient-blob animate-float-1"></div>
      <div className="absolute top-[25%] right-[-10%] w-[36rem] h-[36rem] bg-cyan-400/25 gradient-blob animate-float-2" style={{ animationDelay: '2.5s' }}></div>
      <div className="absolute bottom-[-5%] left-[15%] w-[45rem] h-[45rem] bg-violet-400/20 gradient-blob animate-float-3" style={{ animationDelay: '5s' }}></div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 max-w-7xl mx-auto flex flex-col items-center text-center mt-12 z-10">
        <div className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-600 mb-8 animate-pulse shadow-sm">
          <Sparkles size={14} className="fill-blue-500/20" />
          <span className="text-xs font-bold uppercase tracking-wider">Introducing HireVision AI 2.0</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-slate-700 mb-8 max-w-5xl leading-[1.15]">
          Revolutionizing Hiring with <br />
          <span className="gradient-text-premium">AI-Powered Smart Interviews</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-3xl leading-relaxed">
          Automate your recruitment process with intelligent resume analysis, real-time behavioral monitoring, and comprehensive evaluation reports that spotlight the top 1% talent.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 mb-20 w-full sm:w-auto justify-center">
          <Link href="/candidate/upload" className="w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2.5 shadow-lg group">
              Upload Resume 
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/signup" className="w-full sm:w-auto">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto gap-2.5">
              Register as Company
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mx-auto">
          {[
            { value: '95%', label: 'Faster Screening Process', desc: 'Saves hundreds of hours manually reviewing applications.' },
            { value: '10x', label: 'Better Match Accuracy', desc: 'Identifies deep technical skills alignment automatically.' },
            { value: '50K+', label: 'Interviews Conducted', desc: 'Trusted by candidates and scaling teams globally.' }
          ].map((stat, i) => (
            <GlassCard key={i} className="text-center !p-8 border border-white/60 shadow-lg hover:shadow-xl transition-all rounded-3xl" hover>
              <h3 className="text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-3">{stat.value}</h3>
              <p className="text-sm font-bold text-slate-700 mb-2">{stat.label}</p>
              <p className="text-xs text-slate-400 font-medium leading-relaxed">{stat.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-28 bg-white/40 border-t border-slate-200/50 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 mb-4 font-bold text-xs uppercase tracking-wider">
              <Star size={12} className="fill-indigo-600/20" /> Capabilities
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-800 mb-5 tracking-tight">Enterprise-Grade AI Platform</h2>
            <p className="text-slate-500 max-w-3xl mx-auto text-lg leading-relaxed">Everything you need to assess talent, verify skills, and host flawless conversational assessments at scale.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <GlassCard key={i} hover className="border border-white/60 shadow-md hover:shadow-xl rounded-3xl !p-8 flex flex-col items-start text-left bg-white/50">
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 shadow-sm">
                    <Icon className="text-blue-600" size={26} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3 tracking-tight">{feature.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">{feature.desc}</p>
                </GlassCard>
              );
            })}
          </div>
        </div>
      </section>
      
      {/* Footer minimal */}
      <footer className="relative py-12 text-center text-slate-400 border-t border-slate-200/30 bg-white/60 backdrop-blur-md z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm font-semibold">&copy; {new Date().getFullYear()} HireVision AI. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-semibold text-slate-500">
            <a href="#" className="hover:text-blue-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-blue-600 transition-colors">Contact Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
