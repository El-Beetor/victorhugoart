'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

export default function About() {
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
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity"
          >
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
          </button>

          {/* Center: Site Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
            <Image
              src="/images/victorhugoartlogohorizontal.png"
              alt="Victor Hugo Art"
              width={150}
              height={38}
              className="object-contain sm:w-[200px] sm:h-[50px] brightness-0"
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
              <nav className="flex flex-col gap-6 px-8 py-4">
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

      {/* About Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2e1705] mb-8 text-center">
              About the Artist
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="aspect-square bg-gradient-to-br from-[#2e1705]/20 to-[#0B3826]/20 rounded-lg border border-[#2e1705]/20 flex items-center justify-center shadow-xl">
                <div className="text-center text-[#2e1705]/50">
                  <div className="text-8xl mb-4">👨‍🎨</div>
                  <p className="text-sm">Your photo here</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg text-[#2e1705]/80 leading-relaxed">
                Welcome! I&apos;m Victor Hugo, an artist passionate about creating unique and meaningful works of art.
                My journey in art began years ago, and since then, I&apos;ve been exploring different styles and mediums
                to express my creativity.
              </p>
              <p className="text-lg text-[#2e1705]/80 leading-relaxed">
                Each piece I create tells a story and carries a piece of my vision. Through my work, I aim to
                evoke emotions, spark imagination, and bring beauty into the world.
              </p>
              <p className="text-lg text-[#2e1705]/80 leading-relaxed">
                Thank you for visiting my portfolio. I hope you enjoy exploring my collection as much as I
                enjoyed creating it.
              </p>
            </motion.div>
          </div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-[#fffff7]/80 backdrop-blur-sm rounded-lg p-8 border border-[#2e1705]/20 text-center shadow-xl"
          >
            <h2 className="text-3xl font-bold text-[#2e1705] mb-4">Let&apos;s Connect</h2>
            <p className="text-[#2e1705]/70 mb-6">
              Interested in commissioning a piece or learning more about my work?
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-3 bg-[#2e1705] text-[#fffff7] font-semibold rounded-full hover:bg-[#2e1705]/80 transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Get in Touch
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
