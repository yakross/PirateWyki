/**
 * ══════════════════════════════════════════════════════
 *  GalaxWiki — Sistema de Marcos de Perfil
 *  profile-frames.js
 * ══════════════════════════════════════════════════════
 *
 *  USO:
 *  1. Agrega tus imágenes de marco en /assets/frames/
 *     Ejemplo: /assets/frames/halloween.png
 *             /assets/frames/navidad.png
 *             /assets/frames/leyenda.png
 *
 *  2. Registra cada marco en GW_FRAMES abajo.
 *
 *  3. Asigna marcos desde el admin (campo profileFrame en users/{uid})
 *     o automáticamente por logro con gwAssignFrame().
 *
 *  El marco se renderiza sobre el avatar en posts del foro y perfil.
 * ══════════════════════════════════════════════════════
 */

// ── Catálogo de marcos disponibles ──────────────────────────
// Agrega aquí cada marco que crees.
// path: ruta relativa desde /pages/ al archivo de imagen
// condition: 'admin' | 'achievement:X' | 'event:X' | 'manual'
// label: nombre visible en el admin panel
const GW_FRAMES = [
    {
        id:        'none',
        label:     'Sin marco',
        path:      '',
        condition: 'manual',
    },
    {
        id:        'leyenda',
        label:     'Marco Leyenda',
        path:      '../assets/frames/leyenda.png',
        condition: 'achievement:leyenda',   // se auto-asigna cuando rank >= Leyenda
    },
    {
        id:        'halloween',
        label:     'Marco Halloween 2025',
        path:      '../assets/frames/halloween.png',
        condition: 'event:halloween2025',   // manual por admin o evento
    },
    {
        id:        'navidad',
        label:     'Marco Navidad 2025',
        path:      '../assets/frames/navidad.png',
        condition: 'event:navidad2025',
    },
    {
        id:        'admin',
        label:     'Marco Administrador',
        path:      '../assets/frames/admin.png',
        condition: 'admin',                 // auto si role === 'admin'
    },
    // ── Agrega más marcos aquí ──────────────────────────────
    // {
    //   id: 'cumpleanos',
    //   label: 'Marco Aniversario',
    //   path:  '../assets/frames/aniversario.png',
    //   condition: 'event:aniversario2026',
    // },
];

// ── Obtener datos de un marco por id ────────────────────────
function gwGetFrame(frameId) {
    return GW_FRAMES.find(f => f.id === frameId) || GW_FRAMES[0];
}

// ── Obtener ruta del marco activo de un usuario ─────────────
// userData: objeto con campos role, xp, profileFrame
function gwResolveFramePath(userData) {
    if (!userData) return '';

    // 1. Marco asignado manualmente / por admin
    const manual = userData.profileFrame || '';
    if (manual && manual !== 'none') {
        const frame = gwGetFrame(manual);
        return frame ? frame.path : '';
    }

    // 2. Auto por rol admin
    if (userData.role === 'admin') {
        const f = GW_FRAMES.find(f => f.condition === 'admin');
        return f ? f.path : '';
    }

    // 3. Auto por rango Leyenda (xp >= 2500)
    const xp = userData.xp || 0;
    if (xp >= 2500 && typeof gwGetRank === 'function') {
        const rank = gwGetRank(xp);
        if (rank.rank.name === 'Leyenda') {
            const f = GW_FRAMES.find(f => f.condition === 'achievement:leyenda');
            return f ? f.path : '';
        }
    }

    return '';
}

// ── Asignar marco manualmente a un usuario (admin) ──────────
// Llama esto desde el admin panel
async function gwAssignFrame(uid, frameId) {
    if (typeof db === 'undefined') { console.error('db no disponible'); return; }
    try {
        await db.collection('users').doc(uid).update({ profileFrame: frameId });
        console.log('[GW Frames] Marco "' + frameId + '" asignado a ' + uid);
        return true;
    } catch(e) {
        console.error('[GW Frames] Error:', e);
        return false;
    }
}

// ── Renderizar avatar con marco ──────────────────────────────
// Uso: gwRenderAvatarWithFrame(containerEl, userData)
// containerEl: elemento DOM donde poner el avatar+marco
function gwRenderAvatarWithFrame(containerEl, userData, size) {
    size = size || 72;
    const avatarUrl = userData.avatar || '';
    const framePath = gwResolveFramePath(userData);

    const avatarHtml = avatarUrl
        ? `<img src="${avatarUrl}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
        : `<i class="fas fa-user" style="font-size:${Math.round(size*0.4)}px;color:#a78bfa;"></i>`;

    const frameHtml = framePath
        ? `<img src="${framePath}" alt="" style="position:absolute;inset:-${Math.round(size*0.06)}px;width:calc(100% + ${Math.round(size*0.12)}px);height:calc(100% + ${Math.round(size*0.12)}px);border-radius:50%;object-fit:cover;pointer-events:none;z-index:2;">`
        : '';

    containerEl.innerHTML =
        `<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;background:linear-gradient(135deg,rgba(102,126,234,0.3),rgba(118,75,162,0.3));border:2px solid rgba(102,126,234,0.4);overflow:visible;display:flex;align-items:center;justify-content:center;">
            <div style="width:100%;height:100%;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;">
                ${avatarHtml}
            </div>
            ${frameHtml}
        </div>`;
}

// ── Selector de marcos para el admin panel ───────────────────
// Devuelve HTML de un <select> con todos los marcos
function gwFrameSelectorHtml(selectedId, selectId) {
    selectId = selectId || 'profileFrameSelect';
    var html = `<select id="${selectId}" class="form-control">`;
    GW_FRAMES.forEach(function(f) {
        html += `<option value="${f.id}" ${f.id === selectedId ? 'selected' : ''}>${f.label}</option>`;
    });
    html += '</select>';
    return html;
}

// Exportar globales
window.gwGetFrame           = gwGetFrame;
window.gwResolveFramePath   = gwResolveFramePath;
window.gwAssignFrame        = gwAssignFrame;
window.gwRenderAvatarWithFrame = gwRenderAvatarWithFrame;
window.gwFrameSelectorHtml  = gwFrameSelectorHtml;
window.GW_FRAMES            = GW_FRAMES;

console.log('[GW Frames] Sistema de marcos cargado —', GW_FRAMES.length - 1, 'marcos disponibles');