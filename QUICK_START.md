# 🚀 Guía de Inicio Rápido - Revista Bífido

## Primeros Pasos

### 1. Verificar Instalación

El proyecto ya está instalado y listo para usar. Verifica que todo esté correcto:

```bash
cd bifido-web
npm run dev
```

Abre tu navegador en `http://localhost:3000` y deberías ver la página de inicio con la escena 3D interactiva.

### 2. Estructura del Proyecto

```
bifido-web/
├── app/                    # Páginas (Next.js App Router)
│   ├── page.tsx           # 🏠 Página de inicio
│   ├── [section]/         # 📰 Páginas de secciones
│   ├── lamanada/            # 🎭 Página de personaje
│   ├── manifiesto/        # 📜 Página de manifiesto
│   └── contáctanos/             # 📧 Página de contacto
├── components/            # Componentes reutilizables
├── lib/                   # Utilidades y datos
├── types/                 # Tipos TypeScript
├── public/images/         # Imágenes (incluye personajes)
└── docs/                  # Documentación
```

### 3. Páginas Disponibles

Navega a estas URLs en tu navegador:

- **Inicio**: `http://localhost:3000/`
- **Ecorebeldia**: `http://localhost:3000/ecorebeldia`
- **Opinión**: `http://localhost:3000/opinion`
- **Cultura**: `http://localhost:3000/cultura`
- **Reducción de Riesgos**: `http://localhost:3000/reduccion-de-riesgos`
- **Diversidad**: `http://localhost:3000/diversidad`
- **La manada**: `http://localhost:3000/lamanada`
- **Manifiesto**: `http://localhost:3000/manifiesto`
- **Contáctanos**: `http://localhost:3000/contáctanos`

### 4. Características Principales

#### 🎨 Escena 3D Interactiva
- Pasa el mouse sobre los personajes en la página de inicio
- Haz clic en un personaje para ir a su sección
- La escena usa React Three Fiber y GSAP

#### 🎭 Los 5 personajes
Cada personaje representa una sección:
1. **Punkibrí** (Verde) - Ecorebeldia
2. **Mordáz** (Rojo) - Opinión
3. **Malandra** (Púrpura) - Cultura
4. **Anika** (Turquesa) - Reducción de Riesgos
5. **Incendia** (Naranja) - Diversidad

#### 📱 Diseño Responsivo
- Prueba redimensionar la ventana
- Funciona en móviles, tablets y escritorio

## Próximos Pasos

### Opción A: Usar con Datos de Ejemplo (Actual)

El proyecto actualmente usa datos de ejemplo hardcodeados. Puedes:

1. **Modificar contenido de ejemplo**:
   - Edita `app/page.tsx` para cambiar artículos destacados
   - Edita `lib/mascots.ts` para modificar información de personajes

2. **Añadir más artículos de ejemplo**:
   - Crea nuevos objetos en los arrays de artículos
   - Sigue la estructura del tipo `Article` en `types/index.ts`

### Opción B: Integrar con CMS (Recomendado para Producción)

Para usar contenido dinámico desde un CMS:

1. **Lee la documentación**:
   ```bash
   # Ver guía de integración CMS
   cat docs/CMS_INTEGRATION.md
   ```

2. **Instalar Strapi (opción recomendada)**:
   ```bash
   # En otra terminal, en la carpeta padre
   npx create-strapi-app@latest bifido-cms --quickstart
   ```

3. **Configurar variables de entorno**:
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. **Actualizar páginas para usar API**:
   - Las funciones de API ya están en `lib/api.ts`
   - Solo necesitas reemplazar los datos de ejemplo con llamadas a la API

## Personalización

### Cambiar Colores

Edita `tailwind.config.ts`:

```typescript
colors: {
  punkibri: {
    primary: '#TU_COLOR',  // Cambia aquí
    // ...
  },
  // ...
}
```

### Modificar Animaciones

Las animaciones GSAP están en cada página. Ejemplo en `app/page.tsx`:

```typescript
gsap.fromTo(
  titleRef.current,
  { opacity: 0, y: 50 },
  { opacity: 1, y: 0, duration: 1 }
);
```

### Añadir Nueva Sección

1. Añade el personaje en `lib/mascots.ts`
2. Crea la ruta en `app/[section]/page.tsx` (ya existe, es dinámica)
3. Actualiza el Header si es necesario

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Iniciar servidor de desarrollo

# Producción
npm run build        # Construir para producción
npm start            # Iniciar servidor de producción

# Calidad de Código
npm run lint         # Verificar errores de linting

# Limpieza
rm -rf .next         # Limpiar caché de Next.js
npm install          # Reinstalar dependencias
```

## Solución de Problemas

### La escena 3D no carga
- Verifica que estés usando un navegador moderno
- Abre la consola del navegador (F12) para ver errores
- El componente 3D se carga de forma lazy, puede tardar unos segundos

### Errores de TypeScript
- Ejecuta `npm install` para asegurar que todas las dependencias estén instaladas
- Reinicia el servidor de desarrollo

### Imágenes no se muestran
- Verifica que las imágenes estén en `public/images/`
- Las rutas deben empezar con `/images/`

### Puerto 3000 ocupado
```bash
# Usa otro puerto
npm run dev -- -p 3001
```

## Recursos Adicionales

- **Documentación Completa**: Ver carpeta `docs/`
  - `CMS_INTEGRATION.md` - Integración con CMS
  - `DEPLOYMENT.md` - Guía de deployment
  - `FEATURES.md` - Lista de características

- **Next.js Docs**: https://nextjs.org/docs
- **TailwindCSS**: https://tailwindcss.com/docs
- **GSAP**: https://greensock.com/docs/
- **React Three Fiber**: https://docs.pmnd.rs/react-three-fiber

## Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa la documentación en la carpeta `docs/`
2. Verifica la consola del navegador para errores
3. Consulta los logs del servidor en la terminal

## Checklist de Desarrollo

- [ ] Servidor de desarrollo corriendo
- [ ] Todas las páginas cargan correctamente
- [ ] Escena 3D funciona
- [ ] Navegación entre secciones funciona
- [ ] Formulario de contacto muestra feedback
- [ ] Diseño responsivo en móvil
- [ ] Imágenes de personajes se muestran

## Siguiente Nivel

Una vez que te familiarices con el proyecto:

1. **Integra un CMS** (Strapi recomendado)
2. **Personaliza el diseño** según tu marca
3. **Añade analytics** (Google Analytics, Vercel Analytics)
4. **Configura SEO** (metadata, sitemap)
5. **Deploy a producción** (Vercel recomendado)

¡Disfruta construyendo la plataforma de Revista Bífido! 🎉
