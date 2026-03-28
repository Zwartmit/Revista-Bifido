# Revista Bífido

Plataforma web de Revista Bífido construida con una estética visual disruptiva y de alto impacto editorial. La plataforma presenta un diseño dinámico e híbrido, combinando elementos visuales como la estética "glitch / broadcast" con estilos de "collage urbano".

El proyecto está construido sobre un stack moderno y robusto utilizando Next.js (App Router) y Payload CMS, garantizando tanto una experiencia de usuario impresionante en la interfaz del cliente (frontend) como un potente administrador para la gestión de contenido (backend).

## Tecnologías

- **Framework**: [Next.js](https://nextjs.org/) (App Router)
- **CMS**: [Payload CMS](https://payloadcms.com/) (Versión 3)
- **Base de Datos**: PostgreSQL
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones y 3D**: [GSAP](https://gsap.com/) y [Three.js](https://threejs.org/) (`@react-three/fiber`, `@react-three/drei`)
- **Iconos**: [Lucide React](https://lucide.dev/) y [React Icons](https://react-icons.github.io/react-icons/)
- **Lenguaje**: TypeScript

## Guía de Inicio

Sigue estas instrucciones para configurar el proyecto de forma local.

### Prerrequisitos

- Node.js (se recomienda la versión v18 o superior)
- Base de datos PostgreSQL (local o en la nube, ej. Neon)

### Instalación

1. Clona el repositorio y navega al directorio del proyecto (si no lo has hecho aún):

   ```bash
   cd Revista-Bifido
   ```
2. Instala las dependencias necesarias:

   ```bash
   npm install
   ```
3. Configura tus variables de entorno:

   Copia el archivo `.env.example` a un nuevo archivo `.env` y actualiza los valores con tu configuración local:

   ```bash
   cp .env.example .env
   ```

   **Variables de Entorno**:

   - `PAYLOAD_SECRET`: Una cadena de texto segura y aleatoria utilizada por Payload CMS para funciones criptográficas.
   - `DATABASE_URI`: Cadena de conexión (connection string) a tu base de datos PostgreSQL.
   - `NEXT_PUBLIC_SERVER_URL`: La URL pública de tu aplicación (por defecto: `http://localhost:3000`).

### Ejecutando el Proyecto

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador web para ver la aplicación.
Para acceder al panel de administración de Payload CMS y gestionar el contenido, ingresa a [http://localhost:3000/admin](http://localhost:3000/admin).

## Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo local de Next.js.
- `npm run build`: Compila la aplicación y optimiza los recursos para el despliegue en producción.
- `npm run start`: Inicia la aplicación que ya fue compilada en entorno de producción.
- `npm run lint`: Ejecuta el validador (ESLint) para asegurar la calidad del código.

## Estructura del Repositorio

- `/app`: Rutas del *App Router* de Next.js, vistas y layouts. Incluye tanto el sitio web accesible para los usuarios como la inyección del entorno de administración de Payload.
- `/components`: Componentes reutilizables de React para la interfaz gráfica.
- `/payload`: Configuración del CMS genérico, colecciones para bases de datos (Artículos, Eventos, Configuraciones, etc) e inicializador de Payload.
- `/public`: Archivos estáticos accesibles globalmente (tipografías, imágenes, íconos).
- `/lib`: Funciones de utilidad, helpers auxiliares y configuraciones globales para facilitar el desarrollo.
- `/types`: Definiciones de interfaces y tipos en TypeScript.

## Características Principales

- **CMS Headless Embebido**: Todo el poder visual de Next.js convive con el panel de administración centralizado de Payload CMS en el mismo repositorio.
- **Rutas Dinámicas**: Creación de páginas únicas al instante desde el CMS (como noticias, artículos editoriales y perfiles puntuales).
- **Interfaz Inmersiva**: Animaciones controladas con GSAP y renderizado en web 3D con Three.js / React Three Fiber.
- **Diseño Responsivo**: Experiencia de usuario (UX/UI) adaptada al enfoque *Mobile-First*, mejorada globalmente con las utilidades de Tailwind CSS.

## Licencia

Este proyecto es de uso privado y comercial de los autores correspondientes. Queda prohibida la copia, distribución u otro uso sin la autorización pertinente de sus propietarios.
