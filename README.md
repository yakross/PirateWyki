# 🌌 GalaxWiki - Pirate Galaxy Ultimate Enciclopedia & Toolkit

[![GitHub license](https://img.shields.io/github/license/yakross/PirateWyki?style=for-the-badge&color=ffd700)](https://github.com/yakross/PirateWyki/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/yakross/PirateWyki?style=for-the-badge&color=00c3ff)](https://github.com/yakross/PirateWyki/stargazers)
[![Firebase Support](https://img.shields.io/badge/Firebase-Active-orange?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-Modern-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![HTML5 & ES6](https://img.shields.io/badge/HTML5_&_JS-Vanilla-e34f26?style=for-the-badge&logo=html5)](https://developer.mozilla.org/)

**GalaxWiki** (también conocida como *Pirate Galaxy Wiki*) es la enciclopedia interactiva y plataforma de comunidad definitiva para el aclamado juego espacial MMO **Pirate Galaxy**. Diseñada con una estética futurista "cyber-pirata" de primer nivel, ofrece una experiencia inmersiva que combina bases de datos exhaustivas con herramientas interactivas avanzadas de teoría y comunidad.

Con un rendimiento ultrarrápido, un diseño ultra-premium adaptativo (con soporte completo de temas y modo oscuro) y un backend en tiempo real, **GalaxWiki** es el recurso número uno para pilotos del espacio que buscan conquistar los sistemas estelares de la galaxia.

---

## 🚀 Características Principales

### 🌌 1. Enciclopedia y Base de Datos Completa
*   **Base de Datos de Naves (`pages/wiki/ships.html`):** Catálogo visual interactivo que detalla cada nave disponible en el juego (de tipo Tanque, Choque, Ingeniero, etc.), incluyendo sus estadísticas clave, requerimientos de planos y ubicaciones de obtención.
*   **Comparador Avanzado de Naves:** Herramienta para comparar especificaciones técnicas de dos naves simultáneamente de manera visual.
*   **Componentes de Combate y Soporte:** Catálogo completo de tecnologías (armas, escudos, motores, colectores, etc.) con sus niveles de plano y atributos específicos.
*   **Bestiario y Drops de Enemigos:** Listado de enemigos Mantis y sus respectivas probabilidades de drop y planos para optimizar tus rutas de farmeo.
*   **Sistemas Universales y Mapas:** Mapas interactivos detallados de todos los sistemas estelares principales (Vega, Antares, Gemini, Mizar, Sol, Draconis, Sirius, Tau Ceti) con información sobre recursos.

### 🛠️ 2. Herramientas de Teoría (Theorycrafting)
*   **Calculadora de Builds Interactiva (`pages/wiki/calculator.html`):** Configura y diseña tus naves agregando componentes específicos para calcular la potencia total, salud, poder de ataque e impacto de nivel de plano en tiempo real.
*   **Editor de Builds:** Crea, guarda y comparte tus configuraciones óptimas con la comunidad.

### 💬 3. Comunidad Interactiva en Tiempo Real (Firebase)
*   **Foro Completo de Discusión (`pages/forum.html`):** Crea hilos de discusión, responde a publicaciones, añade etiquetas de categorías y organiza debates sobre tácticas y actualizaciones.
*   **Chat Global Integrado:** Sala de chat en vivo y en tiempo real en la barra lateral para conversar con otros pilotos en línea.
*   **Sección de Noticias:** Tablón dinámico de noticias donde los administradores pueden publicar actualizaciones importantes y eventos con vistas previas enriquecidas en la página de inicio.

### 🏆 4. Sistema de Gamificación y Perfil de Piloto
*   **Nivelación y Experiencia (XP):** Gana experiencia e interactúa en el foro y chat para subir de nivel tu perfil.
*   **Marcos de Perfil Dinámicos:** Desbloquea y equipa marcos cosméticos exclusivos para tu avatar que se muestran en el chat y las publicaciones.
*   **Panel de Favoritos:** Guarda tus naves y componentes preferidos para un acceso rápido y personalizado.
*   **Configuración Avanzada:** Personaliza tu alias, foto de perfil, preferencias de idioma y ajustes de interfaz.

### 🌐 5. Multilingüe e Internacionalización (i18n)
*   Soporte completo integrado para cambio dinámico de idioma (Español / Inglés) que traduce toda la interfaz, menús, etiquetas y contenidos clave instantáneamente.

---

## 🛠️ Tecnologías y Arquitectura

El proyecto está diseñado siguiendo una arquitectura de aplicación web SPA moderna, limpia y modular, utilizando principalmente tecnologías del lado del cliente para garantizar tiempos de respuesta inmediatos y máxima escalabilidad.

| Tecnología | Categoría | Propósito / Uso |
| :--- | :--- | :--- |
| **HTML5 & CSS3** | Base | Estructura web semántica y diseño visual a medida. |
| **JavaScript (ES6+)** | Lógica | Programación de componentes interactivos, traducción i18n y reactividad. |
| **Tailwind CSS v4** | Estilizado | Diseño responsive, sistema de grids moderno y utilidades estéticas rápidas. |
| **Bootstrap 5** | Maquetación | Estructura modular complementaria y componentes interactivos como modales y selectores. |
| **Firebase App / Auth** | Seguridad | Registro de usuarios, inicio de sesión seguro, perfiles y recuperación de contraseñas. |
| **Firebase Firestore** | Base de Datos | Almacenamiento NoSQL en tiempo real para hilos de foro, chat global, noticias y estadísticas. |
| **FontAwesome 6** | Iconografía | Biblioteca rica de iconos vectoriales modernos y estilizados. |

---

## 📁 Estructura del Directorio

```bash
PirateWyki/
├── .firebase/                  # Logs y caché local de Firebase
├── assets/                     # Recursos estáticos (imágenes, logos de naves, planetas)
├── css/
│   └── styles.css              # Estilos visuales globales personalizados (cyber-dark theme)
├── data/                       # Archivos JSON locales con datos de la base de datos
├── js/
│   ├── components/             # Componentes web modulares (como footer-component.js)
│   ├── admin_news_image_patch.js # Parches y scripts del administrador
│   ├── calculator.js           # Lógica interactiva de la calculadora de naves
│   ├── comments.js             # Gestión de foros, hilos y comentarios en Firestore
│   ├── favorites.js            # Lógica para guardar favoritos localmente/remotamente
│   ├── firebase-config.js      # Inicialización y configuración centralizada de Firebase SDK
│   ├── gamification.js         # Lógica de niveles de XP, logros y marcos cosméticos
│   ├── global-chat.js          # Chat global en tiempo real a través de Firestore
│   ├── header-auth.js          # Manejo de estados de sesión, botones y modales de autenticación
│   ├── i18n.js                 # Motor de internacionalización y archivos de traducción
│   └── toast.js                # Sistema de notificaciones emergentes Toast minimalistas
├── pages/
│   ├── admin/                  # Paneles de control para moderadores
│   ├── wiki/                   # Subpáginas de la enciclopedia (ships, builds, enemies, systems)
│   ├── forum.html              # Vista principal del foro
│   ├── news.html               # Vista de noticias y anuncios
│   ├── settings.html           # Configuración del perfil de usuario y preferencias
│   └── search.html             # Motor de búsqueda global en la wiki
├── index.html                  # Página de aterrizaje y portal de inicio
├── login.html                  # Pantalla de inicio de sesión premium
├── register.html               # Pantalla de creación de cuenta premium
├── firestore.rules             # Reglas de seguridad y acceso robusto para Firestore
├── storage.rules               # Reglas de seguridad de almacenamiento Firebase
├── firebase.json               # Configuración del hosting y funciones Firebase
└── package.json                # Configuración de herramientas y scripts dev (Tailwind v4)
```

---

## 🚀 Instalación y Despliegue Local

### Requisitos Previos
*   [Node.js](https://nodejs.org/) (Versión 16 o superior recomendada)
*   Una cuenta activa de [Firebase](https://firebase.google.com/) (opcional si deseas configurar tu propio backend en vivo).

### Pasos para Ejecutar Localmente

1.  **Clona este repositorio:**
    ```bash
    git clone https://github.com/yakross/PirateWyki.git
    cd PirateWyki
    ```

2.  **Instala las dependencias de desarrollo:**
    ```bash
    npm install
    ```

3.  **Configura Firebase (Opcional):**
    *   Crea un nuevo proyecto en la consola de Firebase.
    *   Habilita **Authentication** (método de correo/contraseña) y **Cloud Firestore**.
    *   Copia la configuración web de tu aplicación Firebase y reemplázala en el archivo [js/firebase-config.js](file:///c:/Users/LeinerSuarez/Desktop/Proyectos/Portafolio/PirateWyki/js/firebase-config.js):
        ```javascript
        const firebaseConfig = {
          apiKey: "TU_API_KEY",
          authDomain: "TU_PROJECT_ID.firebaseapp.com",
          projectId: "TU_PROJECT_ID",
          storageBucket: "TU_PROJECT_ID.appspot.com",
          messagingSenderId: "TU_SENDER_ID",
          appId: "TU_APP_ID"
        };
        ```

4.  **Genera las directivas de estilos de Tailwind (si realizas modificaciones):**
    ```bash
    npm run build
    ```

5.  **Ejecuta un servidor web local:**
    Puedes usar extensiones como *Live Server* en VSCode o ejecutar una herramienta ligera de node:
    ```bash
    npx serve .
    ```
    Abre tu navegador en `http://localhost:3000` (o el puerto indicado) para explorar la plataforma.

---

## 🔒 Reglas de Seguridad de Base de Datos
El proyecto incluye un robusto archivo de reglas en `firestore.rules` que garantiza que:
*   Cualquier usuario puede leer datos públicos (noticias, wiki, comentarios).
*   Solo usuarios autenticados pueden publicar mensajes en el chat, crear hilos en el foro o modificar sus perfiles individuales.
*   Solo administradores autorizados tienen permisos de escritura sobre bases de datos maestras de naves, componentes y publicaciones oficiales de noticias.

---

## 🛡️ Licencia y Créditos
Este proyecto es desarrollado por la comunidad y está bajo la licencia **MIT**. Todo el contenido visual, nombres de naves, sistemas estelares e iconografía oficial del juego original pertenecen a **Splitscreen Games**.

---

*¡Buena caza en el espacio, piloto! 🚀 Nos vemos en las estrellas.*
