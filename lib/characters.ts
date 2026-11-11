import { Character } from '@/types';
import { CHARACTER_FACTS, formatAge } from '@/lib/character-facts';

/**
 * Datos estáticos de personajes.
 * Usados como fallback si el CMS no responde.
 * La fuente de verdad es Payload CMS (colección "characters").
 */
export const characters: Character[] = [
  {
    id: 'anika',
    name: 'Ánika',
    slug: 'anika',
    description: 'Defensora de la reducción de riesgos y daños. Ánika promueve el autocuidado, la información responsable y el respeto a las decisiones personales sin juicios morales.',
    religion: CHARACTER_FACTS.anika.religion,
    age: formatAge(CHARACTER_FACTS.anika),
    favoriteColor: CHARACTER_FACTS.anika.colors,
    image: '/personajes/Anika.webp',
  },
  {
    id: 'incendia',
    name: 'Incendia',
    slug: 'incendia',
    description: 'Activista de género, diversidad y equidad. Incendia arde con la pasión de la justicia social y lucha por un mundo donde todas las identidades sean respetadas.',
    religion: CHARACTER_FACTS.incendia.religion,
    age: formatAge(CHARACTER_FACTS.incendia),
    favoriteColor: CHARACTER_FACTS.incendia.colors,
    image: '/personajes/Incendia.webp',
  },
  {
    id: 'malandra',
    name: 'Malandra',
    slug: 'malandra',
    description: 'Cronista de la cultura underground y las expresiones artísticas marginales. Malandra celebra lo que la sociedad rechaza y encuentra belleza en lo prohibido.',
    religion: CHARACTER_FACTS.malandra.religion,
    age: formatAge(CHARACTER_FACTS.malandra),
    favoriteColor: CHARACTER_FACTS.malandra.colors,
    image: '/personajes/Malandra.webp',
  },
  {
    id: 'mordaz',
    name: 'Mordáz',
    slug: 'mordaz',
    description: 'Crítico implacable y portavoz de las verdades incómodas. Mordáz no se muerde la lengua y expone las contradicciones del sistema con humor ácido.',
    religion: CHARACTER_FACTS.mordaz.religion,
    age: formatAge(CHARACTER_FACTS.mordaz),
    favoriteColor: CHARACTER_FACTS.mordaz.colors,
    image: '/personajes/Mordaz.webp',
  },
  {
    id: 'punkibri',
    name: 'Punkibrí',
    slug: 'punkibri',
    description: 'Guardián de la naturaleza y activista ambiental. Punkibrí lucha por un mundo más verde y sostenible, denunciando la destrucción ecológica con su actitud rebelde.',
    religion: CHARACTER_FACTS.punkibri.religion,
    age: formatAge(CHARACTER_FACTS.punkibri),
    favoriteColor: CHARACTER_FACTS.punkibri.colors,
    image: '/personajes/Punkibri.webp',
  },
];

export const getCharacterBySlug = (slug: string): Character | undefined => {
  return characters.find(m => m.slug === slug);
};

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(m => m.id === id);
};
