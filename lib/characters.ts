import { Character } from '@/types';

/**
 * Datos estáticos de personajes.
 * Usados como fallback si el CMS no responde.
 * La fuente de verdad es Payload CMS (colección "characters").
 */
export const characters: Character[] = [
  {
    id: 'malandra',
    name: 'Malandra',
    slug: 'malandra',
    description: 'Cronista de la cultura underground y las expresiones artísticas marginales. Malandra celebra lo que la sociedad rechaza y encuentra belleza en lo prohibido.',
    religion: 'Culto a la creatividad',
    age: '33 años',
    favoriteColor: 'Púrpura oscuro',
    image: '/personajes/Malandra.png',
  },
  {
    id: 'incendia',
    name: 'Incendia',
    slug: 'incendia',
    description: 'Activista de género, diversidad y equidad. Incendia arde con la pasión de la justicia social y lucha por un mundo donde todas las identidades sean respetadas.',
    religion: 'Interseccionalidad',
    age: '31 años',
    favoriteColor: 'Naranja fuego',
    image: '/personajes/Incendia.png',
  },
  {
    id: 'mordaz',
    name: 'Mordáz',
    slug: 'mordaz',
    description: 'Crítico implacable y portavoz de las verdades incómodas. Mordáz no se muerde la lengua y expone las contradicciones del sistema con humor ácido.',
    religion: 'Escepticismo militante',
    age: '42 años',
    favoriteColor: 'Rojo sangre',
    image: '/personajes/Mordaz.png',
  },
  {
    id: 'punkibri',
    name: 'Punkibrí',
    slug: 'punkibri',
    description: 'Guardián de la naturaleza y activista ambiental. Punkibrí lucha por un mundo más verde y sostenible, denunciando la destrucción ecológica con su actitud rebelde.',
    religion: 'Animismo',
    age: '127 años (en años de colibrí)',
    favoriteColor: 'Verde musgo',
    image: '/personajes/Punkibri.png',
  },
  {
    id: 'anika',
    name: 'Ánika',
    slug: 'anika',
    description: 'Defensora de la reducción de riesgos y daños. Ánika promueve el autocuidado, la información responsable y el respeto a las decisiones personales sin juicios morales.',
    religion: 'Pragmatismo compasivo',
    age: '28 años',
    favoriteColor: 'Turquesa',
    image: '/personajes/Anika.png',
  },
];

export const getCharacterBySlug = (slug: string): Character | undefined => {
  return characters.find(m => m.slug === slug);
};

export const getCharacterById = (id: string): Character | undefined => {
  return characters.find(m => m.id === id);
};
