'use client';
import { useEffect, useState } from 'react';
import GLogin from '@/components/gAuth/GLogin';

export default function Gportal() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('guardianToken');
    if (token) setLoggedIn(true);
  }, []);

  if (!loggedIn) {
    return <GLogin />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-2xl font-semibold text-emerald-700">
      Hello Guardian 👋 — welcome to your dashboard!
    </div>
  );
}
