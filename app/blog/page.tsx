'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'Finding Inspiration in Everyday Moments',
    excerpt: 'How I discovered that the most powerful artistic ideas often come from the simplest observations in daily life...',
    date: 'October 1, 2024',
    category: 'Inspiration',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'My Journey with Abstract Art',
    excerpt: 'Exploring the evolution of my abstract style and the techniques that shaped my artistic voice over the years...',
    date: 'September 28, 2024',
    category: 'Process',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Behind the Scenes: Creating "Urban Flow"',
    excerpt: 'A detailed look at the creative process behind one of my most popular pieces, from concept to completion...',
    date: 'September 15, 2024',
    category: 'Behind the Scenes',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Color Theory and Emotion',
    excerpt: 'How I use color psychology to evoke specific feelings and create deeper connections with viewers...',
    date: 'September 5, 2024',
    category: 'Technique',
    readTime: '8 min read',
  },
  {
    id: 5,
    title: 'My Studio Setup and Tools',
    excerpt: 'A tour of my creative space and the essential tools that help bring my artistic visions to life...',
    date: 'August 20, 2024',
    category: 'Studio Life',
    readTime: '4 min read',
  },
  {
    id: 6,
    title: 'Reflections on Art and Purpose',
    excerpt: 'Thoughts on why I create, what art means to me, and the role of the artist in today\'s world...',
    date: 'August 10, 2024',
    category: 'Thoughts',
    readTime: '5 min read',
  },
];

export default function Blog() {
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
            <Link href="/blog" className="text-white font-semibold transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </nav>

      {/* Blog Content */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Blog
            </h1>
            <p className="text-xl text-white/70 mb-12">
              Thoughts, updates, and insights from my artistic journey
            </p>
          </motion.div>

          {/* Category Filter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 mb-12 flex-wrap"
          >
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm">
              All Posts
            </button>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm">
              Inspiration
            </button>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm">
              Process
            </button>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm">
              Behind the Scenes
            </button>
            <button className="px-5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors text-sm">
              Thoughts
            </button>
          </motion.div>

          {/* Blog Posts List */}
          <div className="space-y-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                whileHover={{ x: 10 }}
                className="group cursor-pointer"
              >
                <Link href={`/blog/${post.id}`}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-lg p-8 border border-white/10 group-hover:border-white/30 transition-all">
                    <div className="flex flex-wrap gap-3 mb-4">
                      <span className="px-3 py-1 bg-purple-500/20 text-purple-200 rounded-full text-sm">
                        {post.category}
                      </span>
                      <span className="text-white/50 text-sm">{post.date}</span>
                      <span className="text-white/50 text-sm">• {post.readTime}</span>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-3 group-hover:text-purple-300 transition-colors">
                      {post.title}
                    </h2>

                    <p className="text-white/70 text-lg leading-relaxed mb-4">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center text-white/60 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Read more</span>
                      <svg
                        className="w-4 h-4 ml-2 group-hover:translate-x-2 transition-transform"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </div>

          {/* Newsletter Signup */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-16 bg-gradient-to-r from-purple-500/10 to-pink-500/10 backdrop-blur-sm rounded-lg p-8 border border-white/10 text-center"
          >
            <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
            <p className="text-white/70 mb-6 max-w-2xl mx-auto">
              Subscribe to get notifications when I post new articles, artwork, or updates
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="px-8 py-3 bg-white text-black font-semibold rounded-lg hover:bg-white/90 transition-colors">
                Subscribe
              </button>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
