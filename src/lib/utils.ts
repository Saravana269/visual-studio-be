
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(input: string | number): string {
  const date = new Date(input)
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function nanoid(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function generateRandomColor(): string {
  // Generate pastel colors that are visually distinct
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 75%)`;
}

export function isDark(color: string): boolean {
  // Simple function to determine if a color is dark
  // Used for determining text color (white on dark backgrounds, black on light)
  let r, g, b;
  
  // Check for hex colors
  if (color.startsWith('#')) {
    const hex = color.replace('#', '');
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  } 
  // Check for HSL colors
  else if (color.startsWith('hsl')) {
    // This is a rough approximation for HSL
    // Extract the lightness value
    const match = color.match(/hsl\(\s*\d+\s*,\s*\d+%\s*,\s*(\d+)%\s*\)/);
    if (match && match[1]) {
      const lightness = parseInt(match[1]);
      return lightness < 50;
    }
    return false;
  } 
  // Default to RGB or other formats
  else {
    // Default to considering it a light color
    return false;
  }
  
  // Calculate perceived brightness
  // Formula: (R * 299 + G * 587 + B * 114) / 1000
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  
  // Threshold for considering a color dark
  return brightness < 128;
}
