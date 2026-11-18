/**
 * Datos de los personajes que deben verse IGUAL en todo el sitio:
 * la tarjeta «¡Hola, soy…!» de El Parche, las landings y el respaldo estático.
 *
 * Fuente de verdad: Manual de Identidad de Bífido (sección «La Manada»).
 * Si el equipo cambia algo, se edita aquí y se actualiza en todas partes
 * (el CMS ya no manda sobre estos campos).
 */
export type CharacterSlug = 'anika' | 'incendia' | 'malandra' | 'mordaz' | 'punkibri';

export interface CharacterFacts {
  /** Eje temático de la revista (manual: «Eje») */
  eje: string;
  /** Animal (manual: «Animal») */
  animal: string;
  /** Edad del personaje, p. ej. «33 años» */
  age: string;
  /** Aclaración opcional de la edad, p. ej. «en años de colibrí» */
  ageNote?: string;
  /** Religión simbólica (manual: «Religión simbólica») */
  religion: string;
  /** Color identitario (manual: «Color identitario») */
  colors: string;
  /** Frase corta de carácter/voz, tomada del manual (opcional: reemplaza la descripción del CMS) */
  description?: string;
}

export const CHARACTER_FACTS: Record<CharacterSlug, CharacterFacts> = {
  malandra: {
    eje: 'Cultura',
    animal: 'Zarigüeya',
    age: '33 años',
    religion: 'Culto a la creatividad',
    colors: 'Púrpura oscuro',
  },
  incendia: {
    eje: 'Género y Diversidad',
    animal: 'Zorra',
    age: '31 años',
    religion: 'Interseccionalidad',
    colors: 'Naranja fuego',
  },
  mordaz: {
    eje: 'Opinión',
    animal: 'Cóndor',
    age: '42 años',
    religion: 'Escepticismo militante',
    colors: 'Rojo sangre',
  },
  punkibri: {
    eje: 'Medio Ambiente',
    animal: 'Colibrí',
    age: '127 años',
    ageNote: 'en años de colibrí',
    religion: 'Animismo',
    colors: 'Verde musgo',
    description: 'Rebelde, sensible y poético cuando quiere, feroz cuando toca. Habla desde el «nosotrxs» del territorio.',
  },
  anika: {
    eje: 'Reducción de Riesgos y Daños',
    animal: 'Serpiente',
    age: '28 años',
    religion: 'Pragmatismo compasivo',
    colors: 'Turquesa',
  },
};

export function getCharacterFacts(slug: string): CharacterFacts | undefined {
  return (CHARACTER_FACTS as Record<string, CharacterFacts>)[slug];
}

/** «127 años (en años de colibrí)» o «33 años» */
export function formatAge(facts: CharacterFacts): string {
  return facts.ageNote ? `${facts.age} (${facts.ageNote})` : facts.age;
}
