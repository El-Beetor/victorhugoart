'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { useColors } from '../context/ColorContext';

export default function About() {
  const { accentColor, darkGradientColor, brightAccentColor } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, #fffff7, #f5f5ed)` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${accentColor}DD` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
          </button>

          {/* Center: Site Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1" style={{ color: brightAccentColor }}>
              {'vic art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
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
                  <span className="text-3xl" style={{ color: accentColor }}>×</span>
                </button>
              </div>

              {/* Menu Links */}
              <nav className="flex flex-col gap-6 px-8 py-4 max-h-[750px]:mt-16">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'home'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[3, -2, 4, -3][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/#portfolio"
                  onClick={scrollToPortfolio}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'portfolio'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-2, 3, -4, 2, -3, 4, -2, 3, -1][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/sketchbook"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'sketchbook'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, -2, 3, -4, 2, -3, 4, -2][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'shop'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-3, 4, -2, 3][i]}deg)` }}>{letter}</span>
                  ))}
                </Link>
                <Link
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'about'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, -2, 3][i]}deg)` }}>{letter}</span>
                  ))}
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
            <h1 className="text-5xl md:text-6xl font-bold mb-8 text-center" style={{ color: accentColor }}>
              hi
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="aspect-square rounded-lg overflow-hidden shadow-xl border" style={{ borderColor: `${accentColor}33` }}>
                <Image
                  src="/images/profile.jpg"
                  alt="Victor Hugo - Artist"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full"
                  priority
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="space-y-6"
            >
              <p className="text-lg leading-relaxed" style={{ color: `${accentColor}CC` }}>
                Welcome! I&apos;m Victor Hugo, an artist passionate about creating unique and meaningful works of art.
                My journey in art began years ago, and since then, I&apos;ve been exploring different styles and mediums
                to express my creativity.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: `${accentColor}CC` }}>
                Each piece I create tells a story and carries a piece of my vision. Through my work, I aim to
                evoke emotions, spark imagination, and bring beauty into the world.
              </p>
              <p className="text-lg leading-relaxed" style={{ color: `${accentColor}CC` }}>
                Thank you for visiting my portfolio. I hope you enjoy exploring my collection as much as I
                enjoyed creating it.
              </p>
            </motion.div>
          </div>

          {/* Contact Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="bg-[#fffff7]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 border mt-16"
            style={{ borderColor: `${accentColor}1A` }}
          >
            <div className="space-y-8">
              {/* Email Section */}
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl font-bold mb-4" style={{ color: accentColor }}>
                  Get in Touch
                </h2>
                <p className="mb-6" style={{ color: `${accentColor}B3` }}>
                  For inquiries, commissions, or just to say hello
                </p>
                <a
                  href="mailto:victorhugoart@pm.me"
                  className="inline-block px-8 py-4 text-[#fffff7] font-semibold text-lg rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
                  style={{ backgroundColor: accentColor }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  victorhugoart@pm.me
                </a>
              </div>

              {/* Response Time */}
              <div className="text-center">
                <p className="text-sm" style={{ color: `${accentColor}CC` }}>
                  I typically respond within 24-48 hours
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
