'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative z-10 border-b border-[var(--panel-border)] bg-[var(--panel-bg)]">
      <div className="max-w-screen-2xl mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 bg-[var(--accent)] rounded-sm flex items-center justify-center shadow-sm">
            <div className="w-2 h-2 bg-[var(--bg-color)] rounded-full" />
          </div>
          <h1 className="text-lg font-bold tracking-wide text-[var(--text-main)]">
            AI Studio Builder
          </h1>
        </div>

        {/* Middle: Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--text-muted)]">
          <Link href="/" className="text-[var(--text-main)] hover:text-white transition-colors">
            Home
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            About
          </Link>
          <Link href="/privacy" className="hover:text-white transition-colors">
            Privacy Policy
          </Link>
        </nav>

        {/* Right Side: Status */}
        <div className="flex items-center gap-4">
          <div className="text-xs text-[var(--text-muted)] bg-[var(--bg-color)] border border-[var(--panel-border)] px-3 py-1.5 rounded-md shadow-inner">
            v1.1.0
          </div>
        </div>

      </div>
    </header>
  );
}
