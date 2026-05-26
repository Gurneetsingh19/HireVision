import Link from 'next/link';
import { ArrowLeft, CheckCircle, AlertTriangle, ShieldCheck, Download, ThumbsUp, Brain } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';

export default function AnalysisReport() {
  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-soft-gray hover:text-primary transition-colors">
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            AF
          </div>
          <div>
            <h1 className="text-3xl font-bold text-text-dark">Alice Freeman</h1>
            <p className="text-soft-gray text-lg">Senior React Developer</p>
            <div className="flex items-center gap-3 mt-2 text-sm font-semibold">
              <span className="flex items-center gap-1 text-green-600 bg-green-50 px-2.5 py-1 rounded-md">
                <ShieldCheck size={14} /> Low Risk
              </span>
              <span className="text-soft-gray">Interviewed: Today, 10:30 AM</span>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download size={18} /> Export PDF
          </Button>
          <Button className="gap-2 bg-green-600 hover:bg-green-700 shadow-green-600/30">
            <ThumbsUp size={18} /> Move to Offer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <GlassCard className="text-center col-span-1 border-t-4 border-t-primary">
          <h3 className="text-soft-gray font-semibold mb-2">Overall Match Score</h3>
          <div className="w-32 h-32 mx-auto rounded-full border-[12px] border-gray-100 flex items-center justify-center relative mb-4">
            {/* SVG circle for progress */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="52" fill="none" stroke="currentColor" strokeWidth="12" className="text-primary" strokeDasharray="326" strokeDashoffset="26" />
            </svg>
            <span className="text-4xl font-bold text-text-dark">92</span>
          </div>
          <p className="text-sm text-soft-gray font-medium">Top 5% of all candidates</p>
        </GlassCard>

        <GlassCard className="col-span-1 md:col-span-2">
          <h3 className="font-bold text-text-dark mb-6 flex items-center gap-2">
            <Brain className="text-violet-light" size={20} /> AI Summary & Recommendation
          </h3>
          <p className="text-gray-700 leading-relaxed mb-6">
            Alice demonstrated exceptional knowledge of React internals, state management, and performance optimization. Her communication style is clear, structured, and confident. She smoothly handled the system design question regarding the e-commerce checkout flow.
          </p>
          <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-start gap-3">
            <CheckCircle className="text-green-600 mt-0.5 shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-green-800">Strong Hire Recommendation</h4>
              <p className="text-sm text-green-700 mt-1">
                Candidate exceeded expectations in 4 out of 5 technical areas. Highly recommended for the Senior role.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard>
          <h3 className="font-bold text-text-dark mb-6">Detailed Scoring</h3>
          <div className="space-y-6">
            {[
              { label: 'Technical Knowledge', score: 95, color: 'bg-primary' },
              { label: 'Problem Solving', score: 88, color: 'bg-accent' },
              { label: 'Communication Skills', score: 92, color: 'bg-violet-light' },
              { label: 'Confidence Level', score: 85, color: 'bg-primary' },
            ].map(skill => (
              <div key={skill.label}>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span className="text-text-dark">{skill.label}</span>
                  <span className="text-soft-gray">{skill.score}/100</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full ${skill.color} rounded-full`} style={{ width: `${skill.score}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="font-bold text-text-dark mb-6">Integrity & Behavior Analysis</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="font-medium text-text-dark">Eye Tracking Accuracy</span>
              <span className="text-green-600 font-bold">98% Focused</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="font-medium text-text-dark">Tab Switching</span>
              <span className="text-green-600 font-bold">0 Instances</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 border border-gray-100">
              <span className="font-medium text-text-dark">Multiple Faces Detected</span>
              <span className="text-green-600 font-bold">Negative</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-100">
              <div className="flex items-center gap-2 text-text-dark font-medium">
                Audio Anomalies <AlertTriangle size={14} className="text-red-500" />
              </div>
              <span className="text-red-600 font-bold">1 Minor Event</span>
            </div>
            <p className="text-xs text-soft-gray px-1">
              * Minor background noise detected at 14:23. AI confirmed it was a dog barking.
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
