# Revista Bífido - Plataforma Web

**"Periodismo crudo para sensibilidades frágiles"**

Plataforma web inmersiva para la Revista Bífido, una revista digital, cultural, alternativa e independiente.

## 🚀 Características

- **Experiencia 3D Interactiva**: Escena 3D con los 5 personajes de Bífido usando React Three Fiber
- **Animaciones Fluidas**: Implementadas con GSAP para transiciones suaves
- **Diseño Responsivo**: Optimizado para todos los dispositivos
- **SEO Optimizado**: Renderizado del lado del servidor con Next.js
- **5 Secciones Temáticas**: Cada una con su propia identidad visual

## 🎨 Secciones

1. **Ecorebeldia** (Punkibrí) - Ambiente y activismo ecológico
2. **Lxs compas de Mordáz** (Mordáz) - Opinión y crítica social
3. **Mala Fama** (Malandra) - Cultura underground
4. **Muda de Piel** (Anika) - Reducción de riesgos y daños
5. **Fuegos Diversos** (Incendia) - Género, diversidad y equidad

## 🛠️ Stack Tecnológico

- **Framework**: Next.js 15 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: TailwindCSS
- **Animaciones**: GSAP
- **3D**: React Three Fiber + Drei
- **Iconos**: Lucide React

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 🌐 Estructura del Proyecto

```
bifido-web/
├── app/                    # Páginas de Next.js (App Router)
│   ├── [section]/         # Páginas dinámicas de secciones
│   ├── lamanada/            # Página de personajes
│   ├── manifiesto/        # Página de manifiesto
│   ├── contáctanos/             # Página de contacto
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   └── globals.css        # Estilos globales
├── components/            # Componentes reutilizables
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── ArticleCard.tsx
│   └── InteractiveScene.tsx
├── lib/                   # Utilidades y datos
│   ├── mascots.ts
│   └── utils.ts
├── types/                 # Definiciones de TypeScript
│   └── index.ts
└── public/               # Archivos estáticos
    └── images/           # Imágenes de personajes
```

## 🔗 Integración con CMS

La plataforma está preparada para integrarse con un CMS Headless (Strapi, Sanity, Contentful, etc.). 

Los datos de ejemplo en el código deben ser reemplazados por llamadas a la API del CMS.

### Endpoints necesarios:

- `GET /api/articles` - Obtener todos los artículos
- `GET /api/articles/:slug` - Obtener un artículo específico
- `GET /api/articles/section/:section` - Obtener artículos por sección
- `GET /api/mascots` - Obtener información de personajes

## 🎯 Próximos Pasos

1. **Integrar CMS Headless**: Conectar con Strapi o similar
2. **Sistema de Búsqueda**: Implementar búsqueda de artículos
3. **Newsletter**: Sistema de suscripción
4. **Comentarios**: Sistema de comentarios en artículos
5. **Analytics**: Integrar Google Analytics o similar
6. **Optimización**: Mejorar performance y SEO

## 📝 Licencia

© 2024 Revista Bífido. Todos los derechos reservados.

## 🤝 Contribuir

Si quieres contribuir al proyecto, contáctanos a través del buzón en la plataforma.
