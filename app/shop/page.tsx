'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

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
    <div className="min-h-screen bg-gradient-to-b from-[#fffff7] to-[#2E1705]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fffff7]/55 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center">
          {/* Left: Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="w-10 h-10 flex flex-col justify-center items-center gap-1.5 hover:opacity-70 transition-opacity relative z-10"
          >
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
            <span className="w-6 h-0.5 bg-[#2e1705] rounded-full"></span>
          </button>

          {/* Center: Site Logo */}
          <Link href="/" className="absolute left-1/2 transform -translate-x-1/2 inline-flex items-center pointer-events-auto z-0">
            <Image
              src="/images/victorhugoartlogohorizontal.png"
              alt="Victor Hugo Art"
              width={150}
              height={38}
              className="object-contain !w-[120px] !h-auto sm:!w-[200px] brightness-0"
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
              <nav className="flex flex-col gap-6 px-8 py-4 max-h-[750px]:mt-16">
                <Link
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="text-2xl font-semibold text-[#2e1705] hover:text-[#0B3826] transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/#portfolio"
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

      {/* Shop Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-[#2e1705] mb-4">
              Shop
            </h1>
            <p className="text-xl text-[#2e1705]/70 mb-12">
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
            <button className="px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors">
              All Available
            </button>
            <button className="px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors">
              Abstract
            </button>
            <button className="px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors">
              Portrait
            </button>
            <button className="px-6 py-2 bg-[#2e1705]/10 hover:bg-[#2e1705]/20 text-[#2e1705] rounded-full transition-colors">
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
                <div className="relative aspect-square bg-gradient-to-br from-[#2e1705]/20 to-[#0B3826]/20 rounded-lg overflow-hidden border border-[#2e1705]/20 group-hover:border-[#2e1705]/40 transition-all">
                  <div className="w-full h-full flex items-center justify-center text-[#2e1705]/50">
                    {/* Placeholder - replace with actual images */}
                    <div className="text-center">
                      <div className="text-6xl mb-4">🎨</div>
                      <p className="text-sm">Product image</p>
                    </div>
                  </div>

                  {!product.available && (
                    <div className="absolute inset-0 bg-[#2e1705]/80 flex items-center justify-center">
                      <span className="text-[#fffff7] font-semibold text-lg">SOLD</span>
                    </div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-xl font-semibold text-[#2e1705]">{product.title}</h3>
                      <p className="text-[#2e1705]/60 text-sm">{product.category} • {product.size}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#2e1705]">${product.price}</p>
                    </div>
                  </div>

                  {product.available ? (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePurchase(product.id, product.title, product.price)}
                      className="w-full mt-3 px-6 py-3 bg-[#2e1705] text-[#fffff7] font-semibold rounded-lg hover:bg-[#2e1705]/80 transition-colors"
                    >
                      Purchase with Stripe
                    </motion.button>
                  ) : (
                    <button
                      disabled
                      className="w-full mt-3 px-6 py-3 bg-[#2e1705]/10 text-[#2e1705]/40 font-semibold rounded-lg cursor-not-allowed"
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
            className="mt-16 bg-[#fffff7]/80 backdrop-blur-sm rounded-lg p-8 border border-[#2e1705]/20"
          >
            <h2 className="text-2xl font-bold text-[#2e1705] mb-4">Purchase Information</h2>
            <div className="grid md:grid-cols-2 gap-6 text-[#2e1705]/70">
              <div>
                <h3 className="text-[#2e1705] font-semibold mb-2">Shipping</h3>
                <p>All artworks are carefully packaged and shipped with insurance. Shipping costs calculated at checkout.</p>
              </div>
              <div>
                <h3 className="text-[#2e1705] font-semibold mb-2">Authenticity</h3>
                <p>Each piece comes with a certificate of authenticity signed by the artist.</p>
              </div>
              <div>
                <h3 className="text-[#2e1705] font-semibold mb-2">Returns</h3>
                <p>14-day return policy for all purchases. Artwork must be returned in original condition.</p>
              </div>
              <div>
                <h3 className="text-[#2e1705] font-semibold mb-2">Questions?</h3>
                <p>Contact us at <a href="mailto:victorhugoart@pm.me" className="text-[#2e1705] hover:underline">victorhugoart@pm.me</a></p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
