"use client";
export default function GlassCard({ 
  children, 
  className = '', 
  dark = false,
  hover = false,
  ...props 
}) {
  const baseStyles = dark ? 'glass-card-dark' : 'glass-card';
  const hoverStyles = hover ? 'transition-all duration-300 ease-out hover:shadow-[0_16px_40px_0_rgba(15,23,42,0.06)] hover:-translate-y-0.5' : '';
  
  return (
    <div 
      className={`${baseStyles} ${hoverStyles} p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
