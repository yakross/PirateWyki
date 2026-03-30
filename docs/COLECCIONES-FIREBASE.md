# Colecciones de Firestore – GalaxWiki

En Firebase Console → Firestore → **+ Iniciar colección** o **+ Agregar documento** puedes crear estas colecciones. Cada colección equivale a una "tabla"; cada documento, a una fila.

**Documento detallado:** ver **`ESTRUCTURA-TABLAS-Y-BASE-DE-DATOS.md`** para todas las tablas, campos y qué agregar o cambiar.

---

## Resumen de colecciones

| Colección | Uso |
|-----------|-----|
| `users` | Usuarios: username, email, fleet, role, avatar, level, createdAt, updatedAt (se crea al registrarse) |
| `users/{uid}/favorites` | Favoritos del usuario (naves, planetas, sistemas, componentes, etc.) |
| `factions` | Facciones de naves (un documento por facción) |
| `ship_types` | Tipos de nave (Storm, Tank, etc.) |
| `ships` | Naves del juego |
| `components` | Componentes (armas, escudos) |
| `component_types` | Tipos de componente |
| `component_rarities` | Rarezas (común, raro, épico, etc.) |
| `enemies` | Enemigos/NPCs |
| `systems` | Sistemas estelares |
| `planets` | Planetas por sistema |
| `missions` | Misiones |
| `paints` | Pinturas/skins |
| `drones` | Drones |
| `cortex` | Módulos Cortex |
| `gravitons` | Gravitones |
| `servers` | Servidores (nombre, zona horaria) |
| `misc_info` | Misc Info (clave, contenido) |
| `conquest_schedules` | Conquista por servidor (planeta, horario) |
| `news` | Noticias |
| `forum_categories` | Categorías del foro |
| `forum_threads` | Hilos del foro |
| `forum_threads/{id}/posts` | Respuestas de cada hilo |

---

## Facciones: estructura correcta

**Un documento = una facción.** No pongas todas en un solo documento.

Cada documento en `factions` debe tener:
- `name` (string): valor que se guarda en la nave
- `label` (string): texto mostrado en el desplegable
- `order` (number): orden de aparición

Ejemplo: documento 1 → `name: "Antares Industries"`, `label: "Antares Industries"`, `order: 0`  
Documento 2 → `name: "Raven Dynamics"`, `label: "Raven Dynamics"`, `order: 1`

Si tienes un solo documento con todas las facciones en un string (separadas por coma), el panel ahora las dividirá en opciones separadas.
