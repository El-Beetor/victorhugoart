import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const THEME_PATH = path.join(process.cwd(), 'app/config/theme.json');

const FONT_KEYS = ['geist', 'playfair', 'poppins', 'caveat'];

export async function POST(request: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const body = await request.json();

  const isHexColor = (value: unknown): value is string =>
    typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
  const isHexColorArray = (value: unknown): value is string[] =>
    Array.isArray(value) && value.every(isHexColor);

  if (
    !isHexColor(body.accentColor) ||
    !isHexColor(body.darkGradientColor) ||
    !isHexColor(body.brightAccentColor) ||
    !isHexColor(body.bgGradientStart) ||
    !isHexColor(body.bgGradientEnd) ||
    !isHexColor(body.textColor) ||
    !isHexColorArray(body.darkColors) ||
    !isHexColorArray(body.midColors) ||
    !isHexColorArray(body.brightColors) ||
    !isHexColorArray(body.buttonColors) ||
    !FONT_KEYS.includes(body.font)
  ) {
    return NextResponse.json({ error: 'Invalid theme payload' }, { status: 400 });
  }

  const theme = {
    font: body.font,
    accentColor: body.accentColor,
    darkGradientColor: body.darkGradientColor,
    brightAccentColor: body.brightAccentColor,
    darkColors: body.darkColors,
    midColors: body.midColors,
    brightColors: body.brightColors,
    buttonColors: body.buttonColors,
    bgGradientStart: body.bgGradientStart,
    bgGradientEnd: body.bgGradientEnd,
    textColor: body.textColor,
  };

  await fs.writeFile(THEME_PATH, JSON.stringify(theme, null, 2) + '\n', 'utf-8');

  return NextResponse.json({ success: true });
}
