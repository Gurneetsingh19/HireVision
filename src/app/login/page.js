"use client";
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { BrainCircuit, Mail, Lock, ArrowRight, Code, Globe, Sparkles } from 'lucide-react';
import Button from '@/components/Button';
import GlassCard from '@/components/GlassCard';
import ParticleGlobe from '@/components/ParticleGlobe';

export default function LoginPage() {
  const [loginType, setLoginType] = useState('candidate');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const API_URL = process.env.NEW_PUBLIC_API;
  const handleLogin = async () => {
    setError("");
    let isSuccess = false;
    let userRole = "";
    let userData = null;
    
  
    try {
      const response = await fetch(
        `${API_URL}/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password, role: loginType })
        }
      );

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.success) {
        if (!data.user || !data.user.role) {
          setError("Role not received from backend");
          return;
        }
        isSuccess = true;
        userRole = data.user.role;
        userData = data.user;
      } else {
        setError(data.message || "Wrong password or user not found");
        return;
      }
    } catch (err) {
      console.error("FastAPI Login Fetch Error:", err);
      setError("Network error. Please make sure the backend server is running.");
      return;
    }

    if (isSuccess && userData) {
      // Determine redirection route first
      let route = "";
      if (userRole === "candidate") {
        route = "/candidate/upload";
      } else if (userRole === "company") {
        route = "/dashboard";
      } else {
        setError("Invalid user role received");
        return;
      }

      // Save user data
      localStorage.setItem("user", JSON.stringify(userData));

      try {
        console.log("Signing in through NextAuth client...");
        // Sign in using next-auth to establish the session cookie and state
        const signInResult = await signIn("credentials", {
          email,
          password,
          role: userRole,
          redirect: false
        });

        console.log("NextAuth signInResult:", signInResult);

        if (signInResult?.error) {
          setError(signInResult.error || "Authentication failed");
          return;
        }

        console.log("Redirecting to:", route);
        window.location.href = route;
      } catch (authErr) {
        // NextAuth v5 client-side signIn sometimes throws redirect or navigation errors internally.
        // If it throws, we check if we still want to redirect the user to the target page.
        console.warn("NextAuth client signIn threw an exception (likely a Next.js client-side redirect signal):", authErr);
        console.log("Proceeding with redirection to:", route);
        window.location.href = route;
      }
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fafbfe]">
      {/* LEFT SIDE - Premium Graphics */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#070b13] overflow-hidden flex-col justify-center items-center p-16 text-center">
        {/* Dynamic 3D Particle Globe Background */}
        <ParticleGlobe />
        <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-15 pointer-events-none"></div>
        
        {/* Floating AI Elements */}
        <div className="relative z-10 w-full max-w-lg">
          <div className="flex justify-center mb-10">
            <div className="w-24 h-24 rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-[0_0_50px_rgba(59,130,246,0.3)] animate-bounce" style={{ animationDuration: '4s' }}>
              <BrainCircuit size={48} className="text-cyan-400 drop-shadow-[0_0_15px_rgba(6,182,212,0.6)]" />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
            The Future of Hiring <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-violet-400">Powered by AI</span>
          </h2>
          <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed mb-12">
            Join thousands of scaling organizations and top talent leveraging intelligence to drive faster, fairer, and high-signal conversational screening.
          </p>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left transition-all duration-300 hover:border-white/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={16} className="text-cyan-400" />
                <span className="text-cyan-400 font-extrabold text-3xl leading-none">95%</span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Time screening saved</div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-left transition-all duration-300 hover:border-white/20">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={16} className="text-violet-400" />
                <span className="text-violet-400 font-extrabold text-3xl leading-none">10x</span>
              </div>
              <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Better talent match</div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-hidden">
        {/* Glow blob */}
        <div className="absolute top-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 gradient-blob animate-float-1"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-violet-500/10 gradient-blob animate-float-2" style={{ animationDelay: '3s' }}></div>
        
        <div className="w-full max-w-md relative z-10">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-10 group lg:hidden">
            <div className="p-1.5 rounded-xl bg-blue-500/10 text-blue-600">
              <BrainCircuit size={22} className="text-blue-600" />
            </div>
            <span className="text-xl font-extrabold text-slate-800 tracking-tight">HireVision AI</span>
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 tracking-tight mb-2">Welcome back</h1>
            <p className="text-slate-500 font-semibold text-sm">Please sign in to access your talent profile.</p>
          </div>

          <GlassCard className="!p-8 border border-white/80 shadow-2xl rounded-3xl bg-white/70">
            {/* Toggle */}
            <div className="flex p-1.5 bg-slate-100/60 border border-slate-200/40 rounded-2xl mb-6">
              <button
                onClick={() => setLoginType('candidate')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                  loginType === 'candidate' 
                    ? 'bg-white shadow-sm text-blue-600 scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Candidate
              </button>
              <button
                onClick={() => setLoginType('company')}
                className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all duration-300 cursor-pointer ${
                  loginType === 'company' 
                    ? 'bg-white shadow-sm text-blue-600 scale-[1.02]' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Company
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4.5 py-3 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                {error}
              </div>
            )}

            <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                    <Mail size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-12 pr-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm text-slate-800 placeholder-slate-400"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
                  <a href="#" className="text-xs font-bold text-blue-600 hover:text-indigo-600 transition-colors">Forgot password?</a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4.5 flex items-center pointer-events-none">
                    <Lock size={18} className="text-slate-400" />
                  </div>
                  <input
                    type="password"
                    required
                    className="w-full pl-12 pr-4.5 py-3.5 rounded-2xl border border-slate-200/80 bg-white/50 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm text-slate-800 placeholder-slate-400"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center text-sm pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <input type="checkbox" className="rounded-md border-slate-300 text-blue-600 focus:ring-blue-500/30 w-4 h-4" />
                  <span className="text-xs text-slate-500 font-semibold">Keep me signed in for 30 days</span>
                </label>
              </div>

              <div className="block pt-3">
                <Button
                  className="w-full flex justify-center py-4 text-sm tracking-wide font-bold group shadow-md"
                  onClick={handleLogin}
                >
                  Sign In
                  <ArrowRight
                    size={16}
                    className="ml-2 group-hover:translate-x-1 transition-transform"
                  />
                </Button>
              </div>
            </form>

            <div className="mt-8 flex items-center justify-center space-x-4">
              <div className="h-px bg-slate-200/80 flex-1"></div>
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Or continue with</span>
              <div className="h-px bg-slate-200/80 flex-1"></div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <Button variant="secondary" className="w-full gap-2.5 !py-3 rounded-2xl text-xs font-bold border border-slate-200 hover:border-slate-300">
                <Code size={16} /> Google
              </Button>
              <Button variant="secondary" className="w-full gap-2.5 !py-3 rounded-2xl text-xs font-bold border border-slate-200 hover:border-slate-300">
                <Globe size={16} className="text-[#0A66C2]" /> LinkedIn
              </Button>
            </div>
            
            <p className="mt-8 text-center text-sm text-slate-500 font-semibold">
              New to HireVision? <Link href="/signup" className="font-bold text-blue-600 hover:underline hover:text-indigo-600 transition-colors">Create account</Link>
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
