'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../context/ColorContext';
import Footer from '../components/Footer';

const artworks = [
  {
    id: 1,
    title: 'Graceland',
    year: 2025,
    category: 'Oil on Canvas 8" x 12"',
    description: 'Oil on Canvas 8" x 12"',
    size: 'small',
    image: '/FinishedPaintings/graceland.jpg',
    behindTheScenesUrl: '/behind-the-scenes/graceland'
  },
  {
    id: 2,
    title: '10pm',
    year: 2025,
    category: 'Oil on Canvas 8" x 10"',
    description: 'Oil on Canvas 8 x 10',
    size: 'large',
    image: '/FinishedPaintings/bar.jpg',
    behindTheScenesUrl: '/behind-the-scenes/10pm'
  },
  {
    id: 3,
    title: 'After School Bike Ride',
    year: 2025,
    category: 'Oil on Canvas 9 x 12"',
    description: 'Oil on Canvas 9" x12"',
    size: 'small',
    image: '/FinishedPaintings/bike.jpg',
    behindTheScenesUrl: '/behind-the-scenes/after-school-bike-ride'
  },
  {
    id: 4,
    title: 'Bird in Blue',
    year: 2025,
    category: 'Oil on Canvas 14" x18"',
    description: 'Oil on Canvas 14" x18"',
    size: 'medium',
    image: '/FinishedPaintings/bird.jpg',
    behindTheScenesUrl: '/behind-the-scenes/bird-in-blue'
  },
  {
    id: 5,
    title: 'Sisters',
    year: 2025,
    category: 'Oil on Paper 8" x 10"',
    description: 'Oil on Canvas 8" x10"',
    size: 'large',
    image: '/FinishedPaintings/duck.png',
    behindTheScenesUrl: '/behind-the-scenes/sisters'
  },
  {
    id: 6,
    title: 'Long way down: Far way forward',
    year: 2025,
    category: 'Oil on Wood 8" x 10"',
    description: 'Oil on Canvas 8" x 10"',
    size: 'medium',
    image: '/FinishedPaintings/river.png',
    behindTheScenesUrl: '/behind-the-scenes/long-way-down'
  },
  {
    id: 7,
    title: 'Billowing Tree',
    year: 2025,
    category: 'Oil on Canvas 24" x 30"',
    description: 'Oil on Canvas 24 x 30',
    size: 'large',
    image: '/FinishedPaintings/tree.jpg',
    behindTheScenesUrl: '/behind-the-scenes/billowing-tree'
  },
  {
    id: 8,
    title: 'Le\' Sheep',
    year: 2025,
    category: 'Oil on Canvas 8" x 10"',
    description: 'Oil on Canvas 8 x 10',
    size: 'large',
    image: '/FinishedPaintings/sheep.jpg',
    behindTheScenesUrl: '/behind-the-scenes/le-sheep'
  }
];

export default function Portfolio() {
  const { accentColor, darkGradientColor, darkColors, midColors, bgGradientStart, bgGradientEnd } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, ${bgGradientStart}, ${bgGradientEnd})` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${bgGradientStart}DD` }}>
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
              className="fixed left-0 top-0 h-full w-80 shadow-2xl z-50 flex flex-col"
              style={{ backgroundColor: bgGradientStart }}
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
                  href="/portfolio"
                  onClick={() => setIsMenuOpen(false)}
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

      {/* Portfolio Content */}
      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              Portfolio
            </h1>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              Explore my collection of artwork
            </p>
          </motion.div>

          {/* Gallery Wall */}
          <div className="columns-1 md:columns-2 gap-6 sm:gap-10">
            {artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 * (index % 2), duration: 0.8 }}
                className="group mb-10 sm:mb-16 break-inside-avoid"
              >
                {/* Frame with shadow effect */}
                <motion.div className="relative">
                  {/* Artwork Frame */}
                  <div className="relative p-4 sm:p-6 shadow-2xl" style={{ backgroundColor: bgGradientStart }}>
                    {/* Inner artwork area */}
                    <div
                      className="relative w-full overflow-hidden transition-all duration-300 group-hover:border-4"
                      style={{
                        borderColor: darkColors[index % darkColors.length] || darkGradientColor
                      }}
                    >
                      <Image
                        src={art.image}
                        alt={art.title}
                        width={1200}
                        height={800}
                        className="w-full h-auto"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Frame shadow/depth effect */}
                    <div
                      className="absolute -inset-2 -z-10 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      style={{
                        background: `linear-gradient(to bottom, ${midColors[index % midColors.length] || accentColor}CC, ${darkColors[index % darkColors.length] || accentColor})`
                      }}
                    ></div>
                  </div>

                  {/* Spotlight effect on hover */}
                  <motion.div
                    className="absolute -inset-6 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 -z-20"
                    initial={{ opacity: 0 }}
                    style={{ backgroundColor: `${darkColors[index % darkColors.length] || darkGradientColor}` }}
                  />
                </motion.div>

                {/* Artwork Info Plaque */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * (index % 2) + 0.3 }}
                  className="mt-4 p-4"
                >
                  <div className="flex flex-col items-start gap-3">
                    {/* Artwork Info */}
                    <div>
                      <h3 className="text-xl font-bold mb-1" style={{ color: darkColors[0] || accentColor }}>
                        {art.title}
                      </h3>
                      <p className="text-sm" style={{ color: darkColors[1] || accentColor }}>
                        {art.category} • {art.year}
                      </p>
                    </div>

                    {/* Behind the Scenes Button - only for specific artworks */}
                    {art.behindTheScenesUrl && (
                      <Link href={art.behindTheScenesUrl}>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-all duration-300 shadow-md hover:shadow-lg"
                          style={{
                            backgroundColor: darkColors[0] || accentColor,
                            color: '#fffff7'
                          }}
                        >
                          See Behind the Scenes
                        </motion.button>
                      </Link>
                    )}
                  </div>
                </motion.div>
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
