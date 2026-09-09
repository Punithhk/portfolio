'use client';

import { useState, useEffect } from 'react';

export default function VisitorGreeting() {
  const [visitorName, setVisitorName] = useState('');

  useEffect(() => {
    const name = localStorage.getItem('visitor_name');
    if (name) setVisitorName(name);
  }, []);

  if (!visitorName) return null;

  return (
    <span className="text-xs text-cyan-400 font-medium px-3 py-1 bg-cyan-950/40 rounded-full border border-cyan-800/40">
      Welcome, {visitorName}
    </span>
  );
}