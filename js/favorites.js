/**
 * Favoritos: añadir/quitar/listar por usuario (Firestore: users/{uid}/favorites)
 * Tipos: ship, component, enemy, paint, planet, system, drone, cortex
 */
(function () {
    'use strict';

    const auth = window.auth;
    const db = window.db;

    if (!db) {
        console.warn('favorites.js: Firestore no disponible');
        return;
    }

    function getFavoritesRef(uid) {
        return db.collection('users').doc(uid).collection('favorites');
    }

    /**
     * Añade un favorito. entityId = id del doc en la colección (ships, components, etc.)
     */
    window.addFavorite = async function (type, entityId, name) {
        if (!auth || !auth.currentUser) return { ok: false, error: 'Debes iniciar sesión' };
        const uid = auth.currentUser.uid;
        const ref = getFavoritesRef(uid);
        const docId = type + '_' + entityId;
        try {
            await ref.doc(docId).set({
                type: type,
                entityId: entityId,
                name: name || '',
                addedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { ok: true };
        } catch (e) {
            console.error('addFavorite error:', e);
            return { ok: false, error: e.message };
        }
    };

    /**
     * Quita un favorito
     */
    window.removeFavorite = async function (type, entityId) {
        if (!auth || !auth.currentUser) return { ok: false, error: 'Debes iniciar sesión' };
        const uid = auth.currentUser.uid;
        const docId = type + '_' + entityId;
        try {
            await getFavoritesRef(uid).doc(docId).delete();
            return { ok: true };
        } catch (e) {
            console.error('removeFavorite error:', e);
            return { ok: false, error: e.message };
        }
    };

    /**
     * Comprueba si un elemento está en favoritos
     */
    window.isFavorite = async function (type, entityId) {
        if (!auth || !auth.currentUser) return false;
        const docId = type + '_' + entityId;
        const snap = await getFavoritesRef(auth.currentUser.uid).doc(docId).get();
        return snap.exists;
    };

    /**
     * Lista todos los favoritos del usuario, opcionalmente por tipo
     */
    window.getFavorites = async function (typeFilter) {
        if (!auth || !auth.currentUser) return [];
        const snap = await getFavoritesRef(auth.currentUser.uid).get();
        const list = [];
        snap.forEach(doc => {
            const d = { id: doc.id, ...doc.data() };
            if (!typeFilter || d.type === typeFilter) list.push(d);
        });
        list.sort((a, b) => (b.addedAt?.toMillis?.() || 0) - (a.addedAt?.toMillis?.() || 0));
        return list;
    };

    /**
     * Toggle favorito: si está, lo quita; si no, lo añade. Retorna { ok, isNowFavorite }
     */
    window.toggleFavorite = async function (type, entityId, name) {
        const isFav = await window.isFavorite(type, entityId);
        if (isFav) {
            const r = await window.removeFavorite(type, entityId);
            return r.ok ? { ok: true, isNowFavorite: false } : r;
        } else {
            const r = await window.addFavorite(type, entityId, name);
            return r.ok ? { ok: true, isNowFavorite: true } : r;
        }
    };
})();
