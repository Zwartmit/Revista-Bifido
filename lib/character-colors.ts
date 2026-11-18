/**
 * Paleta de colores por personaje (Manual de Identidad: «Color identitario»).
 * - Naranja fuego (Incendia) #FF5600, y Turquesa (Ánika) #1DA3A3 son
 *   colores de la paleta oficial del manual.
 * - Malandra #8321A5, Mordáz #E34545 y Punkibrí #3D903F son los códigos indicados por el equipo.
 * `text` es una versión aclarada del color para texto pequeño sobre fondo oscuro (legibilidad).
 */
export interface CharacterPalette { primary: string; secondary: string; dark: string; text: string; /** Color de texto legible (negro o blanco, contraste ≥ 4.5) sobre `primary` */ on: string }

/** Negro o blanco, el que dé mejor contraste (WCAG) sobre un fondo hexadecimal. */
export function readableOn(hex: string): '#000000' | '#ffffff' {
  const n = parseInt(hex.slice(1), 16);
  const lin = (c: number) => { const v = c / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const L = 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255);
  // Contraste con negro vs. con blanco: gana el mayor
  return (L + 0.05) / 0.05 >= 1.05 / (L + 0.05) ? '#000000' : '#ffffff';
}

function lighten(hex: string, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const mix = (c: number) => Math.round(c + (255 - c) * amount);
  const r = mix((n >> 16) & 255), g = mix((n >> 8) & 255), b = mix(n & 255);
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}
const palette = (primary: string, secondary: string, dark: string, amount = 0.38, text?: string): CharacterPalette => ({ primary, secondary, dark, text: text ?? lighten(primary, amount), on: readableOn(primary) });

export const CHARACTER_COLORS: Record<string, CharacterPalette> = {
  malandra: palette('#8321A5', '#84cc16', '#5F1878'), // Púrpura (código indicado por el equipo)
  incendia: palette('#FF5600', '#a855f7', '#C24100', 0.15), // Naranja fuego
  mordaz: palette('#E34545', '#eab308', '#A82E2E', 0.25), // Rojo sangre (código indicado por el equipo)
  punkibri: palette('#3D903F', '#eab308', '#2C6B2E', 0.35), // Verde (código indicado por el equipo)
  anika: palette('#1DA3A3', '#a855f7', '#147878', 0.2), // Turquesa
  criollos: palette('#FFD93B', '#FFD93B', '#C9A400', 0), // Amarillo pollito (Los Criollos: sección de adopción)
};

/** Helper para obtener los colores de un personaje por su slug */
export function getCharacterColors(slug: string): CharacterPalette {
  return CHARACTER_COLORS[slug] ?? palette('#b8ff00', '#a8d900', '#8ab800', 0);
}
