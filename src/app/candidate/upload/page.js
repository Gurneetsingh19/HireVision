"use client";
import { useState } from 'react';
import Link from 'next/link';
import { UploadCloud, File, CheckCircle2, Brain, Play, Sparkles, AlertCircle, HelpCircle, Shield } from 'lucide-react';
import GlassCard from '@/components/GlassCard';
import Button from '@/components/Button';

export default function CandidateUploadPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  const API_URL = process.env.NEW_PUBLIC_API;
    setLoading(true);
    setSuccess(false);
    setError(false);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/resume`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("API response was not ok");
      }

      const data = await response.json();

      await fetch(
        "/api/save-resume",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            email: JSON.parse(localStorage.getItem("user")).email, 
            resume: data 
          })
        }
      );

      console.log("Resume Data:", data);
      setSuccess(true);
    } catch (err) {
      console.error("Error analyzing resume:", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-4 animate-fade-in relative z-10">
      {/* Background decoration orbs */}
      <div className="absolute top-[-10%] right-[-10%] w-80 h-80 bg-blue-500/5 rounded-full filter blur-[80px] pointer-events-none animate-float-1"></div>
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Upload Resume</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Let our AI analyze your profile to personalize your interview experience.</p>
        </div>
        <div>
          {success ? (
            <Link href="/interview">
              <Button className="gap-2.5 shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-indigo-600">
                <Play size={16} fill="currentColor" /> Start AI Interview
              </Button>
            </Link>
          ) : (
            <Button className="gap-2.5 opacity-40 cursor-not-allowed shadow-none" variant="secondary" disabled>
              <Play size={16} /> Start AI Interview
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="border-2 border-dashed border-blue-500/30 bg-blue-500/[0.01] hover:bg-blue-500/[0.03] hover:border-blue-500/60 transition-all duration-300 flex flex-col items-center justify-center py-16 px-6 text-center rounded-3xl relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.03] pointer-events-none"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-white shadow-md border border-slate-100 flex items-center justify-center mb-6 group-hover:scale-105 transition-transform duration-300">
              <UploadCloud size={30} className="text-blue-600" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2 tracking-tight">Drag & Drop your resume</h3>
            <p className="text-sm text-slate-500 mb-8 font-medium">Supported file format: PDF (Max 5MB)</p>
            
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileUpload}
              className="hidden"
              id="resumeUpload"
            />

            <label
              htmlFor="resumeUpload"
              className="cursor-pointer px-6 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all duration-300 tracking-wide text-sm"
            >
              Browse Local Files
            </label>
          </GlassCard>

          {/* Uploading State */}
          {loading && (
            <GlassCard className="flex items-center gap-4.5 animate-pulse border border-blue-500/10 rounded-2xl !p-6">
              <div className="w-10 h-10 rounded-full border-4 border-slate-200 border-t-blue-600 animate-spin"></div>
              <div>
                <p className="font-bold text-slate-800 text-sm">Analyzing Resume...</p>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">AI is mapping your technical skillset and experience points.</p>
              </div>
            </GlassCard>
          )}

          {/* Error State */}
          {error && (
            <GlassCard className="border-l-4 border-l-rose-500 bg-rose-50/50 border border-slate-200/50 animate-fade-in rounded-2xl !p-6 flex items-start gap-4">
              <div className="p-2 bg-rose-100 rounded-xl text-rose-600">
                <AlertCircle size={20} />
              </div>
              <div>
                <p className="font-bold text-rose-700 text-sm">Resume analysis failed</p>
                <p className="text-xs text-rose-500 font-semibold mt-1">Please ensure your PDF is not encrypted and try uploading again.</p>
              </div>
            </GlassCard>
          )}

          {/* Success State */}
          {success && (
            <GlassCard className="border-l-4 border-l-emerald-500 bg-emerald-50/30 border border-slate-200/50 animate-fade-in rounded-2xl !p-6 flex items-start gap-4.5">
              <div className="p-3.5 bg-emerald-500/10 rounded-2xl text-emerald-600">
                <CheckCircle2 className="text-emerald-500" size={24} />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-slate-800 tracking-tight">Resume Screening Successful</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Our system parsed your skillset successfully. You are now fully prepared to trigger your personalized conversational assessment.
                </p>
                
                <div className="inline-flex items-center gap-2 text-xs text-blue-600 font-bold bg-blue-500/10 px-3 py-1.5 rounded-lg border border-blue-500/10">
                  <Sparkles size={13} className="fill-blue-500/10 animate-spin" style={{ animationDuration: '4s' }} /> Ready to begin the AI interview
                </div>
              </div>
            </GlassCard>
          )}
        </div>

        {/* Right Sidebar Instructions */}
        <div className="space-y-6">
          <GlassCard className="bg-slate-50/50 border border-slate-200/40 rounded-2xl">
            <h3 className="font-extrabold text-slate-800 mb-4 flex items-center gap-2 text-sm tracking-tight uppercase">
              <HelpCircle size={16} className="text-blue-500" /> Interview Protocol
            </h3>
            <ul className="text-xs text-slate-500 space-y-3.5 pl-1.5 font-semibold">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Ensure you are in a well-lit, quiet location with minimal background noise.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Test your microphone and webcam streams before locking in the assessment launch.</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                <span>Do not switch active tabs, press exit triggers, or load browser extensions during the session.</span>
              </li>
            </ul>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10 rounded-2xl !p-6 flex items-start gap-3">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-600 shrink-0">
              <Shield size={18} />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-700 tracking-tight uppercase mb-1">Data & Privacy Lock</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-semibold">
                Your uploaded resume is fully encrypted and stored securely. It is only utilized to synthesize interview contexts and rank screening metrics.
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
