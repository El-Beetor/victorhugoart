'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../../context/ColorContext';
import Footer from '../../components/Footer';

export default function LeSheepBehindTheScenes() {
  const { accentColor, darkColors } = useColors();

  const colorPalette = [
    { color: '#9ACD32', name: 'Yellow-Green', percentage: 40 },
    { color: '#87CEEB', name: 'Light Blue', percentage: 28 },
    { color: '#4169E1', name: 'Deep Blue', percentage: 15 },
    { color: '#F5F5F5', name: 'White', percentage: 10 },
    { color: '#6B8E23', name: 'Olive Green', percentage: 5 },
    { color: '#4682B4', name: 'Steel Blue', percentage: 2 },
  ];

  // Value breakdown (light to dark)
  const valueBreakdown = [
    { color: '#E8E8E8', name: 'Highlights', percentage: 20 },
    { color: '#B8B8B8', name: 'Lights', percentage: 35 },
    { color: '#787878', name: 'Midtones', percentage: 30 },
    { color: '#404040', name: 'Darks', percentage: 12 },
    { color: '#1C1C1C', name: 'Deep Shadows', percentage: 3 },
  ];

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

      return <path key={index} d={pathData} fill={item.color} stroke="white" strokeWidth="2" />;
    });
  };

  return (
    <div className="min-h-screen bg-[#fffff7]">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <Image src="/favicon.ico" alt="Victor Garcia Art Logo" width={32} height={32} className="w-6 h-6 sm:w-8 sm:h-8" />
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1 text-black">
              {'vicgarcia.art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1, 0, -2, 3, -4, 2, -1][i]}deg)` }}>{letter}</span>
              ))}
            </h1>
          </Link>
          <Link href="/" className="px-4 py-2 rounded-lg font-medium text-sm hover:opacity-70 transition-opacity" style={{ color: accentColor }}>← Back to Home</Link>
        </div>
      </nav>

      <main className="pt-24 pb-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>Le' Sheep</h1>
            <p className="text-xl" style={{ color: darkColors[1] || accentColor }}>Behind the Scenes</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-16">
            <div className="relative max-w-3xl mx-auto bg-[#fffff7] p-6 sm:p-8 shadow-2xl">
              <Image src="/FinishedPaintings/sheep.jpg" alt="Le' Sheep - Finished Painting" width={1200} height={800} className="w-full h-auto" />
              <div className="mt-6 text-center">
                <h2 className="text-2xl font-bold mb-2" style={{ color: darkColors[0] || accentColor }}>Finished Painting</h2>
                <p className="text-sm" style={{ color: darkColors[1] || accentColor }}>Oil on Canvas 8" x 10" • 2025</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.4 }} className="mb-16 max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8" style={{ color: darkColors[0] || accentColor }}>Color Breakdown</h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                <div className="flex-shrink-0">
                  <svg width="240" height="240" viewBox="0 0 240 240" className="drop-shadow-lg">{generatePieSlices(colorPalette)}</svg>
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {colorPalette.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-md shadow-md flex-shrink-0 border-2 border-white" style={{ backgroundColor: item.color }} />
                      <div className="flex-1">
                        <p className="font-semibold text-sm" style={{ color: darkColors[0] || accentColor }}>{item.name}</p>
                        <p className="text-xs" style={{ color: darkColors[1] || accentColor }}>{item.percentage}%</p>
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

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }} className="mb-16 max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-6" style={{ color: darkColors[0] || accentColor }}>About This Piece</h2>
            <div className="bg-white p-8 shadow-lg rounded-lg">
              <p className="text-lg leading-relaxed mb-4" style={{ color: darkColors[1] || accentColor }}>
                  This one was fun to paint because I did it around friends. I wish I didn't go so saturated with the colors, it is jarring for me looking back at it. I also wish I had smaller brushes to work with when I made this.
                  I think using a large brush for most of the painting is great but you do need some small details to really sell some shapes. 
              </p>
              <p className="text-lg leading-relaxed" style={{ color: darkColors[1] || accentColor }}>
              </p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.6 }} className="mb-12">
            <div className="max-w-3xl mx-auto bg-white p-8 shadow-lg rounded-lg text-center">
              <p className="text-lg" style={{ color: darkColors[0] || accentColor }}>Work in progress photos coming soon!</p>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
