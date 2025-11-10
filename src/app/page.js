'use client';

import Link from "next/link";
import Image from 'next/image';
import { useEffect, useState } from "react";
import { GraduationCap, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

const Home = dynamic(() => import("@/components/pages/Home"), {
  loading: () => (
    <div className="flex justify-center items-center min-h-screen">
      <p className="text-gray-500">Loading...</p>
    </div>
  ),
});

const CONFIG = {
  branding: {
    name: "Studify",
    logo: "/logo.png",
    useTextLogo: true,
    tagline: "Manage coaching easily.",
    description: "Focus on teaching while Studify takes care of the management.",
  },
  hero: {
    title: "Studify - Manage coaching",
    highlightedWord: "easily",
    subtitle: "Focus on teaching while Studify takes care of the management.",
    features: [
      "Student Management",
      "Payment Tracking",
      "Batch Tracking",
      "Exam results and payments via SMS",
    ],
  },
};

export default function HomePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/check");
        const data = await res.json();
        if (data.loggedIn) {
          setUser(data.user);
        }
      } catch (err) {
        console.error("Error checking auth:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.reload();
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <p className="text-gray-500 animate-pulse">Checking your session...</p>
      </div>
    );

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                {CONFIG.branding.useTextLogo ? (
                  <>
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <GraduationCap className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xl font-bold text-gray-900">
                      <span className="text-blue-500">i</span>{CONFIG.branding.name}
                    </span>
                  </>
                ) : (
                  <Image
                    src={CONFIG.branding.logo}
                    alt={CONFIG.branding.name}
                    width={32}
                    height={32}
                    className="h-8 w-auto"
                  />
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href="/upgrade"
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-sm"
                >
                  Purchase
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium text-sm border border-gray-300"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 md:p-12">
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-gray-600">Ready to manage your coaching center?</p>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-10">
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Logout
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Current Plan</p>
                <p className="text-gray-900 text-xl font-bold">{user.plan}</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Status</p>
                <p className="text-gray-900 text-xl font-bold">Active</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-5 text-center">
                <p className="text-gray-600 text-sm mb-1">Email</p>
                <p className="text-gray-900 text-sm font-semibold truncate">{user.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <Home />;
}
