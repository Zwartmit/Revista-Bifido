import { getPayload } from 'payload';
import configPromise from '@payload-config';
import path from 'path';
import fs from 'fs';
import * as dotenv from 'dotenv';

// Cargar variables de entorno manualmente antes de que Payload lo intente
dotenv.config();

const charactersData = [
  {
    name: 'Ánika',
    slug: 'anika',
    description: 'Clara, tranquila y firme. Genera confianza y calma en temas de salud comunitaria.',
    religion: 'El cuidado como acto político',
    age: 'Ancestral',
    favoriteColor: 'Turquesa',
    imageFile: 'anika.png',
  },
  {
    name: 'Mordáz',
    slug: 'mordaz',
    description: 'Sarcástico, lúcido y provocador. Maestro de la ironía y el humor negro.',
    religion: 'La provocación como dialéctica',
    age: 'Desconocida',
    favoriteColor: 'Rojo',
    imageFile: 'mordaz.png',
  },
  {
    name: 'Malandra',
    slug: 'malandra',
    description: 'Observadora, cómplice e irónica. Habla desde la experiencia y el recorrido callejero.',
    religion: 'Memoria viva de la escena cultural',
    age: 'Callejera',
    favoriteColor: 'Púrpura',
    imageFile: 'malandra.png',
  },
  {
    name: 'Incendia',
    slug: 'incendia',
    description: 'Directa, combativa y afectiva. Convoca, denuncia y moviliza por la justicia social.',
    religion: 'Lucha activa por la equidad',
    age: 'Joven rebelde',
    favoriteColor: 'Naranja',
    imageFile: 'incendia.png',
  },
  {
    name: 'Punkibrí',
    slug: 'punkibri',
    description: 'Rebelde, sensible y poético. Defiende el territorio y la soberanía alimentaria.',
    religion: 'Relación espiritual y política con la tierra',
    age: 'Agitador de alas',
    favoriteColor: 'Verde',
    imageFile: 'punkibri.png',
  },
];

async function seed() {
  console.log('--- Iniciando Seed de Personajes ---');
  
  const config = await configPromise;
  const payload = await getPayload({ config });

  for (const char of charactersData) {
    console.log(`Procesando a ${char.name}...`);

    // 1. Verificar si ya existe
    const existing = await payload.find({
      collection: 'characters',
      where: { slug: { equals: char.slug } },
    });

    if (existing.totalDocs > 0) {
      console.log(`[Skip] ${char.name} ya existe.`);
      continue;
    }

    // 2. Subir imagen a Media
    const filePath = path.resolve(process.cwd(), 'public/icons', char.imageFile);
    let mediaId = '';

    if (fs.existsSync(filePath)) {
      const media = await payload.create({
        collection: 'media',
        data: {
          alt: `Avatar de ${char.name}`,
        },
        file: {
          data: fs.readFileSync(filePath),
          name: char.imageFile,
          mimetype: 'image/png',
          size: fs.statSync(filePath).size,
        },
      });
      mediaId = media.id;
      console.log(`[Media] Imagen para ${char.name} cargada.`);
    } else {
      console.warn(`[Warn] No se encontró el archivo en ${filePath}`);
    }

    // 3. Crear Personaje
    await payload.create({
      collection: 'characters',
      data: {
        name: char.name,
        slug: char.slug,
        description: char.description,
        religion: char.religion,
        age: char.age,
        favoriteColor: char.favoriteColor,
        image: mediaId,
      },
    });

    console.log(`[Success] ${char.name} creado correctamente.`);
  }

  console.log('--- Seed completado con éxito ---');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Error durante el seed:', err);
  process.exit(1);
});
