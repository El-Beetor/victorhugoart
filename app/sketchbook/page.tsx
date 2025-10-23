'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../context/ColorContext';
import Footer from '../components/Footer';

const sketches = [
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
];

export default function SketchBook() {
  const { accentColor, darkGradientColor, brightAccentColor, darkColors, midColors, brightColors } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [direction, setDirection] = useState(0);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  const nextPage = () => {
    if (currentPage < sketches.length - 1) {
      setDirection(1);
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setDirection(-1);
      setCurrentPage(currentPage - 1);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -1000 : 1000,
      opacity: 0,
      rotateY: direction > 0 ? -45 : 45,
    }),
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, #fffff7, #f5f5ed)` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
            <span className="w-6 h-0.5 rounded-full bg-black"></span>
          </button>

          {/* Center: Site Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1 text-black">
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
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
      <main className="pt-24 pb-12 px-4 min-h-screen flex flex-col">
        <div className="max-w-7xl mx-auto w-full mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              SketchBook
            </h1>
            <p className="text-xl text-gray-700">
              Page {currentPage + 1} of {sketches.length}
            </p>
          </motion.div>
        </div>

        {/* Sketchbook Page Container */}
        <div className="flex-1 flex items-center justify-center relative max-w-6xl mx-auto w-full">
          {/* Previous Button */}
          <button
            onClick={prevPage}
            disabled={currentPage === 0}
            className="absolute left-0 z-10 p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: accentColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Page Display */}
          <div className="relative w-full max-w-4xl mx-16" style={{ perspective: '2000px' }}>
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentPage}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.3 },
                  rotateY: { duration: 0.5 },
                }}
                className="relative bg-white rounded-lg shadow-2xl p-4 sm:p-8"
                style={{
                  transformStyle: 'preserve-3d',
                  border: '2px solid #e5e7eb'
                }}
              >
                <div className="relative w-full">
                  <Image
                    src={sketches[currentPage]}
                    alt={`Sketch ${currentPage + 1}`}
                    width={2000}
                    height={3000}
                    className="w-full h-auto object-contain rounded"
                    style={{ maxHeight: 'calc(100vh - 300px)' }}
                    priority
                  />
                </div>

                {/* Page Number at Bottom */}
                <div className="text-center mt-4 text-gray-500 text-sm">
                  {currentPage + 1}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <button
            onClick={nextPage}
            disabled={currentPage === sketches.length - 1}
            className="absolute right-0 z-10 p-4 rounded-full bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ color: accentColor }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Page Dots Indicator */}
        <div className="flex justify-center gap-2 mt-8">
          {sketches.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setDirection(index > currentPage ? 1 : -1);
                setCurrentPage(index);
              }}
              className="w-2 h-2 rounded-full transition-all"
              style={{
                backgroundColor: index === currentPage ? accentColor : '#d1d5db',
                transform: index === currentPage ? 'scale(1.5)' : 'scale(1)'
              }}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
