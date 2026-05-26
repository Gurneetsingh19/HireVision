"use client";
export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseStyles = "inline-flex items-center justify-center font-bold rounded-2xl transition-all duration-300 ease-out transform cursor-pointer tracking-wide select-none focus:outline-none focus:ring-2 focus:ring-primary/40 focus:ring-offset-1";
  
  const variants = {
    primary: "bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-[0_4px_20px_-4px_rgba(59,130,246,0.5)] hover:shadow-[0_8px_25px_-4px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97] hover:brightness-105 active:brightness-95",
    secondary: "bg-white/80 backdrop-blur-sm text-text-dark border border-slate-200 hover:border-blue-500/40 hover:bg-blue-50/30 shadow-[0_2px_8px_rgba(15,23,42,0.03)] hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]",
    outline: "bg-transparent text-blue-600 border-2 border-blue-500/60 hover:border-blue-500 hover:bg-blue-50/40 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]",
    ghost: "bg-transparent text-soft-gray hover:text-blue-600 hover:bg-blue-50/40 hover:-translate-y-0.5 hover:scale-[1.02] active:scale-[0.97]"
  };

  const sizes = {
    sm: "px-4 py-2.5 text-sm rounded-xl",
    md: "px-6 py-3.5 text-base",
    lg: "px-8 py-4.5 text-lg rounded-2xl"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
