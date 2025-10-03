'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function About() {
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
            <Link href="/about" className="text-white font-semibold transition-colors">
              About
            </Link>
            <Link href="/shop" className="text-white/80 hover:text-white transition-colors">
              Shop
            </Link>
          </div>
        </div>
      </nav>

      {/* About Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-8">
              About the Artist
            </h1>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <div className="aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-white/10 flex items-center justify-center">
                <div className="text-center text-white/50">
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
              <p className="text-lg text-white/80 leading-relaxed">
                Welcome! I'm Victor Hugo, an artist passionate about creating unique and meaningful works of art.
                My journey in art began years ago, and since then, I've been exploring different styles and mediums
                to express my creativity.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Each piece I create tells a story and carries a piece of my vision. Through my work, I aim to
                evoke emotions, spark imagination, and bring beauty into the world.
              </p>
              <p className="text-lg text-white/80 leading-relaxed">
                Thank you for visiting my portfolio. I hope you enjoy exploring my collection as much as I
                enjoyed creating it.
              </p>
            </motion.div>
          </div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-white mb-2">50+</div>
              <div className="text-white/60">Artworks</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-white mb-2">5</div>
              <div className="text-white/60">Years Experience</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-white mb-2">20+</div>
              <div className="text-white/60">Exhibitions</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10 text-center">
              <div className="text-4xl font-bold text-white mb-2">100+</div>
              <div className="text-white/60">Happy Collectors</div>
            </div>
          </motion.div>

          {/* Contact CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Let's Connect</h2>
            <p className="text-white/70 mb-6">
              Interested in commissioning a piece or learning more about my work?
            </p>
            <a
              href="mailto:contact@victorhugoart.com"
              className="inline-block px-8 py-3 bg-white text-black font-semibold rounded-full hover:bg-white/90 transition-colors"
            >
              Get in Touch
            </a>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
