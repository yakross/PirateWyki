# Estructura de la base de datos – GalaxWiki (Pirate Galaxy)

En **Firestore** no existen “tablas” como en SQL. Los datos se organizan en **colecciones** (equivalente a tablas) y **documentos** (equivalente a filas). Cada documento tiene **campos** (atributos).

Tu proyecto usa estas colecciones para la wiki de **Pirate Galaxy** (Splitscreen, 2009):

---

## 1. Colección: `users`

Datos de usuario (registro + perfil). Ya la usas en login/registro.

| Campo        | Tipo   | Descripción                          |
|-------------|--------|--------------------------------------|
| username    | string | Nombre de usuario                    |
| email       | string | Correo (coincide con Firebase Auth)  |
| fleet       | string | Nombre de la flota                   |
| role        | string | `"user"` o `"admin"`                 |
| avatar      | string | URL de imagen de perfil (opcional)  |
| level       | number | Nivel del jugador en el juego (opcional, 1–999) |
| createdAt   | timestamp | Fecha de registro (servidor)       |
| updatedAt   | timestamp | Última actualización de la cuenta (opcional) |

**ID del documento:** `user.uid` (mismo que Firebase Authentication).

---

## 2. Colección: `ships` (Naves)

Naves del juego. El panel admin ya tiene formulario para estas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la nave |
| type | string | `fighter`, `heavy`, `support`, `bomber`, `scout` |
| faction | string | Valor del campo `name` de la colección **factions** (gestión en Contenido genérico → Facciones). Si no hay facciones en BD, se obtienen de las naves existentes. |
| stats | map | armor, speed, energy, damage (números) |
| requirements | map | level, credits (números) |
| **rareBonus** | **map** | **Opcional. Bono por ser rara: `{ type: "health" \| "damage" \| "speed", value: number }` (valor en %).** |
| **droneSlotCosts** | **array** | **Coste por ranura de dron (6 ranuras; ranura 1 gratis). Array de 6 números: [0, coste2, coste3, coste4, coste5, coste6].** |
| **cortexSlotCosts** | **array** | **Coste por ranura de cortex (2 ranuras; ranura 1 gratis). Array de 2 números: [0, coste2].** |
| **armors** | **array** | **Blindajes disponibles: `[{ type: string, cost: number, level: number }, ...]` (tipo, coste en créditos, nivel requerido).** |
| **componentSlotsMax** | **number** | **Máximo de ranuras de componentes (ej. 6 o 8).** |
| image | string | URL de la imagen |
| description | string | Descripción para la wiki |
| location | string | Dónde conseguirla (ej. tienda, misión) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin que la creó |

---

## 2.1 Colección: `factions` (Facciones de naves)

Usada para el desplegable de facción al crear/editar naves en el panel admin. Si la colección está vacía, el desplegable se rellena con los valores únicos de `faction` de las naves existentes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Identificador interno (ej. `terran`, `sol`). Es el valor que se guarda en `ship.faction`. |
| label | string | Etiqueta para mostrar en el desplegable (ej. "Terran", "Sol"). |
| order | number | Orden de aparición en el desplegable. |
| createdAt | timestamp | Opcional. |
| updatedAt | timestamp | Opcional. |

**Gestión:** Panel Admin → Contenido (genérico) → Facciones (naves).

---

## 3. Colección: `components` (Componentes)

Componentes (armas, escudos, etc.). El panel admin ya gestiona estas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del componente |
| type | string | Tipo (arma, escudo, etc.) |
| rarity | string | `common`, `uncommon`, `rare`, `epic`, `legendary` |
| level | number | Nivel recomendado |
| dropLocation | string | Dónde dropea (ej. enemigo – sistema) |
| dropRate | number | % de probabilidad de drop (0–100) |
| description | string | Descripción para la wiki |
| image | string | URL de la imagen (opcional) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 4. Colección: `enemies` (Enemigos)

Enemigos/NPCs del juego.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del enemigo |
| type | string | Tipo (boss, normal, etc.) |
| system | string | Sistema donde aparece (ej. Sol, Vega) |
| planet | string | Planeta o zona (opcional) |
| level | number | Nivel del enemigo |
| stats | map | armor, damage, etc. (opcional) |
| drops | array | IDs o nombres de componentes que suelta |
| description | string | Descripción para la wiki |
| image | string | URL de la imagen |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 5. Colección: `planets` (Planetas)

Planetas por sistema. Al abrir un sistema en la wiki se listan sus planetas; al abrir un planeta se muestra imagen + mapa interactivo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del planeta |
| systemId | string | ID del documento en `systems` (para filtrar planetas del sistema) |
| order | number | Orden en el sistema (para listar) |
| levelMin | number | Nivel mínimo recomendado |
| levelMax | number | Nivel máximo |
| resources | array | Recursos que se encuentran (ej. crionita) |
| description | string | Descripción para la wiki |
| image | string | URL de la imagen del planeta |
| **mapImage** | **string** | **URL del mapa interactivo (imagen del planeta con zonas)** |
| **mapZones** | **array** | **Opcional. Zonas clickeables: `[{ name, label, x, y, width, height }]` (x,y,width,height en %)** |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 6. Colección: `systems` (Sistemas)

Sistemas estelares (mapas).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del sistema (ej. Sol, Vega, Sirius) |
| order | number | Orden de aparición en la wiki |
| levelMin | number | Nivel mínimo del sistema |
| levelMax | number | Nivel máximo |
| description | string | Descripción para la wiki |
| mapImage | string | URL del mapa del sistema |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 7. Subcolección: `users/{uid}/favorites` (Favoritos del usuario)

El documento del usuario está en **`users/{uid}`** (donde `{uid}` es el UID de Firebase Auth). Dentro de ese documento tienes la subcolección **`favorites`**. Cada usuario puede guardar favoritos (naves, componentes, enemigos, pinturas, planetas, sistemas).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| type | string | `ship`, `component`, `enemy`, `paint`, `planet`, `system`, `drone`, `cortex` |
| entityId | string | ID del documento en la colección correspondiente |
| name | string | Nombre para mostrar (opcional, para listar sin cargar el doc) |
| addedAt | timestamp | Fecha en que se añadió |

---

## 8. Colección: `missions` (Misiones)

Misiones del juego (guías, recompensas, objetivos). Se muestran en la sección Misiones de la wiki.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la misión |
| description | string | Descripción o guía |
| system | string | Sistema donde se realiza (opcional) |
| planet | string | Planeta o zona (opcional) |
| levelMin | number | Nivel mínimo recomendado |
| rewards | array o string | Recompensas (texto o lista) |
| image | string | URL de la imagen (opcional) |
| order | number | Orden de aparición |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 9. Colección: `paints` (Pinturas para naves)

Pinturas o skins que se aplican a **cualquier nave** del juego. Se muestran al lado de Componentes en la wiki. No se asocian a una nave concreta (targetType/targetName no se usan).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la pintura |
| rarity | string | common, uncommon, rare, epic, legendary |
| description | string | Descripción para la wiki (opcional) |
| image | string | URL de la imagen |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 9.1 Colección: `drones` (Drones)

Drones que mejoran blindaje o potencia de fuego de la nave. Inspirado en la [Guía de Pirate Galaxy](https://www.c3709203.myzen.co.uk/PG/): Armor drone (+1% a +9% blindaje), Fire-power drone (+1% a +10% daño).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del drone (ej. "Armor drone +5%") |
| type | string | `armor` (blindaje) o `firepower` (potencia de fuego) |
| bonusPercent | number | Porcentaje de bono (1–10) |
| description | string | Descripción para la wiki (opcional) |
| image | string | URL de la imagen (opcional) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 9.2 Colección: `cortex` (Cortex)

Módulos Cortex que otorgan efectos especiales (ej. Ifrit Cortex con multiplicador). Referencia: [HHG Pirate Galaxy](https://www.c3709203.myzen.co.uk/PG/).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del cortex (ej. "Ifrit Cortex") |
| effect | string | Descripción del efecto (ej. "1.25", "Multiplicador daño x1.25") |
| description | string | Descripción para la wiki (opcional) |
| image | string | URL de la imagen (opcional) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 9.3 Colección: `gravitons` (Gravitones)

Hay 5 gravitones en el juego. Se muestran en la pestaña Gravitones dentro de Componentes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del gravitón (ej. "Citrine Graviton", "Pyrope Graviton") |
| effect | string | Efecto o valor (ej. "5.0", "1.0") |
| description | string | Descripción para la wiki (opcional) |
| image | string | URL de la imagen (opcional) |
| order | number | Orden de aparición (1–5) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 10. Foro (propio)

Estructura tipo Pirate Galaxy: **categorías** → **hilos** → **respuestas (posts)**. Tres niveles en Firestore.

### 10.1 Colección: `forum_categories`

Una “tabla” de categorías del foro (ej. General, Estrategias, Noticias del juego).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre de la categoría (ej. "General") |
| description | string | Descripción breve de la categoría |
| order | number | Orden de aparición (menor = primero) |
| icon | string | Nombre de icono (ej. "fa-comments") o URL (opcional) |
| createdAt | timestamp | Fecha de creación (opcional) |
| createdBy | string | UID del admin que la creó (opcional) |

**ID del documento:** lo genera Firestore (Add document) o tú (ej. `general`).

---

### 10.2 Colección: `forum_threads`

Una “tabla” de hilos. Cada hilo pertenece a una categoría.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| categoryId | string | ID del documento en `forum_categories` |
| title | string | Título del hilo |
| authorId | string | UID del usuario que creó el hilo |
| authorName | string | Nombre de usuario para mostrar |
| createdAt | timestamp | Fecha de creación del hilo |
| updatedAt | timestamp | Fecha del último mensaje (para ordenar por actividad) |
| postCount | number | Número de respuestas (se actualiza al añadir un post) |

**ID del documento:** lo genera Firestore al crear un hilo.

---

### 10.3 Subcolección: `forum_threads/{threadId}/posts`

Cada hilo tiene una subcolección **posts** con las respuestas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| authorId | string | UID del usuario que escribió el mensaje |
| authorName | string | Nombre de usuario para mostrar |
| content | string | Texto del mensaje |
| createdAt | timestamp | Fecha y hora del mensaje |

**ID del documento:** lo genera Firestore al crear cada respuesta.

**Resumen:** Creas categorías en `forum_categories`. El usuario crea un hilo en `forum_threads` (con categoryId, title, authorId, authorName). Las respuestas se guardan en `forum_threads/{id del hilo}/posts`.

---

## 11. Colección: `news` (Noticias)

Noticias de la wiki (actualizaciones, eventos, anuncios). Ya tienes la colección `news` creada; estos son los campos que puedes meter en cada documento.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título de la noticia |
| content | string | Contenido completo (puede ser HTML o texto plano) |
| excerpt | string | Resumen corto para listados (opcional) |
| image | string | URL de la imagen principal (opcional) |
| authorId | string | UID del usuario/admin que la publica |
| authorName | string | Nombre para mostrar del autor |
| createdAt | timestamp | Fecha de publicación |
| updatedAt | timestamp | Fecha de última edición |
| published | boolean | Si es true se muestra en la web; false = borrador (opcional) |

**ID del documento:** lo genera Firestore al crear la noticia, o puedes usar uno propio.

---

## 12. Colección: `events` (Eventos / Noticias)

Eventos del juego y noticias de la wiki.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título del evento o noticia |
| type | string | `event` (evento in-game), `news` (noticia wiki), `update` (actualización) |
| description | string | Texto o resumen |
| content | string | Contenido largo (opcional, para noticias) |
| startDate | timestamp | Inicio del evento (opcional) |
| endDate | timestamp | Fin del evento (opcional) |
| image | string | URL de la imagen |
| link | string | Enlace externo (opcional) |
| createdAt | timestamp | Fecha de creación |
| updatedAt | timestamp | Última actualización |
| createdBy | string | UID del admin |

---

## 13. Colección: `servers` (Servidores)

Para mostrar la hora por servidor y asociar conquistas. Se usa en la pestaña **Hora servidores** y **Conquista** de la página Sistemas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del servidor (ej. Europa, USA) |
| timezone | string | Zona horaria IANA (ej. Europe/Madrid, America/New_York) |
| order | number | Orden de aparición |

---

## 14. Colección: `misc_info` (Misc Info)

Información miscelánea (consejos, guías breves). Se muestra en la página **Misc Info** de la wiki.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| key | string | Título o clave de la entrada |
| content | string | Contenido (texto o HTML) |
| order | number | Orden de aparición |

---

## 15. Colección: `conquest_schedules` (Conquista por servidor)

Planetas con conquista y horario según el servidor (cada servidor puede tener distintos horarios).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| serverId | string | Nombre o ID del servidor (debe coincidir con `servers.name`) |
| planetName | string | Nombre del planeta con conquista |
| schedule | string | Horario (ej. Sábado 20:00, Domingo 18:00) |
| order | number | Orden (opcional) |

---

## Cómo se crean las “tablas” en Firestore

En Firestore **no hace falta crear la colección a mano**. La colección aparece cuando añades el **primer documento**:

- **ships, components, enemies:** se crean al guardar el primer elemento desde el panel admin (Naves, Componentes, Enemigos).
- **planets, systems, events:** puedes crearlos desde el panel con el botón **“Inicializar base de datos”**, que añade un documento de ejemplo en cada una para que las colecciones existan y puedas usarlas.

En la consola de Firebase (Firestore Database) verás una “tabla” por cada colección: `users`, `ships`, `components`, `enemies`, `planets`, `systems`, `events`.

---

## Reglas de seguridad (Firestore)

En la raíz del proyecto está el archivo **`firestore.rules`** con reglas completas para todas las colecciones (lectura pública de la wiki, escritura solo usuarios autenticados; usuarios y favoritos por UID). Copia su contenido en Firebase Console → Firestore → Reglas o despliega con `firebase deploy --only firestore:rules`.

Resumen: lectura pública para la wiki; escritura (create/update/delete) solo si `request.auth != null`. Favoritos y usuario: solo el propio usuario. Ejemplo básico si no usas el archivo:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /{collection}/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

- Para **favoritos** (subcolección `users/{uid}/favorites`), cada usuario solo puede leer y escribir sus propios documentos:

```
match /users/{userId}/favorites/{favId} {
  allow read, write: if request.auth != null && request.auth.uid == userId;
}
```

Ajusta `write` en las demás colecciones si quieres restringir por rol (admin).

**Si al crear una categoría del foro aparece "Missing" o "Missing or insufficient permissions"**: la colección `forum_categories` debe tener reglas que permitan escritura a usuarios autenticados (o solo a admins). Comprueba que la regla genérica `match /{collection}/{doc}` con `allow write: if request.auth != null` aplique, o añade explícitamente:

```
match /forum_categories/{categoryId} {
  allow read: if true;
  allow create, update, delete: if request.auth != null;
}
```

---

## Gestión genérica en el panel admin

En el panel de administración, la sección **Contenido (genérico)** permite gestionar varias colecciones (facciones, enemigos, sistemas, misiones, pinturas, drones, cortex, gravitones, categorías del foro) desde una sola pantalla: se elige la colección en un desplegable y el formulario y la tabla se generan a partir de un **esquema** definido en código (`ADMIN_COLLECTIONS_SCHEMA`). Para añadir una nueva “tabla” o tipo de contenido sin crear secciones manuales, basta con agregar un nuevo objeto al esquema (id, label, collection, fields, tableColumns).

---

## Resumen de colecciones (tablas)

| Colección / Ruta        | Uso                         | Se crea al… |
|-------------------------|-----------------------------|-------------|
| users                   | Usuarios y perfiles         | Registrarse |
| users/{uid}/favorites   | Favoritos (naves, componentes, enemigos, pinturas, planetas, sistemas, drones, cortex) | Usuario añade favorito |
| factions                | Facciones de naves (nombre, etiqueta, orden) | Admin en Contenido genérico |
| ships                   | Naves (con rareBonus opcional) | Admin agrega nave |
| components              | Componentes                 | Admin agrega componente |
| enemies                 | Enemigos                    | Admin agrega enemigo |
| drones                  | Drones (armor / firepower)  | Admin agrega drone |
| cortex                  | Cortex (módulos especiales) | Admin agrega cortex |
| gravitons               | Gravitones (5 en el juego)  | Admin agrega gravitón |
| missions                | Misiones (guías)            | Admin agrega misión |
| paints                  | Pinturas para naves (cualquier nave) | Admin agrega pintura |
| planets                 | Planetas (mapImage para mapa interactivo) | Admin / Inicializar |
| systems                 | Sistemas estelares         | Admin / Inicializar |
| ship_types              | Tipos de nave (Storm, Tank, Caza, etc.) | Admin en Contenido genérico |
| component_types         | Tipos de componente        | Admin en Contenido genérico |
| component_rarities      | Rarezas (común, raro, etc.) | Admin en Contenido genérico |
| servers                 | Servidores (nombre, zona horaria) | Admin en Contenido genérico |
| misc_info               | Misc Info (clave, contenido) | Admin en Contenido genérico |
| conquest_schedules      | Conquista por servidor (planeta, horario) | Admin en Contenido genérico |
| forum_categories        | Foro: categorías            | Admin crea categoría |
| forum_threads           | Foro: hilos                 | Usuario crea hilo |
| forum_threads/{id}/posts| Foro: respuestas            | Usuario responde |
| news                    | Noticias (title, content, image, authorId, etc.) | Admin publica |

Los documentos de ejemplo que crea el botón **Inicializar colecciones** puedes editarlos o borrarlos en Firebase Console; son solo plantillas para que las colecciones existan.
