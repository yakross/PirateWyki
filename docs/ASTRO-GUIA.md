# Guía de Astro

## ¿Astro cuesta dinero?

**No. Astro es 100% gratuito y open-source** (licencia MIT). No hay costes de licencia, suscripciones ni restricciones.

---

## ¿Qué es Astro?

Astro es un generador de sitios estáticos que te permite:
- Crear componentes reutilizables (Header, Nav, Footer)
- Escribir en HTML, CSS, JS, React, Vue o Svelte
- Generar HTML estático por defecto (mínimo JavaScript)
- Ideal para wikis y contenido que no requiere mucha interactividad

---

## Cómo usar Astro

### 1. Instalación (gratis)

```bash
# Crear nuevo proyecto
npm create astro@latest

# O añadir Astro a un proyecto existente
npm init astro
```

### 2. Estructura básica

```
src/
├── components/
│   ├── Header.astro
│   ├── Nav.astro
│   └── Footer.astro
├── layouts/
│   └── Layout.astro
└── pages/
    ├── index.astro
    └── wiki/
        └── ships.astro
```

### 3. Componente ejemplo (Header.astro)

```astro
---
// Lógica en la parte superior (opcional)
const title = "GalaxWiki";
---
<header class="header">
  <div class="logo">{title}</div>
  <!-- ... -->
</header>
```

### 4. Página que usa el layout

```astro
---
import Layout from '../layouts/Layout.astro';
---
<Layout title="Naves">
  <h1>Base de Naves</h1>
  <!-- contenido -->
</Layout>
```

### 5. Build y despliegue

```bash
npm run build    # Genera carpeta dist/ con HTML estático
npm run preview  # Vista previa local
```

Puedes desplegar `dist/` en Firebase Hosting, Netlify, Vercel, etc. **Sin coste extra.**

---

## Migrar GalaxWiki a Astro (opcional)

La migración sería un proyecto aparte. Mientras tanto, las mejoras aplicadas (JSON-LD, fuentes, skeletons, noticias, toasts) funcionan perfectamente sin Astro.
