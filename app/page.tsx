'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const artworks = [
  {
    id: 1,
    title: 'Midnight Dreams',
    year: 2024,
    category: 'Abstract',
    description: 'An exploration of subconscious imagery through bold strokes and deep colors.',
    size: 'large'
  },
  {
    id: 2,
    title: 'Portrait of Solitude',
    year: 2024,
    category: 'Portrait',
    description: 'Capturing the quiet beauty of introspection and self-reflection.',
    size: 'medium'
  },
  {
    id: 3,
    title: 'Mountain Serenity',
    year: 2023,
    category: 'Landscape',
    description: 'A peaceful vista inspired by early morning light in the Rockies.',
    size: 'large'
  },
  {
    id: 4,
    title: 'Urban Rhythm',
    year: 2023,
    category: 'Abstract',
    description: 'The pulse and energy of city life translated into geometric forms.',
    size: 'small'
  },
  {
    id: 5,
    title: 'Faces of Time',
    year: 2022,
    category: 'Portrait',
    description: 'A study of aging and the stories written in every line and wrinkle.',
    size: 'medium'
  },
  {
    id: 6,
    title: 'Coastal Sunset',
    year: 2022,
    category: 'Landscape',
    description: 'Golden hour on the Pacific coast, where sky meets sea.',
    size: 'large'
  },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorTrail, setCursorTrail] = useState<Array<{ x: number; y: number; id: number }>>([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const totalImages = 21;

  // Slideshow effect - change image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === totalImages ? 1 : prev + 1));
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax effect and cursor trail
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // ±10px movement
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });

      // Add cursor trail
      const newTrail = { x: e.clientX, y: e.clientY, id: Date.now() };
      setCursorTrail((prev) => [...prev, newTrail].slice(-15)); // Keep last 15 positions
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  // Petal button data
  const petals = [
    { name: 'Portfolio', href: '#portfolio', angle: 0 },
    { name: 'Shop', href: '/shop', angle: 90 },
    { name: 'About', href: '/about', angle: 180 },
    { name: 'Contact', href: '/contact', angle: 270 },
  ];

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const portfolioSection = document.getElementById('portfolio');
    if (portfolioSection) {
      portfolioSection.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };


  const getFrameSize = (size: string) => {
    switch(size) {
      case 'large': return 'h-[400px] sm:h-[500px]';
      case 'medium': return 'h-[350px] sm:h-[400px]';
      case 'small': return 'h-[300px] sm:h-[350px]';
      default: return 'h-[350px] sm:h-[400px]';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Cursor Trail */}
      {cursorTrail.map((trail, index) => (
        <motion.div
          key={trail.id}
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed w-4 h-4 rounded-full bg-[#fffff7] pointer-events-none z-50"
          style={{
            left: trail.x - 8,
            top: trail.y - 8,
            opacity: (index / cursorTrail.length) * 0.6,
          }}
        />
      ))}

      {/* Background Slideshow */}
      <div className="fixed inset-0 -z-10">
        <AnimatePresence>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{
              opacity: 1,
              scale: [1.05, 1.08, 1.06, 1.07, 1.05],
              x: mousePosition.x,
              y: mousePosition.y
            }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 5 },
              scale: { duration: 25, repeat: Infinity, ease: "easeInOut" },
              x: { duration: 0.5, ease: "easeOut" },
              y: { duration: 0.5, ease: "easeOut" }
            }}
            className="absolute inset-0"
          >
            <Image
              src={`/bg_wallpapers/image_${currentImage}.png`}
              alt={`Background ${currentImage}`}
              fill
              className="object-cover blur-[2px]"
              priority={currentImage === 1}
            />
            {/* Color Tint Overlay */}
            <div className="absolute inset-0 bg-[#fffff7] opacity-40 mix-blend-multiply"></div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Navigation Bar */}
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
                  href="#portfolio"
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
      <main className="relative flex items-center justify-center min-h-screen px-4">
        {/* Center Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: "easeOut"
          }}
          className="relative z-10 w-[375px] h-[375px] sm:w-[450px] sm:h-[450px] md:w-[525px] md:h-[525px] rounded-full flex items-center justify-center shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-sm bg-[#fffff7]/55 cursor-pointer"
        >
          <Image
            src="/images/victorhugoartlogo.png"
            alt="Victor Hugo Art Logo"
            width={525}
            height={525}
            className="rounded-full object-cover"
            priority
            style={{ filter: 'brightness(0) saturate(100%) invert(8%) sepia(39%) saturate(1890%) hue-rotate(358deg) brightness(95%) contrast(97%)' }}
          />
        </motion.div>

        {/* Navigation Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="absolute bottom-20 left-0 right-0 flex flex-wrap gap-3 justify-center px-6"
        >
          {petals.map((petal, index) => (
            <Link key={petal.name} href={petal.href} onClick={petal.name === 'Portfolio' ? scrollToPortfolio : undefined}>
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  rotate: [0, -10, 10, -10, 10, 0],
                }}
                transition={{
                  scale: { duration: 0.4, delay: 1.2 + index * 0.1 },
                  opacity: { duration: 0.4, delay: 1.2 + index * 0.1 },
                  rotate: {
                    duration: 1.5,
                    delay: 3 + index * 0.3,
                    repeat: Infinity,
                    repeatDelay: 4,
                    ease: "easeInOut"
                  }
                }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 bg-[#fffff7]/55 backdrop-blur-md rounded-full shadow-lg"
              >
                <span className="text-[#2e1705] font-semibold text-sm">
                  {petal.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* Decorative Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-[#0B3826]/40 rounded-full blur-3xl -z-10"
        />
      </main>

      {/* Portfolio Section */}
      <section id="portfolio" className="relative bg-gradient-to-b from-[#fffff7] to-[#2E1705] py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#2e1705] mb-4">
              Portfolio
            </h2>
            <p className="text-xl text-[#2e1705]/70">
              Explore my collection of artwork
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 sm:gap-4 mb-16 flex-wrap justify-center"
          >
            <button className="px-4 sm:px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors text-sm sm:text-base">
              All
            </button>
            <button className="px-4 sm:px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors text-sm sm:text-base">
              Abstract
            </button>
            <button className="px-4 sm:px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors text-sm sm:text-base">
              Portrait
            </button>
            <button className="px-4 sm:px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors text-sm sm:text-base">
              Landscape
            </button>
          </motion.div>

          {/* Gallery Wall */}
          <div className="space-y-16 sm:space-y-24">
            {artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index, duration: 0.8 }}
                className="group"
              >
                {/* Frame with shadow effect */}
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="relative mx-auto max-w-3xl"
                >
                  {/* Artwork Frame */}
                  <div className={`relative ${getFrameSize(art.size)} bg-[#fffff7] p-6 sm:p-8 shadow-2xl`}>
                    {/* Inner artwork area */}
                    <div className="w-full h-full bg-gradient-to-br from-[#0B3826]/30 to-[#2e1705]/30 flex items-center justify-center border-2 border-[#2e1705]/20">
                      <div className="text-center text-[#2e1705]">
                        <div className="text-5xl sm:text-7xl mb-4">🎨</div>
                        <p className="text-sm font-medium">&quot;{art.title}&quot;</p>
                      </div>
                    </div>

                    {/* Frame shadow/depth effect */}
                    <div className="absolute -inset-2 bg-gradient-to-b from-[#2e1705]/80 to-[#2e1705] -z-10 shadow-2xl"></div>
                  </div>

                  {/* Spotlight effect on hover */}
                  <motion.div
                    className="absolute -inset-12 bg-[#0B3826]/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"
                    initial={{ opacity: 0 }}
                  />
                </motion.div>

                {/* Artwork Info Plaque */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index + 0.3 }}
                  className="mt-8 max-w-2xl mx-auto bg-[#2e1705]/20 backdrop-blur-sm border border-[#2e1705]/30 rounded-lg p-6"
                >
                  <h3 className="text-xl sm:text-2xl font-bold text-[#fffff7] mb-2">
                    {art.title}
                  </h3>
                  <p className="text-[#fffff7]/60 text-sm mb-3">
                    {art.category} • {art.year}
                  </p>
                  <p className="text-[#fffff7]/80 leading-relaxed italic text-sm sm:text-base">
                    &quot;{art.description}&quot;
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
