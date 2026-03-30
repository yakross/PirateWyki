# Roles de usuario y organización de páginas – GalaxWiki

Este documento explica cómo funcionan las cuentas **admin** y **usuario normal**, y cómo está organizada la navegación y las opciones en la wiki.

---

## 1. Tipos de cuenta

| Rol    | Descripción |
|--------|-------------|
| **Admin** | Puede acceder al **Panel Admin** (gestión de naves, componentes, enemigos, usuarios, etc.) y puede asignar o quitar el rol de administrador a otros usuarios. |
| **Usuario** | Puede usar la wiki (ver contenido, búsqueda, favoritos, perfil, configuración). No ve la opción "Panel Admin" ni puede entrar al dashboard de administración. |

---

## 2. Cómo obtener una cuenta admin

- **Primera cuenta:** La primera persona que se registre en la wiki recibe automáticamente el rol **admin**.
- **Otras cuentas:** Cualquier usuario que ya sea admin puede:
  1. Iniciar sesión y abrir **Panel Admin** (menú del usuario → Panel Admin).
  2. Ir a la sección **Usuarios**.
  3. En la lista, usar **"Hacer admin"** en la fila del usuario al que quiera dar permisos de administrador.

Para quitar permisos de admin a alguien (y dejarlo como usuario normal), un admin entra en Panel Admin → Usuarios y pulsa **"Quitar admin"**. No se puede quitar el rol al último admin que quede en la wiki (protección para no quedarse sin administradores).

---

## 3. Cómo tener una cuenta admin y otra normal

1. **Crear la cuenta admin:** Registrarse con el primer correo. Esa cuenta será admin.
2. **Crear la cuenta normal:** Cerrar sesión, registrarse con otro correo. Esa segunda cuenta será usuario normal.
3. **Cambiar entre ellas:** Usar **Cerrar sesión** y luego **Iniciar sesión** con el correo que quieras usar.

Si más adelante quieres que la segunda cuenta también sea admin, inicia sesión con la primera (admin), ve a Panel Admin → Usuarios y pulsa **"Hacer admin"** para la segunda.

---

## 4. Organización de páginas y opciones

### Página principal (Inicio – `index.html`)

- **Sin iniciar sesión:** Se muestran **Iniciar sesión** y **Registrarse**. Tema claro/oscuro y barra de navegación (Inicio, Naves, Componentes, Enemigos, etc.).
- **Iniciado como usuario:** Se muestra el menú del usuario (avatar + nombre, flota). Opciones: **Mi Perfil**, **Favoritos**, **Configuración**, **Cerrar sesión**. No aparece "Panel Admin".
- **Iniciado como admin:** Igual que el usuario, pero además se muestra la etiqueta **Admin** junto al nombre y la opción **Panel Admin** en el menú desplegable.

### Navegación común (todas las páginas)

En la barra superior aparecen:

- **Inicio** → `index.html`
- **Naves** → `pages/wiki/ships.html`
- **Componentes** → `pages/wiki/components.html`
- **Enemigos** → `pages/wiki/enemies.html`
- **Sistemas** → `pages/wiki/systems.html`
- **Misiones** → `pages/wiki/missions.html`
- **Foro** → `pages/forum.html`
- **Noticias** → `pages/news.html`

### Menú del usuario (solo en Inicio cuando hay sesión)

- **Mi Perfil** → `pages/profile.html`
- **Favoritos** → `pages/favorites.html`
- **Configuración** → `pages/settings.html`
- **Panel Admin** → `pages/admin/dashboard.html` (solo si el usuario es admin)
- **Cerrar sesión**

### Panel Admin (solo accesible para admins)

Ruta: `pages/admin/dashboard.html`. Si un usuario sin rol admin intenta entrar, se le redirige al inicio.

Secciones del panel:

- **Dashboard:** Resumen (naves, componentes, enemigos, sistemas, usuarios) y botón para inicializar colecciones.
- **Naves, Componentes, Enemigos:** Alta, edición y listado (CRUD).
- **Sistemas, Noticias, Usuarios:** Gestión de sistemas, noticias y **gestión de usuarios y roles** (cambiar entre admin y usuario).

---

## 5. Resumen rápido

| Qué quieres hacer | Dónde |
|-------------------|--------|
| Tener una cuenta admin | Registrarte primero (primera cuenta = admin). |
| Tener una cuenta normal | Registrarte después del primer usuario, o que un admin te quite el rol. |
| Dar admin a otro usuario | Iniciar sesión como admin → Panel Admin → Usuarios → "Hacer admin". |
| Quitar admin a alguien | Panel Admin → Usuarios → "Quitar admin" (si no es el último admin). |
| Ver si soy admin | En Inicio, al estar logueado: ves la etiqueta "Admin" y la opción "Panel Admin" en el menú. |
