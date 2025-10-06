'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';

export default function Success() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffff7] to-[#2E1705] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl w-full bg-[#fffff7]/80 backdrop-blur-sm rounded-2xl shadow-2xl p-8 sm:p-12 border border-[#2e1705]/20 text-center"
      >
        <div className="mb-6">
          <div className="text-6xl mb-4">✓</div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2e1705] mb-4">
            Payment Successful!
          </h1>
          <p className="text-xl text-[#2e1705]/70 mb-8">
            Thank you for your purchase. Your artwork is on its way!
          </p>
        </div>

        <div className="bg-[#2e1705]/5 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-[#2e1705] mb-3">What's Next?</h2>
          <ul className="text-left text-[#2e1705]/70 space-y-2">
            <li>✓ You'll receive a confirmation email shortly</li>
            <li>✓ Your artwork will be carefully packaged and shipped</li>
            <li>✓ You'll receive a certificate of authenticity</li>
            <li>✓ Tracking information will be sent to your email</li>
          </ul>
        </div>

        {sessionId && (
          <p className="text-sm text-[#2e1705]/50 mb-6">
            Order ID: {sessionId.slice(-12)}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/shop">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#2e1705] text-[#fffff7] font-semibold rounded-lg hover:bg-[#2e1705]/80 transition-colors"
            >
              Continue Shopping
            </motion.button>
          </Link>
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-[#2e1705]/10 text-[#2e1705] font-semibold rounded-lg hover:bg-[#2e1705]/20 transition-colors"
            >
              Back to Home
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
