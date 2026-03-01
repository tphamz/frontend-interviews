function rgbToHsl(r, g, b) {
  // 1. Normalize values to 0-1
  r /= 255; g /= 255; b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  
  let h = 0;
  let s = 0;
  let l = (max + min) / 2;

  // 2. Calculate Saturation and Hue only if not grayscale
  if (delta !== 0) {
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);

    switch (max) {
      case r: h = (g - b) / delta + (g < b ? 6 : 0); break;
      case g: h = (b - r) / delta + 2; break;
      case b: h = (r - g) / delta + 4; break;
    }
    
    h /= 6; // Convert to 0-1 range
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100)
  };
}


function hexToRgb(hex) {
  // 1. Remove the hash if it's there
  hex = hex.replace(/^#/, '');

  // 2. Handle 3-digit hex (e.g., "0CF" -> "00CCFF")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // 3. Convert to a number and use bitwise shifts to extract R, G, B
  const num = parseInt(hex, 16);

  return {
    r: (num >> 16) & 255, // Shift 16 bits right and mask
    g: (num >> 8) & 255,  // Shift 8 bits right and mask
    b: num & 255          // Just mask the last 8 bits
  };
}

// Example usage:
// hexToRgb("#FF5733") -> { r: 255, g: 87, b: 51 }

function hexToRgba(hex) {
  hex = hex.replace(/^#/, '');

  // Handle shorthand (3 or 4 digits)
  if (hex.length === 3 || hex.length === 4) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const num = parseInt(hex, 16);
  const hasAlpha = hex.length === 8;

  if (hasAlpha) {
    // 8-digit Hex: RRGGBBAA (32-bit)
    return {
      r: (num >>> 24) & 255,
      g: (num >>> 16) & 255,
      b: (num >>> 8) & 255,
      a: (num & 255) / 255 // Normalize alpha to 0-1
    };
  } else {
    // 6-digit Hex: RRGGBB (24-bit)
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
      a: 1 // Default to fully opaque
    };
  }
}


function convertToDarkMode(hslColor) {
  const [h, s, l] = hslColor;
  
  // Keep the Hue (h), Lower the Saturation (s), Flip the Lightness (l)
  const newS = Math.max(s - 20, 10); // Desaturate for comfort
  const newL = 100 - l; // Flip lightness (e.g., 90% white becomes 10% dark grey)
  
  return `hsl(${h}, ${newS}%, ${newL}%)`;
}

function getContrastFromHsl(h, s, l) {
  // If lightness is > 50%, use black. Otherwise, white.
  return l > 50 ? 'hsl(0, 0%, 0%)' : 'hsl(0, 0%, 100%)';
}