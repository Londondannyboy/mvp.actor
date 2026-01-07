"use client";

import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, UserButton } from "@neondatabase/auth/react/ui";
import { authClient } from "@/app/lib/auth/client";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  if (isPending) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-black/30 backdrop-blur-sm">
        <Link href="/" className="text-white font-bold text-lg hover:text-cyan-400 transition-colors">
          &larr; EsportsJobs.quest
        </Link>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header>

      <div className="max-w-2xl mx-auto p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Account Settings</h1>

        <SignedOut>
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 text-center">
            <p className="text-gray-300 mb-4">Please sign in to view your account settings.</p>
            <Link
              href="/auth/sign-in"
              className="inline-block px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-medium transition-colors"
            >
              Sign In
            </Link>
          </div>
        </SignedOut>

        <SignedIn>
          {/* Profile Section */}
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">Profile</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <p className="text-white text-lg">{user?.name || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Email</label>
                <p className="text-white text-lg">{user?.email || "Not set"}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">User ID</label>
                <p className="text-gray-500 text-sm font-mono">{user?.id}</p>
              </div>
            </div>
          </div>

          {/* Account Actions */}
          <div className="bg-gray-800/80 rounded-lg p-6 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Account Actions</h2>
            <div className="space-y-3">
              <Link
                href="/auth/sign-out"
                className="block w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors text-center"
              >
                Sign Out
              </Link>
            </div>
          </div>
        </SignedIn>
      </div>
    </main>
  );
}
