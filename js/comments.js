/**
 * GalaxWiki - Sistema de Comentarios Reutilizable
 * Uso: window.GWComments.init({ collection, docId, containerId })
 * - collection: nombre de la colección padre (ej. 'ships', 'enemies', 'missions')
 * - docId: ID del documento (ej. el ID de la nave)
 * - containerId: ID del div donde se renderizará la sección
 */
(function() {
    'use strict';

    const PAGE_SIZE = 20;

    function esc(s) {
        return ('' + (s || '')).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function timeAgo(date) {
        if (!date) return '';
        const now = Date.now();
        const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
        const diff = Math.floor((now - d.getTime()) / 1000);
        if (diff < 60) return 'hace unos segundos';
        if (diff < 3600) return 'hace ' + Math.floor(diff / 60) + ' min';
        if (diff < 86400) return 'hace ' + Math.floor(diff / 3600) + ' h';
        if (diff < 604800) return 'hace ' + Math.floor(diff / 86400) + ' días';
        return d.toLocaleDateString('es');
    }

    function buildUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = `
            <div class="comments-section" style="margin-top: 32px; border-top: 1px solid var(--border-color); padding-top: 24px;">
                <h3 class="page-title" style="font-size: 20px; margin-bottom: 16px;">
                    <i class="fas fa-comments me-2" style="color: var(--accent);"></i>
                    Comentarios <span id="gwc-count" style="font-size: 14px; color: var(--text-tertiary); font-weight: 400;"></span>
                </h3>

                <!-- Formulario nuevo comentario -->
                <div id="gwc-form-wrap" style="display: none; margin-bottom: 20px;">
                    <textarea id="gwc-textarea" placeholder="Escribe tu comentario..." rows="3" style="width: 100%; padding: 12px; border-radius: 12px; border: 1px solid var(--border-color); background: var(--bg-input); color: var(--text-primary); resize: vertical; font-family: inherit; font-size: 14px;"></textarea>
                    <div style="display: flex; gap: 8px; margin-top: 8px; align-items: center;">
                        <button id="gwc-submit" class="btn-header btn-register" style="display: inline-flex; align-items: center; gap: 6px; padding: 8px 16px;">
                            <i class="fas fa-paper-plane"></i> Publicar
                        </button>
                        <p id="gwc-error" style="color: #f87171; margin: 0; font-size: 13px; display: none;"></p>
                    </div>
                </div>
                <div id="gwc-login-msg" style="display: none; margin-bottom: 16px; padding: 12px 16px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; font-size: 14px; color: var(--text-secondary);">
                    <i class="fas fa-lock me-2"></i> <a href="#" style="color: var(--accent);" onclick="event.preventDefault(); window.location.href='../../login.html'">Inicia sesión</a> para dejar un comentario.
                </div>

                <!-- Lista de comentarios -->
                <div id="gwc-list"></div>
                <div id="gwc-loading" style="text-align: center; padding: 16px; color: var(--text-tertiary); font-size: 14px;">
                    <i class="fas fa-spinner fa-spin me-2"></i> Cargando comentarios...
                </div>
                <div id="gwc-empty" style="display: none; padding: 24px; text-align: center; color: var(--text-tertiary); font-size: 14px;">
                    <i class="fas fa-comment-slash me-2"></i> Aún no hay comentarios. ¡Sé el primero!
                </div>
                <button id="gwc-load-more" style="display: none; margin-top: 12px; width: 100%; padding: 10px; background: var(--bg-card); border: 1px solid var(--border-color); border-radius: 10px; color: var(--text-secondary); cursor: pointer; font-size: 14px;">
                    Cargar más comentarios
                </button>
            </div>
        `;
        return container;
    }

    function renderComment(c, currentUid, isAdmin) {
        const d = c.createdAt ? timeAgo(c.createdAt) : '';
        const avatar = esc(c.authorAvatar || '');
        const name = esc(c.authorName || 'Anónimo');
        const fleet = esc(c.authorFleet || '');
        const text = esc(c.content || '').replace(/\n/g, '<br>');
        const canDelete = currentUid && (c.authorId === currentUid || isAdmin);
        return `
            <div class="gwc-comment" data-id="${esc(c.id)}" style="display: flex; gap: 12px; margin-bottom: 16px; padding: 14px; background: var(--bg-card); border-radius: 12px; border: 1px solid var(--border-color); animation: fadeIn 0.3s ease;">
                <div style="flex-shrink: 0; width: 36px; height: 36px; border-radius: 50%; background: var(--bg-input); display: flex; align-items: center; justify-content: center; overflow: hidden;">
                    ${avatar ? `<img src="${avatar}" alt="" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-user\\' style=\\'font-size:14px;color:var(--text-tertiary);\\'></i>'">` : '<i class="fas fa-user" style="font-size:14px;color:var(--text-tertiary);"></i>'}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; flex-wrap: wrap;">
                        <div>
                            <strong style="font-size: 14px; color: var(--text-primary);">${name}</strong>
                            ${fleet ? `<span class="badge badge-type" style="margin-left: 6px; font-size: 11px;">${fleet}</span>` : ''}
                            <span style="font-size: 12px; color: var(--text-tertiary); margin-left: 8px;">${d}</span>
                        </div>
                        ${canDelete ? `<button class="gwc-delete-btn" data-id="${esc(c.id)}" title="Eliminar" style="background: none; border: none; color: #f87171; cursor: pointer; font-size: 13px; padding: 2px 6px; border-radius: 6px; flex-shrink: 0;"><i class="fas fa-trash-alt"></i></button>` : ''}
                        <button class="gwc-report-btn" data-id="${esc(c.id)}" title="Reportar comentario" style="background: none; border: none; color: var(--text-tertiary); cursor: pointer; font-size: 13px; padding: 2px 6px; border-radius: 6px; flex-shrink: 0;"><i class="fas fa-flag"></i></button>
                    </div>
                    <p style="margin: 6px 0 0; font-size: 14px; color: var(--text-secondary); line-height: 1.5; word-break: break-word;">${text}</p>
                </div>
            </div>`;
    }

    async function init(opts) {
        const { collection, docId, containerId } = opts;
        if (!collection || !docId || !containerId) { console.error('GWComments: faltan parámetros'); return; }
        const db = window.db;
        const auth = window.auth;
        if (!db) { console.error('GWComments: Firebase no disponible'); return; }

        const container = buildUI(containerId);
        if (!container) return;

        const colPath = db.collection(collection).doc(docId).collection('comments');
        let lastDoc = null;
        let reachedEnd = false;
        let totalCount = 0;
        let currentUserIsAdmin = false;
        let currentUser = null;
        let initialized = false;

        function el(id) { return document.getElementById(id); }

        function updateAuthUI(user) {
            currentUser = user;
            if (user) {
                el('gwc-form-wrap').style.display = 'block';
                el('gwc-login-msg').style.display = 'none';
            } else {
                el('gwc-form-wrap').style.display = 'none';
                el('gwc-login-msg').style.display = 'block';
            }
        }

        async function loadMore(initial) {
            if (reachedEnd) return;
            if (!initial) el('gwc-load-more').style.display = 'none';

            let q = colPath.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
            if (!initial && lastDoc) q = q.startAfter(lastDoc);

            try {
                const snap = await q.get();
                if (snap.empty && initial) {
                    el('gwc-loading').style.display = 'none';
                    el('gwc-empty').style.display = 'block';
                    return;
                }
                const comments = [];
                snap.forEach(d => comments.push({ id: d.id, ...d.data() }));
                totalCount += comments.length;
                el('gwc-count').textContent = `(${totalCount})`;

                if (snap.docs.length === PAGE_SIZE) {
                    lastDoc = snap.docs[snap.docs.length - 1];
                    el('gwc-load-more').style.display = 'block';
                } else {
                    reachedEnd = true;
                    el('gwc-load-more').style.display = 'none';
                }

                const uid = currentUser ? currentUser.uid : null;
                const html = comments.map(c => renderComment(c, uid, currentUserIsAdmin)).join('');
                if (initial) {
                    el('gwc-list').innerHTML = html;
                } else {
                    el('gwc-list').insertAdjacentHTML('beforeend', html);
                }
                el('gwc-loading').style.display = 'none';
                el('gwc-empty').style.display = 'none';

                // Bind delete buttons
                el('gwc-list').querySelectorAll('.gwc-delete-btn').forEach(btn => {
                    btn.onclick = async function() {
                        if (!confirm('¿Eliminar este comentario?')) return;
                        const cid = this.dataset.id;
                        try {
                            await colPath.doc(cid).delete();
                            this.closest('.gwc-comment').remove();
                            totalCount = Math.max(0, totalCount - 1);
                            el('gwc-count').textContent = `(${totalCount})`;
                        } catch(err) { alert('Error al eliminar: ' + err.message); }
                    };
                });

                // Bind report buttons
                el('gwc-list').querySelectorAll('.gwc-report-btn').forEach(btn => {
                    btn.onclick = async function() {
                        const cid = this.dataset.id;
                        const reason = prompt('¿Por qué estás reportando este comentario?');
                        if (!reason || !reason.trim()) return;
                        
                        try {
                            const btnIcon = this.querySelector('i');
                            if(btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';
                            
                            await db.collection('reports').add({
                                type: 'comment',
                                commentId: cid,
                                docId: docId,
                                collectionName: collection,
                                urlContext: window.location.href,
                                reporterId: currentUser ? currentUser.uid : 'anon',
                                reason: reason.trim(),
                                status: 'pending',
                                createdAt: firebase.firestore.FieldValue.serverTimestamp()
                            });
                            alert('Comentario reportado correctamente. Un moderador lo revisará.');
                            
                            if(btnIcon) {
                                btnIcon.className = 'fas fa-check';
                                this.style.color = '#22c55e';
                                this.disabled = true;
                            }
                        } catch(err) { 
                            alert('Error al reportar: ' + err.message); 
                            const btnIcon = this.querySelector('i');
                            if(btnIcon) btnIcon.className = 'fas fa-flag';
                        }
                    };
                });
            } catch(err) {
                console.error('GWComments load error:', err);
                el('gwc-loading').innerHTML = '<i class="fas fa-exclamation-circle me-2" style="color:#f87171;"></i>Error al cargar comentarios: ' + err.message + '. (Notifica al administrador si este error persiste).';
            }
        }

        async function submitComment() {
            if (!currentUser) return;
            const textarea = el('gwc-textarea');
            const content = (textarea.value || '').trim();
            const errEl = el('gwc-error');
            if (!content) { errEl.textContent = 'Escribe algo antes de publicar.'; errEl.style.display = 'block'; return; }
            errEl.style.display = 'none';
            const btn = el('gwc-submit');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';

            try {
                let authorName = (currentUser.displayName || currentUser.email || 'Anónimo').substring(0, 80);
                let authorAvatar = '';
                let authorFleet = '';
                try {
                    const ud = await db.collection('users').doc(currentUser.uid).get();
                    if (ud.exists) {
                        const u = ud.data();
                        if (u.username) authorName = u.username.substring(0, 80);
                        authorAvatar = u.avatar || '';
                        authorFleet = u.fleet || '';
                    }
                } catch(e) {}

                const ref = await colPath.add({
                    authorId: currentUser.uid,
                    authorName,
                    authorAvatar,
                    authorFleet,
                    content,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                textarea.value = '';
                // Award XP for commenting
                if (typeof gwAwardXp === 'function') gwAwardXp('comment').catch(() => {});

                // Prepend new comment to list
                const newComment = { id: ref.id, authorId: currentUser.uid, authorName, authorAvatar, authorFleet, content, createdAt: { toDate: () => new Date() } };
                totalCount++;
                el('gwc-count').textContent = `(${totalCount})`;
                el('gwc-list').insertAdjacentHTML('afterbegin', renderComment(newComment, currentUser.uid, currentUserIsAdmin));
                el('gwc-empty').style.display = 'none';

                // Bind delete on inserted comment
                const inserted = el('gwc-list').querySelector('.gwc-comment:first-child .gwc-delete-btn');
                if (inserted) {
                    inserted.onclick = async function() {
                        if (!confirm('¿Eliminar este comentario?')) return;
                        try { await colPath.doc(ref.id).delete(); this.closest('.gwc-comment').remove(); totalCount = Math.max(0,totalCount-1); el('gwc-count').textContent=`(${totalCount})`; }
                        catch(e) { alert('Error: ' + e.message); }
                    };
                }
            } catch(err) {
                el('gwc-error').textContent = err.message || 'Error al publicar.';
                el('gwc-error').style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar';
            }
        }

        // Check if admin
        async function checkAdmin(user) {
            if (!user) return false;
            try {
                const ud = await db.collection('users').doc(user.uid).get();
                return ud.exists && ud.data().role === 'admin';
            } catch(e) { return false; }
        }

        // Init auth listener
        if (auth) {
            auth.onAuthStateChanged(async function(user) {
                currentUser = user;
                if (user) currentUserIsAdmin = await checkAdmin(user);
                updateAuthUI(user);
                if (!initialized) { initialized = true; await loadMore(true); }
            });
        } else {
            updateAuthUI(null);
            await loadMore(true);
        }

        // Submit
        el('gwc-submit').addEventListener('click', submitComment);
        el('gwc-textarea').addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'Enter') submitComment();
        });
        el('gwc-load-more').addEventListener('click', () => loadMore(false));
    }

    window.GWComments = { init };
})();
