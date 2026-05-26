"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { LayoutDashboard, Users, FileText, Settings, Video, LogOut, BrainCircuit, HelpCircle, X } from 'lucide-react';
import GlassCard from './GlassCard';

export default function Sidebar({ role = 'company', isOpen = false, onClose }) {
  const pathname = usePathname();
  
  const companyLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { name: 'Interviews', icon: Video, href: '/dashboard/interviews' },
    { name: 'Candidates', icon: Users, href: '/dashboard/candidates' },
    { name: 'Reports', icon: FileText, href: '/dashboard/reports' },
    { name: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  const candidateLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/candidate' },
    { name: 'My Interviews', icon: Video, href: '/candidate/interviews' },
    { name: 'Upload Resume', icon: FileText, href: '/candidate/upload' },
    { name: 'Settings', icon: Settings, href: '/candidate/settings' },
  ];

  const links = role === 'company' ? companyLinks : candidateLinks;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/35 backdrop-blur-[2px] z-40 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Main Sidebar Panel */}
      <GlassCard 
        className={`h-[calc(100vh-2rem)] w-64 m-4 flex flex-col fixed left-0 top-0 border border-white/50 z-50 shadow-[0_8px_40px_rgba(15,23,42,0.06)] !p-5 transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-[calc(100%+2rem)]'
        } md:flex`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-3 py-4 mb-6 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600">
              <BrainCircuit size={22} className="text-blue-600" />
            </div>
            <span className="font-extrabold text-lg text-slate-800 tracking-tight">
              HireVision AI
            </span>
          </div>
          
          {/* Close Menu Button on Mobile */}
          <button 
            onClick={onClose}
            className="md:hidden p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mb-6 px-1">
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-3">
            Navigation
          </h2>
          <nav className="flex flex-col gap-1.5">
            {links.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all duration-300 font-semibold text-sm group ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-blue-600'
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`transition-colors duration-300 ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-500'
                    }`} 
                  />
                  {link.name}
                </Link>
              );
            })}
          </nav>
        </div>
        
        <div className="mt-auto px-1 space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/10">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle size={16} className="text-blue-600" />
              <p className="text-xs font-bold text-slate-700">Need assistance?</p>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-3">Our customer success team is online.</p>
            <button className="text-xs font-bold text-blue-600 hover:text-indigo-600 hover:underline transition-colors cursor-pointer bg-transparent border-none p-0">
              Support Center &rarr;
            </button>
          </div>
          
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="w-full flex items-center justify-center gap-2.5 px-3 py-3 rounded-xl text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-300 font-bold text-sm cursor-pointer"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </GlassCard>
    </>
  );
}
