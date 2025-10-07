'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function Contact() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffff7] to-[#2E1705]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffff7]/55 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
          </button>

          {/* Center: Site Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <Image
              src="/images/victorhugoartlogohorizontal.png"
              alt="Victor Hugo Art"
              width={150}
              height={38}
              className="object-contain !w-[120px] !h-auto sm:!w-[200px] brightness-0"
              priority
              style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(39%) saturate(1890%) hue-rotate(358deg) brightness(95%) contrast(97%)' }}
            />
          </Link>

          {/* Right: Empty space for symmetry */}
          <div className="w-10 h-10"></div>
        </div>
      </nav>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Menu Panel */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 bg-[#fffff7] shadow-2xl z-50 flex flex-col"
            >
              {/* Close Button */}
              <div className="flex justify-start p-6">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center hover:opacity-70 transition-opacity"
                >
                  <span className="text-3xl text-[#2e1705]">×</span>
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col gap-6 px-8 py-4 max-h-[750px]:mt-16">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#portfolio"
                  onClick={scrollToPortfolio}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  Shop
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  About
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  Contact
                </Link>
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-[#2e1705] mb-6">
              Get in Touch
            </h1>
            <p className="text-xl sm:text-2xl text-[#2e1705]/70">
              I&apos;d love to hear from you
            </p>
          </motion.div>

          {/* Contact Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="bg-[#fffff7]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 border border-[#2e1705]/10"
          >
            <div className="space-y-8">
              {/* Email Section */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold text-[#2e1705] mb-4">
                  Email Me
                </h2>
                <p className="text-[#2e1705]/70 mb-6">
                  For inquiries, commissions, or just to say hello
                </p>
                <a
                  href="mailto:victorhugoart@pm.me"
                  className="inline-block px-8 py-4 bg-[#2e1705] text-[#fffff7] font-semibold text-lg rounded-full hover:bg-[#2e1705]/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  victorhugoart@pm.me
                </a>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-[#2e1705]/20"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#fffff7] text-[#2e1705]/50">or</span>
                </div>
              </div>

              {/* Quick Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/"
                  className="p-4 bg-[#2e1705]/5 hover:bg-[#2e1705]/10 rounded-xl transition-colors text-center"
                >
                  <span className="text-[#2e1705] font-semibold">← Back to Home</span>
                </Link>
                <Link
                  href="/#portfolio"
                  className="p-4 bg-[#2e1705]/5 hover:bg-[#2e1705]/10 rounded-xl transition-colors text-center"
                >
                  <span className="text-[#2e1705] font-semibold">View Portfolio →</span>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Additional Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-[#fffff7]/80 text-sm">
              I typically respond within 24-48 hours
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
