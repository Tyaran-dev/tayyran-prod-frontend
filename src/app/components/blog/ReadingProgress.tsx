'use client';

import { useState, useEffect } from 'react';

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // We want to track progress based on the main content area ideally,
      // but for simplicity, we'll use the whole document height minus window height
      const scrollY = window.scrollY;
      const maxScroll = documentHeight - windowHeight;
      
      if (maxScroll <= 0) {
        setProgress(0);
        return;
      }
      
      const currentProgress = (scrollY / maxScroll) * 100;
      setProgress(Math.min(100, Math.max(0, currentProgress)));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full h-1.5 z-50 bg-transparent pointer-events-none">
      <div 
        className="h-full bg-blogGradient transition-all duration-150 ease-out rtl:origin-right ltr:origin-left"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
