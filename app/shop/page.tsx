'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useColors } from '../context/ColorContext';
import Footer from '../components/Footer';

interface Product {
  id: string;
  priceId: string;
  title: string;
  price: number;
  category: string;
  size: string;
  available: boolean;
  description?: string;
  images?: string[];
}

export default function Shop() {
  const { accentColor, darkGradientColor, brightAccentColor, darkColors, midColors, brightColors } = useColors();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from Stripe
  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        const data = await response.json();

        if (data.error) {
          setError(data.error);
        } else {
          setProducts(data.products);
        }
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const scrollToPortfolio = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = '/#portfolio';
    setIsMenuOpen(false);
  };

  const handlePurchase = async (productId: string, priceId: string) => {
    try {
      // Create checkout session
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId,
          priceId,
        }),
      });

      const data = await response.json();

      if (data.error) {
        console.error('Error:', data.error);
        alert('Something went wrong. Please try again or contact vicgarcia.art@pm.me');
        return;
      }

      // Redirect to Stripe Checkout using the session URL
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Something went wrong. Please try again or contact vicgarcia.art@pm.me');
    }
  };

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(to bottom, #fffff7, #f5f5ed)` }}>
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md" style={{ backgroundColor: '#fffff7DD' }}>
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

          {/* Loading State */}
          {loading && (
            <div className="text-center py-16">
              <p className="text-xl" style={{ color: accentColor }}>Loading products...</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-16">
              <p className="text-xl" style={{ color: darkColors[0] || accentColor }}>Shop is currently unavailable. Please check back soon or reach out at vicgarcia.art@pm.me</p>
            </div>
          )}

          {/* Product Grid */}
          {!loading && !error && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.length === 0 ? (
                <div className="col-span-full text-center py-16">
                  <p className="text-xl" style={{ color: accentColor }}>
                    No products available yet. Add products in your Stripe dashboard!
                  </p>
                </div>
              ) : (
                products.map((product, index) => (
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
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-600">
                          <div className="text-center">
                            <div className="text-6xl mb-4">🎨</div>
                            <p className="text-sm">No image</p>
                          </div>
                        </div>
                      )}

                      {!product.available && (
                        <div className="absolute inset-0 flex items-center justify-center" style={{ backgroundColor: `${accentColor}CC` }}>
                          <span className="text-[#fffff7] font-semibold text-lg">SOLD</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold" style={{ color: accentColor }}>{product.title}</h3>
                          {product.description && (
                            <p className="text-sm text-gray-700 mt-1">{product.description}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold" style={{ color: accentColor }}>${product.price}</p>
                        </div>
                      </div>

                      {product.available ? (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handlePurchase(product.id, product.priceId)}
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
                          className="w-full mt-3 px-6 py-3 font-semibold rounded-lg cursor-not-allowed bg-gray-200 text-gray-500"
                        >
                          Sold Out
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* Info Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-[#fffff7]/80 backdrop-blur-sm rounded-lg p-8 border"
            style={{ borderColor: `${accentColor}33` }}
          >
            <h2 className="text-2xl font-bold mb-4" style={{ color: accentColor }}>Purchase Information</h2>
            <div className="grid md:grid-cols-2 gap-6 text-gray-800">
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
                <p>Contact us at <a href="mailto:vicgarcia.art@pm.me" className="hover:underline" style={{ color: accentColor }}>vicgarcia.art@pm.me</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
