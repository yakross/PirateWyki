(function() {
    const db = window.db;
    const params = new URLSearchParams(location.search);
    const compId = params.get('id');
    const container = document.getElementById('componentContent');
    if (!compId || !db) {
        container.innerHTML = '<div class="empty-state">Componente no especificado. <a href="components.html">Volver</a></div>';
        return;
    }
    async function load() {
        container.innerHTML = '<div class="empty-state">Cargando...</div>';
        try {
            const doc = await db.collection('components').doc(compId).get();
            if (!doc.exists) {
                container.innerHTML = '<div class="empty-state">Componente no encontrado. <a href="components.html">Volver</a></div>';
                return;
            }
            const c = doc.data();
            const auth = window.auth;
            let favStar = 'far';
            if (typeof window.isFavorite === 'function' && auth && auth.currentUser)
                favStar = await window.isFavorite('component', compId) ? 'fas' : 'far';

            // Fetch type icon based on rarity
            let typeIconsHtml = '';
            if (c.type && c.rarity) {
                try {
                    const rarityLower = c.rarity.toLowerCase();
                    const typeSnap = await db.collection('component_types').where('name', '==', c.type).limit(1).get();
                    if (!typeSnap.empty) {
                        const typeData = typeSnap.docs[0].data();
                        let iconPath = '';
                        let title = '';
                        if (rarityLower.includes('azul')) { iconPath = typeData.imageBlue; title = 'Azul'; }
                        else if (rarityLower.includes('dorado')) { iconPath = typeData.imageGold; title = 'Dorado'; }
                        else if (rarityLower.includes('arcano')) { iconPath = typeData.imageArcane; title = 'Arcano'; }
                        
                        if (iconPath) {
                            typeIconsHtml = `<div style="display:inline-flex; margin-right:8px; vertical-align:middle;"><img src="../../${iconPath}" style="width:22px;height:22px;object-fit:contain;" title="${title}"></div>`;
                        }
                    }
                } catch(e) { console.warn("Error fetching type icons:", e); }
            }

            const meta = [];
            if (c.type) meta.push('<div style="display:inline-flex; align-items:center;">' + typeIconsHtml + '<span class="badge badge-type">' + escapeHtml(c.type) + '</span></div>');
            if (c.rarity) meta.push('<span class="badge badge-type">' + escapeHtml(c.rarity) + '</span>');
            if (c.level != null) meta.push('Nivel ' + c.level);
            if (c.dropLocation) meta.push('<i class="fas fa-map-marker-alt me-1"></i>' + escapeHtml(c.dropLocation));
            if (c.dropRate != null) meta.push(c.dropRate + '% drop');
            if (c.energy != null) meta.push('Energía: ' + c.energy);
            if (c.cooldown != null) meta.push('Enfriamiento: ' + c.cooldown + 's');
            if (c.duration != null) meta.push('Duración: ' + c.duration + 's');
            container.innerHTML = '<div class="profile-card" style="text-align: left; position: relative;">' +
                '<button type="button" class="btn-fav" data-type="component" data-id="' + compId + '" data-name="' + escapeAttr(c.name || '') + '" title="Añadir a favoritos" style="position:absolute;top:16px;right:16px;background:var(--bg-card);border:1px solid var(--border-color);border-radius:8px;color:var(--accent);cursor:pointer;padding:8px 12px;"><i class="' + favStar + ' fa-star"></i></button>' +
                (c.image ? '<img src="' + escapeAttr(c.image) + '" alt="" style="width:100%;max-height:220px;object-fit:contain;border-radius:12px;margin-bottom:16px;">' : '') +
                '<h1 class="page-title">' + escapeHtml(c.name || 'Componente') + '</h1>' +
                '<p class="profile-meta">' + meta.join(' · ') + '</p>' +
                (c.dropLocation ? '<p class="profile-meta"><strong>Dónde dropea:</strong> ' + escapeHtml(c.dropLocation) + '</p>' : '') +
                (c.description ? '<div class="item-description" style="margin-top:16px;">' + (typeof formatContentWithImages === 'function' ? formatContentWithImages(c.description) : escapeHtml(c.description).replace(/\n/g, '<br>')) + '</div>' : '') +
                '</div>';
            var btn = container.querySelector('.btn-fav');
            if (btn) btn.addEventListener('click', async function() {
                if (typeof window.toggleFavorite !== 'function') return;
                var r = await window.toggleFavorite('component', compId, c.name || '');
                var icon = this.querySelector('i');
                if (r && r.ok && icon) icon.className = r.isNowFavorite ? 'fas fa-star' : 'far fa-star';
            });
        } catch (e) {
            console.error(e);
            container.innerHTML = '<div class="empty-state">Error al cargar. <a href="components.html">Volver</a></div>';
        }
    }
    function escapeHtml(s) { return (s + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
    function escapeAttr(s) { return (s + '').replace(/"/g, '&quot;').replace(/'/g, '&#39;'); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', load);
    else load();
})();
