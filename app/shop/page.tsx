'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useColors } from '../context/ColorContext';

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
  const { accentColor, darkGradientColor, brightAccentColor, darkColors, midColors, brightColors } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  const handlePurchase = async (productId: number, title: string, price: number) => {
    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          title,
          price,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Error:', data.error);
        alert('Something went wrong. Please try again or contact victorhugoart@pm.me');
        return;
      }

      // Redirect to Stripe Checkout using the session URL
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again or contact victorhugoart@pm.me');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, #fffff7, #f5f5ed)` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: `${accentColor}DD` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
            <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: brightAccentColor }}></span>
          </button>

          {/* Center: Site Name */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <h1 className="text-2xl sm:text-3xl font-bold lowercase flex gap-1" style={{ color: brightAccentColor }}>
              {'vic art'.split('').map((letter, i) => (
                <span key={i} style={{ display: 'inline-block', transform: `rotate(${[2, -3, 4, 0, -2, 3, -1][i]}deg)` }}>{letter}</span>
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
                  href="/#portfolio"
                  onClick={scrollToPortfolio}
                  className="text-3xl font-light tracking-wide hover:opacity-70 transition-opacity lowercase flex"
                  style={{ color: accentColor }}
                >
                  {'portfolio'.split('').map((letter, i) => (
                    <span key={i} style={{ display: 'inline-block', transform: `rotate(${[-2, 3, -4, 2, -3, 4, -2, 3, -1][i]}deg)` }}>{letter}</span>
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

      {/* Shop Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-4" style={{ color: darkColors[0] || accentColor }}>
              Shop
            </h1>
            <p className="text-xl mb-12" style={{ color: darkColors[1] || accentColor }}>
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
            <button
              className="px-6 py-2 rounded-full transition-colors"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              All Available
            </button>
            <button
              className="px-6 py-2 rounded-full transition-colors"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              Abstract
            </button>
            <button
              className="px-6 py-2 rounded-full transition-colors"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
              Portrait
            </button>
            <button
              className="px-6 py-2 rounded-full transition-colors"
              style={{ backgroundColor: `${accentColor}1A`, color: accentColor }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = `${accentColor}33`}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = `${accentColor}1A`}
            >
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
                <div
                  className="relative aspect-square rounded-lg overflow-hidden border transition-all"
                  style={{
                    background: `linear-gradient(to bottom right, ${accentColor}33, ${brightAccentColor}33)`,
                    borderColor: `${accentColor}33`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = `${accentColor}66`}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = `${accentColor}33`}
                >
                  <div className="w-full h-full flex items-center justify-center" style={{ color: `${accentColor}80` }}>
                    {/* Placeholder - replace with actual images */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="text-sm">Product image</p>
                    </div>
                  </div>

                  {!product.available && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${accentColor}CC` }}>
                      <span className="text-[#fffff7] font-semibold text-lg">SOLD</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold" style={{ color: accentColor }}>{product.title}</h3>
                      <p className="text-sm" style={{ color: `${accentColor}99` }}>{product.category} • {product.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ color: accentColor }}>${product.price}</p>
                    </div>
                  </div>

                  {product.available ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePurchase(product.id, product.title, product.price)}
                      className="w-full mt-3 px-6 py-3 text-[#fffff7] font-semibold rounded-lg transition-opacity"
                      style={{ backgroundColor: accentColor }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                    >
                      Purchase with Stripe
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-3 px-6 py-3 font-semibold rounded-lg cursor-not-allowed"
                      style={{ backgroundColor: `${accentColor}1A`, color: `${accentColor}66` }}
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
            className="mt-16 bg-[#fffff7]/80 backdrop-blur-sm rounded-lg p-8 border"
            style={{ borderColor: `${accentColor}33` }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>Purchase Information</h2>
            <div className="grid md:grid-cols-2 gap-6" style={{ color: `${accentColor}B3` }}>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: accentColor }}>Shipping</h3>
                <p>All artworks are carefully packaged and shipped with insurance. Shipping costs calculated at checkout.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: accentColor }}>Authenticity</h3>
                <p>Each piece comes with a certificate of authenticity signed by the artist.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: accentColor }}>Returns</h3>
                <p>14-day return policy for all purchases. Artwork must be returned in original condition.</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: accentColor }}>Questions?</h3>
                <p>Contact us at <a href="mailto:victorhugoart@pm.me" className="hover:underline" style={{ color: accentColor }}>victorhugoart@pm.me</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
