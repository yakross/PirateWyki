# Estructura completa de tablas (Firestore) – GalaxWiki

Firestore usa **colecciones** (≈ tablas) y **documentos** (≈ filas). Cada documento tiene un **ID** (auto o custom) y **campos**.

---

## Resumen: colecciones y documentos

| Colección | ID del documento | Nº documentos |
|-----------|------------------|---------------|
| users | `user.uid` (Auth UID) | 1 por usuario registrado |
| users/{uid}/favorites | Auto (add) | N por usuario (cada favorito) |
| factions | Auto o custom (ej. `terran`) | N (facciones de naves) |
| ships | Auto (add) | N (cada nave) |
| ship_types | Auto o custom | N (tipos de nave) |
| components | Auto (add) | N (cada componente) |
| component_types | Auto o custom | N (tipos de componente) |
| component_rarities | Auto o custom | N (rarezas) |
| enemies | Auto (add) | N (cada enemigo) |
| enemy_types | Auto o custom | N (tipos de enemigo) |
| missions | Auto (add) | N (cada misión) |
| paints | Auto (add) | N (cada pintura) |
| paint_types | Auto o custom | N (tipos de pintura) |
| paint_rarities | Auto o custom | N (rarezas de pintura) |
| drones | Auto (add) | N (cada drone) |
| drone_types | Auto o custom | N (tipos de drone) |
| cortex | Auto (add) | N (cada cortex) |
| gravitons | Auto (add) | 5 típicos (o N) |
| systems | Auto (add) | N (cada sistema) |
| planets | Auto (add) | N (cada planeta) |
| forum_categories | Auto o custom | N (categorías foro) |
| forum_threads | Auto (add) | N (cada hilo) |
| forum_threads/{id}/posts | Auto (add) | N (cada respuesta) |
| news | Auto (add) | N (cada noticia) |
| misc_info | Auto o custom (key) | N (entradas misc) |
| servers | Auto o custom | N (servidores) |
| conquest_schedules | Auto (add) | N (horarios conquista) |

---

## 1. `users`

**ID:** `auth.uid` (mismo que Firebase Authentication).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| username | string | Nombre de usuario |
| email | string | Correo (Auth) |
| fleet | string | Nombre de la flota |
| role | string | `user` \| `admin` |
| avatar | string | URL avatar (opcional) |
| level | number | Nivel en juego 1–999 (opcional) |
| createdAt | timestamp | Registro |
| updatedAt | timestamp | Última actualización |

---

## 2. `users/{uid}/favorites` (subcolección)

**ID:** Auto al añadir favorito.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| type | string | `ship` \| `component` \| `enemy` \| `paint` \| `planet` \| `system` \| `drone` \| `cortex` |
| entityId | string | ID del documento en su colección |
| name | string | Nombre para listar (opcional) |
| addedAt | timestamp | Fecha |

---

## 3. `factions`

**ID:** Auto o custom (ej. `terran`). **Documentos:** los que defina el admin.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor guardado en `ship.faction` |
| label | string | Etiqueta en desplegable |
| order | number | Orden |
| createdAt | timestamp | Opcional |
| updatedAt | timestamp | Opcional |

---

## 4. `ships`

**ID:** Auto. **Documentos:** uno por nave.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| type | string | Valor de `ship_types` (ej. fighter, heavy) |
| faction | string | Valor de `factions.name` |
| stats | map | armor (number), speed (number) |
| requirements | map | level (number), credits (number) = crionita |
| creditsRaven | number | Créditos Raven (opcional) |
| rareBonus | map | Opcional. { type, value } (primer bono, compatibilidad) |
| rareBonuses | array | Opcional. [{ type, value }, ...] (varios bonos) |
| componentSlotsMax | number | 1–10 |
| droneSlotCosts | array | [0, c2, c3, c4, c5, c6] |
| cortexSlotCosts | array | [0, c2] |
| armors | array | [{ type, cost, level }, ...] |
| image | string | URL |
| description | string | Opcional |
| location | string | Dónde conseguirla |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 5. `ship_types`

**ID:** Auto o custom. **Documentos:** N (tipos de nave).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `ship.type` |
| label | string | Etiqueta (opcional) |
| order | number | Orden |

---

## 6. `components`

**ID:** Auto. **Documentos:** uno por componente.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| type | string | Valor de `component_types` |
| rarity | string | Valor de `component_rarities` |
| level | number | Nivel recomendado |
| dropLocation | string | Dónde dropea |
| description | string | Opcional |
| image | string | URL (opcional) |
| cost | number | Precio en crionita (opcional) |
| creditsRaven | number | Créditos Raven (opcional) |
| energy | number | Consumo energía |
| cooldown | number | Enfriamiento (seg); 0 = sin cooldown |
| duration | number | Duración (seg); 0 = sin duración |
| role | string | `repair` \| `damage` \| `shield` \| `aura` (opcional) |
| healPerSec | number | Curación por segundo (si role=repair) |
| powerPerSec | number | Potencia por segundo (si aplica) |
| shieldValue | number | Blindaje (si role=shield/aura) |
| variant | string | `rapido` \| `normal` \| `potente` (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 7. `component_types`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `component.type` |
| label | string | Opcional |
| order | number | Orden |

---

## 8. `component_rarities`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `component.rarity` (ej. azul, dorado) |
| label | string | Opcional |
| order | number | Orden |

---

## 9. `enemies`

**ID:** Auto. **Documentos:** uno por enemigo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| type | string | Valor de `enemy_types` (boss, normal, evento, etc.) |
| system | string | Sistema (ej. Sol, Vega) |
| planet | string | Planeta/zona (opcional) |
| level | number | Nivel |
| stats | map | armor, damage, etc. (opcional) |
| drops | array | IDs o nombres de componentes que suelta |
| description | string | Opcional |
| image | string | URL (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 10. `enemy_types`

**ID:** Auto o custom. **Documentos:** N (tipos de enemigo).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `enemy.type` (normal, boss, evento, mision, pks, etc.) |
| label | string | Opcional |
| order | number | Orden |

---

## 11. `missions`

**ID:** Auto. **Documentos:** uno por misión.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| description | string | Guía/descripción |
| system | string | Sistema (opcional) |
| planet | string | Planeta (opcional) |
| levelMin | number | Nivel mínimo |
| levelMax | number | Nivel máximo (opcional) |
| videoLink | string | URL video tutorial (opcional) |
| rewards | array o string | Recompensas |
| image | string | URL (opcional) |
| order | number | Orden |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 12. `paints`

**ID:** Auto. **Documentos:** uno por pintura.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| type | string | Valor de `paint_types` (opcional) |
| rarity | string | Valor de `paint_rarities` (common, rare, etc.) |
| crionita | number | Precio en crionita (opcional) |
| creditsRaven | number | Créditos Raven (opcional) |
| droppedByEnemyId | string | ID enemigo que la suelta (opcional) |
| paidWithGold | boolean | true si se paga con oro (opcional) |
| description | string | Opcional |
| image | string | URL (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 13. `paint_types`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `paint.type` |
| label | string | Opcional |
| order | number | Orden |

---

## 14. `paint_rarities`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `paint.rarity` |
| label | string | Opcional |
| order | number | Orden |

---

## 15. `drones`

**ID:** Auto. **Documentos:** uno por drone.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (ej. Armor drone +5%) |
| type | string | Valor de `drone_types` (armor, firepower, etc.) |
| bonusPercent | number | Porcentaje 1–10 |
| crionita | number | Precio crionita (opcional) |
| creditsRaven | number | Créditos Raven (opcional) |
| howToGet | string | `credits_raven` \| `events` \| `paid` \| `drop` (opcional) |
| description | string | Opcional |
| image | string | URL (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 16. `drone_types`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Valor para `drone.type` (armor, firepower, etc.) |
| label | string | Opcional |
| order | number | Orden |

---

## 17. `cortex`

**ID:** Auto. **Documentos:** uno por cortex.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (ej. Ifrit Cortex) |
| effect | string | Efecto (ej. 1.25) |
| challengeDuration | string | Duración del reto (ej. "7 días") |
| partsRequired | number | Partes para completar (ej. 25) |
| parts1st | number | Partes puesto 1º |
| parts2nd | number | Partes puesto 2º |
| parts3rd | number | Partes puesto 3º |
| parts4th | number | Partes puesto 4º |
| parts5th | number | Partes puesto 5º |
| description | string | Opcional |
| image | string | URL (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 18. `gravitons`

**ID:** Auto. **Documentos:** típicamente 5 (o N).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (ej. Citrine Graviton) |
| effect | string | Efecto/valor |
| cooldown | number | Enfriamiento global (seg) (opcional) |
| cooldownPvp | number | Cooldown modo PvP (opcional) |
| cooldownConquest | number | Cooldown conquista (opcional) |
| cooldownNormal | number | Cooldown modo normal (opcional) |
| duration | number | Duración efecto (opcional) |
| description | string | Opcional |
| image | string | URL (opcional) |
| order | number | 1–5 (o N) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 19. `systems`

**ID:** Auto. **Documentos:** uno por sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre (Sol, Vega, Sirius) |
| order | number | Orden |
| levelMin | number | Nivel mínimo |
| levelMax | number | Nivel máximo |
| description | string | Opcional |
| mapImage | string | URL mapa |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 20. `planets`

**ID:** Auto. **Documentos:** uno por planeta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre |
| systemId | string | ID doc en `systems` |
| order | number | Orden en el sistema |
| levelMin | number | Nivel mínimo |
| levelMax | number | Nivel máximo |
| planetType | string | `normal` \| `conquest` \| `event` \| `none` |
| resources | array | Recursos (opcional) |
| description | string | Opcional |
| image | string | URL |
| mapImage | string | URL mapa interactivo (opcional) |
| mapZones | array | [{ name, label, x, y, width, height }] (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 21. `forum_categories`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre categoría |
| description | string | Opcional |
| order | number | Orden |
| icon | string | Opcional |
| createdAt | timestamp | Opcional |
| createdBy | string | Opcional |

---

## 22. `forum_threads`

**ID:** Auto. **Documentos:** uno por hilo.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| categoryId | string | ID en `forum_categories` |
| title | string | Título |
| authorId | string | UID autor |
| authorName | string | Nombre a mostrar |
| createdAt | timestamp | |
| updatedAt | timestamp | Último mensaje |
| postCount | number | Nº respuestas |

---

## 23. `forum_threads/{threadId}/posts`

**ID:** Auto. **Documentos:** uno por respuesta.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| authorId | string | UID autor |
| authorName | string | Nombre |
| content | string | Texto |
| createdAt | timestamp | |

---

## 24. `news`

**ID:** Auto. **Documentos:** uno por noticia.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título |
| content | string | Contenido (HTML/texto) |
| excerpt | string | Resumen (opcional) |
| image | string | URL (opcional) |
| authorId | string | UID autor |
| authorName | string | Nombre autor |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| published | boolean | true = visible |

---

## 25. `misc_info`

**ID:** Auto o por clave. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| key | string | Título/clave |
| content | string | Contenido (texto/HTML) |
| order | number | Orden |

---

## 26. `servers`

**ID:** Auto o custom. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre servidor |
| timezone | string | IANA (ej. Europe/Madrid) |
| order | number | Orden |

---

## 27. `conquest_schedules`

**ID:** Auto. **Documentos:** N.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| serverId | string | ID/nombre servidor |
| planetName | string | Planeta con conquista |
| schedule | string | Horario |
| order | number | Opcional |

## 28. `blueprints` (Planos)

**ID:** Auto. **Documentos:** uno por plano.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del plano |
| type | string | `ship` \| `component` \| `paint` \| `drone` |
| itemId | string | ID del item correspondiente (nave, componente, etc.) |
| dropRate | number | Porcentaje de drop (ej: 2.5 para 2.5%) |
| enemies | array | IDs de enemigos que sueltan el plano |
| enemyNames | array | Nombres de los enemigos (para mostrar) |
| levelMin | number | Nivel mínimo recomendado |
| levelMax | number | Nivel máximo (opcional) |
| planet | string | Planeta donde se obtiene (opcional) |
| system | string | Sistema donde se obtiene (opcional) |
| requiresDecryption | boolean | true si requiere descifrado |
| decryptionComponents | array | IDs de componentes necesarios para descifrar |
| decryptionShips | array | IDs de naves necesarias para descifrar |
| decryptionCost | number | Costo en crionita para descifrar |
| decryptionTime | number | Tiempo de descifrado en horas |
| description | string | Descripción adicional (opcional) |
| image | string | URL imagen (opcional) |
| createdAt | timestamp | |
| updatedAt | timestamp | |
| createdBy | string | UID admin |

---

## 29. `user_blueprints` (Tracker de Planos por Usuario)

**ID:** `{userId}_{blueprintId}`. **Documentos:** uno por plano obtenido.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| userId | string | UID del usuario |
| blueprintId | string | ID del plano |
| obtained | boolean | true si lo tiene |
| obtainedAt | timestamp | Fecha de obtención |
| decrypted | boolean | true si ya lo descifró |
| decryptedAt | timestamp | Fecha de descifrado |
| progress | number | % de progreso si está descifrando |
| notes | string | Notas del usuario (opcional) |

---

## 30. `sirius_info` (Singularidad Sirius)

**ID:** Auto. **Documentos:** información y estadísticas de Sirius.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| key | string | Identificador (ej: description, stats) |
| type | string | Tipo: description, stat, info |
| content | string | Contenido descriptivo |
| icon | string | Emoji/icono (ej: 🌀) |
| statLabel | string | Label para estadísticas |
| statValue | string | Valor para estadísticas |
| order | number | Orden de visualización |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

## 31. `survival_guides` (Guías de Supervivencia)

**ID:** Auto. **Documentos:** guías de supervivencia por sistema.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título de la guía |
| system | string | Sistema donde aplica |
| minLevel | number | Nivel mínimo recomendado |
| difficulty | string | Fácil, Media, Difícil, Extrema |
| content | string | Contenido de la guía |
| order | number | Orden de visualización |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

## 32. `farming_routes` (Rutas de Farmeo)

**ID:** Auto. **Documentos:** rutas para farmear recursos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| zone | string | Zona o planeta |
| system | string | Sistema |
| minLevel | number | Nivel mínimo |
| maxLevel | number | Nivel máximo (opcional) |
| resource | string | Recurso a farmear (ej: Crionita) |
| efficiency | string | S, A, B, C |
| notes | string | Notas adicionales |
| order | number | Orden de visualización |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

## 33. `conquest_info` (Info Conquista)

**ID:** Auto. **Documentos:** información general sobre conquistas.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título de la información |
| content | string | Contenido detallado |
| order | number | Orden de visualización |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

## 34. `clan_info` (Info Clanes)

**ID:** Auto. **Documentos:** información sobre clanes.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| title | string | Título de la información |
| content | string | Contenido detallado |
| order | number | Orden de visualización |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

## 35. `map_markers` (Marcadores de Mapa)

**ID:** Auto. **Documentos:** marcadores para mapas interactivos.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| name | string | Nombre del marcador |
| mapId | string | ID del mapa (system_1, planet_5, etc.) |
| type | string | poi, enemy, resource, portal, station |
| x | number | Posición X (0-100%) |
| y | number | Posición Y (0-100%) |
| description | string | Descripción del marcador |
| createdAt | timestamp | |
| updatedAt | timestamp | |

---

- **users:** 1 por cada usuario registrado.
- **favorites:** tantos como favoritos tenga cada usuario.
- **factions, ship_types, component_types, component_rarities, enemy_types, paint_types, paint_rarities, drone_types:** los que el admin defina (listas de opciones); pueden ser 0 y rellenar desde valores existentes o valores por defecto en código.
- **ships, components, enemies, missions, paints, drones, cortex, gravitons, systems, planets, news, forum_threads, forum_threads/…/posts:** N, según contenido de la wiki.
- **forum_categories:** al menos 1 para tener foro usable.
- **misc_info:** los que quieras mostrar en Misc Info.
- **servers, conquest_schedules:** según necesidad (horarios por servidor).
- **blueprints:** planos con info de drop, descifrado, etc.
- **sirius_info, survival_guides, farming_routes, conquest_info, clan_info, map_markers:** según contenido agregado en admin.

Las colecciones **no se crean a mano** en Firestore: aparecen al añadir el **primer documento** en cada una (desde el panel admin o desde código).
