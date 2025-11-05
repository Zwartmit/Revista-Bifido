# Guía de Deployment

Esta guía explica cómo desplegar la plataforma de Revista Bífido en producción.

## Opción 1: Vercel (Recomendado)

Vercel es la plataforma creada por el equipo de Next.js y ofrece la mejor integración.

### Pasos:

1. **Crear cuenta en Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Regístrate con tu cuenta de GitHub/GitLab/Bitbucket

2. **Conectar repositorio**
   - Haz clic en "New Project"
   - Importa tu repositorio de GitHub
   - Vercel detectará automáticamente que es un proyecto Next.js

3. **Configurar variables de entorno**
   - En la sección "Environment Variables", añade:
     ```
     NEXT_PUBLIC_STRAPI_URL=https://tu-cms.com
     STRAPI_API_TOKEN=tu-token
     REVALIDATE_SECRET=tu-secret
     ```

4. **Deploy**
   - Haz clic en "Deploy"
   - Vercel construirá y desplegará automáticamente

5. **Dominio personalizado**
   - Ve a Settings > Domains
   - Añade tu dominio personalizado (ej: bifido.com)
   - Configura los DNS según las instrucciones

### Configuración adicional en Vercel:

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["iad1"]
}
```

## Opción 2: Netlify

### Pasos:

1. **Crear cuenta en Netlify**
   - Ve a [netlify.com](https://netlify.com)
   - Regístrate con tu cuenta de GitHub

2. **Conectar repositorio**
   - New site from Git
   - Selecciona tu repositorio

3. **Configurar build**
   - Build command: `npm run build`
   - Publish directory: `.next`

4. **Variables de entorno**
   - Site settings > Environment variables
   - Añade las mismas variables que en Vercel

5. **Deploy**
   - Netlify desplegará automáticamente

## Opción 3: VPS (DigitalOcean, AWS, etc.)

### Requisitos:
- Node.js 18+
- PM2 para gestión de procesos
- Nginx como reverse proxy

### Pasos:

1. **Preparar el servidor**
   ```bash
   # Instalar Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Instalar PM2
   sudo npm install -g pm2
   ```

2. **Clonar repositorio**
   ```bash
   git clone https://github.com/tu-usuario/bifido-web.git
   cd bifido-web
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   nano .env
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Iniciar con PM2**
   ```bash
   pm2 start npm --name "bifido-web" -- start
   pm2 save
   pm2 startup
   ```

6. **Configurar Nginx**
   ```nginx
   server {
       listen 80;
       server_name bifido.com www.bifido.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

7. **SSL con Let's Encrypt**
   ```bash
   sudo apt-get install certbot python3-certbot-nginx
   sudo certbot --nginx -d bifido.com -d www.bifido.com
   ```

## Deployment del CMS (Strapi)

### Opción 1: Railway

1. Ve a [railway.app](https://railway.app)
2. New Project > Deploy from GitHub
3. Selecciona tu repositorio de Strapi
4. Railway detectará automáticamente Strapi
5. Añade una base de datos PostgreSQL
6. Configura variables de entorno:
   ```
   DATABASE_CLIENT=postgres
   DATABASE_HOST=${{Postgres.PGHOST}}
   DATABASE_PORT=${{Postgres.PGPORT}}
   DATABASE_NAME=${{Postgres.PGDATABASE}}
   DATABASE_USERNAME=${{Postgres.PGUSER}}
   DATABASE_PASSWORD=${{Postgres.PGPASSWORD}}
   ```

### Opción 2: Heroku

1. Instalar Heroku CLI
2. Crear app:
   ```bash
   heroku create bifido-cms
   ```
3. Añadir PostgreSQL:
   ```bash
   heroku addons:create heroku-postgresql:mini
   ```
4. Deploy:
   ```bash
   git push heroku main
   ```

## CI/CD con GitHub Actions

Crear archivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          NEXT_PUBLIC_STRAPI_URL: ${{ secrets.STRAPI_URL }}
          STRAPI_API_TOKEN: ${{ secrets.STRAPI_TOKEN }}
          
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Checklist Pre-Deployment

- [ ] Variables de entorno configuradas
- [ ] CMS desplegado y accesible
- [ ] Imágenes optimizadas
- [ ] SEO metadata configurado
- [ ] Analytics configurado
- [ ] Formulario de contacto funcionando
- [ ] SSL/HTTPS habilitado
- [ ] Dominio personalizado configurado
- [ ] Backup del CMS configurado
- [ ] Monitoreo configurado (Sentry, LogRocket, etc.)

## Optimizaciones Post-Deployment

1. **CDN**: Configurar Cloudflare para caché adicional
2. **Image Optimization**: Usar Next.js Image Optimization
3. **Monitoring**: Configurar Vercel Analytics o Google Analytics
4. **Error Tracking**: Integrar Sentry
5. **Performance**: Monitorear con Lighthouse CI

## Mantenimiento

### Actualizaciones
```bash
# Actualizar dependencias
npm update

# Verificar vulnerabilidades
npm audit

# Actualizar Next.js
npm install next@latest react@latest react-dom@latest
```

### Backups
- Configurar backups automáticos del CMS
- Exportar contenido regularmente
- Mantener copias de las imágenes

### Monitoreo
- Configurar alertas de uptime
- Monitorear performance con Web Vitals
- Revisar logs regularmente
