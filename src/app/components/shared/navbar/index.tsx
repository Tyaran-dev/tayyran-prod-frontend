"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "/public/assets/icons/logo.svg";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { BookOpen, ChevronDown, ChevronRight, LogOut, Menu, MessageCircle, User, UserPlus, X } from "lucide-react";
import { WhatApps } from "@/app/svg";
// import { LanguageSwitcher } from "../google-tranlator/language-switcher";
import LanguageSwitcher from "../translate/LanguageSwitcher";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthContext } from "@/context/AuthContext";

const menuItems = [
  { key: "home", url: "/" },
  { key: "aboutUs", url: "/about-us" },
  { key: "blog", url: "/blog" },
  { key: "packages", url: "/packages" },
  { key: "freeticket", url: "/free-ticket" },

];

const Navbar = () => {
  const t = useTranslations('header');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = usePathname();
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuthContext();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);



  const isActive = (path: string) => {
    return router === path ? "!text-secondary lg:!text-primary" : "";
  };

  return (
    <div className="w-full top-0 left-0 bg-white shadow-sm text-primary sticky z-50">
      <nav
        className="lg:px-20 md:px-12 px-5 max-w-[1800px] mx-auto py-3 flex items-center justify-between w-full bg-white"
      >
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <Image
            src={logo}
            alt="Logo"
            className="hover:scale-105 w-28 duration-300 transition-all"
          />
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.url}
              className={`
            relative px-4 py-2 rounded-xl text-[15px] font-semibold font-montserrat
            transition-all duration-300 ease-out
            hover:bg-slate-50 hover:text-[#016733]
            ${isActive(item.url)}
          `}
            >
              {t(`navItems.${item.key}`)}
              {/* Active indicator dot */}
              <span
                className={`
              absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#016733]
              transition-all duration-300
              ${isActive(item.url) ? "opacity-100 scale-100" : "opacity-0 scale-0"}
            `}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {/* WhatsApp */}
          <a
            href="https://wa.me/966920032065"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-green-700 bg-green-50 hover:bg-green-100 transition-all duration-300"
          >
            <MessageCircle className="w-4 h-4" />
            <span className="hidden xl:inline">966920032065</span>
          </a>

          {/* Language Switcher */}
          <div className="relative">
            <LanguageSwitcher />
          </div>

          {/* Divider */}
          <div className="w-px h-8 bg-slate-200 mx-1" />

          {/* Auth */}
          {!user ? (
            <Link
              href="/signup"
              className="group relative border border-[#016733] overflow-hidden inline-flex items-center justify-center gap-2 py-2.5 px-6 text-sm font-bold  rounded-xl shadow-lg shadow-indigo-900/15 hover:shadow-xl hover:shadow-indigo-900/20 active:scale-[0.97] transition-all duration-300"
       
            >
              <span className="relative text-[#016733] z-10 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-[#016733]" />
                {t(`registerButton`)}
              </span>
            </Link>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-3 pl-2 pr-4 py-2 rounded-2xl bg-slate-50 hover:bg-slate-100 transition-all duration-300 border border-slate-100 hover:border-slate-200 active:scale-[0.98]"
              >
                <div className="relative">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold text-sm ring-2 ring-white shadow-md">
                    {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#016733] border-2 border-white rounded-full" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-800 capitalize">
                    {user.first_name || 'User'}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`}
                  />
                </div>
              </button>

              {/* Profile Dropdown */}
              <div
                className={`
              absolute right-0 mt-3 w-72 bg-white/95 backdrop-blur-xl border border-slate-100 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden transition-all duration-300 origin-top-right
              ${isProfileOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                  }
            `}
              >
                {/* Header */}
                <div className="p-5 bg-gradient-to-br from-slate-50 to-white border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold text-lg ring-2 ring-slate-200 shadow-lg">
                      {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">
                        {`${user.first_name || ''} ${user.last_name || ''}`.trim() || 'User'}
                      </p>
                      <p className="text-xs text-slate-500 truncate">{user.email || 'user@example.com'}</p>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div className="p-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#016733] hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#016733]/10 flex items-center justify-center transition-colors duration-200">
                      <User className="w-4 h-4 text-slate-600 group-hover:text-[#016733] transition-colors" />
                    </div>
                    <span>Profile</span>
                  </Link>

                  <Link
                    href="/my-bookings"
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-slate-700 hover:text-[#1c1466] hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#1c1466]/10 flex items-center justify-center transition-colors duration-200">
                      <BookOpen className="w-4 h-4 text-slate-600 group-hover:text-[#1c1466] transition-colors" />
                    </div>
                    <span>My Bookings</span>
                  </Link>
                </div>

                {/* Logout */}
                <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                  <button
                    onClick={() => {
                      logout();
                      setIsProfileOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                  >
                    <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                      <LogOut className="w-4 h-4 text-red-600" />
                    </div>
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsModalOpen(!isModalOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
        >
          {isModalOpen ? <IoClose size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Bottom Sheet (from previous enhancement) */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isModalOpen ? "pointer-events-auto" : "pointer-events-none"}`}>
        <div
          className={`
    fixed inset-0 z-50 lg:hidden
    transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
    ${isModalOpen ? "pointer-events-auto" : "pointer-events-none"}
  `}
        >
          {/* Backdrop with blur */}
          <div
            className={`
      absolute inset-0 bg-slate-900/40 backdrop-blur-sm
      transition-opacity duration-500
      ${isModalOpen ? "opacity-100" : "opacity-0"}
    `}
            onClick={() => setIsModalOpen(false)}
          />

          {/* Slide-up panel */}
          <div
            className={`
      absolute bottom-0 left-0 right-0
      bg-white rounded-t-[2rem] shadow-2xl
      transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
      ${isModalOpen ? "translate-y-0" : "translate-y-full"}
      max-h-[85vh] overflow-y-auto
    `}
          >
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1.5 rounded-full bg-slate-300" />
            </div>

            {/* Close button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>

            <div className="px-6 pb-8 pt-2">
              {/* Navigation Links */}
              <nav className="flex flex-col gap-1">
                {menuItems.map((item, index) => (
                  <Link
                    key={item.key}
                    href={item.url}
                    onClick={() => setIsModalOpen(false)}
                    className={`
              group flex items-center justify-between
              py-3.5 px-4 rounded-xl
              text-base font-semibold font-montserrat
              transition-all duration-300 ease-out
              hover:bg-slate-50 active:scale-[0.98]
              ${isActive(item.url)}
            `}
                    style={{
                      transitionDelay: isModalOpen ? `${index * 40}ms` : "0ms",
                      opacity: isModalOpen ? 1 : 0,
                      transform: isModalOpen ? "translateX(0)" : "translateX(-20px)",
                    }}
                  >
                    <span>{t(`navItems.${item.key}`)}</span>
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-slate-600 transition-colors" />
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="my-4 h-px bg-slate-100" />

              {/* WhatsApp & Language */}
              <div className="flex flex-col gap-3 px-1">
                <a
                  href="https://wa.me/966920032065"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 py-3 px-4 rounded-xl bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
                >
                  <div className="p-2 rounded-lg bg-green-500 text-white">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <span className="font-semibold">966920032065</span>
                </a>

                <div className="py-2">
                  <LanguageSwitcher />
                </div>
              </div>

              {/* Divider */}
              <div className="my-4 h-px bg-slate-100" />

              {/* Auth Section */}
              {!user ? (
                <Link
                  href="/signup"
                  onClick={() => setIsModalOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg shadow-indigo-900/20 active:scale-[0.98] transition-all duration-200"
                  style={{
                    background: "linear-gradient(135deg, #016733, #1c1466)",
                  }}
                >
                  <UserPlus className="w-5 h-5" />
                  Register
                </Link>
              ) : (
                <div className="flex flex-col gap-3">
                  {/* User Card */}
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-900/20">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-slate-900 truncate">
                        {user.name || "User"}
                      </p>
                      <p className="text-sm text-slate-500 truncate">
                        {user.email || "user@example.com"}
                      </p>
                    </div>
                  </div>

                  {/* User Actions */}
                  <div className="flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={() => setIsModalOpen(false)}
                      className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <div className="p-2 rounded-lg bg-[#016733]/10 text-[#016733]">
                        <User className="w-4 h-4" />
                      </div>
                      Profile
                    </Link>

                    <Link
                      href="/my-bookings"
                      onClick={() => setIsModalOpen(false)}
                      className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-slate-700 hover:bg-slate-50 active:scale-[0.98] transition-all"
                    >
                      <div className="p-2 rounded-lg bg-[#1c1466]/10 text-[#1c1466]">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      My Bookings
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setIsModalOpen(false);
                      }}
                      className="flex items-center gap-3 py-3.5 px-4 rounded-xl font-semibold text-red-600 hover:bg-red-50 active:scale-[0.98] transition-all text-left"
                    >
                      <div className="p-2 rounded-lg bg-red-100">
                        <LogOut className="w-4 h-4" />
                      </div>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
