import Link from "next/link";

export const dynamic = "force-static";
export const revalidate = false;



export default function DevelopmentPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-100 text-gray-800 px-4 relative">
      <div className="flex flex-col items-center border border-gray-200 bg-white p-10 rounded-2xl shadow-xl text-center max-w-md w-full">
        <div className="text-5xl mb-4 animate-bounce">🚧</div>

        <h1 className="text-3xl primary-font font-bold mb-3 text-gray-900">
          Feature in Development 🚀
        </h1>

        <p className="text-gray-600 mb-6 secondary-font">
          Hey there! 😄 We’re currently building something exciting.  
          Our team is polishing up the final details to make it amazing for you!
        </p>

        <div className="flex flex-col items-center gap-1 mb-6">
          <p className="text-lg font-medium text-emerald-600">📅 Estimate Release : January 2nd</p>
        </div>

        <Link
          href="/"
          className="mt-4 bg-emerald-500 hover:bg-green-500 px-6 py-2 rounded-lg text-white font-medium transition-all shadow-md hover:shadow-green-400/40"
        >
          ⬅️ Back to Home
        </Link>
      </div>

      <footer className="absolute bottom-4 text-sm text-gray-400">
        Copyright © {new Date().getFullYear()}. All rights reserved. Loom Softwares
      </footer>
    </main>
  );
}
