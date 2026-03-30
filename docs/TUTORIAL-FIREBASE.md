# Tutorial: Cómo usar Firebase en PirateWyki

Este tutorial explica cómo usas **Firebase** en tu proyecto: **Authentication** (login/registro) y **Firestore** (base de datos). Todo está basado en el código real de GalaxWiki.

---

## 1. Qué usas de Firebase

| Servicio | Uso en tu proyecto |
|----------|---------------------|
| **Firebase Auth** | Login, registro y cierre de sesión. Identifica al usuario por email/contraseña. |
| **Firestore** | Base de datos: usuarios, naves, componentes, enemigos y estadísticas. |

No necesitas un servidor propio: todo se ejecuta en el navegador.

---

## 2. Incluir Firebase en una página

En cada HTML que use Firebase, carga **siempre** estos scripts **en este orden**, antes de tu propio código:

```html
<!-- 1. App + Auth + Firestore (compatibilidad v9) -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-app-compat.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-auth-compat.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/firebase/9.22.0/firebase-firestore-compat.min.js"></script>

<!-- 2. Tu script (config + lógica) -->
<script>
  // aquí tu código
</script>
```

Sin `firebase-app-compat` no funciona nada. Sin `firebase-auth-compat` no hay login. Sin `firebase-firestore-compat` no puedes leer/escribir en la base de datos.

---

## 3. Configuración e inicialización

Tu configuración está en `js/firebase-config.js` y repetida en `index.html`, `login.html` y `register.html`. Solo necesitas inicializar **una vez** por página.

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyBNxrvFcQSfd1Z4VarqrzrPXftaBxwKZ9o",
    authDomain: "piratewyki.firebaseapp.com",
    projectId: "piratewyki",
    storageBucket: "piratewyki.firebasestorage.app",
    messagingSenderId: "501878813096",
    appId: "1:501878813096:web:177f9460b3976f2ffb6d9d",
    measurementId: "G-6J1C57D842"
};

// Inicializar (solo una vez por página)
firebase.initializeApp(firebaseConfig);

// Referencias que usarás en todo el código
const auth = firebase.auth();
const db = firebase.firestore();
```

- **auth**: para login, registro, cerrar sesión y saber si hay usuario logueado.
- **db**: para leer y escribir en Firestore (colecciones y documentos).

---

## 4. Firebase Authentication

### 4.1 Registrar un usuario (register.html)

Flujo que ya tienes:

1. Validar contraseña y confirmación.
2. Comprobar en Firestore si el `username` ya existe.
3. Crear el usuario en Auth con email y contraseña.
4. Guardar en Firestore los datos extra (username, fleet, role, etc.).

```javascript
// Crear cuenta en Authentication
const userCredential = await auth.createUserWithEmailAndPassword(email, password);
const user = userCredential.user;  // user.uid, user.email

// Guardar datos adicionales en Firestore (colección 'users')
await db.collection('users').doc(user.uid).set({
    username: username,
    email: email,
    fleet: fleet,
    role: isFirstUser ? 'admin' : 'user',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    avatar: null
});
```

- `user.uid` es el ID único del usuario; lo usas como ID del documento en `users`.
- `FieldValue.serverTimestamp()` pone la fecha/hora del servidor (Firebase).

### 4.2 Iniciar sesión (login.html)

```javascript
const userCredential = await auth.signInWithEmailAndPassword(email, password);
const user = userCredential.user;
// Redirigir a index.html o dashboard
```

### 4.3 Cerrar sesión (index.html)

```javascript
await auth.signOut();
location.reload();
```

### 4.4 Saber si hay alguien logueado: onAuthStateChanged

Lo usas en **index.html** para mostrar perfil o botones de login, y en **login/register** para redirigir si ya está logueado.

```javascript
auth.onAuthStateChanged(async (user) => {
    if (user) {
        // Hay usuario logueado: user.uid, user.email
        const userDoc = await db.collection('users').doc(user.uid).get();
        if (userDoc.exists) {
            const userData = userDoc.data();
            // userData.username, userData.fleet, userData.role...
        }
    } else {
        // No hay nadie logueado: mostrar Login / Registro
    }
});
```

Importante: `onAuthStateChanged` se dispara al cargar la página y cada vez que el estado de login cambia (login, logout).

### 4.5 Errores de Auth que ya manejas

| Código | Significado |
|--------|-------------|
| `auth/user-not-found` | No existe cuenta con ese correo |
| `auth/wrong-password` | Contraseña incorrecta |
| `auth/invalid-email` | Email inválido |
| `auth/email-already-in-use` | Correo ya registrado |
| `auth/weak-password` | Contraseña muy débil |
| `auth/too-many-requests` | Demasiados intentos; esperar |

En tu código usas `error.code` y `error.message` en un `switch` para mostrar mensajes en español.

---

## 5. Firestore: leer y escribir

Firestore se organiza en **colecciones** y **documentos**. En tu proyecto usas por ejemplo: `users`, `ships`, `components`, `enemies`.

### 5.1 Leer un documento por ID (ej: un usuario)

```javascript
const userDoc = await db.collection('users').doc(user.uid).get();

if (userDoc.exists) {
    const userData = userDoc.data();  // objeto con username, email, fleet, role...
} else {
    // el documento no existe
}
```

- `.doc(id)` → un documento concreto.
- `.get()` → devuelve un “snapshot”; `.exists` y `.data()` son del snapshot.

### 5.2 Leer todos los documentos de una colección (index.html – estadísticas)

```javascript
const shipsSnapshot = await db.collection('ships').get();
console.log('Número de naves:', shipsSnapshot.size);

shipsSnapshot.forEach((doc) => {
    const id = doc.id;
    const data = doc.data();
    // data.nombre, data.tipo, etc.
});
```

Lo mismo haces con `components`, `enemies`, `users` para mostrar cantidades en la portada.

### 5.3 Consultas con condiciones (register.html – username único)

Comprobar si ya existe un usuario con un `username`:

```javascript
const usernameQuery = await db.collection('users')
    .where('username', '==', username)
    .get();

if (!usernameQuery.empty) {
    // Ya existe alguien con ese nombre
}
```

- `.where('campo', '==', valor)` filtra documentos.
- `.get()` devuelve un snapshot; `.empty` indica si hay o no resultados.

### 5.4 Escribir o crear un documento (register.html)

Crear o **sobrescribir** un documento con un ID fijo (por ejemplo el `uid` del usuario):

```javascript
await db.collection('users').doc(user.uid).set({
    username: username,
    email: email,
    fleet: fleet,
    role: isFirstUser ? 'admin' : 'user',
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    avatar: null
});
```

- `.set(datos)` crea el documento o lo reemplaza por completo.
- Para actualizar solo algunos campos: `.update({ campo: valor })`.

### 5.5 Timestamps

Para guardar “fecha de creación” o “última actualización” usa la hora del servidor:

```javascript
createdAt: firebase.firestore.FieldValue.serverTimestamp()
```

Así no dependes de la hora del ordenador del usuario.

---

## 6. Resumen del flujo en tu proyecto

```
Registro (register.html)
  → auth.createUserWithEmailAndPassword(email, password)
  → db.collection('users').doc(user.uid).set({ username, email, fleet, role, ... })
  → redirigir a index.html

Login (login.html)
  → auth.signInWithEmailAndPassword(email, password)
  → redirigir a index.html

Portada (index.html)
  → auth.onAuthStateChanged → si hay user: leer db.collection('users').doc(user.uid)
  → mostrar nombre, flota, opción admin
  → loadStats(): db.collection('ships').get(), .components, .enemies, .users (solo .size para estadísticas)

Cerrar sesión
  → auth.signOut() → recargar página
```

---

## 7. Buenas prácticas que ya sigues

- Validar contraseña y coincidencia antes de llamar a Firebase.
- Comprobar username único en Firestore antes de crear la cuenta.
- Usar `try/catch` en login y registro y mostrar mensajes claros con `error.code`.
- Usar `onAuthStateChanged` para la UI (mostrar/ocultar perfil o botones).
- Guardar datos extra del usuario en `users` con el mismo `user.uid` que Auth.

---

## 8. Dónde está cada cosa en tu código

| Qué | Dónde |
|-----|--------|
| Configuración central | `js/firebase-config.js` (por ahora no lo cargas en las páginas; podrías usarlo para no repetir config). |
| Inicialización + sesión + estadísticas | `index.html` (scripts al final). |
| Login | `login.html` (formulario + `signInWithEmailAndPassword` + `onAuthStateChanged`). |
| Registro | `register.html` (validación, `where('username', ...)`, `createUserWithEmailAndPassword`, `users.doc(uid).set`). |

---

## 9. Próximos pasos posibles

- Cargar **una sola vez** la config desde `js/firebase-config.js` en `index.html`, `login.html` y `register.html`, y quitar la config duplicada de cada HTML.
- Crear colecciones `ships`, `components`, `enemies` en la consola de Firebase y, si quieres, añadir datos de prueba para que las estadísticas de la portada muestren números reales.
- En páginas como `pages/wiki/ships.html`, usar `db.collection('ships').get()` y pintar una tabla o tarjetas con los datos.

Si quieres, en el siguiente paso podemos definir juntos la estructura de `ships` (campos) y el código para listarlas en `ships.html`.
