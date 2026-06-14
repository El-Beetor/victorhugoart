'use client';

import { useState, useEffect } from 'react';
import { useColors } from '../context/ColorContext';
import theme from '../config/theme.json';

const FONTS = [
  { name: 'Geist', key: 'geist', value: 'var(--font-geist-sans)' },
  { name: 'Playfair Display', key: 'playfair', value: 'var(--font-playfair)' },
  { name: 'Poppins', key: 'poppins', value: 'var(--font-poppins)' },
  { name: 'Caveat', key: 'caveat', value: 'var(--font-caveat)' },
  { name: 'Special Elite', key: 'specialElite', value: 'var(--font-special-elite)' },
  { name: 'Courier Prime', key: 'courierPrime', value: 'var(--font-courier-prime)' },
  { name: 'Cutive Mono', key: 'cutiveMono', value: 'var(--font-cutive-mono)' },
];

const PALETTES = [
  {
    name: 'Earth',
    accentColor: '#2e1705',
    darkGradientColor: '#2E1705',
    brightAccentColor: '#0B3826',
    darkColors: ['#2e1705', '#3d2410', '#1f3d2e', '#4a2f15', '#2a1a08'],
    midColors: ['#8a6f47', '#a0826d', '#6b8e5a', '#b08968', '#7a8c6f'],
    brightColors: ['#e8d5b7', '#f0e4d0', '#d4e4d0', '#f5ead6', '#dde8d8'],
    buttonColors: ['#8a6f47', '#a0826d', '#6b8e5a', '#b08968'],
    bgGradientStart: '#fffff7',
    bgGradientEnd: '#f5f5ed',
  },
  {
    name: 'Ocean',
    accentColor: '#0a2540',
    darkGradientColor: '#0a2540',
    brightAccentColor: '#0ea5e9',
    darkColors: ['#0a2540', '#13344f', '#1e3a5f', '#0f2c44', '#16324a'],
    midColors: ['#2c6e91', '#3b82a0', '#4a90b8', '#5a9bc4', '#3d7ea6'],
    brightColors: ['#bae6fd', '#e0f2fe', '#cffafe', '#d0f0fd', '#e6f7ff'],
    buttonColors: ['#2c6e91', '#3b82a0', '#4a90b8', '#5a9bc4'],
    bgGradientStart: '#f5fbff',
    bgGradientEnd: '#e8f4fb',
  },
  {
    name: 'Sunset',
    accentColor: '#7c2d12',
    darkGradientColor: '#7c2d12',
    brightAccentColor: '#f97316',
    darkColors: ['#7c2d12', '#6b2810', '#5c2348', '#7a2e2e', '#5c1f1f'],
    midColors: ['#ea580c', '#f97316', '#fb923c', '#e8642a', '#f2754a'],
    brightColors: ['#fed7aa', '#ffedd5', '#fef3c7', '#fde2c4', '#fff0db'],
    buttonColors: ['#ea580c', '#f97316', '#fb923c', '#e8642a'],
    bgGradientStart: '#fffaf5',
    bgGradientEnd: '#fef0e4',
  },
  {
    name: 'Forest',
    accentColor: '#1a2e1a',
    darkGradientColor: '#1a2e1a',
    brightAccentColor: '#16a34a',
    darkColors: ['#1a2e1a', '#2d4a2d', '#14301f', '#223822', '#1c3320'],
    midColors: ['#3f6b3f', '#4d7c4d', '#5a8f5a', '#467e52', '#508a5c'],
    brightColors: ['#bbf7d0', '#dcfce7', '#d4f5dd', '#e0f7e9', '#caf5da'],
    buttonColors: ['#3f6b3f', '#4d7c4d', '#5a8f5a', '#467e52'],
    bgGradientStart: '#f7fcf7',
    bgGradientEnd: '#eaf6ec',
  },
  {
    name: 'Charcoal',
    accentColor: '#1f1f1f',
    darkGradientColor: '#1f1f1f',
    brightAccentColor: '#525252',
    darkColors: ['#1f1f1f', '#2e2e2e', '#262626', '#333333', '#2a2a2a'],
    midColors: ['#737373', '#8a8a8a', '#a3a3a3', '#909090', '#7f7f7f'],
    brightColors: ['#d4d4d4', '#e5e5e5', '#f5f5f5', '#ededed', '#dedede'],
    buttonColors: ['#737373', '#8a8a8a', '#a3a3a3', '#909090'],
    bgGradientStart: '#fafafa',
    bgGradientEnd: '#ededed',
  },
  {
    name: 'Lavender',
    accentColor: '#4a3b6b',
    darkGradientColor: '#4a3b6b',
    brightAccentColor: '#9b6dd6',
    darkColors: ['#4a3b6b', '#3d2f5c', '#5c4a7a', '#453569', '#564269'],
    midColors: ['#8b6fb5', '#9b7fc4', '#a98fd1', '#967ec0', '#a384c9'],
    brightColors: ['#e6dcf5', '#f0e8fa', '#e8ddf7', '#ede3f9', '#e3d6f4'],
    buttonColors: ['#8b6fb5', '#9b7fc4', '#a98fd1', '#967ec0'],
    bgGradientStart: '#fcfaff',
    bgGradientEnd: '#f3edfa',
  },
  {
    name: 'Rose',
    accentColor: '#7a2e3a',
    darkGradientColor: '#7a2e3a',
    brightAccentColor: '#e0758f',
    darkColors: ['#7a2e3a', '#6b2530', '#8a3d48', '#702834', '#84353f'],
    midColors: ['#c97a8a', '#d68a99', '#e0758f', '#cc8896', '#d4828f'],
    brightColors: ['#fbd9e0', '#fce4e9', '#fadce3', '#fbe0e5', '#f9d6dd'],
    buttonColors: ['#c97a8a', '#d68a99', '#e0758f', '#cc8896'],
    bgGradientStart: '#fffafb',
    bgGradientEnd: '#fcedf0',
  },
  {
    name: 'Mustard',
    accentColor: '#6b5414',
    darkGradientColor: '#6b5414',
    brightAccentColor: '#e0a52f',
    darkColors: ['#6b5414', '#5c4710', '#7a611c', '#664f12', '#735c18'],
    midColors: ['#c99a3a', '#d6a847', '#e0a52f', '#cca050', '#d4ab3a'],
    brightColors: ['#fbe9c4', '#fcefd4', '#fae5bc', '#fbeac8', '#f9e3b8'],
    buttonColors: ['#c99a3a', '#d6a847', '#e0a52f', '#cca050'],
    bgGradientStart: '#fffdf5',
    bgGradientEnd: '#fcf3e0',
  },
  {
    name: 'Teal',
    accentColor: '#0d3d3d',
    darkGradientColor: '#0d3d3d',
    brightAccentColor: '#2bb3a3',
    darkColors: ['#0d3d3d', '#0a3232', '#154a4a', '#0c3838', '#114444'],
    midColors: ['#3a9b91', '#47a89e', '#2bb3a3', '#50a89c', '#3aa49a'],
    brightColors: ['#c4f5ee', '#d4faf4', '#bcf0e8', '#c8f2eb', '#b8efe6'],
    buttonColors: ['#3a9b91', '#47a89e', '#2bb3a3', '#50a89c'],
    bgGradientStart: '#f5fffd',
    bgGradientEnd: '#e0f7f2',
  },
  {
    name: 'Plum',
    accentColor: '#3d1a3d',
    darkGradientColor: '#3d1a3d',
    brightAccentColor: '#a8459b',
    darkColors: ['#3d1a3d', '#321530', '#4a2049', '#381c38', '#442142'],
    midColors: ['#8b4a87', '#9b5794', '#a8459b', '#96508f', '#a14a99'],
    brightColors: ['#f3d4ef', '#f8e0f5', '#f0cced', '#f5d8f1', '#eec8ea'],
    buttonColors: ['#8b4a87', '#9b5794', '#a8459b', '#96508f'],
    bgGradientStart: '#fffaff',
    bgGradientEnd: '#f9ecf7',
  },
  {
    name: 'Slate',
    accentColor: '#2e3a45',
    darkGradientColor: '#2e3a45',
    brightAccentColor: '#5d7a96',
    darkColors: ['#2e3a45', '#26303a', '#384654', '#2a3640', '#324050'],
    midColors: ['#6b8299', '#7891a8', '#5d7a96', '#7088a0', '#6884a0'],
    brightColors: ['#d8e4ed', '#e4edf4', '#d0dfeb', '#dce6ef', '#cddeec'],
    buttonColors: ['#6b8299', '#7891a8', '#5d7a96', '#7088a0'],
    bgGradientStart: '#f7fafc',
    bgGradientEnd: '#e9f0f5',
  },
  {
    name: 'Terracotta',
    accentColor: '#6b2f1f',
    darkGradientColor: '#6b2f1f',
    brightAccentColor: '#d9764a',
    darkColors: ['#6b2f1f', '#5c2719', '#7a3826', '#662c1c', '#733424'],
    midColors: ['#c4744f', '#d18259', '#d9764a', '#c97f5e', '#cf7850'],
    brightColors: ['#fae0d4', '#fce8de', '#f8dccc', '#fae3d6', '#f7d8c8'],
    buttonColors: ['#c4744f', '#d18259', '#d9764a', '#c97f5e'],
    bgGradientStart: '#fffaf7',
    bgGradientEnd: '#fbece3',
  },
];

const initialFontIndex = Math.max(0, FONTS.findIndex((f) => f.key === theme.font));

export default function DebugPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFont, setActiveFont] = useState(initialFontIndex);
  const [activePalette, setActivePalette] = useState<number | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const {
    accentColor,
    darkGradientColor,
    brightAccentColor,
    darkColors,
    midColors,
    brightColors,
    buttonColors,
    bgGradientStart,
    bgGradientEnd,
    textColor,
    setButtonColors,
    setAccentColor,
    setDarkGradientColor,
    setBrightAccentColor,
    setDarkColors,
    setMidColors,
    setBrightColors,
    setBgGradientStart,
    setBgGradientEnd,
    setTextColor,
  } = useColors();

  useEffect(() => {
    const savedFont = localStorage.getItem('debug-font');
    if (savedFont !== null) {
      const index = Number(savedFont);
      if (FONTS[index]) {
        document.body.style.setProperty('--font-active', FONTS[index].value);
        setActiveFont(index);
      }
    }
  }, []);

  const applyFont = (index: number) => {
    document.body.style.setProperty('--font-active', FONTS[index].value);
    localStorage.setItem('debug-font', String(index));
    setActiveFont(index);
  };

  const applyPalette = (index: number) => {
    const palette = PALETTES[index];
    setAccentColor(palette.accentColor);
    setDarkGradientColor(palette.darkGradientColor);
    setBrightAccentColor(palette.brightAccentColor);
    setDarkColors(palette.darkColors);
    setMidColors(palette.midColors);
    setBrightColors(palette.brightColors);
    setButtonColors(palette.buttonColors);
    setBgGradientStart(palette.bgGradientStart);
    setBgGradientEnd(palette.bgGradientEnd);
    setActivePalette(index);
  };

  const customColors: { label: string; value: string; onChange: (color: string) => void }[] = [
    { label: 'Background Start', value: bgGradientStart, onChange: setBgGradientStart },
    { label: 'Background End', value: bgGradientEnd, onChange: setBgGradientEnd },
    { label: 'Accent', value: accentColor, onChange: setAccentColor },
    { label: 'Bright Accent', value: brightAccentColor, onChange: setBrightAccentColor },
    { label: 'Text', value: textColor, onChange: setTextColor },
  ];

  const handleCustomColorChange = (onChange: (color: string) => void, color: string) => {
    onChange(color);
    setActivePalette(null);
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    try {
      const res = await fetch('/api/save-theme', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          font: FONTS[activeFont].key,
          accentColor,
          darkGradientColor,
          brightAccentColor,
          darkColors,
          midColors,
          brightColors,
          buttonColors,
          bgGradientStart,
          bgGradientEnd,
          textColor,
        }),
      });
      if (!res.ok) throw new Error('Save failed');
      setSaveStatus('saved');
    } catch {
      setSaveStatus('error');
    } finally {
      setTimeout(() => setSaveStatus('idle'), 2500);
    }
  };

  // Dev-only: stripped entirely from production builds.
  if (process.env.NODE_ENV === 'production') return null;

  return (
    <div style={{ position: 'fixed', bottom: 16, right: 16, zIndex: 9999, fontFamily: 'system-ui, sans-serif' }}>
      {isOpen && (
        <div
          style={{
            marginBottom: 8,
            width: 260,
            maxHeight: '80vh',
            overflowY: 'auto',
            background: 'rgba(20, 20, 20, 0.92)',
            color: '#fff',
            borderRadius: 12,
            padding: 16,
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.35)',
            fontSize: 13,
          }}
        >
          <p style={{ margin: '0 0 8px', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.7, fontSize: 11 }}>
            Font
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {FONTS.map((font, i) => (
              <button
                key={font.name}
                onClick={() => applyFont(i)}
                style={{
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: activeFont === i ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
                  background: activeFont === i ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                {font.name}
              </button>
            ))}
          </div>

          <p style={{ margin: '0 0 8px', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.7, fontSize: 11 }}>
            Color Theme
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {PALETTES.map((palette, i) => (
              <button
                key={palette.name}
                onClick={() => applyPalette(i)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 10px',
                  borderRadius: 8,
                  border: activePalette === i ? '1px solid #fff' : '1px solid rgba(255, 255, 255, 0.2)',
                  background: activePalette === i ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    width: 14,
                    height: 14,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${palette.accentColor} 50%, ${palette.brightAccentColor} 50%)`,
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  }}
                />
                {palette.name}
              </button>
            ))}
          </div>

          <p style={{ margin: '0 0 8px', fontWeight: 600, letterSpacing: 0.5, textTransform: 'uppercase', opacity: 0.7, fontSize: 11 }}>
            Custom Colors
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {customColors.map(({ label, value, onChange }) => (
              <label
                key={label}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, cursor: 'pointer' }}
              >
                <span style={{ fontSize: 12 }}>{label}</span>
                <input
                  type="color"
                  value={value}
                  onChange={(e) => handleCustomColorChange(onChange, e.target.value)}
                  style={{ width: 36, height: 24, border: 'none', borderRadius: 4, padding: 0, cursor: 'pointer', background: 'none' }}
                />
              </label>
            ))}
          </div>

          <button
            onClick={handleSave}
            disabled={saveStatus === 'saving'}
            style={{
              marginTop: 14,
              width: '100%',
              padding: '8px 12px',
              borderRadius: 8,
              border: '1px solid rgba(255, 255, 255, 0.2)',
              background:
                saveStatus === 'saved'
                  ? 'rgba(34, 197, 94, 0.25)'
                  : saveStatus === 'error'
                  ? 'rgba(239, 68, 68, 0.25)'
                  : 'rgba(255, 255, 255, 0.1)',
              color: '#fff',
              cursor: saveStatus === 'saving' ? 'default' : 'pointer',
              fontSize: 12,
              fontWeight: 600,
            }}
          >
            {saveStatus === 'saving'
              ? 'Saving...'
              : saveStatus === 'saved'
              ? 'Saved as default ✓'
              : saveStatus === 'error'
              ? 'Save failed'
              : 'Save as Default Theme'}
          </button>

          <p style={{ margin: '12px 0 0', fontSize: 11, opacity: 0.5, lineHeight: 1.4 }}>
            Dev preview only. Reload to restore image-based colors. &quot;Save as Default Theme&quot; writes app/config/theme.json — commit it to ship these as the new defaults.
          </p>
        </div>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle theme debug panel"
        style={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          border: 'none',
          background: 'rgba(20, 20, 20, 0.85)',
          color: '#fff',
          fontSize: 20,
          cursor: 'pointer',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        🎨
      </button>
    </div>
  );
}
