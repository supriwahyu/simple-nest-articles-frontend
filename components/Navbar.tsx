'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, token, logout, isLoading } = useAuth();
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path
      ? 'text-blue-600 font-semibold'
      : 'text-slate-600 hover:text-slate-950';

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Article<span className="text-blue-600">Hub</span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <Link href="/" className={`text-sm transition ${isActive('/')}`}>
            Home
          </Link>

          <Link
            href="/articles"
            className={`text-sm transition ${isActive('/articles')}`}
          >
            Articles
          </Link>

          {token && (
            <Link
              href="/articles/new"
              className={`text-sm transition ${isActive('/articles/new')}`}
            >
              Write Article
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
          ) : user ? (
            <div className="flex items-center gap-4">
              <span className="hidden text-xs text-slate-500 sm:inline">
                {user.email}
              </span>
              <Link
                href="/articles/new"
                className="hidden rounded-full bg-blue-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-blue-700 sm:inline-block"
              >
                + Write
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-slate-300 px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
