'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Search,
  ListFilter,
  PlusCircle,
  LogOut,
  UserCheck,
  LogIn,
  Menu,
  X,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.authenticated && data.user) {
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setUser(null);
      setMobileMenuOpen(false);
      router.push('/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const navItems = [
    { label: 'Search', href: '/', icon: Search },
    { label: 'Inventory', href: '/inventory', icon: ListFilter },
    { label: 'Add Device', href: '/admin', icon: PlusCircle },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-blue-500 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform shrink-0">
              <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-base sm:text-lg leading-tight tracking-tight flex items-center gap-1.5">
                PhoneVerify <span className="text-[10px] sm:text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-semibold border border-blue-200/60">GSX</span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden md:block">
                Store Phone Verification & GSX Inventory
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-2">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/' || pathname === '/search'
                  : pathname.startsWith(item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/30'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Desktop Auth Section */}
            <div className="ml-2 pl-2 border-l border-slate-200 flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
                    <UserCheck className="w-3.5 h-3.5" />
                    <span className="max-w-[120px] truncate">{user.email}</span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Sign Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 bg-white px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top-2 duration-200">
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/' || pathname === '/search'
                : pathname.startsWith(item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {user ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1.5 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                  <UserCheck className="w-4 h-4" />
                  <span className="truncate max-w-[150px]">{user.email}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
