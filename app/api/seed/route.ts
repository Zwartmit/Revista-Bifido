import { getPayload } from 'payload';
import configPromise from '@/payload/payload.config';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

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

export async function GET() {
  try {
    const payload = await getPayload({ config: await configPromise });
    let results = [];

    for (const char of charactersData) {
      // 1. Verificar si ya existe
      const existing = await payload.find({
        collection: 'characters',
        where: { slug: { equals: char.slug } },
      });

      if (existing.totalDocs > 0) {
        results.push(`[Skip] ${char.name} ya existe.`);
        continue;
      }

      // 2. Subir imagen a Media
      const filePath = path.resolve(process.cwd(), 'public/icons', char.imageFile);
      let mediaId = '';

      if (fs.existsSync(filePath)) {
        // En un entorno web, necesitamos usar los métodos de payload.create para archivos locales
        // Es más fácil usar el absolute file path. Payload 3.0 lo soporta usando la propiedad "filePath".
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: `Avatar de ${char.name}`,
          },
          filePath: filePath, // <- Payload 3.0 magic
        });
        mediaId = media.id;
        results.push(`[Media] Imagen para ${char.name} cargada.`);
      } else {
        results.push(`[Warn] No se encontró el archivo en ${filePath}`);
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
          image: mediaId || undefined,
        },
      });

      results.push(`[Success] ${char.name} creado correctamente.`);
    }

    return NextResponse.json({ message: 'Seed completado', logs: results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fallo durante el seed', details: String(error) }, { status: 500 });
  }
}
