"use client";
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Menu, BrainCircuit } from 'lucide-react';

export default function ReportLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row">
      {/* Mobile Top Header Bar */}
      <div className="md:hidden flex items-center justify-between px-6 py-4 bg-white/65 backdrop-blur-xl border-b border-slate-200/40 shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600">
            <BrainCircuit size={22} />
          </div>
          <span className="font-extrabold text-lg text-slate-800 tracking-tight">
            HireVision AI
          </span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <Menu size={22} />
        </button>
      </div>

      <Sidebar role="company" isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <div className="flex-1 md:ml-[17rem] p-4 md:p-8">
        {children}
      </div>
    </div>
  );
}
