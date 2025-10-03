'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Victor Hugo Art
          </Link>
          <div className="flex gap-8">
            <Link href="/gallery" className="text-white/80 hover:text-white transition-colors">
              Gallery
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors">
              About
            </Link>
            <Link href="/shop" className="text-white/80 hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-screen px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-6xl md:text-8xl font-bold text-white mb-6">
            Victor Hugo Art
          </h1>
          <p className="text-xl md:text-2xl text-white/70 mb-12 max-w-2xl">
            Explore a collection of unique artworks that blend creativity, passion, and vision.
          </p>

          <div className="flex gap-6 justify-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/gallery"
                className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
              >
                View Gallery
              </Link>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href="/shop"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-full hover:bg-white/10 transition-colors"
              >
                Shop Art
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
