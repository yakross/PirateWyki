# Cambios de esquema aplicados y pendientes – GalaxWiki

**Monedas:** En el juego la moneda es **Crionita**. La moneda de pago es **Oro** (Créditos Raven). Todo lo que tenga precio en la wiki es en **Crionita**, salvo que se indique también Créditos Raven.

---

## ✅ Aplicado en el panel admin

### Contadores y usuarios
- **Contadores (index y admin):** Corregidos. En index se cargan naves, componentes y enemigos (lectura pública); el contador de usuarios solo se muestra para admins. En admin los contadores se cargan después de confirmar que el usuario es admin.
- **Sección Usuarios:** Corregido escape y carga; la lista de usuarios ya no debería dar error.

### Naves
- **Energía:** Eliminada de la nave (el gasto de energía es solo de los componentes).
- **Precio:** "Créditos Requeridos" pasado a **Crionita**; añadido **Créditos Raven** (opcional).
- **Stats guardados:** `armor`, `speed` (sin `energy` ni `damage` en formulario). `requirements.credits` = crionita. Nuevo campo `creditsRaven`.
- **Bonos de rareza:** Varios bonos; array `rareBonuses: [{ type, value }, ...]`; en admin se pueden añadir/quitar filas. Se mantiene `rareBonus` (primer bono) para compatibilidad.
- **Ranuras de componentes:** Selector de 1 a 10 en el formulario admin.

### Componentes
- **Imagen:** Campo **URL de imagen** añadido.
- **Precio:** **Crionita** (`cost`) y **Créditos Raven** (`creditsRaven`) en formulario admin.
- **Drop %:** Eliminado. Solo "Dónde se consigue (drop)".
- **Energía, Cooldown, Duración:** ya en admin.
- **Rol/función:** Incluye repair, damage, shield, aura, recolección, velocidad, aceleración, stuneo, ralentización, debuff_dano, señal_interferencia, picador, mira, perforador, distancia, cantidad_enemigos, potencia; **curación/seg**, **potencia/seg**, **blindaje** (escudo/aura); **variante** rápido / normal / potente.

### Pinturas
- **Imagen:** Ya existía; se mantiene.
- **Precio:** Crionita y Créditos Raven.
- **Enemigo que la suelta:** select que carga enemigos (`droppedByEnemyId`). **Pagada con oro:** checkbox (`paidWithGold`).

### Drones
- **Precio:** **Crionita** y **Créditos Raven** en formulario admin.
- **Cómo se consigue:** select `howToGet`: créditos Raven, eventos, de pago, drop de enemigo.

### Misiones
- **Nivel máximo** (`levelMax`) y **link de video** (`videoLink`) para tutorial.

### Cortex
- **Duración del reto** (`challengeDuration`), **partes para completar** (`partsRequired`, ej. 25), **partes por puesto 1º–5º** (`parts1st` … `parts5th`).

### Gravitones
- **Cooldown** (global), **cooldown PvP / Conquista / Normal** y **duración** (seg).

### Planetas
- **Tipo de planeta** (`planetType`): normal, conquista, evento, sin uso.

### Enemigos
- **Tipo:** desplegable que carga desde colección `enemy_types`. Si no hay documentos, se usan opciones por defecto. En admin existe la sección **Tipos de enemigo** para CRUD de `enemy_types`.
- **Componentes que utiliza:** campo `componentIds` (array de IDs de componentes) en formulario admin; se guarda como lista de IDs separados por coma.

### Opciones seleccionables (admin) — implementado
- **Tipos de enemigo:** Sección admin para CRUD de `enemy_types` (nombre, etiqueta, orden).
- **Tipos de pintura:** Sección admin para CRUD de `paint_types`. El formulario de pinturas incluye campo **Tipo de pintura** y carga opciones desde esta colección al abrir la sección Pinturas.
- **Rarezas de pintura:** Sección admin para CRUD de `paint_rarities`. El desplegable "Rareza" del formulario de pinturas se rellena desde `paint_rarities` si hay documentos; si no, se mantienen las opciones fijas (común, poco común, etc.).
- **Tipos de drone:** Sección admin para CRUD de `drone_types`. El desplegable "Tipo" del formulario de drones se rellena desde `drone_types` al abrir la sección Drones; si la colección está vacía, se usan las opciones fijas (Blindaje, Potencia de fuego).

---

## Pendiente de implementar en admin / Firestore

### Naves (complementos)
- **Componentes de la nave:** Poder indicar cuántos componentes tiene la nave y **cuáles** (lista de IDs o nombres de componentes compatibles).

### Misiones (complementos)
- **Fases:** array de objetos `{ title, description, order }`.
- **Tipo parte / %:** opciones para guiar (Parte 1, Parte 2, tipo: recoger, destruir, etc.).

### Drones (complementos)
- **Varios potenciadores** (array `boosters`), **energía** del drone.

### Noticias
- **Contenido con imágenes:** Editor o soporte para **imágenes** dentro del contenido (HTML con `<img>` o almacenar URLs de imágenes en el contenido).
- **Reacciones con emotes:** Que los usuarios puedan **reaccionar** a la noticia con emotes (requiere subcolección tipo `news/{id}/reactions` o campo de reacciones por emoji y contadores).

### Foro
- **Emotes y reacciones:** Igual que noticias: reacciones con emotes a hilos o mensajes.
- **Respuestas a reacciones:** Que los usuarios puedan **responder** a una reacción (o a un mensaje que tenga reacciones).
- **Imágenes / memes / emoticones:** Permitir **imágenes** (y si aplica memes/emoticones) en los mensajes del foro (contenido HTML o URLs).

---

## Resumen de campos en Firestore (referencia)

| Colección   | Campos ya en admin / implementados |
|------------|-------------------------------------|
| **ships**  | rareBonuses, componentSlotsMax 1–10, creditsRaven, sin damage en stats. |
| **components** | cost, creditsRaven, role, healPerSec, powerPerSec, shieldValue, variant, energy, cooldown, duration. |
| **paints** | type (desde paint_types), crionita, creditsRaven, droppedByEnemyId, paidWithGold. |
| **missions** | levelMax, videoLink (link video tutorial). |
| **drones**  | crionita, creditsRaven, howToGet (credits_raven, events, paid, drop). |
| **cortex**  | challengeDuration, partsRequired, parts1st … parts5th. |
| **gravitons** | cooldown, cooldownPvp, cooldownConquest, cooldownNormal, duration. |
| **planets** | planetType (normal, conquest, event, none). |
| **enemies** | type se rellena desde colección `enemy_types` si existe (name, label, order). |

**Detalles públicos:** Al hacer clic en una tarjeta de pintura, misión, drone, cortex o gravitón se abre la página de detalle correspondiente (`paint-detail.html`, `mission-detail.html`, `drone-detail.html`, `cortex-detail.html`, `graviton-detail.html`). **Misc Info:** En la vista usuario, las entradas se muestran como barras horizontales; al hacer clic se despliega el contenido hacia abajo. **Firestore:** Reglas añadidas para `enemy_types`, `paint_types`, `paint_rarities`, `drone_types` (lectura pública, escritura si autenticado) para corregir "missing or insufficient permissions" al guardar.

**Foro:** Al crear un hilo o responder se guardan avatar, flota y nivel del usuario (desde `users`). En cada mensaje se muestra perfil (foto, nombre, flota, nivel). Las URLs de imágenes (.png, .jpg, .gif, .webp) en el texto se muestran como imágenes. **Noticias:** Reacciones con emotes (👍 ❤️ 😄 🎉 🔥 😲 😢 😂 🤔 👏 🎮); cooldown 800 ms para evitar doble clic; estilo “seleccionado” con sombra en la reacción del usuario; animación al pulsar. **Firestore:** `news/{id}/user_reactions/{userId}` restringido a que cada usuario solo lea/escriba su propio documento. **Calculadora:** Naves con `componentSlotTypes` muestran un desplegable por tipo de ranura (un componente por tipo); coincidencia de tipo sin distinguir mayúsculas. Componentes adicionales: lista con icono ✓ (chulito); click para añadir/quitar de la selección; la selección se mantiene al cambiar el filtro "Todos los tipos" / por tipo. **Textos con imágenes:** En descripciones (naves, componentes, enemigos, misiones, pinturas, drones, cortex, gravitones, sistemas, planetas) y contenido de noticias se usa `formatContentWithImages` (js/content-utils.js): se escapa HTML y las URLs de imagen se convierten en `<img>`. **Admin imágenes:** Junto a cada campo “URL de imagen” hay botón “Subir imagen” que sube el archivo a Firebase Storage (`wiki_uploads/`) y escribe la URL en el campo. Desplegar reglas de Storage: `solo URL, sin Storage` (archivo `storage.rules`).

**Perfil / Configuración:** En Configuración se puede elegir **Servidor** (Vega, Antares, Sirius, Mizar, Sol, Otro); se guarda en `users.server` y se muestra en Mi Perfil.

Pendiente: phases en misiones; boosters/energy en drones; reacciones en mensajes del foro (emotes por post).
