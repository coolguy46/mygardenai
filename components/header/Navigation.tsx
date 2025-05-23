"use client"

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    const client = createClient();
    await client.auth.signOut();
    router.push('/login');
  };

  return (
    <nav className="w-full bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <Link 
              href="/dashboard"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/dashboard') 
                ? 'border-green-500 text-gray-900' 
                : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/settings"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/settings')
                ? 'border-green-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              Settings
            </Link>
            <Link 
              href="/chat"
              className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                isActive('/chat')
                ? 'border-green-500 text-gray-900'
                : 'border-transparent text-gray-500 hover:border-gray-300'
              }`}
            >
              Chat
            </Link>
          </div>
          <button
            onClick={handleLogout}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
