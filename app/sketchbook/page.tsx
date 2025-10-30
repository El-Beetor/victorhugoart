'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useColors } from '../context/ColorContext';
import Footer from '../components/Footer';

const sketchesBase = [
  '/sketches/image_1.png',
  '/sketches/image_3.png',
  '/sketches/image_4.png',
  '/sketches/image_5.png',
  '/sketches/image_6.png',
  '/sketches/image_7.png',
  '/sketches/image_8.png',
  '/sketches/image_9.png',
  '/sketches/image_10.png',
  '/sketches/image_11.png',
  '/sketches/image_12.png',
  '/sketches/image_13.png',
  '/sketches/image_14.png',
  '/sketches/image_15.png',
  '/sketches/image_17.png',
  '/sketches/image_19.png',
  '/sketches/image_21.png',
  '/sketches/lagoon.png',
];

// Shuffle function
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function SketchBook() {
  const { accentColor, darkGradientColor, brightAccentColor, darkColors, midColors, brightColors } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sketches, setSketches] = useState(sketchesBase);

  // Shuffle on client side only to avoid hydration mismatch
  useEffect(() => {
    setSketches(shuffleArray(sketchesBase));
  }, []);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, #fffff7, #f5f5ed)` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Site Name */}
          <Link href="/" className="inline-flex items-center gap-2 pointer-events-auto z-10">
            <Image
              src="/favicon.ico"
              alt="Victor Garcia Art Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1 text-black">
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
          </Link>

          {/* Right: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
          </button>
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
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-80 bg-[#fffff7] shadow-2xl z-50 flex flex-col"
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
                  href="#portfolio"
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

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              SketchBook
            </h1>
            <p className="text-xl text-gray-700">
              {sketches.length} Sketches
            </p>
          </motion.div>

          {/* Scrolling Gallery */}
          <div className="space-y-8">
            {sketches.map((sketch, index) => (
              <motion.div
                key={sketch}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: 0.1 * (index % 3), duration: 0.6 }}
                className="w-full"
              >
                <Image
                  src={sketch}
                  alt={`Sketch ${index + 1}`}
                  width={2000}
                  height={3000}
                  className="w-full h-auto shadow-lg"
                  style={{
                    filter: 'contrast(1.05) brightness(0.98)',
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
