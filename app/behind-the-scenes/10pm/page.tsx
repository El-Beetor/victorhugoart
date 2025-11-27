'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../../context/ColorContext';
import Footer from '../../components/Footer';

export default function TenPmBehindTheScenes() {
  const { accentColor, darkColors } = useColors();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const wipImages = [
    { src: '/WorkInProgress/10pm_wip/undercoat.jpg', title: 'I started this painting with a bright red undercoat' },
    { src: '/WorkInProgress/10pm_wip/sketch.jpg', title: 'I then scetched the composition' },
    { src: '/WorkInProgress/10pm_wip/blockin.jpg', title: 'Blocked in the darks and lights' },
    { src: '/FinishedPaintings/bar.jpg', title: 'I brightened up the piece and added a lot more lights' },
    
  ];

  // Color palette used in the painting
  const colorPalette = [
    { color: '#C85A3F', name: 'Reddish-Orange', percentage: 28 },
    { color: '#4A2C2A', name: 'Dark Brown', percentage: 23 },
    { color: '#B8865F', name: 'Warm Amber', percentage: 17 },
    { color: '#FFD700', name: 'Golden Yellow', percentage: 12 },
    { color: '#5C7A8A', name: 'Blue-Gray', percentage: 10 },
    { color: '#FF5722', name: 'Bright Orange', percentage: 10 },
  ];

  // Value breakdown (light to dark) - pure grayscale
  const valueBreakdown = [
    { color: '#E8E8E8', name: 'Highlights', percentage: 5 },
    { color: '#B8B8B8', name: 'Lights', percentage: 18 },
    { color: '#787878', name: 'Midtones', percentage: 32 },
    { color: '#404040', name: 'Darks', percentage: 30 },
    { color: '#181818', name: 'Deep Shadows', percentage: 15 },
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % wipImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + wipImages.length) % wipImages.length);
  };

  // Convert hex to HSL for color wheel positioning
  const hexToHSL = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  // Generate color wheel markers
  const generateColorWheelMarkers = () => {
    const centerX = 120;
    const centerY = 120;
    const radius = 90;

    return colorPalette.map((item, index) => {
      const hsl = hexToHSL(item.color);
      const angle = (hsl.h - 90) * (Math.PI / 180);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const markerSize = 6 + (item.percentage / 100) * 8;

      return (
        <g key={index}>
          <circle
            cx={x}
            cy={y}
            r={markerSize}
            fill={item.color}
            stroke="white"
            strokeWidth="2"
          />
        </g>
      );
    });
  };

  // Generate pie chart slices for color palette
  const generatePieSlices = (data: typeof colorPalette) => {
    let currentAngle = 0;
    const radius = 100;
    const centerX = 120;
    const centerY = 120;

    return data.map((item, index) => {
      const sliceAngle = (item.percentage / 100) * 2 * Math.PI;
      const startAngle = currentAngle;
      const endAngle = currentAngle + sliceAngle;

      const x1 = centerX + radius * Math.cos(startAngle);
      const y1 = centerY + radius * Math.sin(startAngle);
      const x2 = centerX + radius * Math.cos(endAngle);
      const y2 = centerY + radius * Math.sin(endAngle);

      const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ');

      currentAngle = endAngle;

      return (
        <path
          key={index}
          d={pathData}
          fill={item.color}
          stroke="white"
          strokeWidth="2"
        />
      );
    });
  };

  return (
    <div className="min-h-screen bg-[#fffff7]">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2">
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

          <Link
            href="/"
            className="px-4 py-2 rounded-lg font-medium text-sm hover:opacity-70 transition-opacity"
            style={{ color: accentColor }}
          >
            ← Back to Home
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              10pm
            </h1>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>
              Behind the Scenes
            </p>
          </motion.div>

          {/* Finished Painting */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-16"
          >
            <div className="relative max-w-3xl mx-auto bg-[#fffff7] p-6 sm:p-8 shadow-2xl">
              <Image
                src="/FinishedPaintings/bar.jpg"
                alt="10pm - Finished Painting"
                width={1200}
                height={800}
                className="w-full h-auto"
              />
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: darkColors[0] || accentColor }}>
                  Finished Painting
                </h2>
                <p className="text-sm" style={{ color: darkColors[1] || accentColor }}>
                  Oil on Canvas 8&quot; x 10&quot; • 2025
                </p>
              </div>
            </div>
          </motion.div>

          {/* Color Palette Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              Color Breakdown
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="flex-shrink-0">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">
                    {generatePieSlices(colorPalette)}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colorPalette.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md shadow-md flex-shrink-0 border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: darkColors[0] || accentColor }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: darkColors[1] || accentColor }}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Value Breakdown Pie Chart */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="mb-16 max-w-4xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              Value Breakdown
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                {/* Pie Chart */}
                <div className="flex-shrink-0">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">
                    {generatePieSlices(valueBreakdown)}
                  </svg>
                </div>

                {/* Legend */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {valueBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-md shadow-md flex-shrink-0 border-2 border-white"
                        style={{ backgroundColor: item.color }}
                      />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: darkColors[0] || accentColor }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: darkColors[1] || accentColor }}>
                          {item.percentage}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Description Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-16 max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: darkColors[0] || accentColor }}>
              About This Piece
            </h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <p className="text-lg leading-relaxed mb-4" style={{ color: darkColors[1] || accentColor }}>
                I currently live on top of a bar and knew I had to paint it at some point. This is that some point. 
                I went down there and did a sketch of the scene and really enjoyed the composition and how easily it was to enter it. 
                The bar had a distint bright red that I wanted to make sure was in the final piece. This one was a hard piece to get right. It took a while
                to get it to point where I was happy with it. I had to go back and add a lot more light sources than there was in real life to get the that cozy feeling I 
                felt when I was there. 
              </p>
              <p className="text-lg leading-relaxed" style={{ color: darkColors[1] || accentColor }}>
              </p>
            </div>
          </motion.div>

          {/* Work in Progress Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>
              The Process
            </h2>

            <div className="relative max-w-4xl mx-auto">
              {/* Carousel Container */}
              <div className="relative overflow-hidden rounded-lg shadow-2xl bg-white p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col items-center"
                  >
                    <Image
                      src={wipImages[currentImageIndex].src}
                      alt={wipImages[currentImageIndex].title}
                      width={1200}
                      height={900}
                      className="w-full h-auto rounded-lg"
                    />
                    <p className="mt-4 text-xl font-medium" style={{ color: darkColors[0] || accentColor }}>
                      {wipImages[currentImageIndex].title}
                    </p>
                  </motion.div>
                </AnimatePresence>

                {/* Navigation Buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ color: darkColors[0] || accentColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
                  style={{ color: darkColors[0] || accentColor }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                  </svg>
                </button>
              </div>

              {/* Dots Indicator */}
              <div className="flex justify-center gap-2 mt-6">
                {wipImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className="w-3 h-3 rounded-full transition-all duration-300"
                    style={{
                      backgroundColor: index === currentImageIndex ? (darkColors[0] || accentColor) : '#D1D5DB',
                      transform: index === currentImageIndex ? 'scale(1.2)' : 'scale(1)'
                    }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
