# Próximos pasos – GalaxWiki (Pirate Galaxy)

Documento generado tras revisar el proyecto. Incluye lo ya hecho en esta sesión y sugerencias para continuar.

---

## Hecho en esta sesión

1. **Facciones de naves desde la base de datos**
   - El desplegable de facción en el formulario de naves (admin) se rellena desde la colección **`factions`**.
   - Si no hay documentos en `factions`, se usan los valores únicos de `faction` de las naves existentes.
   - Las facciones se gestionan en **Contenido (genérico)** → **Facciones (naves)** (nombre/id, etiqueta, orden).
   - Documentación: `ESTRUCTURA-BASE-DATOS.md` → colección `factions`.

2. **Blindajes con nivel requerido**
   - Cada blindaje en una nave tiene ahora: **tipo**, **coste** y **nivel requerido**.
   - En el panel admin: nueva columna "Nivel req." en cada fila de blindajes.
   - En la wiki (ships): se muestra por ejemplo `Grade Bulkwark 5000 cr, niv. 5`.
   - Esquema en Firestore: `armors: [{ type, cost, level }]`.

3. **Gestión de Enemigos y Sistemas en el admin**
   - CRUD completo para **Enemigos** y **Sistemas** en el panel admin (formularios, tablas, editar/eliminar).
   - Al abrir las secciones Enemigos o Sistemas se cargan los datos desde Firestore.

4. **Foro: mensaje “missing”**
   - Validación de nombre obligatorio y mensaje de error más claro.
   - Si el error es de permisos, se indica revisar las reglas de Firestore para `forum_categories`.

5. **Gestor genérico por esquema**
   - Sección **Contenido (genérico)** en el panel admin: una sola pantalla para gestionar varias colecciones (facciones, categorías foro, enemigos, sistemas, misiones, pinturas, drones, cortex, gravitones).
   - Añadir una nueva “tabla” es solo añadir un objeto al array `ADMIN_COLLECTIONS_SCHEMA` en `dashboard.html`.

---

## Estado actual del proyecto (resumen)

| Área | Estado | Notas |
|------|--------|--------|
| **Panel Admin** | Completo | Naves, Componentes, Enemigos, Sistemas, Misiones, Pinturas, Drones, Cortex, Gravitones, Noticias, Foro (categorías), Usuarios, Contenido (genérico). |
| **Wiki – Naves** | OK | Carga desde Firestore, filtros por nombre/tipo/facción, favoritos, blindajes con nivel. |
| **Wiki – Componentes** | OK | Tabs: Componentes, Pinturas, Drones, Cortex, Gravitones; filtros y favoritos. |
| **Wiki – Enemigos** | OK | Carga desde Firestore, filtros, favoritos. |
| **Wiki – Sistemas / Planetas** | OK | systems.html con pestañas Sistemas y Planetas; system-detail y planet-detail. |
| **Wiki – Misiones** | OK | missions.html carga desde Firestore. |
| **Foro** | Parcial | Categorías en admin; falta verificar que la página foro liste categorías desde Firestore. |
| **Noticias** | OK | Admin CRUD y página news. |
| **Favoritos** | OK | Incluye ship, component, enemy, paint, drone, cortex, graviton, planet, system. |
| **Auth / roles** | OK | Login, registro, admin por `users.role`. |

---

## Sugerencias para continuar (prioridad orientativa)

### 1. Filtros dinámicos en la página Naves (wiki)
- **Situación:** Los desplegables "Tipo" y "Facción" en `ships.html` están fijos (Storm, Tank, Antares Industries, etc.).
- **Propuesta:** Rellenar **Tipo** con valores únicos de `type` de las naves (o una colección `ship_types` si se quiere). Rellenar **Facción** desde la colección `factions` (igual que en el admin), para mantener coherencia.

### 2. Planetas en el panel admin
- **Situación:** Sistemas tienen CRUD; planetas no tienen sección propia en el admin. La wiki ya muestra planetas desde Firestore.
- **Propuesta:** Añadir **Planetas** al esquema del gestor genérico (`ADMIN_COLLECTIONS_SCHEMA`) con campos: name, systemId, order, levelMin, levelMax, resources (texto o lista), description, image, mapImage, etc., para poder crear/editar planetas sin tocar Firestore a mano.

### 3. Foro: listar categorías desde Firestore
- **Situación:** La página `forum.html` existe; hay que confirmar que las categorías y los hilos se leen de `forum_categories` y `forum_threads`.
- **Propuesta:** Revisar `forum.html` y `forum-thread-list.html` (y la página de un hilo) y asegurar que todo use Firestore; si hay datos mock, sustituirlos por lecturas reales.

### 4. Mapa interactivo de planetas
- **Situación:** En la documentación se menciona `mapImage` y `mapZones` para planetas (zonas clickeables).
- **Propuesta:** En `planet-detail.html`, si el planeta tiene `mapImage` y `mapZones`, dibujar el mapa y hacer que las zonas sean clicables (por ejemplo con áreas o divs posicionados con coordenadas en %).

### 5. Tipos de nave desde la base de datos
- **Situación:** El tipo de nave en el formulario de naves (admin) puede estar fijo (fighter, heavy, etc.).
- **Propuesta:** Si se quieren tipos editables, crear una colección `ship_types` y un desplegable dinámico (como con facciones), o rellenar el desplegable con los valores únicos de `type` de las naves existentes.

### 6. Inicializador de colecciones en el panel admin
- **Situación:** En la raíz existe `dashboard.html` con lógica de “Inicializar base de datos” (documentos de ejemplo). El panel admin en `pages/admin/dashboard.html` no tiene un botón equivalente.
- **Propuesta:** Añadir en el panel admin (por ejemplo en la sección Dashboard) un botón “Inicializar colecciones” que cree documentos de ejemplo en `systems`, `planets`, `factions`, etc., para quien acaba de configurar Firestore.

### 7. Favoritos: tipo “graviton”
- **Situación:** En `favorites.js` y en la wiki de componentes ya se usa el tipo `graviton`.
- **Propuesta:** Confirmar que la página de favoritos (`favorites.html`) incluye el tipo `graviton` en filtros y en `typeLinks` (por ejemplo hacia `components.html?tab=gravitones`).

### 8. Reglas de Firestore
- **Situación:** Si al crear una categoría del foro aparece “Missing” o “permissions”, suele ser por reglas.
- **Propuesta:** Tener documentadas (como en `ESTRUCTURA-BASE-DATOS.md`) reglas mínimas para `forum_categories`, `factions`, y el resto de colecciones que use el admin y la wiki.

### 9. Detalle de ítem (nave, componente, enemigo)
- **Situación:** Las páginas wiki muestran listados (tarjetas). No hay vistas de detalle tipo “ficha” para una nave, un componente o un enemigo.
- **Propuesta:** Añadir páginas como `ship-detail.html?id=xxx`, `component-detail.html?id=xxx`, `enemy-detail.html?id=xxx` que carguen un solo documento y muestren todos los campos (stats, blindajes, drops, etc.) para mejorar la consulta.

### 10. Búsqueda global
- **Situación:** Existe `search.html`; hay que ver si busca en todas las colecciones (naves, componentes, enemigos, etc.) o solo en algunas.
- **Propuesta:** Revisar la búsqueda y, si hace falta, ampliarla a naves, componentes, enemigos, sistemas, misiones, etc., con filtro por tipo de resultado.

---

## Archivos clave revisados

- `pages/admin/dashboard.html` – Panel admin (CRUD, esquema genérico, facciones, blindajes con nivel).
- `pages/wiki/ships.html` – Listado de naves, filtros, favoritos, texto de blindajes.
- `pages/wiki/components.html` – Tabs componentes/pinturas/drones/cortex/gravitones.
- `pages/wiki/enemies.html`, `systems.html`, `missions.html` – Listados desde Firestore.
- `pages/wiki/system-detail.html`, `planet-detail.html` – Detalle sistema/planeta.
- `pages/forum.html`, `forum-thread.html`, `forum-thread-list.html` – Foro.
- `js/favorites.js` – Tipos y lógica de favoritos.
- `docs/ESTRUCTURA-BASE-DATOS.md` – Esquemas y reglas.

---

Puedes usar este documento como lista de tareas y ir marcando lo que vayas cerrando. Si quieres, el siguiente paso concreto puede ser **filtros dinámicos en Naves** o **añadir Planetas al gestor genérico**.
