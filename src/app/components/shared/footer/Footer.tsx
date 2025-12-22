'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import {
  FaPlane,
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaYoutube,
  FaInstagram,
} from 'react-icons/fa';

import {
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdArrowOutward,
} from 'react-icons/md';

const Footer = () => {
  const t = useTranslations('footer');
  const [email, setEmail] = useState('');

  const links = [
    { href: 'milecoin', label: t('company.milecoin') },
    { href: 'aboutUs', label: t('company.about') },
    { href: '#', label: t('company.order') },
    { href: '#', label: t('company.contact') },
    { href: '#', label: t('company.faq') },
  ];

  const legalLinks = [
    { href: 'termsandconditions', label: t('legal.terms') },
    { href: 'privacypolicy', label: t('legal.privacy') },
    { href: '#', label: t('legal.cookies') },
    { href: '#', label: t('legal.developers') },
  ];

  const socialLinks = [
    { href: '#', icon: FaFacebookF, label: 'Facebook' },
    { href: '#', icon: FaTwitter, label: 'Twitter' },
    { href: 'https://www.linkedin.com/company/tayyran/posts/?feedView=all', icon: FaLinkedinIn, label: 'LinkedIn' },
    { href: '#', icon: FaYoutube, label: 'YouTube' },
    { href: '#', icon: FaInstagram, label: 'Instagram' },
  ];

  return (
    <footer className="relative bg-greenGradient text-white overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* TOP */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">

            {/* LOGO + DESC */}
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 mb-6 group">

                <Image
                  src="/assets/icons/footer-logo.svg"
                  alt=""
                  width={100}
                  height={100}
                  unoptimized
                  className="rounded-2xl mr-3 object-contain"
                />
              </Link>

              <p className="text-slate-400 leading-relaxed mb-8 text-sm">
                {t('description')}
              </p>

              <div className="flex gap-3">
                {socialLinks.map((social, i) => (
                  <Link
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-11 h-11 rounded-xl bg-white/[0.03] flex items-center justify-center hover:scale-110 transition"
                  >
                    <social.icon className="w-5 h-5 text-slate-300 hover:text-white" />
                  </Link>
                ))}
              </div>
            </div>

            {/* COMPANY */}
            <div className="lg:col-span-2">
              <h3 className="text-md font-bold uppercase mb-6">
                {t('titles.company')}
              </h3>
              <ul className="space-y-3">
                {links.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="flex items-center gap-2 text-slate-400 hover:text-white">
                      <MdArrowOutward className="text-emerald-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* LEGAL */}
            <div className="lg:col-span-3">
              <h3 className="text-md font-bold uppercase mb-6">
                {t('titles.legal')}
              </h3>
              <ul className="space-y-3">
                {legalLinks.map((link, i) => (
                  <li key={i}>
                    <Link href={link.href} className="flex items-center gap-2 text-slate-400 hover:text-white">
                      <MdArrowOutward className="text-indigo-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CONTACT */}
            <div className="lg:col-span-3">
              <h3 className="text-md font-bold uppercase mb-6">
                {t('titles.contact')}
              </h3>

              <ul className="space-y-4 text-slate-300">

                <li className="flex gap-3">
                  <MdEmail className="text-emerald-500 text-xl" />
                  <div>
                    <p className="text-xs uppercase">{t('contact.email')}</p>
                    <p className="text-sm">info@tayyran.com</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <MdPhone className="text-emerald-500 text-xl" />
                  <div>
                    <p className="text-xs uppercase">{t('contact.phone')}</p>
                    <p className="text-sm">966920032065</p>
                  </div>
                </li>

                <li className="flex gap-3">
                  <MdLocationOn className="text-emerald-500 text-xl" />
                  <div>
                    <p className="text-xs uppercase">{t('contact.location')}</p>
                    <p className="text-sm">{t('contact.country')}</p>
                  </div>
                </li>

              </ul>
            </div>

          </div>
        </div>

        {/* BOTTOM */}
        <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between text-sm">
          <p className="text-slate-500">
            © {new Date().getFullYear()} Tayyran. {t('copyright')}
          </p>

          <p className="text-slate-400">
            {t('poweredBy')}{' '}
            <Link href="https://vanhard.com" className="text-white font-semibold">
              Vanhard
            </Link>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
