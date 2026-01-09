'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Redirect old dashboard to new profile page
export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/profile');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">🚀</div>
        <p className="text-cyan-400 animate-pulse">Redirecting to your Career Quest...</p>
      </div>
    </div>
  );
}
