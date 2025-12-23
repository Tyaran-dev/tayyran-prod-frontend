"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import logo from "/public/assets/icons/logo.svg";
import { usePathname } from "next/navigation";
import { IoClose } from "react-icons/io5";
import { BookOpen, ChevronDown, LogOut, Menu, MessageCircle, User } from "lucide-react";
import { WhatApps } from "@/app/svg";
// import { LanguageSwitcher } from "../google-tranlator/language-switcher";
import LanguageSwitcher from "../translate/LanguageSwitcher";
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useAuthContext } from "@/context/AuthContext";

const menuItems = [
  { key: "home", url: "/" },
  { key: "milecoin", url: "/milecoin" },
  { key: "aboutUs", url: "/about-us" },
  { key: "packages", url: "/packages" },
  { key: "tayyranBusiness", url: "/tayyran-Business" },
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
    <div className="w-full  top-0 left-0   bg-white shadow-md text-primary">
      <nav
        className={`lg:px-24 md:px-16 px-5 max-w-[1800px] z-20 flex md:rounded-2xl justify-center mx-auto  py-2 items-start relative top-0 w-full  text-black bg-white`}
      >
        <div className="flex justify-between items-center flex-shrink-0 w-full">
          <Link href="/">
            <Image
              src={logo}
              alt=""
              className=" hover:scale-105 w-24 duration-300 transition-all"
            />
          </Link>
          <div className="lg:flex items-center hidden gap-3 xl:gap-10 ">



            {menuItems.map((item) => (
              <Link
                key={item.key}
                href={item.url}
                className={`hover:scale-105 hover:text-secondary duration-300 transition-all text-base font-medium font-montserrat ${isActive(item.url)}`}
                onClick={() => setIsModalOpen(false)} // only in mobile nav
              >
                {t(`navItems.${item.key}`)}
              </Link>
            ))}
          </div>



          <div className="lg:flex hidden items-center gap-4">
            <LanguageSwitcher />

            <Link
              href="https://wa.me/966920032065"
              className="flex gap-2 items-center lg:text-base font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" />
              966920032065
            </Link>

            {!user ? (
              <Link
                href="/signup"
                className="group inline-flex items-center justify-center py-3 px-6 lg:px-8 lg:text-base font-medium text-white rounded-2xl shadow hover:shadow-md transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #016733, #1c1466)',
                }}
              >
                {t(`registerButton`)}

              </Link>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-4 py-2.5 rounded-2xl hover:bg-slate-50 transition-all duration-300 border border-transparent hover:border-slate-200 group"
                >
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold ring-2 ring-slate-100 group-hover:ring-[#016733] transition-all duration-300">
                      {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#016733] border-2 border-white rounded-full"></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-700 group-hover:text-slate-900 transition-colors capitalize">
                      {user.first_name || 'User'}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200 rounded-2xl shadow-2xl shadow-slate-900/10 overflow-hidden transition-all duration-300 origin-top-right ${isProfileOpen
                    ? 'opacity-100 scale-100 translate-y-0'
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                    }`}
                >
                  <div className="p-4 border-b border-slate-100 bg-gradient-to-br from-slate-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold text-lg ring-2 ring-slate-200">
                        {user.first_name ? user.first_name.charAt(0).toUpperCase() : 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{`${user.first_name} ${user.last_name} ` || 'User'}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email || 'user@example.com'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#016733] hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#016733]/10 flex items-center justify-center transition-colors duration-200">
                        <User className="w-4 h-4 text-slate-600 group-hover:text-[#016733] transition-colors" />
                      </div>
                      <span>Profile</span>
                    </Link>

                    <Link
                      href="my-bookings"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#1c1466] hover:bg-slate-50 rounded-xl transition-all duration-200 group"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <div className="w-9 h-9 rounded-lg bg-slate-100 group-hover:bg-[#1c1466]/10 flex items-center justify-center transition-colors duration-200">
                        <BookOpen className="w-4 h-4 text-slate-600 group-hover:text-[#1c1466] transition-colors" />
                      </div>
                      <span>My Bookings</span>
                    </Link>
                  </div>

                  <div className="p-2 border-t border-slate-100 bg-slate-50/50">
                    <button
                      onClick={() => {
                        logout();
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group"
                    >
                      <div className="w-9 h-9 rounded-lg bg-red-50 group-hover:bg-red-100 flex items-center justify-center transition-colors duration-200">
                        <LogOut className="w-4 h-4 text-red-600 transition-colors" />
                      </div>
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
          <button
            onClick={() => setIsModalOpen(!isModalOpen)}
            className="lg:hidden block py-2 "
          >
            {isModalOpen ? <IoClose size={25} /> : <Menu />}
          </button>
        </div>
      </nav>

      <div className={`bg-white absolute left-0  top-15 block lg:hidden w-full px-10 z-40 py-10 transition-all ease-in-out lg:min-h-0 min-h-screen duration-500 transform ${isModalOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-[110vh] opacity-40"
        }`}>
        <div className="flex flex-col justify-center gap-2 ">
          {menuItems.map((item) => (
            <Link
              key={item.key}
              href={item.url}
              className={`hover:scale-105 hover:text-secondary duration-300 transition-all text-base font-medium font-montserrat ${isActive(item.url)}`}
              onClick={() => setIsModalOpen(false)} // only in mobile nav
            >
              {t(`navItems.${item.key}`)}
            </Link>
          ))}

          <div className="flex flex-col  gap-4">
            <Link
              href="https://wa.me/966920032065"
              className="flex gap-2 items-center lg:text-base font-medium"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle className="w-5 h-5" />
              966920032065
            </Link>
            <LanguageSwitcher />

            {!user ? (
              <Link
                href="/signup"
                className="py-3 px-5 text-white text-center rounded-2xl"
                style={{
                  background: 'linear-gradient(135deg, #016733, #1c1466)',
                }}
              >
                Register
              </Link>
            ) : (
              <div className="flex flex-col gap-2 mt-4 p-4 bg-slate-50 rounded-2xl">
                <div className="flex items-center gap-3 pb-4 border-b border-slate-200">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#016733] to-[#1c1466] flex items-center justify-center text-white font-bold text-lg ring-2 ring-slate-200">
                    {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">{user.name || 'User'}</p>
                    <p className="text-sm text-slate-500">{user.email || 'user@example.com'}</p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="flex items-center gap-3 py-3 px-3 font-medium text-slate-700 hover:bg-white rounded-xl transition-all"
                  onClick={() => setIsModalOpen(false)}
                >
                  <User className="w-5 h-5 text-[#016733]" />
                  Profile
                </Link>

                <Link
                  href="/bookings"
                  className="flex items-center gap-3 py-3 px-3 font-medium text-slate-700 hover:bg-white rounded-xl transition-all"
                  onClick={() => setIsModalOpen(false)}
                >
                  <BookOpen className="w-5 h-5 text-[#1c1466]" />
                  My Bookings
                </Link>

                <button
                  onClick={() => {
                    logout();
                    setIsModalOpen(false);
                  }}
                  className="flex items-center gap-3 py-3 px-3 text-red-600 font-medium text-left hover:bg-red-50 rounded-xl transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

    </div>
  );
};

export default Navbar;
