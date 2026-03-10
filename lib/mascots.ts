import { Mascot } from '@/types';

export const mascots: Mascot[] = [
  {
    id: 'punkibri',
    name: 'Punkibrí',
    section: 'Ecorebeldia',
    slug: 'punkibri',
    description: 'Guardián de la naturaleza y activista ambiental. Punkibrí lucha por un mundo más verde y sostenible, denunciando la destrucción ecológica con su actitud rebelde.',
    religion: 'Animismo',
    age: '127 años (en años de colibrí)',
    favoriteColor: 'Verde musgo',
    image: '/personajes/Punkibri.png',
    color: {
      primary: '#4CAF50',
      secondary: '#81C784',
      dark: '#388E3C',
    },
    position: [-4, 0, 0],
  },
  {
    id: 'mordaz',
    name: 'Mordáz',
    section: 'Lxs compas de Mordáz',
    slug: 'mordaz',
    description: 'Crítico implacable y portavoz de las verdades incómodas. Mordáz no se muerde la lengua y expone las contradicciones del sistema con humor ácido.',
    religion: 'Escepticismo militante',
    age: '42 años',
    favoriteColor: 'Rojo sangre',
    image: '/personajes/Mordaz.png',
    color: {
      primary: '#FF6B6B',
      secondary: '#FF8E8E',
      dark: '#D32F2F',
    },
    position: [-2, 0, 0],
  },
  {
    id: 'malandra',
    name: 'Malandra',
    section: 'Mala Fama',
    slug: 'malandra',
    description: 'Cronista de la cultura underground y las expresiones artísticas marginales. Malandra celebra lo que la sociedad rechaza y encuentra belleza en lo prohibido.',
    religion: 'Culto a la creatividad',
    age: '33 años',
    favoriteColor: 'Púrpura oscuro',
    image: '/personajes/Malandra.png',
    color: {
      primary: '#9C27B0',
      secondary: '#BA68C8',
      dark: '#7B1FA2',
    },
    position: [0, 0, 0],
  },
  {
    id: 'anika',
    name: 'Anika',
    section: 'Muda de Piel',
    slug: 'anika',
    description: 'Defensora de la reducción de riesgos y daños. Anika promueve el autocuidado, la información responsable y el respeto a las decisiones personales sin juicios morales.',
    religion: 'Pragmatismo compasivo',
    age: '28 años',
    favoriteColor: 'Turquesa',
    image: '/personajes/Anika.png',
    color: {
      primary: '#00BCD4',
      secondary: '#4DD0E1',
      dark: '#0097A7',
    },
    position: [2, 0, 0],
  },
  {
    id: 'incendia',
    name: 'Incendia',
    section: 'Fuegos Diversos',
    slug: 'incendia',
    description: 'Activista de género, diversidad y equidad. Incendia arde con la pasión de la justicia social y lucha por un mundo donde todas las identidades sean respetadas.',
    religion: 'Interseccionalidad',
    age: '31 años',
    favoriteColor: 'Naranja fuego',
    image: '/personajes/Incendia.png',
    color: {
      primary: '#FF9800',
      secondary: '#FFB74D',
      dark: '#F57C00',
    },
    position: [4, 0, 0],
  },
];

export const getMascotBySlug = (slug: string): Mascot | undefined => {
  return mascots.find(m => m.slug === slug);
};

export const getMascotById = (id: string): Mascot | undefined => {
  return mascots.find(m => m.id === id);
};
