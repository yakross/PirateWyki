(function () {
    const db = window.db;
    const params = new URLSearchParams(location.search);
    const compId = params.get('id');
    const container = document.getElementById('componentContent');
    if (!compId || !db) {
        container.innerHTML = '<div class="empty-state">Componente no especificado. <a href="components.html">Volver</a></div>';
        return;
    }

    const CRIONITA = '../../assets/img/png/currencies/Crionita.png';
    const GOLD = '../../assets/img/png/currencies/Gold.png';
    const ENERGY_I = '../../assets/img/png/currencies/energy.png';

    function esc(s) { return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function escA(s) { return (s + '').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }

    function bc(rarity) {
        if (!rarity) return 'badge-type';
        const r = rarity.toLowerCase();
        if (r.includes('azul')) return 'badge-azul';
        if (r.includes('dorado')) return 'badge-dorado';
        if (r.includes('arcano')) return 'badge-arcano';
        if (r.includes('conquista')) return 'badge-conquista';
        if (r.includes('evento')) return 'badge-evento';
        return 'badge-type';
    }

    // Stat box — returns '' if value is 0/null/undefined
    function sbox(icon, val, label, r, g, b) {
        const v = parseFloat(val);
        if (!val && val !== 0) return '';
        if (v === 0) return '';
        return `<div style="background:rgba(${r},${g},${b},.09);border:1px solid rgba(${r},${g},${b},.22);border-radius:12px;padding:12px 14px;display:flex;flex-direction:column;gap:3px;min-width:110px;">
            <div style="font-size:18px;color:rgb(${r},${g},${b});">${icon}</div>
            <div style="font-size:20px;font-weight:700;color:var(--text-primary);">${esc(String(val))}</div>
            <div style="font-size:10px;color:var(--text-tertiary);text-transform:uppercase;letter-spacing:.06em;">${label}</div>
        </div>`;
    }

    function imgIcon(src, size = 18) { return `<img src="${src}" style="width:${size}px;height:${size}px;object-fit:contain;vertical-align:middle;">`; }

    async function load() {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-spinner fa-spin me-2"></i>Cargando componente…</div>';
        try {
            const doc = await db.collection('components').doc(compId).get();
            if (!doc.exists) { container.innerHTML = '<div class="empty-state">No encontrado. <a href="components.html">Volver</a></div>'; return; }
            const c = doc.data();

            // Favorito
            let favStar = 'far';
            if (typeof window.isFavorite === 'function' && window.auth && window.auth.currentUser)
                favStar = await window.isFavorite('component', compId) ? 'fas' : 'far';

            // Icono del tipo según rareza
            let typeIconSrc = '';
            if (c.type) {
                try {
                    const snap = await db.collection('component_types').where('name', '==', c.type).limit(1).get();
                    if (!snap.empty) {
                        const td = snap.docs[0].data();
                        const rl = (c.rarity || '').toLowerCase();
                        if (rl.includes('azul')) typeIconSrc = td.imageBlue || td.imageGold || td.imageArcane || '';
                        else if (rl.includes('dorado')) typeIconSrc = td.imageGold || td.imageBlue || td.imageArcane || '';
                        else if (rl.includes('arcano')) typeIconSrc = td.imageArcane || td.imageBlue || td.imageGold || '';
                        else typeIconSrc = td.imageBlue || td.imageGold || td.imageArcane || '';
                    }
                } catch (e) { }
            }

            // Stats
            const stats = [
                sbox(`${imgIcon(ENERGY_I)} Energía`, c.energy, 'Energía', 251, 191, 36),
                sbox(`<i class="fas fa-clock"></i>`, c.cooldown, 'Cooldown (s)', 96, 165, 250),
                sbox(`<i class="fas fa-hourglass-half"></i>`, c.duration, 'Duración (s)', 167, 139, 250),
                sbox(`<i class="fas fa-heart"></i>`, c.healPerSec, 'Curación/s', 52, 211, 153),
                sbox(`<i class="fas fa-fire"></i>`, c.powerPerSec, 'Potencia/s', 248, 113, 113),
                sbox(`<i class="fas fa-shield-alt"></i>`, c.shieldValue, 'Blindaje', 14, 165, 233),
            ].filter(Boolean);

            // Precio
            const priceParts = [];
            if (c.cost) priceParts.push(`<span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;background:rgba(251,191,36,.12);border:1px solid rgba(251,191,36,.28);color:#fbbf24;font-weight:600;">${imgIcon(CRIONITA, 18)} ${c.cost.toLocaleString()} Crionita</span>`);
            if (c.creditsRaven) priceParts.push(`<span style="display:inline-flex;align-items:center;gap:6px;padding:8px 16px;border-radius:999px;background:rgba(167,139,250,.12);border:1px solid rgba(167,139,250,.28);color:#a78bfa;font-weight:600;"><i class="fas fa-coins"></i> ${c.creditsRaven.toLocaleString()} Raven</span>`);

            // Decrypt
            let decryptHtml = '';
            if (c.requiresDecryption && Array.isArray(c.decryptionRequirements) && c.decryptionRequirements.length) {
                const reqs = c.decryptionRequirements.map(r =>
                    `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:10px;font-size:13px;color:var(--text-secondary);">
                        <i class="fas fa-${r.type === 'ship' ? 'space-shuttle' : 'cog'}" style="color:#f87171;"></i>
                        <span><strong style="color:var(--text-primary);">${esc(r.type || '')}:</strong> ${esc(r.id || '')}${r.quantity > 1 ? ' × ' + r.quantity : ''}</span>
                    </div>`).join('');
                decryptHtml = section('fas fa-lock', '#f87171', 'Requiere Descifrado', `<div style="display:flex;flex-direction:column;gap:8px;">${reqs}</div>`);
            } else if (c.decryptShip) {
                decryptHtml = section('fas fa-lock', '#f87171', 'Requiere Descifrado',
                    `<div style="display:flex;align-items:center;gap:10px;padding:10px 14px;background:rgba(239,68,68,.06);border:1px solid rgba(239,68,68,.15);border-radius:10px;font-size:13px;color:var(--text-secondary);">
                        <i class="fas fa-space-shuttle" style="color:#f87171;"></i><span>Nave: ${esc(c.decryptShip)}</span>
                    </div>`);
            }

            container.innerHTML = `
                <!-- HERO -->
                <div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:20px;padding:28px;margin-bottom:16px;display:flex;gap:24px;align-items:flex-start;flex-wrap:wrap;position:relative;">
                    <button type="button" class="btn-fav" data-type="component" data-id="${compId}" data-name="${escA(c.name || '')}"
                        style="position:absolute;top:16px;right:16px;background:rgba(0,0,0,.4);border:1px solid rgba(255,255,255,.1);border-radius:50%;width:36px;height:36px;display:flex;align-items:center;justify-content:center;color:var(--accent);cursor:pointer;font-size:15px;transition:all .3s;">
                        <i class="${favStar} fa-star"></i>
                    </button>

                    <!-- Imagen principal -->
                    <div style="width:130px;height:130px;background:rgba(0,0,0,.22);border-radius:14px;border:1px solid var(--border-color);display:flex;align-items:center;justify-content:center;padding:12px;flex-shrink:0;">
                        ${c.image
                    ? `<img src="${escA(c.image)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 8px 20px rgba(0,0,0,.55));">`
                    : typeIconSrc
                        ? `<img src="../../${escA(typeIconSrc)}" alt="" style="max-width:100%;max-height:100%;object-fit:contain;filter:drop-shadow(0 8px 20px rgba(0,0,0,.55));">`
                        : `<i class="fas fa-cog" style="font-size:52px;color:rgba(102,126,234,.3);"></i>`}
                    </div>

                    <!-- Info -->
                    <div style="flex:1;min-width:200px;">
                        <!-- Badges -->
                        <div style="display:flex;flex-wrap:wrap;align-items:center;gap:7px;margin-bottom:10px;">
                            ${typeIconSrc && !c.image ? `<img src="../../${escA(typeIconSrc)}" style="width:22px;height:22px;object-fit:contain;" title="${esc(c.rarity || '')}">` : ''}
                            ${c.type ? `<span class="badge badge-type">${esc(c.type)}</span>` : ''}
                            ${c.rarity ? `<span class="badge ${bc(c.rarity)}">${esc(c.rarity)}</span>` : ''}
                            ${c.level != null ? `<span style="display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--text-secondary);background:rgba(100,116,139,.12);border:1px solid rgba(100,116,139,.2);border-radius:999px;padding:3px 10px;"><i class="fas fa-layer-group"></i>Nivel ${c.level}</span>` : ''}
                            ${c.variant ? `<span class="badge badge-faction">${esc(c.variant)}</span>` : ''}
                        </div>
                        <h1 class="page-title" style="margin-bottom:10px;">${esc(c.name || 'Componente')}</h1>
                        ${c.dropLocation ? `<div style="margin-bottom:14px;"><span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;background:rgba(100,116,139,.1);border:1px solid rgba(100,116,139,.2);font-size:13px;color:var(--text-secondary);"><i class="fas fa-map-marker-alt" style="color:var(--accent);"></i>${esc(c.dropLocation)}</span>${c.dropSource && c.dropSource !== c.dropLocation ? `<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 14px;border-radius:10px;background:rgba(100,116,139,.06);border:1px solid rgba(100,116,139,.15);font-size:13px;color:var(--text-tertiary);margin-left:8px;"><i class="fas fa-crosshairs"></i>${esc(c.dropSource)}</span>` : ''}</div>` : ''}
                        <!-- Stat boxes -->
                        ${stats.length ? `<div style="display:flex;flex-wrap:wrap;gap:8px;">${stats.join('')}</div>` : ''}
                    </div>
                </div>

                <!-- Descripción -->
                ${c.description ? section('fas fa-scroll', 'var(--accent)', 'Descripción', `<div style="font-size:14px;color:var(--text-secondary);line-height:1.75;">${typeof formatContentWithImages === 'function' ? formatContentWithImages(c.description) : esc(c.description).replace(/\n/g, '<br>')}</div>`) : ''}

                <!-- Precio -->
                ${priceParts.length ? section('fas fa-shopping-cart', 'var(--accent)', 'Precio', `<div style="display:flex;flex-wrap:wrap;gap:10px;">${priceParts.join('')}</div>`) : ''}

                <!-- Descifrado -->
                ${decryptHtml}
            `;

            // fav button
            const btn = container.querySelector('.btn-fav');
            if (btn) btn.addEventListener('click', async function () {
                if (typeof window.toggleFavorite !== 'function') return;
                const r = await window.toggleFavorite('component', compId, c.name || '');
                const icon = this.querySelector('i');
                if (r && r.ok !== false && icon) icon.className = r.isNowFavorite ? 'fas fa-star' : 'far fa-star';
            });
        } catch (e) {
            console.error(e);
            container.innerHTML = '<div class="empty-state">Error al cargar. <a href="components.html">Volver</a></div>';
        }
    }

    function section(iconCls, iconColor, title, body) {
        return `<div style="background:var(--bg-card);border:1px solid var(--border-color);border-radius:16px;padding:20px 24px;margin-bottom:14px;">
            <div style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:${iconColor};margin-bottom:12px;display:flex;align-items:center;gap:8px;"><i class="${iconCls}"></i>${title}</div>
            ${body}
        </div>`;
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
    else load();
})();