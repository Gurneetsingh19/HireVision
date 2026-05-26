"use client";
import { useState } from 'react';
import Link from 'next/link';
import { BrainCircuit, Menu, X } from 'lucide-react';
import Button from './Button';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 bg-white/65 backdrop-blur-xl border-b border-slate-200/40 shadow-[0_4px_30px_rgba(15,23,42,0.02)] transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 rounded-2xl bg-blue-500/10 text-blue-600 group-hover:bg-blue-500/20 group-hover:scale-105 transition-all duration-300">
            <BrainCircuit size={28} className="text-blue-600 group-hover:text-indigo-600 transition-colors duration-300" />
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-slate-800 bg-clip-text group-hover:text-transparent bg-gradient-to-r group-hover:from-blue-600 group-hover:via-indigo-500 group-hover:to-violet-600 transition-all duration-300">
            HireVision AI
          </span>
        </Link>
        
        <div className="hidden md:flex items-center gap-8 font-semibold text-slate-600 text-sm">
          <Link href="#features" className="relative py-1 hover:text-blue-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
            Features
          </Link>
          <Link href="#solutions" className="relative py-1 hover:text-blue-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
            Solutions
          </Link>
          <Link href="#pricing" className="relative py-1 hover:text-blue-600 transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">
            Pricing
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/login" className="text-sm font-bold text-slate-700 hover:text-blue-600 transition-colors duration-300">
            Log in
          </Link>
          <Link href="/login">
            <Button variant="primary" size="sm" className="shadow-md">
              Book Demo
            </Button>
          </Link>
        </div>
        
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-b border-slate-200/50 shadow-lg px-6 py-6 flex flex-col gap-5 font-semibold text-slate-600 animate-slide-down">
          <Link href="#features" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors">
            Features
          </Link>
          <Link href="#solutions" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors">
            Solutions
          </Link>
          <Link href="#pricing" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors">
            Pricing
          </Link>
          <hr className="border-slate-100 my-1" />
          <Link href="/login" onClick={() => setIsOpen(false)} className="hover:text-blue-600 transition-colors">
            Log in
          </Link>
          <Link href="/login" onClick={() => setIsOpen(false)}>
            <Button variant="primary" size="md" className="w-full shadow-md">
              Book Demo
            </Button>
          </Link>
        </div>
      )}
    </nav>
  );
}
