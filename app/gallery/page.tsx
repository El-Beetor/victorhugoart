'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

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

export default function Gallery() {
  // Create varied positioning for gallery wall effect
  const getFrameSize = (size: string) => {
    switch(size) {
      case 'large': return 'h-[500px]';
      case 'medium': return 'h-[400px]';
      case 'small': return 'h-[350px]';
      default: return 'h-[400px]';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-md z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-white">
            Victor Hugo Art
          </Link>
          <div className="flex gap-8">
            <Link href="/gallery" className="text-white font-semibold transition-colors">
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

      {/* Gallery Wall */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Gallery
            </h1>
            <p className="text-xl text-white/70">
              Step into my virtual gallery and explore the collection
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mb-16 flex-wrap justify-center"
          >
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              All
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              Abstract
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              Portrait
            </button>
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              Landscape
            </button>
          </motion.div>

          {/* Gallery Wall - Vertical Layout with frames */}
          <div className="space-y-24">
            {artworks.map((art, index) => (
              <motion.div
                key={art.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
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
                  <div className={`relative ${getFrameSize(art.size)} bg-white p-8 shadow-2xl`}>
                    {/* Inner artwork area */}
                    <div className="w-full h-full bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center border-2 border-gray-300">
                      <div className="text-center text-gray-600">
                        <div className="text-7xl mb-4">🎨</div>
                        <p className="text-sm font-medium">"{art.title}"</p>
                      </div>
                    </div>

                    {/* Frame shadow/depth effect */}
                    <div className="absolute -inset-2 bg-gradient-to-b from-gray-800 to-gray-900 -z-10 shadow-2xl"></div>
                  </div>

                  {/* Spotlight effect on hover */}
                  <motion.div
                    className="absolute -inset-12 bg-white/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-20"
                    initial={{ opacity: 0 }}
                  />
                </motion.div>

                {/* Artwork Info Plaque */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 * index + 0.3 }}
                  className="mt-8 max-w-2xl mx-auto bg-black/30 backdrop-blur-sm border border-white/20 rounded-lg p-6"
                >
                  <h3 className="text-2xl font-bold text-white mb-2">
                    {art.title}
                  </h3>
                  <p className="text-white/60 text-sm mb-3">
                    {art.category} • {art.year}
                  </p>
                  <p className="text-white/80 leading-relaxed italic">
                    "{art.description}"
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
