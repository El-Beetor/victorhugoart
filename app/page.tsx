'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';

const basePath = process.env.NODE_ENV === 'production' ? '/victorhugoart' : '';

export default function Home() {
  const [currentImage, setCurrentImage] = useState(1);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const totalImages = 21;

  // Slideshow effect - change image every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === totalImages ? 1 : prev + 1));
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, []);

  // Mouse tracking for parallax effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // ±10px movement
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  // Petal button data
  const petals = [
    { name: 'Paintings', href: '/gallery', angle: 0 },
    { name: 'Shop', href: '/shop', angle: 72 },
    { name: 'About', href: '/about', angle: 144 },
    { name: 'Contact', href: '/contact', angle: 216 },
    { name: 'Comics', href: '/comics', angle: 288 },
  ];

  // Calculate position for each petal button in a circle
  const radius = 450; // Distance from center

  const getPetalPosition = (angle: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: Math.cos(radians) * radius,
      y: Math.sin(radians) * radius,
    };
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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
              src={`${basePath}/bg_wallpapers/image_${currentImage}.png`}
              alt={`Background ${currentImage}`}
              fill
              className="object-cover"
              priority={currentImage === 1}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#4B352A] backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          {/* Left: Site Logo */}
          <Link href="/" className="flex items-center">
            <Image
              src={`${basePath}/images/victorhugoartlogohorizontal.png`}
              alt="Victor Hugo Art"
              width={200}
              height={50}
              className="object-contain"
              priority
            />
          </Link>

          {/* Right: Menu Button */}
          <button className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity">
            <span className="w-6 h-0.5 bg-[#FEFAE0] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#FEFAE0] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#FEFAE0] rounded-full"></span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="relative flex items-center justify-center min-h-screen">
        {/* Center Logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 0.9, opacity: 1 }}
          whileHover={{ scale: 0.95}}
          transition={{ duration: 1.8, delay: 0.2 }}
          className="relative z-10 w-[700px] h-[700px] rounded-full flex items-center justify-center shadow-2xl bg-[#4B352A] cursor-pointer"
        >
          <Image
            src={`${basePath}/images/victorhugoartlogo.png`}
            alt="Victor Hugo Art Logo"
            width={700}
            height={700}
            className="rounded-full object-cover"

            priority
          />
        </motion.div>

        {/* Petal Buttons in Circle */}
        {petals.map((petal, index) => {
          const position = getPetalPosition(petal.angle);

          return (
            <motion.div
              key={petal.name}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: 1,
                opacity: 1,
              }}
              transition={{
                duration: 0.6,
                delay: 0.8 + index * 0.1,
                type: 'spring',
                stiffness: 100
              }}
              className="absolute"
              style={{
                left: `calc(50% + ${position.x}px - 64px)`,
                top: `calc(50% + ${position.y}px - 64px)`,
                transform: 'translate(-50%, -50%)',
              }}
            >
              <Link href={petal.href}>
                <motion.div
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-32 h-32 bg-[#FEFAE0]/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-xl cursor-pointer hover:bg-[#B99470] transition-colors group"
                >
                  <span className="text-[#4B352A] group-hover:text-[#FEFAE0] font-semibold text-lg text-center px-4 transition-colors">
                    {petal.name}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          );
        })}

        {/* Decorative Background Glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.25, scale: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
          className="absolute w-96 h-96 bg-[#E2A16F]/40 rounded-full blur-3xl -z-10"
        />
      </main>
    </div>
  );
}
