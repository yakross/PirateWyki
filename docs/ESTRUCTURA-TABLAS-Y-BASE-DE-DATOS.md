# Tablas y organización de la base de datos – GalaxWiki

Este documento define **cómo deben estar todas las colecciones** (equivalentes a tablas) en Firestore, **cómo están organizadas** y **qué agregar o cambiar** ahora.

---

## 1. Organización general

En Firestore no hay “tablas” físicas: existen **colecciones** (nombre de la tabla) y **documentos** (filas). Cada documento tiene **campos** (columnas). Las colecciones se agrupan por dominio así:

| Dominio | Colecciones | Uso |
|--------|-------------|-----|
| **Usuarios y cuenta** | `users`, `users/{uid}/favorites` | Perfil, configuración, favoritos |
| **Wiki – Naves** | `ships`, `factions`, `ship_types` | Naves, facciones, tipos de nave |
| **Wiki – Componentes** | `components`, `component_types`, `component_rarities`, `paints`, `drones`, `cortex`, `gravitons` | Armas, escudos, pinturas, drones, cortex, gravitones |
| **Wiki – Mundo** | `systems`, `planets`, `enemies`, `missions` | Sistemas, planetas, enemigos, misiones |
| **Wiki – Genérico** | `servers`, `misc_info`, `conquest_schedules` | Servidores, misc, conquista |
| **Foro** | `forum_categories`, `forum_threads`, `forum_threads/{id}/posts` | Categorías, hilos, respuestas |
| **Contenido editorial** | `news` | Noticias de la wiki |

Opcional (si lo usas): `events` para eventos/noticias con fechas.

---

## 2. Estructura de cada “tabla”

### 2.1 Usuarios y cuenta

#### Colección: `users`  
**ID del documento:** `user.uid` (Firebase Auth UID).

| Campo | Tipo | Obligatorio | Descripción |
|-------|------|-------------|-------------|
| username | string | Sí (al registrar) | Nombre mostrado en la wiki |
| email | string | Sí | Correo (sincronizado con Firebase Auth) |
| fleet | string | No | Nombre de la flota |
| role | string | Sí | `"user"` o `"admin"` |
| avatar | string | No | URL de la imagen de perfil |
| level | number | No | Nivel del jugador en el juego (1–999) |
| createdAt | timestamp | Sí | Fecha de registro (servidor) |
| updatedAt | timestamp | No | Última actualización (cuenta/config) |

**Qué agregar o cambiar ahora:**  
- Asegurarse de que al guardar desde Configuración se escriban `username`, `fleet`, `level`, `avatar` y `updatedAt`.  
- En reglas, el usuario solo debe poder escribir en **su propio** documento (ya está así).  
- Opcional: restringir que solo el propio usuario pueda actualizar `username`, `fleet`, `level`, `avatar`; los admins pueden actualizar `role` y `email`.

---

#### Subcolección: `users/{uid}/favorites`  
**ID del documento:** `{type}_{entityId}` (ej. `ship_abc123`, `planet_xyz`).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| type | string | `ship`, `component`, `enemy`, `paint`, `planet`, `system`, `drone`, `cortex`, `graviton` |
| entityId | string | ID del documento en la colección correspondiente |
| name | string | Nombre para mostrar (evita cargar el doc) |
| addedAt | timestamp | Fecha en que se añadió |

No hace falta cambiar nada; ya está bien definida y usada.

---

### 2.2 Wiki – Naves

#### Colección: `ships`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la nave |
| type | string | Tipo (ej. fighter, heavy; o valor de ship_types) |
| faction | string | Valor de `factions.name` |
| stats | map | armor, speed, energy, damage (números) |
| requirements | map | level, credits (números) |
| rareBonus | map | Opcional: type ("health"\|"damage"\|"speed"), value (número %) |
| droneSlotCosts | array | 6 números: [0, coste2, …, coste6] |
| cortexSlotCosts | array | 2 números: [0, coste2] |
| armors | array | [{ type, cost, level }, …] |
| componentSlotsMax | number | Máximo de ranuras de componentes |
| image | string | URL de la imagen |
| description | string | Descripción para la wiki |
| location | string | Dónde conseguirla |
| createdAt, updatedAt | timestamp | Auditoría |
| createdBy | string | UID del admin |

#### Colección: `factions`  
Un documento por facción.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor que se guarda en `ship.faction` |
| label | string | Texto en el desplegable |
| order | number | Orden de aparición |

#### Colección: `ship_types`  
Un documento por tipo (Storm, Tank, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor que se guarda en la nave |
| label | string | Texto mostrado |
| order | number | Orden |

---

### 2.3 Wiki – Componentes y relacionados

#### Colección: `components`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del componente |
| type | string | Tipo (de component_types) |
| rarity | string | common, uncommon, rare, epic, legendary (de component_rarities) |
| level | number | Nivel recomendado |
| dropLocation | string | Dónde dropea |
| dropRate | number | % (0–100) |
| description | string | Descripción |
| image | string | URL (opcional) |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `component_types`  
Un documento por tipo (arma, escudo, etc.).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Identificador |
| label | string | Texto mostrado |
| order | number | Orden |

#### Colección: `component_rarities`  
Un documento por rareza.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Identificador |
| label | string | Texto mostrado |
| order | number | Orden |

#### Colección: `paints`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la pintura |
| rarity | string | common, uncommon, rare, epic, legendary |
| description | string | Opcional |
| image | string | URL |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `drones`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (ej. "Armor drone +5%") |
| type | string | armor \| firepower |
| bonusPercent | number | 1–10 |
| description | string | Opcional |
| image | string | Opcional |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `cortex`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (ej. "Ifrit Cortex") |
| effect | string | Descripción del efecto |
| description | string | Opcional |
| image | string | Opcional |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `gravitons`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del gravitón |
| effect | string | Efecto o valor |
| description | string | Opcional |
| image | string | Opcional |
| order | number | Orden (1–5) |
| createdAt, updatedAt, createdBy | — | Auditoría |

---

### 2.4 Wiki – Mundo (sistemas, planetas, enemigos, misiones)

#### Colección: `systems`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del sistema (Sol, Vega, etc.) |
| order | number | Orden en la lista |
| levelMin, levelMax | number | Nivel del sistema |
| description | string | Descripción |
| mapImage | string | URL del mapa |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `planets`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del planeta |
| systemId | string | ID del doc en `systems` (o nombre del sistema) |
| order | number | Orden dentro del sistema |
| levelMin, levelMax | number | Niveles |
| resources | array | Recursos (ej. crionita) |
| description | string | Descripción |
| image | string | URL (también se usa planetImage en código) |
| mapImage | string | URL del mapa interactivo |
| mapZones | array | Opcional: [{ name, label, x, y, width, height }] (%)
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `enemies`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del enemigo |
| type | string | boss, normal, etc. |
| system | string | Sistema donde aparece |
| planet | string | Planeta/zona (opcional) |
| level | number | Nivel del enemigo |
| stats | map | armor, damage, etc. (opcional) |
| drops | array | IDs o nombres de componentes que suelta |
| description | string | Descripción |
| image | string | URL |
| createdAt, updatedAt, createdBy | — | Auditoría |

#### Colección: `missions`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la misión |
| description | string | Guía o descripción |
| system, planet | string | Opcional |
| levelMin | number | Nivel mínimo |
| rewards | array o string | Recompensas |
| image | string | Opcional |
| order | number | Orden |
| createdAt, updatedAt, createdBy | — | Auditoría |

---

### 2.5 Wiki – Genérico

#### Colección: `servers`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del servidor (Europa, USA, etc.) |
| timezone | string | IANA (Europe/Madrid, America/New_York) |
| order | number | Orden |

#### Colección: `misc_info`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| key | string | Título o clave |
| content | string | Contenido (texto o HTML) |
| order | number | Orden |

#### Colección: `conquest_schedules`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| serverId | string | Coincide con `servers.name` |
| planetName | string | Planeta con conquista |
| schedule | string | Horario (ej. Sábado 20:00) |
| order | number | Opcional |

---

### 2.6 Foro

#### Colección: `forum_categories`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (General, Estrategias, etc.) |
| description | string | Descripción breve |
| order | number | Orden |
| icon | string | Opcional (fa-comments o URL) |
| createdAt, createdBy | — | Opcional |

#### Colección: `forum_threads`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| categoryId | string | ID en forum_categories |
| title | string | Título del hilo |
| authorId | string | UID del autor |
| authorName | string | Nombre a mostrar |
| createdAt | timestamp | Creación |
| updatedAt | timestamp | Último mensaje (para ordenar) |
| postCount | number | Número de respuestas |

#### Subcolección: `forum_threads/{threadId}/posts`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| authorId | string | UID |
| authorName | string | Nombre a mostrar |
| content | string | Texto del mensaje |
| createdAt | timestamp | Fecha del mensaje |

---

### 2.7 Contenido editorial

#### Colección: `news`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título |
| content | string | Contenido (HTML o texto) |
| excerpt | string | Opcional, para listados |
| image | string | URL (opcional) |
| authorId | string | UID del autor |
| authorName | string | Nombre a mostrar |
| createdAt, updatedAt | timestamp | Fechas |
| published | boolean | Opcional; false = borrador |

---

### 2.8 Opcional: eventos

#### Colección: `events`  
Solo si quieres eventos/noticias con fechas de inicio/fin.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título |
| type | string | event, news, update |
| description | string | Resumen |
| content | string | Opcional |
| startDate, endDate | timestamp | Opcional |
| image, link | string | Opcional |
| createdAt, updatedAt, createdBy | — | Auditoría |

Si no la usas, no hace falta crearla.

---

## 3. Resumen: todas las “tablas” en un solo listado

| Colección | ID documento | Ordenación típica |
|-----------|--------------|-------------------|
| users | uid (Auth) | — |
| users/{uid}/favorites | type_entityId | addedAt desc |
| ships | auto | name / order |
| factions | auto o custom | order |
| ship_types | auto o custom | order |
| components | auto | createdAt desc / order |
| component_types | auto o custom | order |
| component_rarities | auto o custom | order |
| paints | auto | name |
| drones | auto | name / type |
| cortex | auto | name |
| gravitons | auto | order |
| systems | auto | order |
| planets | auto | order (por systemId) |
| enemies | auto | name / system |
| missions | auto | order |
| servers | auto | order |
| misc_info | auto | order |
| conquest_schedules | auto | serverId, order |
| forum_categories | auto o custom | order |
| forum_threads | auto | updatedAt desc |
| forum_threads/{id}/posts | auto | createdAt asc |
| news | auto | createdAt desc |
| events | auto | startDate (si existe) |

---

## 4. Qué agregar o cambiar ahora

### 4.1 En la base de datos (Firestore)

1. **Usuarios**  
   - Asegurar que los documentos en `users` puedan tener (y tu código los guarde): `username`, `email`, `fleet`, `role`, `avatar`, **`level`**, **`updatedAt`**, `createdAt`.  
   - No hace falta “crear” la colección; se crea al registrar el primer usuario. Los campos nuevos se añaden al guardar desde Configuración.

2. **Resto de colecciones**  
   - No hace falta crear tablas vacías. Cada colección aparece al crear el **primer documento** (desde el panel admin o desde el código).  
   - Si ya tienes datos, revisa que los campos coincidan con la tabla de este documento (por ejemplo en `planets`: `image` y/o `planetImage` según lo que use tu código).

3. **Índices**  
   - Si Firestore te pide índices compuestos al hacer consultas (por ejemplo `systems` ordenado por `order`, o `forum_threads` por `categoryId` + `updatedAt`), créalos desde el enlace del error en consola o desde Firebase Console → Firestore → Índices.

### 4.2 En las reglas de Firestore (`firestore.rules`)

1. **Usuarios**  
   - Ya está bien: cada usuario solo lee/escribe su propio documento; admins pueden leer y actualizar cualquier usuario.  
   - Opcional (más estricto): que el usuario solo pueda actualizar ciertos campos (`username`, `fleet`, `level`, `avatar`, `updatedAt`) y no `role` ni `email`; y que solo un admin pueda cambiar `role` o `email`. Eso requeriría reglas con `request.resource.data.diff(resource.data)` o validar campos permitidos.

2. **Wiki y contenido**  
   - Ahora mismo cualquier usuario autenticado puede crear/actualizar/borrar en `ships`, `components`, etc.  
   - **Recomendado:** restringir escritura (create, update, delete) **solo a admins** en:  
     `ships`, `components`, `enemies`, `systems`, `planets`, `missions`, `paints`, `drones`, `cortex`, `gravitons`, `factions`, `ship_types`, `component_types`, `component_rarities`, `servers`, `misc_info`, `conquest_schedules`, `forum_categories`, `news`.  
   - Ejemplo para una de ellas (igual patrón para el resto):

```text
match /ships/{docId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null
    && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
}
```

3. **Foro**  
   - `forum_threads` y `forum_threads/{id}/posts`: mantener que cualquier usuario autenticado pueda crear/editar/borrar (o restringir delete/update al autor o solo a admin, según quieras).  
   - `forum_categories`: solo admin puede crear/actualizar/borrar si aplicas la misma idea que arriba.

### 4.3 En el código

1. **Registro**  
   - Al crear el documento en `users` al registrarse, incluir al menos: `username`, `email`, `fleet` (opcional), `role`, `createdAt`. Opcional: `level`, `avatar`, `updatedAt` en null o por defecto.

2. **Configuración**  
   - Al guardar desde la página de Configuración, usar `set(..., { merge: true })` y actualizar siempre `updatedAt` con `serverTimestamp()`.

3. **Planetas**  
   - Unificar el uso de `image` vs `planetImage` en el código (o guardar ambos en el panel admin) para no tener inconsistencias.

### 4.4 Documentación

1. **COLECCIONES-FIREBASE.md**  
   - Añadir en la tabla resumen las colecciones que falten (`component_types`, `component_rarities`, `servers`, `misc_info`, `conquest_schedules`, `forum_threads`, `news`) y que `users` incluye `level` y `updatedAt`.

2. **ESTRUCTURA-BASE-DATOS.md**  
   - Actualizar la sección de `users` con los campos `level` y `updatedAt` para que coincida con este documento.

---

## 5. Orden sugerido de cambios

1. **Ya hecho (si seguiste la guía anterior):** guardar en `users` los campos `level` y `updatedAt` desde Configuración.  
2. **Reglas:** restringir escritura de colecciones de la wiki y de categorías/noticias a `role == 'admin'`.  
3. **Índices:** crear los que pida Firestore al usar ordenación o filtros compuestos.  
4. **Opcional:** unificar `image` / `planetImage` en planetas y actualizar COLECCIONES-FIREBASE.md y ESTRUCTURA-BASE-DATOS.md con `level`, `updatedAt` y la lista completa de colecciones.

Con esto tendrás todas las “tablas” definidas, organizadas por dominio, y sabrás qué toca agregar o cambiar en la base de datos, reglas y código.
