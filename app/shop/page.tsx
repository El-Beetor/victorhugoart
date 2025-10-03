'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const products = [
  {
    id: 1,
    title: 'Abstract Dreams',
    price: 299,
    category: 'Abstract',
    size: '24" x 36"',
    available: true,
  },
  {
    id: 2,
    title: 'Sunset Portrait',
    price: 499,
    category: 'Portrait',
    size: '30" x 40"',
    available: true,
  },
  {
    id: 3,
    title: 'Mountain Vista',
    price: 399,
    category: 'Landscape',
    size: '36" x 48"',
    available: false,
  },
  {
    id: 4,
    title: 'Urban Flow',
    price: 349,
    category: 'Abstract',
    size: '24" x 36"',
    available: true,
  },
  {
    id: 5,
    title: 'Golden Hour',
    price: 449,
    category: 'Landscape',
    size: '30" x 40"',
    available: true,
  },
  {
    id: 6,
    title: 'Inner Light',
    price: 599,
    category: 'Portrait',
    size: '36" x 48"',
    available: true,
  },
];

export default function Shop() {
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
            <Link href="/shop" className="text-white font-semibold transition-colors">
              Shop
            </Link>
          </div>
        </div>
      </nav>

      {/* Shop Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Shop
            </h1>
            <p className="text-xl text-white/70 mb-12">
              Original artworks available for purchase
            </p>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-4 mb-12 flex-wrap"
          >
            <button className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors">
              All Available
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

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className="group"
              >
                <div className="relative aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg overflow-hidden border border-white/10 group-hover:border-white/30 transition-all">
                  <div className="w-full h-full flex items-center justify-center text-white/50">
                    {/* Placeholder - replace with actual images */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="text-sm">Product image</p>
                    </div>
                  </div>

                  {!product.available && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white font-semibold text-lg">SOLD</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-white">{product.title}</h3>
                      <p className="text-white/60 text-sm">{product.category} • {product.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">${product.price}</p>
                    </div>
                  </div>

                  {product.available ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full mt-3 px-6 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors"
                    >
                      Purchase
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-3 px-6 py-3 bg-white/10 text-white/40 font-semibold rounded-lg cursor-not-allowed"
                    >
                      Sold Out
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10"
          >
            <h2 className="text-2xl font-bold text-white mb-4">Purchase Information</h2>
            <div className="grid md:grid-cols-2 gap-6 text-white/70">
              <div>
                <h3 className="text-white font-semibold mb-2">Shipping</h3>
                <p>All artworks are carefully packaged and shipped with insurance. Shipping costs calculated at checkout.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Authenticity</h3>
                <p>Each piece comes with a certificate of authenticity signed by the artist.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Returns</h3>
                <p>14-day return policy for all purchases. Artwork must be returned in original condition.</p>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-2">Questions?</h3>
                <p>Contact us at <a href="mailto:shop@victorhugoart.com" className="text-white hover:underline">shop@victorhugoart.com</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
