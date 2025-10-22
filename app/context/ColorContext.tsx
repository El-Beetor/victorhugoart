'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ColorContextType {
  buttonColors: string[];
  accentColor: string;
  darkGradientColor: string;
  brightAccentColor: string;
  darkColors: string[];
  midColors: string[];
  brightColors: string[];
  setButtonColors: (colors: string[]) => void;
  setAccentColor: (color: string) => void;
  setDarkGradientColor: (color: string) => void;
  setBrightAccentColor: (color: string) => void;
  setDarkColors: (colors: string[]) => void;
  setMidColors: (colors: string[]) => void;
  setBrightColors: (colors: string[]) => void;
}

const ColorContext = createContext<ColorContextType | undefined>(undefined);

export function ColorProvider({ children }: { children: ReactNode }) {
  const [buttonColors, setButtonColors] = useState<string[]>([]);
  const [accentColor, setAccentColor] = useState('#2e1705');
  const [darkGradientColor, setDarkGradientColor] = useState('#2E1705');
  const [brightAccentColor, setBrightAccentColor] = useState('#0B3826');
  const [darkColors, setDarkColors] = useState<string[]>([]);
  const [midColors, setMidColors] = useState<string[]>([]);
  const [brightColors, setBrightColors] = useState<string[]>([]);

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
        setButtonColors,
        setAccentColor,
        setDarkGradientColor,
        setBrightAccentColor,
        setDarkColors,
        setMidColors,
        setBrightColors,
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
