# 📘 Manual de Usuario: CMS Revista Bífido

Bienvenido al panel de administración de **Revista Bífido**. Este sistema te permite gestionar todo el contenido de tu sitio web de forma dinámica. Aquí te explico para qué sirve cada sección y cómo sacarle el máximo provecho.

---

## 📂 Colecciones (Tu Contenido)

### 1. 👥 Usuarios (Users)
Gestión de las personas que tienen acceso al panel.
- **Uso:** Crea cuentas para tus redactores o administradores.
- **Roles:**
    - `Administrador`: Acceso total.
    - `Editor`: Puede crear y editar contenido, pero no borrar usuarios.
    - `Autor`: Solo puede gestionar sus propios artículos.

### 2. 🎨 Secciones (Sections)
Estas son las categorías principales de la revista (ej. *Punkibrí*, *Incendia*).
- **⚠️ Importante:** La estructura de la web depende de esto. Cada sección define el **Color Primario** y la **Mascota** que se mostrará en el diseño.
- **Campos Clave:**
    - `Mascota`: Asocia uno de los personajes a esta sección.
    - `Color Primario`: Define el color de los botones, bordes y fondos de esa sección en la web.

### 3. 👾 Mascotas (Mascots)
Los personajes que dan vida a la marca.
- **Uso:** Configura a Anika, Incendia, Mordáz, etc.
- **Campos Clave:**
    - `Posición 3D`: Si en el futuro implementamos la escena 3D, aquí configurarás las coordenadas (X, Y, Z).
    - `Colores`: Define la paleta visual (Primario, Secundario, Oscuro) asociada al personaje.
    - `Biografía`: La historia que aparecerá en su página de perfil.

### 4. ✍️ Autores (Authors)
Perfiles públicos de quienes escriben los artículos.
- **Tip:** Crea primero el perfil del autor (con su foto y redes) **antes** de redactar su primer artículo.
- **Campos:** Foto de perfil, Bio corta, Redes Sociales (Twitter, Instagram).

### 5. 📰 Artículos (Articles)
El corazón de la revista.
- **Flujo de Publicación:**
    1.  Escribe el **Título**. El `Slug` (URL) se generará automáticamente.
    2.  Asigna una **Sección** y un **Autor**.
    3.  **Imagen Destacada:** Es la foto que saldrá en la portada.
    4.  **Estado:**
        - `Borrador`: Solo visible en el panel.
        - `Publicado`: Visible en la web para todos.
    5.  **Destacado (Featured):** Marca esta casilla si quieres que el artículo salga más grandes o en carruseles especiales.

### 6. 📅 Eventos (Events)
Gestión de la agenda cultural.
- **Funcionalidades:**
    - `Ubicación`: Puedes elegir entre Físico, Virtual o Híbrido.
    - `Fechas`: Fecha de inicio y fin. El sistema automáticamente clasificará el evento como "Próximo" o "Finalizado" en la web (según la fecha actual).
    - `Entradas`: Si pones un precio, aparecerá; si marcas "Es Gratis", saldrá así en la web.

### 7. 🛍️ Productos (Products)
Catálogo para merchandising o venta de arte.
- **Inventario:**
    - `Cantidad`: Si pones un número, el sistema podría (en el futuro) restar stock. Si lo dejas vacío, es "Ilimitado".
- **Vendedor:** Puedes especificar si el producto lo vende la Revista o un tercero.

### 8. 🖼️ Multimedia (Media)
Tu biblioteca de archivos.
- **Organización:** Aquí se guardan todas las imágenes subidas.
- **Tip:** Puedes subir imágenes directamente desde la edición de un Artículo (en el campo de "Imagen Destacada" -> "Crear Nuevo"), pero a veces es más ordenado subirlas primero aquí.

---

## 🚀 Flujo de Trabajo Recomendado (Paso a Paso)

Si vas a subir una nueva noticia, te recomiendo este orden:

1.  **Verifica al Autor:** Ve a la colección *Autores* y asegúrate de que el escritor tenga un perfil. Si no, créalo.
2.  **Prepara las Imágenes:** Ten listas tus fotos (optimizadas para web, preferiblemente `.jpg` o `.webp`).
3.  **Crea el Artículo:**
    - Ve a *Artículos* -> *Crear Nuevo*.
    - Rellena Título y Contenido.
    - Selecciona la **Sección** (esto le dará el color y personalidad a la página del artículo).
    - Sube la **Imagen Destacada**.
    - **SEO**: Rellena el "Meta Título" y "Descripción" para que Google lo lea bien.
    - Cambia el estado a **Published**.
4.  **¡Listo!** El artículo aparecerá automáticamente en la Home y en la página de su Sección.

---

## 📊 Diccionario de Datos (Detalle de Campos)

A continuación, el detalle técnico de qué datos se pueden crear, leer, editar y borrar en cada colección:

### 👤 Usuarios (Users)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Email** | Email | ✅ | Correo único para iniciar sesión. |
| **Rol** | Select | ✅ | `admin`, `editor` o `author`. |

### 📰 Artículos (Articles)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Título** | Texto | ✅ | Título principal del artículo. |
| **Slug** | Texto | ✅ | Identificador único para la URL (ej. `mi-articulo`). Se genera auto. |
| **Extracto** | Texto Largo | ✅ | Resumen corto para tarjetas y SEO. |
| **Contenido** | RichText | ✅ | El cuerpo del artículo (texto, negritas, imágenes incrustadas). |
| **Imagen Destacada** | Relación (Media) | ✅ | Portada del artículo. **Nota:** No se puede borrar si el artículo la usa. |
| **Autor** | Relación (Authors) | ✅ | Quién escribió el artículo. |
| **Sección** | Relación (Sections) | ✅ | Categoría temática (ej. Punkibrí). |
| **Destacado** | Checkbox | No | Si se marca, aparece en la sección principal del Home. |
| **Estado** | Select | ✅ | `Borrador` (Oculto), `Publicado` (Visible), `Archivado`. |
| **Fecha Publicación** | Fecha | No | Ordena los artículos. Importante para que salga primero. |
| **SEO** | Grupo | No | (Meta Título, Descripción, Keywords) para Google. |

### 🎨 Secciones (Sections)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | ✅ | Nombre visible (ej. "Ecorebeldía"). |
| **Slug** | Texto | ✅ | Parte de la URL (ej. `ecorebeldia`). |
| **Color Primario** | Color | No | Hex (ej. `#FF0000`). Define el estilo de la página. |
| **Mascota** | Relación (Mascots) | No | Personaje asociado a esta sección. |

### 👾 Mascotas (Mascots)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | ✅ | Nombre del personaje. |
| **Imagen** | Relación (Media) | No | Ilustración del personaje (transparente PNG recomendado). |
| **Biografía** | Texto Largo | No | Historia del personaje. |
| **Datos Curiosos** | Grupo | No | Religión, Edad, Color Favorito. |

### ✍️ Autores (Authors)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | ✅ | Nombre público. |
| **Foto** | Relación (Media) | No | Avatar del autor. |
| **Redes Sociales** | Grupo | No | Twitter, Instagram, Web. |

### 📅 Eventos (Events)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | ✅ | Título del evento. |
| **Fecha** | Fecha | ✅ | Cuándo ocurre. |
| **Ubicación** | Grupo | No | Tipo (Físico/Virtual), Dirección, Ciudad. |
| **Precio** | Grupo | No | ¿Es gratis? Monto y moneda. |
| **Organizador** | Texto | No | Quién lo organiza. |
| **Estado** | Select | ✅ | `Próximo`, `En Curso`, `Finalizado`, `Cancelado`. |

### 🛍️ Productos (Products)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Nombre** | Texto | ✅ | Título del producto. |
| **Precio** | Número | ✅ | Costo unitario. |
| **Stock** | Grupo | No | Cantidad disponible. |
| **Vendedor** | Grupo | No | Nombre y contacto. |
| **Enlace Compra** | Texto | No | Link externo a WhatsApp o pasarela de pago. |

### 🖼️ Multimedia (Media)
| Campo | Tipo | Requerido | Descripción |
| :--- | :--- | :--- | :--- |
| **Archivo** | File | ✅ | La imagen en sí (.jpg, .png, .webp). |
| **Texto Alternativo** | Texto | ✅ | Descripción para accesibilidad (ciegos) y SEO. |
| **Leyenda** | Texto | No | Texto que aparece debajo de la foto. |
| **Créditos** | Texto | No | Autor de la foto. |
