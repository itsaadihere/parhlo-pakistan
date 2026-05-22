"use client";

import { useEffect } from 'react';

export default function InactivityTracker({ onLogout, timeoutMs = 900000 }) { // Default 15 minutes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let timeoutId;

    const resetTimeout = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        onLogout();
      }, timeoutMs);
    };

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];
    
    events.forEach(event => window.addEventListener(event, resetTimeout));
    
    resetTimeout(); // Initialize the timer on mount

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      events.forEach(event => window.removeEventListener(event, resetTimeout));
    };
  }, [onLogout, timeoutMs]);

  return null; // This component doesn't render anything
}
