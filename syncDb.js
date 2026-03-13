import { getPayload } from 'payload';
import configPromise from './payload/payload.config.ts';

async function sync() {
  console.log('Iniciando sincronización de base de datos...');
  try {
    const payload = await getPayload({
      config: configPromise,
    });
    
    console.log('Payload inicializado. Ejecutando push...');
    
    // Forzar sincronización de tablas de PostgreSQL
    await payload.db.push();
    
    console.log('¡Éxito! Base de datos sincronizada correctamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error sincronizando la base de datos:', err);
    process.exit(1);
  }
}

sync();
