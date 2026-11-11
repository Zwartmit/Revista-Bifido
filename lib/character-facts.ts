/**
 * Datos de los personajes que deben verse IGUAL en todo el sitio:
 * la tarjeta «¡Hola, soy…!» de El Parche, las landings y el respaldo estático.
 *
 * Es la fuente de verdad de edad, religión y colores. Si el equipo cambia algo,
 * se edita aquí y se actualiza en todas partes (el CMS ya no manda sobre estos tres campos).
 */
export type CharacterSlug = 'anika' | 'incendia' | 'malandra' | 'mordaz' | 'punkibri';

export interface CharacterFacts {
  /** Edad del personaje, p. ej. «33 años» */
  age: string;
  /** Aclaración opcional de la edad, p. ej. «en años de colibrí» */
  ageNote?: string;
  /** «Religión» simbólica */
  religion: string;
  /** Colores del personaje (se muestra como «Color favorito» / «Color identidad») */
  colors: string;
}

export const CHARACTER_FACTS: Record<CharacterSlug, CharacterFacts> = {
  malandra: {
    age: '33 años',
    religion: 'Culto a la creatividad',
    colors: 'Morado / Oro viejo y Coral',
  },
  incendia: {
    age: '27 años',
    religion: 'El patriarcado lo tenemos que tumbar',
    colors: 'Morado y naranja',
  },
  mordaz: {
    age: '42 años',
    religion: 'Escepticismo militante',
    colors: 'Rojo, Oro y Durazno',
  },
  punkibri: {
    age: '127 años',
    ageNote: 'en años de colibrí',
    religion: 'Relación espiritual y política con la tierra',
    colors: 'Verde Páramo / Amarillo y Púrpura',
  },
  anika: {
    age: '30 años',
    religion: 'Los prejuicios no van conmigo',
    colors: 'Cian / Menta y Lavanda',
  },
};

export function getCharacterFacts(slug: string): CharacterFacts | undefined {
  return (CHARACTER_FACTS as Record<string, CharacterFacts>)[slug];
}

/** «127 años (en años de colibrí)» o «33 años» */
export function formatAge(facts: CharacterFacts): string {
  return facts.ageNote ? `${facts.age} (${facts.ageNote})` : facts.age;
}
