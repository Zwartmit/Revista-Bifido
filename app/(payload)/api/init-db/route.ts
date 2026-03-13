import { getPayload } from 'payload';
import configPromise from '../../../../payload/payload.config';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const payload = await getPayload({
      config: configPromise,
    });
    
    // Payload en su inicio asegura que el schema de la DB se crea.
    // También llamamos cualquier sync disponible para estar seguros.
    if (typeof payload.db.init === 'function') {
      await payload.db.init();
    }

    return NextResponse.json({ 
        success: true, 
        message: '¡Base de datos en Neon sincronizada con éxito! Todas las tablas fueron creadas.' 
    });
  } catch (error) {
    console.error('Error sincronizando DB:', error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
