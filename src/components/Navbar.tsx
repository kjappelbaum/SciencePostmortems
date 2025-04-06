"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = async () => {
    await logout();
    closeMobileMenu();
  };

  return (
    <nav className="border-b-2 border-[#A43830] bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link
                href="/"
                className="text-2xl font-bold text-[#A43830] tracking-tight"
              >
                SciencePostmortems
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/"
                    ? "border-[#A43830] text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Home
              </Link>
              <Link
                href="/reports"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/reports" || pathname.startsWith("/reports/")
                    ? "border-[#A43830] text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Reports
              </Link>
              <Link
                href="/reports/new"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/reports/new"
                    ? "border-[#A43830] text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Share Experience
              </Link>
              <Link
                href="/about"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === "/about"
                    ? "border-[#A43830] text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                About
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {loading ? (
              <div className="h-8 w-8 rounded-full bg-[#f8f0f0] animate-pulse"></div>
            ) : isAuthenticated ? (
              <div className="ml-3 relative">
                <div className="flex items-center space-x-4">
                  {user?.email && (
                    <span className="text-sm text-[#666666]">{user.email}</span>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-medium text-[#A43830] hover:text-[#8A2E27] border border-[#A43830] px-3 py-1.5 rounded-md hover:bg-[#f8f0f0] transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  href="/login"
                  className="text-sm font-medium text-[#A43830] hover:text-[#8A2E27] transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium text-white bg-[#A43830] hover:bg-[#8A2E27] px-3 py-1.5 rounded-md transition-colors"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#666666] hover:text-[#A43830] hover:bg-[#f8f0f0] focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {/* Menu icon */}
              <svg
                className={`${mobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              {/* X icon */}
              <svg
                className={`${mobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/"
            onClick={closeMobileMenu}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/"
                ? "bg-[#f8f0f0] border-[#A43830] text-[#A43830]"
                : "border-transparent text-[#666666] hover:bg-[#f8f0f0] hover:border-[#E0E0E0] hover:text-[#A43830]"
            }`}
          >
            Home
          </Link>
          <Link
            href="/reports"
            onClick={closeMobileMenu}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/reports" || pathname.startsWith("/reports/")
                ? "bg-[#f8f0f0] border-[#A43830] text-[#A43830]"
                : "border-transparent text-[#666666] hover:bg-[#f8f0f0] hover:border-[#E0E0E0] hover:text-[#A43830]"
            }`}
          >
            Reports
          </Link>
          <Link
            href="/reports/new"
            onClick={closeMobileMenu}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/reports/new"
                ? "bg-[#f8f0f0] border-[#A43830] text-[#A43830]"
                : "border-transparent text-[#666666] hover:bg-[#f8f0f0] hover:border-[#E0E0E0] hover:text-[#A43830]"
            }`}
          >
            Share Experience
          </Link>
          <Link
            href="/about"
            onClick={closeMobileMenu}
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              pathname === "/about"
                ? "bg-[#f8f0f0] border-[#A43830] text-[#A43830]"
                : "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            }`}
          >
            About
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-[#E0E0E0]">
          {loading ? (
            <div className="flex items-center px-4">
              <div className="h-10 w-10 rounded-full bg-[#f8f0f0] animate-pulse"></div>
              <div className="ml-3 h-4 bg-[#f8f0f0] animate-pulse w-24 rounded"></div>
            </div>
          ) : isAuthenticated ? (
            <div>
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="h-10 w-10 rounded-full bg-[#f8f0f0] flex items-center justify-center">
                    <span className="text-[#A43830] font-medium">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </span>
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-[#333333] truncate">
                    {user?.email}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-[#666666] hover:text-[#A43830] hover:bg-[#f8f0f0]"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1 px-4">
              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="block text-base font-medium text-[#666666] hover:text-[#A43830] hover:bg-[#f8f0f0] py-2"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={closeMobileMenu}
                className="block text-base font-medium text-[#666666] hover:text-[#A43830] hover:bg-[#f8f0f0] py-2"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
