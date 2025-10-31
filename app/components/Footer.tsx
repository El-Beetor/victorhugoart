'use client';

import { useColors } from '../context/ColorContext';

export default function Footer() {
  const { accentColor, darkColors, brightAccentColor, brightColors } = useColors();

  return (
    <footer className="w-full py-8 px-4 sm:px-6" style={{ backgroundColor: darkColors[1] || accentColor || '#333333' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Email */}
          <div className="text-center sm:text-left">
            <p className="text-sm mb-2 text-white">Contact</p>
            <a
              href="mailto:vicgarcia.art@pm.me"
              className="text-lg font-semibold hover:opacity-70 transition-opacity text-white"
            >
              vicgarcia.art@pm.me
            </a>
          </div>

          {/* Instagram */}
          <div className="text-center sm:text-right">
            <p className="text-sm mb-2 text-white">Follow</p>
            <a
              href="https://instagram.com/vicgarcia.art"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg font-semibold hover:opacity-70 transition-opacity text-white"
            >
              @vicgarcia.art
            </a>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6">
          <p className="text-sm text-white">
            © {new Date().getFullYear()} vicgarcia.art. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
