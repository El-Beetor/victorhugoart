'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import theme from '../config/theme.json';

interface ColorContextType {
  buttonColors: string[];
  accentColor: string;
  darkGradientColor: string;
  brightAccentColor: string;
  darkColors: string[];
  midColors: string[];
  brightColors: string[];
  bgGradientStart: string;
  bgGradientEnd: string;
  textColor: string;
  setButtonColors: (colors: string[]) => void;
  setAccentColor: (color: string) => void;
  setDarkGradientColor: (color: string) => void;
  setBrightAccentColor: (color: string) => void;
  setDarkColors: (colors: string[]) => void;
  setMidColors: (colors: string[]) => void;
  setBrightColors: (colors: string[]) => void;
  setBgGradientStart: (color: string) => void;
  setBgGradientEnd: (color: string) => void;
  setTextColor: (color: string) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [buttonColors, setButtonColors] = useState<string[]>(theme.buttonColors);
  const [accentColor, setAccentColor] = useState(theme.accentColor);
  const [darkGradientColor, setDarkGradientColor] = useState(theme.darkGradientColor);
  const [brightAccentColor, setBrightAccentColor] = useState(theme.brightAccentColor);
  const [darkColors, setDarkColors] = useState<string[]>(theme.darkColors);
  const [midColors, setMidColors] = useState<string[]>(theme.midColors);
  const [brightColors, setBrightColors] = useState<string[]>(theme.brightColors);
  const [bgGradientStart, setBgGradientStart] = useState(theme.bgGradientStart);
  const [bgGradientEnd, setBgGradientEnd] = useState(theme.bgGradientEnd);
  const [textColor, setTextColor] = useState(theme.textColor);

  return (
    <ColorContext.Provider
      value={{
        buttonColors,
        accentColor,
        darkGradientColor,
        brightAccentColor,
        darkColors,
        midColors,
        brightColors,
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
      }}
    >
      {children}
    </ColorContext.Provider>
  );
}

export function useColors() {
  const context = useContext(ColorContext);
  if (context === undefined) {
    throw new Error('useColors must be used within a ColorProvider');
  }
  return context;
}
