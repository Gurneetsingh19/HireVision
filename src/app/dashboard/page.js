import { Users, Video, AlertTriangle, TrendingUp, Plus, ArrowRight, Server, Sparkles } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';
import Link from 'next/link';

export default function CompanyDashboard() {
  const stats = [
    { label: 'Total Candidates', value: '1,248', icon: Users, color: 'text-blue-600', bg: 'bg-blue-500/10', border: 'border-blue-500/10' },
    { label: 'Interviews Completed', value: '856', icon: Video, color: 'text-cyan-600', bg: 'bg-cyan-500/10', border: 'border-cyan-500/10' },
    { label: 'Suspicious Activities', value: '12', icon: AlertTriangle, color: 'text-rose-500', bg: 'bg-rose-500/10', border: 'border-rose-500/10' },
    { label: 'Hired This Month', value: '24', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-500/10', border: 'border-purple-500/10' },
  ];

  const candidates = [
    { id: 1, name: 'Alice Freeman', role: 'Senior React Developer', score: 92, status: 'Interview Completed', risk: 'Low' },
    { id: 2, name: 'Bob Smith', role: 'Backend Engineer', score: 85, status: 'Interview Completed', risk: 'Medium' },
    { id: 3, name: 'Charlie Davis', role: 'Product Manager', score: 78, status: 'Pending Review', risk: 'High' },
    { id: 4, name: 'Diana Prince', role: 'UX Designer', score: 95, status: 'Offer Extended', risk: 'Low' },
  ];

  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative z-10">
      {/* Background glowing decorations */}
      <div className="absolute top-[-10%] left-[-5%] w-72 h-72 bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none animate-float-2"></div>
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Overview</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Welcome back! Here's what's happening with your recruitment funnel.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" className="gap-2 border border-slate-200 hover:border-slate-300">
            <Plus size={16} /> New Job
          </Button>
          <Button className="gap-2.5 shadow-md">
            <Video size={16} /> Create Session
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <GlassCard key={i} hover className={`flex items-center gap-4.5 border ${stat.border} rounded-2xl !p-5 bg-white/70`}>
              <div className={`p-3.5 rounded-xl ${stat.bg} ${stat.color} shadow-sm shrink-0`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight mt-0.5">{stat.value}</h3>
              </div>
            </GlassCard>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - Candidate Table */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="!p-0 border border-slate-200/50 shadow-lg rounded-3xl overflow-hidden bg-white/70">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-extrabold text-slate-800 tracking-tight text-base">Recent Assessments</h3>
              <button className="text-xs font-bold text-blue-600 hover:text-indigo-600 flex items-center gap-1 cursor-pointer transition-colors">
                View All <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/40 border-b border-slate-100">
                    <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Candidate</th>
                    <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">AI Score</th>
                    <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="p-4 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map(candidate => (
                    <tr key={candidate.id} className="hover:bg-slate-50/30 transition-colors duration-200">
                      <td className="p-4">
                        <p className="font-bold text-slate-800 text-sm">{candidate.name}</p>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{candidate.role}</p>
                      </td>
                      <td className="p-4 text-center">
                        <div className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 font-extrabold text-xs shadow-sm border border-blue-500/5">
                          {candidate.score}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold ${
                          candidate.risk === 'High' 
                            ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                            : candidate.status.includes('Offer') 
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                            : 'bg-slate-50 text-slate-500 border border-slate-200/60'
                        }`}>
                          <span className={`w-1 h-1 rounded-full ${
                            candidate.risk === 'High' ? 'bg-rose-500' :
                            candidate.status.includes('Offer') ? 'bg-emerald-500' : 'bg-slate-400'
                          }`}></span>
                          {candidate.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        <Link href={`/report?id=${candidate.id}`}>
                          <Button variant="secondary" className="!px-3.5 !py-2 text-xs border border-slate-200 rounded-xl">
                            Report
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar - Quick Actions & System Info */}
        <div className="space-y-6">
          <GlassCard className="border border-slate-200/50 shadow-lg rounded-3xl bg-white/70">
            <h3 className="font-extrabold text-slate-800 mb-2 text-sm tracking-tight flex items-center gap-1.5">
              <Sparkles size={16} className="text-blue-500" /> Quick Job Parser
            </h3>
            <p className="text-xs text-slate-500 mb-4 font-semibold leading-relaxed">
              Paste a Job Description to generate highly customized AI interview questions in real-time.
            </p>
            <textarea 
              className="w-full h-36 p-3.5 rounded-2xl border border-slate-200 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-xs font-semibold text-slate-800 placeholder-slate-400 resize-none mb-4"
              placeholder="Paste Job Description here..."
            ></textarea>
            <Button className="w-full py-3.5 text-xs font-bold shadow-md">Generate Assessment Session</Button>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-blue-500/[0.02] to-purple-500/[0.02] border border-slate-200/50 shadow-md rounded-3xl !p-6">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2 text-sm tracking-tight">
              <Server size={16} className="text-indigo-500" /> Platform Diagnostics
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-semibold border-b border-slate-100 pb-3">
                <span className="text-slate-400">AI Evaluation Node</span>
                <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Active
                </span>
              </div>
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-400">Active Live Screenings</span>
                <span className="font-bold text-slate-700 bg-slate-50 border border-slate-200/60 px-2.5 py-0.5 rounded-lg">14 Sessions</span>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
