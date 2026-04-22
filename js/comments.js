/**
 * GalaxWiki - Sistema de Comentarios (estilo Foro)
 * Uso: window.GWComments.init({ collection, docId, containerId })
 * - collection : colección padre en Firestore (ej. 'planets', 'news')
 * - docId      : ID del documento padre
 * - containerId: ID del div donde se renderizará la sección
 */
(function () {
    'use strict';

    const PAGE_SIZE     = 20;
    const REACTION_EMOJIS = ['👍','❤️','😂','😮','😢','🔥','⭐','💀'];

    /* ── Utilidades ──────────────────────────────────────────────── */
    function esc(s) {
        return ('' + (s || ''))
            .replace(/&/g,'&amp;').replace(/</g,'&lt;')
            .replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    }

    function timeAgo(date) {
        if (!date) return '';
        const d    = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
        const diff = Math.floor((Date.now() - d.getTime()) / 1000);
        if (diff < 60)     return 'hace unos segundos';
        if (diff < 3600)   return 'hace ' + Math.floor(diff / 60)   + ' min';
        if (diff < 86400)  return 'hace ' + Math.floor(diff / 3600) + ' h';
        if (diff < 604800) return 'hace ' + Math.floor(diff / 86400)+ ' días';
        return d.toLocaleDateString('es');
    }

    function formatDate(date) {
        if (!date) return '—';
        const d = date instanceof Date ? date : (date.toDate ? date.toDate() : new Date(date));
        return d.toLocaleDateString('es', { year:'numeric', month:'short', day:'numeric' });
    }

    function getRankLabel(xp) {
        if (typeof gwGetRank === 'function') return gwGetRank(xp).rank.name;
        if (!xp || xp < 100)  return 'Novato';
        if (xp < 500)         return 'Explorador';
        if (xp < 1500)        return 'Corsario';
        if (xp < 5000)        return 'Capitán';
        return 'Almirante';
    }

    /* ── CSS inyectado una sola vez ───────────────────────────────── */
    function injectStyles() {
        if (document.getElementById('gwc-forum-styles')) return;
        const s = document.createElement('style');
        s.id = 'gwc-forum-styles';
        s.textContent = `
        /* ══ Wrapper general ══════════════════════════════ */
        .gwc-section { margin-top: 36px; padding-top: 28px; border-top: 1px solid var(--border-color); }
        .gwc-section-title {
            font-size: 18px; font-weight: 800; color: var(--text-primary);
            margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
        }
        .gwc-section-title i { color: var(--accent); }
        .gwc-count-badge {
            font-size: 12px; font-weight: 600; color: var(--text-tertiary);
            background: var(--bg-input); border: 1px solid var(--border-color);
            border-radius: 99px; padding: 2px 10px;
        }

        /* ══ Post-card (igual al foro) ════════════════════ */
        .gwc-post-card {
            display: grid;
            grid-template-columns: 150px 1fr;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            border-radius: 16px;
            margin-bottom: 14px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: border-color 0.2s;
            animation: gwcFadeIn 0.3s ease;
        }
        .gwc-post-card:hover { border-color: rgba(102,126,234,0.25); }
        @media(max-width: 680px) {
            .gwc-post-card { grid-template-columns: 1fr; }
        }
        @keyframes gwcFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Sidebar del autor ──────────────────────────── */
        .gwc-author-sidebar {
            background: rgba(102,126,234,0.05);
            border-right: 1px solid var(--border-color);
            padding: 18px 14px;
            display: flex; flex-direction: column;
            align-items: center; text-align: center;
            gap: 5px; min-width: 0;
        }
        @media(max-width: 680px) {
            .gwc-author-sidebar {
                border-right: none;
                border-bottom: 1px solid var(--border-color);
                flex-direction: row; text-align: left;
                padding: 12px 16px; gap: 12px;
            }
        }
        .gwc-avatar-wrap { position: relative; width: 64px; height: 64px; flex-shrink: 0; }
        .gwc-avatar {
            width: 64px; height: 64px; border-radius: 50%;
            background: linear-gradient(135deg, rgba(102,126,234,0.3), rgba(118,75,162,0.3));
            border: 2px solid rgba(102,126,234,0.4);
            overflow: hidden;
            display: flex; align-items: center; justify-content: center;
            color: #a78bfa; font-size: 24px;
        }
        .gwc-avatar img { width: 100%; height: 100%; object-fit: cover; }
        .gwc-avatar-frame {
            position: absolute; inset: -4px; border-radius: 50%;
            pointer-events: none; z-index: 2;
        }
        .gwc-avatar-frame img {
            position: absolute; inset: -4px;
            width: calc(100% + 8px); height: calc(100% + 8px);
            border-radius: 50%; object-fit: cover; pointer-events: none;
        }
        .gwc-author-name {
            font-weight: 700; font-size: 13px; color: var(--text-primary);
            word-break: break-word; line-height: 1.3;
        }
        .gwc-author-name a { color: inherit; text-decoration: none; }
        .gwc-author-name a:hover { color: var(--accent); }
        .gwc-author-rank { font-size: 11px; color: var(--accent); font-weight: 600; }
        .gwc-badge-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 4px; margin-top: 2px; }
        .gwc-badge {
            font-size: 10px; padding: 2px 7px; border-radius: 999px;
            font-weight: 700; letter-spacing: 0.3px;
        }
        .gwc-badge-admin { background: rgba(239,68,68,0.15); color: #f87171; }
        .gwc-badge-member { background: rgba(102,126,234,0.12); color: #a78bfa; }
        .gwc-author-stats {
            width: 100%; margin-top: 6px;
            padding-top: 8px; border-top: 1px solid var(--border-color);
        }
        .gwc-author-stat {
            display: flex; justify-content: space-between;
            font-size: 10px; color: var(--text-tertiary);
            padding: 2px 0; gap: 4px;
        }
        .gwc-author-stat span:last-child { color: var(--text-secondary); font-weight: 600; text-align: right; }

        /* ── Cuerpo del comentario ──────────────────────── */
        .gwc-post-body { padding: 16px 20px; display: flex; flex-direction: column; min-width: 0; }
        .gwc-post-meta {
            display: flex; justify-content: space-between;
            align-items: center; margin-bottom: 12px;
            padding-bottom: 10px; border-bottom: 1px solid var(--border-color);
            flex-wrap: wrap; gap: 8px;
        }
        .gwc-post-date { font-size: 12px; color: var(--text-tertiary); }
        .gwc-post-actions { display: flex; gap: 6px; align-items: center; }
        .gwc-btn-action {
            background: none; border: 1px solid var(--border-color);
            color: var(--text-tertiary); font-size: 12px;
            padding: 3px 9px; border-radius: 8px; cursor: pointer;
            transition: all 0.15s;
            display: inline-flex; align-items: center; gap: 4px;
        }
        .gwc-btn-action:hover { background: rgba(102,126,234,0.08); color: var(--accent); border-color: rgba(102,126,234,0.3); }
        .gwc-btn-action.danger:hover { background: rgba(239,68,68,0.08); color: #f87171; border-color: rgba(239,68,68,0.3); }
        .gwc-post-content {
            color: var(--text-secondary); font-size: 14px;
            line-height: 1.75; word-break: break-word; flex: 1;
        }
        .gwc-post-content img { max-width: 100%; height: auto; border-radius: 10px; margin: 8px 0; display: block; }
        .gwc-post-content a { color: var(--accent); }
        .gwc-post-content blockquote {
            border-left: 3px solid var(--accent); margin: 10px 0;
            padding: 8px 14px; background: rgba(102,126,234,0.07);
            border-radius: 0 8px 8px 0; color: var(--text-tertiary); font-style: italic;
        }
        .gwc-post-content ul, .gwc-post-content ol { padding-left: 20px; }
        .gwc-post-content strong { color: var(--text-primary); }
        .gwc-post-content code {
            background: rgba(0,0,0,0.3); border-radius: 4px;
            padding: 1px 5px; font-size: 12px; font-family: monospace;
        }

        /* ── Quill dentro del comentario ya guardado ────── */
        .gwc-post-content.ql-editor { padding: 0 !important; min-height: auto !important; background: transparent !important; }

        /* ── Reacciones ─────────────────────────────────── */
        .gwc-reactions {
            display: flex; flex-wrap: wrap; gap: 6px;
            margin-top: 12px; padding-top: 10px;
            border-top: 1px solid var(--border-color);
        }
        .gwc-reaction-btn {
            background: var(--bg-input); border: 1px solid var(--border-color);
            border-radius: 20px; padding: 3px 10px; font-size: 13px; cursor: pointer;
            transition: all 0.15s; color: var(--text-secondary);
            display: inline-flex; align-items: center; gap: 4px;
        }
        .gwc-reaction-btn:hover { background: rgba(102,126,234,0.1); border-color: rgba(102,126,234,0.3); }
        .gwc-reaction-btn.active { background: rgba(102,126,234,0.15); border-color: rgba(102,126,234,0.5); color: #a78bfa; }
        .gwc-emoji-add-btn {
            background: none; border: 1px dashed var(--border-color);
            border-radius: 20px; padding: 3px 10px; font-size: 12px;
            cursor: pointer; color: var(--text-tertiary);
            transition: all 0.15s; position: relative;
        }
        .gwc-emoji-add-btn:hover { border-color: var(--accent); color: var(--accent); }
        .gwc-emoji-picker {
            position: absolute; bottom: 36px; left: 0;
            background: var(--bg-card); border: 1px solid var(--border-color);
            border-radius: 12px; padding: 8px;
            display: flex; flex-wrap: wrap; gap: 4px;
            width: 220px; z-index: 300;
            box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }
        .gwc-emoji-picker button {
            background: none; border: none; font-size: 18px; cursor: pointer;
            width: 32px; height: 32px; border-radius: 6px; transition: background 0.1s;
        }
        .gwc-emoji-picker button:hover { background: rgba(102,126,234,0.15); }

        /* ── Quote preview ──────────────────────────────── */
        .gwc-quote-preview {
            background: rgba(102,126,234,0.07);
            border-left: 3px solid var(--accent);
            border-radius: 0 8px 8px 0;
            padding: 10px 14px; margin-bottom: 10px;
            font-size: 13px; color: var(--text-tertiary);
            display: none; position: relative;
        }
        .gwc-quote-preview.visible { display: block; }
        .gwc-quote-author { font-weight: 700; color: var(--text-primary); font-size: 12px; margin-bottom: 4px; }
        .gwc-quote-text { font-style: italic; }
        .gwc-quote-close {
            position: absolute; top: 6px; right: 8px;
            background: none; border: none; color: var(--text-tertiary);
            cursor: pointer; font-size: 13px; padding: 2px 5px;
        }
        .gwc-quote-close:hover { color: var(--accent); }

        /* ── Formulario de escritura ────────────────────── */
        .gwc-form-card {
            background: var(--bg-card); border: 1px solid var(--border-color);
            border-radius: 16px; padding: 22px; margin-bottom: 24px;
        }
        .gwc-form-title {
            font-size: 15px; font-weight: 700; color: var(--text-primary);
            margin-bottom: 14px; display: flex; align-items: center; gap: 8px;
        }

        /* ── Quill toolbar overrides ────────────────────── */
        .gwc-form-card .ql-toolbar.ql-snow {
            background: var(--bg-input) !important;
            border: 1px solid var(--border-color) !important;
            border-radius: 10px 10px 0 0 !important; padding: 6px 8px !important;
        }
        .gwc-form-card .ql-container.ql-snow {
            border: 1px solid var(--border-color) !important;
            border-top: none !important;
            border-radius: 0 0 10px 10px !important;
            background: var(--bg-input) !important; min-height: 120px;
        }
        .gwc-form-card .ql-editor {
            color: var(--text-primary) !important; font-size: 14px !important;
            line-height: 1.7 !important; min-height: 120px;
        }
        .gwc-form-card .ql-editor.ql-blank::before { color: var(--text-tertiary) !important; font-style: normal !important; }
        .gwc-form-card .ql-snow .ql-stroke { stroke: var(--text-secondary) !important; }
        .gwc-form-card .ql-snow .ql-fill { fill: var(--text-secondary) !important; }
        .gwc-form-card .ql-snow button:hover .ql-stroke { stroke: var(--accent) !important; }
        .gwc-form-card .ql-snow button:hover .ql-fill { fill: var(--accent) !important; }
        .gwc-form-card .ql-snow button.ql-active .ql-stroke { stroke: var(--accent) !important; stroke-width: 2.5px !important; }
        .gwc-form-card .ql-snow button.ql-active .ql-fill { fill: var(--accent) !important; }
        .gwc-form-card .ql-snow .ql-picker { color: var(--text-secondary) !important; }
        .gwc-form-card .ql-snow .ql-picker-options { background: var(--bg-card) !important; border-color: var(--border-color) !important; }
        .gwc-form-card .ql-snow .ql-picker-item { color: var(--text-secondary) !important; }
        .gwc-form-card .ql-snow .ql-picker-label:hover .ql-stroke { stroke: var(--accent) !important; }

        /* ── Adjuntar imagen ────────────────────────────── */
        .gwc-attach-btn {
            display: inline-flex; align-items: center; gap: 6px;
            background: rgba(102,126,234,0.1); border: 1px solid rgba(102,126,234,0.3);
            color: #a78bfa; border-radius: 8px; padding: 6px 14px;
            font-size: 13px; cursor: pointer; transition: all 0.2s; margin-top: 10px;
        }
        .gwc-attach-btn:hover { background: rgba(102,126,234,0.2); }
        .gwc-previews { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 10px; }
        .gwc-thumb {
            position: relative; width: 80px; height: 80px;
            border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color);
        }
        .gwc-thumb img { width: 100%; height: 100%; object-fit: cover; }
        .gwc-thumb-remove {
            position: absolute; top: 2px; right: 2px;
            background: rgba(0,0,0,0.6); border: none; color: #fff;
            font-size: 10px; width: 18px; height: 18px; border-radius: 50%;
            cursor: pointer; display: flex; align-items: center; justify-content: center;
        }

        /* ── Botón publicar ─────────────────────────────── */
        .gwc-btn-submit {
            display: inline-flex; align-items: center; gap: 8px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white; border: none; padding: 11px 24px;
            border-radius: 12px; font-weight: 600; font-size: 14px;
            cursor: pointer; transition: all 0.2s; margin-top: 14px;
        }
        .gwc-btn-submit:hover { opacity: 0.9; transform: translateY(-1px); }
        .gwc-btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* ── Login notice ───────────────────────────────── */
        .gwc-login-notice {
            padding: 14px 18px; background: var(--bg-card);
            border: 1px solid var(--border-color); border-radius: 12px;
            font-size: 14px; color: var(--text-secondary); margin-bottom: 20px;
        }
        .gwc-login-notice a { color: var(--accent); }

        /* ── Load more ──────────────────────────────────── */
        .gwc-load-more {
            width: 100%; padding: 10px; background: var(--bg-card);
            border: 1px solid var(--border-color); border-radius: 10px;
            color: var(--text-secondary); cursor: pointer; font-size: 14px;
            margin-top: 8px; transition: all 0.15s;
        }
        .gwc-load-more:hover { border-color: var(--accent); color: var(--accent); }

        /* ── Empty / loading ────────────────────────────── */
        .gwc-empty { padding: 28px; text-align: center; color: var(--text-tertiary); font-size: 14px; }
        .gwc-loading { text-align: center; padding: 16px; color: var(--text-tertiary); font-size: 14px; }
        `;
        document.head.appendChild(s);
    }

    /* ── HTML base de la sección ────────────────────────────────── */
    function buildUI(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return null;
        container.innerHTML = `
            <div class="gwc-section">
                <div class="gwc-section-title">
                    <i class="fas fa-comments"></i>
                    Comentarios
                    <span class="gwc-count-badge" id="gwc-count"></span>
                </div>

                <!-- Login notice -->
                <div id="gwc-login-notice" class="gwc-login-notice" style="display:none;">
                    <i class="fas fa-lock me-2"></i>
                    <a href="#" onclick="event.preventDefault(); window.location.href=(window.location.pathname.includes('/pages/')?'../../login.html':'login.html')">Inicia sesión</a>
                    para dejar un comentario.
                </div>

                <!-- Formulario -->
                <div id="gwc-form-wrap" style="display:none;">
                    <div class="gwc-form-card">
                        <div class="gwc-form-title"><i class="fas fa-pen"></i> Escribe un comentario</div>

                        <!-- Quote preview -->
                        <div class="gwc-quote-preview" id="gwc-quote-preview">
                            <div class="gwc-quote-author" id="gwc-quote-author"></div>
                            <div class="gwc-quote-text" id="gwc-quote-text"></div>
                            <button class="gwc-quote-close" id="gwc-quote-close"><i class="fas fa-times"></i></button>
                        </div>

                        <!-- Editor -->
                        <div id="gwc-editor"></div>

                        <!-- Adjuntar imágenes -->
                        <div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;">
                            <label class="gwc-attach-btn" title="Adjuntar imagen">
                                <i class="fas fa-image"></i> Adjuntar imagen
                                <input type="file" id="gwc-file-input" accept="image/png,image/jpeg,image/gif,image/webp" multiple style="display:none;">
                            </label>
                            <span style="font-size:12px;color:var(--text-tertiary);">PNG, JPG, GIF — máx 2 MB</span>
                        </div>
                        <div class="gwc-previews" id="gwc-previews"></div>

                        <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
                            <button class="gwc-btn-submit" id="gwc-submit">
                                <i class="fas fa-paper-plane"></i> Publicar comentario
                            </button>
                            <span id="gwc-error" style="color:#f87171;font-size:13px;display:none;"></span>
                        </div>
                    </div>
                </div>

                <!-- Lista de comentarios -->
                <div id="gwc-list"></div>
                <div id="gwc-loading" class="gwc-loading"><i class="fas fa-spinner fa-spin me-2"></i>Cargando...</div>
                <div id="gwc-empty" class="gwc-empty" style="display:none;"><i class="fas fa-comment-slash me-2"></i>Aún no hay comentarios. ¡Sé el primero!</div>
                <button id="gwc-load-more" class="gwc-load-more" style="display:none;">Cargar más comentarios</button>
            </div>
        `;
        injectStyles();
        return container;
    }

    /* ── Sidebar del autor ──────────────────────────────────────── */
    function renderAuthorSidebar(c) {
        const avatar = esc(c.authorAvatar || '');
        const name   = esc(c.authorName  || 'Anónimo');
        const fleet  = esc(c.authorFleet || '');
        const role   = c.authorRole || '';
        const xp     = c.authorXp   || 0;
        const rank   = esc(c.authorRank || getRankLabel(xp));
        const frame  = esc(c.authorFrame || '');
        const joined = c.authorJoined ? formatDate(c.authorJoined) : null;
        const msgs   = c.authorMsgCount != null ? c.authorMsgCount : null;
        const level  = c.authorLevel   != null ? c.authorLevel    : null;
        const server = esc(c.authorServer || '');

        const avatarHtml = avatar
            ? `<img src="${avatar}" alt="" loading="lazy" onerror="this.parentElement.innerHTML='<i class=\\'fas fa-user\\'></i>'">`
            : `<i class="fas fa-user"></i>`;

        const frameHtml = frame
            ? `<div class="gwc-avatar-frame"><img src="${frame}" alt=""></div>` : '';

        const statsRows = [
            joined ? `<div class="gwc-author-stat"><span>Unido:</span><span>${joined}</span></div>` : '',
            msgs != null ? `<div class="gwc-author-stat"><span>Comentarios:</span><span>${msgs}</span></div>` : '',
            level != null ? `<div class="gwc-author-stat"><span>Nivel:</span><span>${level}</span></div>` : '',
            server ? `<div class="gwc-author-stat"><span>Servidor:</span><span>${server}</span></div>` : '',
            fleet  ? `<div class="gwc-author-stat"><span>Flota:</span><span>${fleet}</span></div>` : '',
        ].filter(Boolean).join('');

        return `
        <div class="gwc-author-sidebar">
            <div class="gwc-avatar-wrap">
                <div class="gwc-avatar">${avatarHtml}</div>
                ${frameHtml}
            </div>
            <div class="gwc-author-name">
                <a href="${getProfileUrl(c.authorId)}">${name}</a>
            </div>
            <div class="gwc-author-rank">${rank}</div>
            <div class="gwc-badge-row">
                ${role === 'admin' ? '<span class="gwc-badge gwc-badge-admin">Admin</span>' : ''}
                <span class="gwc-badge gwc-badge-member">${rank}</span>
            </div>
            ${statsRows ? `<div class="gwc-author-stats">${statsRows}</div>` : ''}
        </div>`;
    }

    function getProfileUrl(uid) {
        if (!uid) return '#';
        // Detecta si estamos dentro de /pages/wiki/ o /pages/ etc.
        const depth = (window.location.pathname.match(/\//g) || []).length;
        if (depth >= 4) return `../../pages/profile.html?uid=${esc(uid)}`;
        if (depth >= 3) return `../profile.html?uid=${esc(uid)}`;
        return `pages/profile.html?uid=${esc(uid)}`;
    }

    /* ── Reacciones ─────────────────────────────────────────────── */
    function renderReactions(reactions, commentId) {
        const entries = Object.entries(reactions || {}).filter(([, v]) => v > 0);
        let html = `<div class="gwc-reactions" id="gwc-react-${esc(commentId)}">`;
        entries.forEach(([emoji, count]) => {
            html += `<button class="gwc-reaction-btn" data-cid="${esc(commentId)}" data-emoji="${esc(emoji)}">${emoji} <span>${count}</span></button>`;
        });
        html += `<div style="position:relative;display:inline-block;">
            <button class="gwc-emoji-add-btn" data-cid="${esc(commentId)}"><i class="fas fa-smile-plus"></i></button>
        </div></div>`;
        return html;
    }

    /* ── Renderizar un comentario completo ─────────────────────── */
    function renderComment(c, currentUid, isAdmin) {
        const date     = c.createdAt ? timeAgo(c.createdAt) : '';
        const fullDate = c.createdAt ? formatDate(c.createdAt) : '';
        const content  = c.contentHtml || c.content || '';
        const canDelete = currentUid && (c.authorId === currentUid || isAdmin);

        let imagesHtml = '';
        if (c.attachedImages && c.attachedImages.length > 0) {
            imagesHtml = c.attachedImages.map(src =>
                `<img src="${esc(src)}" alt="" loading="lazy">`
            ).join('');
        }

        // Quote block
        let quoteHtml = '';
        if (c.quoteAuthor && c.quoteText) {
            quoteHtml = `<blockquote style="margin:0 0 10px;border-left:3px solid var(--accent);padding:6px 12px;background:rgba(102,126,234,0.07);border-radius:0 6px 6px 0;font-style:italic;color:var(--text-tertiary);">
                <strong style="font-size:11px;display:block;margin-bottom:2px;">${esc(c.quoteAuthor)} escribió:</strong>
                ${esc(c.quoteText)}
            </blockquote>`;
        }

        return `
        <div class="gwc-post-card" id="gwc-comment-${esc(c.id)}" data-id="${esc(c.id)}">
            ${renderAuthorSidebar(c)}
            <div class="gwc-post-body">
                <div class="gwc-post-meta">
                    <span class="gwc-post-date" title="${fullDate}"><i class="fas fa-clock me-1"></i>${date}</span>
                    <div class="gwc-post-actions">
                        <button class="gwc-btn-action gwc-quote-btn" data-id="${esc(c.id)}" data-name="${esc(c.authorName||'Anónimo')}">
                            <i class="fas fa-quote-right"></i> Citar
                        </button>
                        ${canDelete ? `<button class="gwc-btn-action danger gwc-delete-btn" data-id="${esc(c.id)}">
                            <i class="fas fa-trash-alt"></i> Eliminar
                        </button>` : ''}
                        <button class="gwc-btn-action gwc-report-btn" data-id="${esc(c.id)}" title="Reportar">
                            <i class="fas fa-flag"></i>
                        </button>
                    </div>
                </div>
                <div class="gwc-post-content ql-editor" style="padding:0;">
                    ${quoteHtml}
                    ${content}
                    ${imagesHtml}
                </div>
                ${renderReactions(c.reactions || {}, c.id)}
            </div>
        </div>`;
    }

    /* ── Init ────────────────────────────────────────────────────── */
    async function init(opts) {
        const { collection, docId, containerId } = opts;
        if (!collection || !docId || !containerId) { console.error('GWComments: faltan parámetros'); return; }
        const db   = window.db;
        const auth = window.auth;
        if (!db) { console.error('GWComments: Firebase no disponible'); return; }

        buildUI(containerId);

        const el = id => document.getElementById(id);

        const colPath = db.collection(collection).doc(docId).collection('comments');
        let quill          = null;
        let attachedImages = [];
        let quoteData      = null;
        let lastDoc        = null;
        let reachedEnd     = false;
        let totalCount     = 0;
        let currentUser    = null;
        let isAdmin        = false;
        let initialized    = false;

        /* ── Quill ────────────────────────────────── */
        if (typeof Quill !== 'undefined') {
            quill = new Quill('#gwc-editor', {
                theme: 'snow',
                placeholder: 'Escribe tu comentario...',
                modules: {
                    toolbar: [
                        [{ header: [2, 3, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ color: [] }],
                        ['link', 'blockquote', 'code-block'],
                        [{ list: 'ordered' }, { list: 'bullet' }],
                        ['clean']
                    ]
                }
            });
        } else {
            el('gwc-editor').innerHTML = `<textarea id="gwc-fallback-ta" style="width:100%;height:120px;padding:12px;background:transparent;border:none;color:inherit;font-family:inherit;outline:none;resize:vertical;"></textarea>`;
        }

        /* ── Adjuntar imágenes ────────────────────── */
        function renderPreviews() {
            const p = el('gwc-previews');
            if (!p) return;
            p.innerHTML = attachedImages.map((src, i) => `
                <div class="gwc-thumb">
                    <img src="${src}" alt="">
                    <button class="gwc-thumb-remove" data-i="${i}"><i class="fas fa-times"></i></button>
                </div>`).join('');
            p.querySelectorAll('.gwc-thumb-remove').forEach(btn => {
                btn.onclick = () => { attachedImages.splice(+btn.dataset.i, 1); renderPreviews(); };
            });
        }

        const fileInput = el('gwc-file-input');
        if (fileInput) fileInput.onchange = e => {
            Array.from(e.target.files).forEach(f => {
                if (f.size > 2 * 1024 * 1024) { alert(`"${f.name}" supera 2 MB.`); return; }
                const r = new FileReader();
                r.onload = ev => { attachedImages.push(ev.target.result); renderPreviews(); };
                r.readAsDataURL(f);
            });
            e.target.value = '';
        };

        /* ── Quote ────────────────────────────────── */
        function setQuote(authorName, text) {
            quoteData = { authorName, text };
            const p = el('gwc-quote-preview');
            if (p) {
                el('gwc-quote-author').textContent = authorName + ' escribió:';
                el('gwc-quote-text').textContent   = text.substring(0, 200) + (text.length > 200 ? '…' : '');
                p.classList.add('visible');
            }
        }
        function clearQuote() {
            quoteData = null;
            const p = el('gwc-quote-preview');
            if (p) p.classList.remove('visible');
        }
        const qc = el('gwc-quote-close');
        if (qc) qc.onclick = clearQuote;

        /* ── Auth UI ──────────────────────────────── */
        function updateAuthUI(user) {
            currentUser = user;
            el('gwc-form-wrap').style.display    = user ? 'block' : 'none';
            el('gwc-login-notice').style.display = user ? 'none'  : 'block';
        }

        /* ── Conteo real ──────────────────────────── */
        async function refreshCount() {
            try {
                const snap = await colPath.get();
                totalCount = snap.size;
                const c = el('gwc-count');
                if (c) c.textContent = totalCount > 0 ? totalCount : '';
            } catch (_) {}
        }

        /* ── Reacciones ───────────────────────────── */
        async function toggleReaction(commentId, emoji) {
            if (!currentUser) return;
            const docRef  = colPath.doc(commentId);
            const reactRef = docRef.collection('comment_reactions').doc(currentUser.uid);
            try {
                const [userReact, docSnap] = await Promise.all([reactRef.get(), docRef.get()]);
                const prevEmoji  = userReact.exists ? userReact.data().emoji : null;
                const reactions  = Object.assign({}, (docSnap.data() || {}).reactions || {});
                if (prevEmoji === emoji) {
                    reactions[emoji] = Math.max(0, (reactions[emoji] || 0) - 1);
                    await reactRef.delete();
                } else {
                    if (prevEmoji) reactions[prevEmoji] = Math.max(0, (reactions[prevEmoji] || 0) - 1);
                    reactions[emoji] = (reactions[emoji] || 0) + 1;
                    await reactRef.set({ emoji });
                }
                await docRef.update({ reactions });
                const container = document.getElementById('gwc-react-' + commentId);
                if (container) container.outerHTML = renderReactions(reactions, commentId);
                bindReactionBtns();
            } catch (e) { console.error('Reaction error', e); }
        }

        function showEmojiPicker(btn, commentId) {
            document.querySelectorAll('.gwc-emoji-picker').forEach(p => p.remove());
            const picker = document.createElement('div');
            picker.className = 'gwc-emoji-picker';
            REACTION_EMOJIS.forEach(emoji => {
                const b = document.createElement('button');
                b.textContent = emoji;
                b.onclick = () => { picker.remove(); toggleReaction(commentId, emoji); };
                picker.appendChild(b);
            });
            btn.parentElement.appendChild(picker);
            setTimeout(() => document.addEventListener('click', function h(e) {
                if (!picker.contains(e.target) && e.target !== btn) {
                    picker.remove(); document.removeEventListener('click', h);
                }
            }), 10);
        }

        function bindReactionBtns() {
            document.querySelectorAll('.gwc-reaction-btn').forEach(btn => {
                btn.onclick = () => toggleReaction(btn.dataset.cid, btn.dataset.emoji);
            });
            document.querySelectorAll('.gwc-emoji-add-btn').forEach(btn => {
                btn.onclick = () => showEmojiPicker(btn, btn.dataset.cid);
            });
        }

        /* ── Bind actions inside list ─────────────── */
        function bindListActions() {
            // Delete
            el('gwc-list').querySelectorAll('.gwc-delete-btn').forEach(btn => {
                btn.onclick = async () => {
                    if (!confirm('¿Eliminar este comentario?')) return;
                    try {
                        await colPath.doc(btn.dataset.id).delete();
                        document.getElementById('gwc-comment-' + btn.dataset.id)?.remove();
                        await refreshCount();
                        if (!el('gwc-list').querySelector('.gwc-post-card'))
                            el('gwc-empty').style.display = 'block';
                    } catch (e) { alert('Error: ' + e.message); }
                };
            });
            // Report
            el('gwc-list').querySelectorAll('.gwc-report-btn').forEach(btn => {
                btn.onclick = async () => {
                    const reason = prompt('¿Por qué reportas este comentario?');
                    if (!reason?.trim()) return;
                    try {
                        const icon = btn.querySelector('i');
                        if (icon) icon.className = 'fas fa-spinner fa-spin';
                        await db.collection('reports').add({
                            type: 'comment', commentId: btn.dataset.id,
                            docId, collectionName: collection,
                            urlContext: window.location.href,
                            reporterId: currentUser?.uid || 'anon',
                            reason: reason.trim(), status: 'pending',
                            createdAt: firebase.firestore.FieldValue.serverTimestamp()
                        });
                        alert('Comentario reportado. Un moderador lo revisará.');
                        if (icon) icon.className = 'fas fa-check';
                        btn.style.color = '#22c55e';
                        btn.disabled = true;
                    } catch (e) { alert('Error: ' + e.message); }
                };
            });
            // Quote
            el('gwc-list').querySelectorAll('.gwc-quote-btn').forEach(btn => {
                btn.onclick = () => {
                    const card = document.getElementById('gwc-comment-' + btn.dataset.id);
                    const contentEl = card?.querySelector('.gwc-post-content');
                    const text = (contentEl?.innerText || '').trim().substring(0, 300);
                    setQuote(btn.dataset.name, text);
                    el('gwc-form-wrap').scrollIntoView({ behavior: 'smooth', block: 'center' });
                };
            });
            // Reactions
            bindReactionBtns();
        }

        /* ── Load comments ────────────────────────── */
        async function loadMore(initial) {
            if (reachedEnd && !initial) return;
            let q = colPath.orderBy('createdAt', 'desc').limit(PAGE_SIZE);
            if (!initial && lastDoc) q = q.startAfter(lastDoc);
            try {
                const snap = await q.get();
                if (snap.empty && initial) {
                    el('gwc-loading').style.display = 'none';
                    el('gwc-empty').style.display   = 'block';
                    return;
                }
                const comments = [];
                snap.forEach(d => comments.push({ id: d.id, ...d.data() }));
                refreshCount();

                if (snap.docs.length === PAGE_SIZE) {
                    lastDoc = snap.docs[snap.docs.length - 1];
                    el('gwc-load-more').style.display = 'block';
                } else {
                    reachedEnd = true;
                    el('gwc-load-more').style.display = 'none';
                }

                const uid  = currentUser?.uid || null;
                const html = comments.map(c => renderComment(c, uid, isAdmin)).join('');
                if (initial) el('gwc-list').innerHTML = html;
                else         el('gwc-list').insertAdjacentHTML('beforeend', html);

                el('gwc-loading').style.display = 'none';
                el('gwc-empty').style.display   = 'none';
                bindListActions();
            } catch (err) {
                console.error('GWComments load error:', err);
                el('gwc-loading').innerHTML = `<i class="fas fa-exclamation-circle me-2" style="color:#f87171;"></i>Error al cargar: ${err.message}`;
            }
        }

        /* ── Submit ───────────────────────────────── */
        async function submitComment() {
            if (!currentUser) return;

            let content = '';
            if (quill) {
                content = quill.root.innerHTML.trim();
                if (content === '<p><br></p>') content = '';
            } else {
                content = (el('gwc-fallback-ta')?.value || '').trim();
            }
            if (!content) { el('gwc-error').textContent = 'Escribe algo antes de publicar.'; el('gwc-error').style.display = 'block'; return; }
            el('gwc-error').style.display = 'none';

            const btn = el('gwc-submit');
            btn.disabled = true;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publicando...';

            try {
                // Obtener datos extendidos del usuario
                let authorName   = (currentUser.displayName || currentUser.email || 'Anónimo').substring(0, 80);
                let authorAvatar = '', authorFleet = '', authorRole = '',
                    authorRank  = '', authorFrame  = '', authorXp   = 0,
                    authorJoined = null, authorMsgCount = null,
                    authorLevel  = null, authorServer   = '';

                try {
                    const ud = await db.collection('users').doc(currentUser.uid).get();
                    if (ud.exists) {
                        const u = ud.data();
                        if (u.username)   authorName     = u.username.substring(0, 80);
                        authorAvatar   = u.avatar         || '';
                        authorFleet    = u.fleet          || '';
                        authorRole     = u.role           || '';
                        authorFrame    = u.profileFrame   || '';
                        authorXp       = u.xp             || 0;
                        authorRank     = u.rank           || getRankLabel(authorXp);
                        authorJoined   = u.createdAt      || null;
                        authorLevel    = u.level          ?? null;
                        authorServer   = u.server         || '';
                        authorMsgCount = u.commentCount   ?? null;
                    }
                } catch (_) {}

                // Incrementar contador de comentarios del usuario
                try {
                    await db.collection('users').doc(currentUser.uid).update({
                        commentCount: firebase.firestore.FieldValue.increment(1)
                    });
                    if (authorMsgCount != null) authorMsgCount++;
                } catch (_) {}

                const ref = await colPath.add({
                    authorId: currentUser.uid, authorName,
                    authorAvatar, authorFleet, authorRole,
                    authorRank, authorFrame, authorXp,
                    authorJoined, authorLevel, authorServer,
                    authorMsgCount,
                    content,          // legacy plaintext (fallback)
                    contentHtml: content,  // HTML de Quill
                    attachedImages,
                    quoteAuthor: quoteData?.authorName || null,
                    quoteText:   quoteData?.text       || null,
                    reactions:   {},
                    createdAt:   firebase.firestore.FieldValue.serverTimestamp()
                });

                if (quill) quill.setContents([]);
                else if (el('gwc-fallback-ta')) el('gwc-fallback-ta').value = '';
                clearQuote();
                const savedImages = [...attachedImages];
                attachedImages = [];
                renderPreviews();

                if (typeof gwAwardXp === 'function') gwAwardXp('comment').catch(() => {});

                const newComment = {
                    id: ref.id, authorId: currentUser.uid,
                    authorName, authorAvatar, authorFleet, authorRole,
                    authorRank, authorFrame, authorXp, authorJoined,
                    authorLevel, authorServer, authorMsgCount,
                    content, contentHtml: content,
                    attachedImages: savedImages,
                    quoteAuthor: quoteData?.authorName || null,
                    quoteText:   quoteData?.text       || null,
                    reactions: {},
                    createdAt: { toDate: () => new Date() }
                };
                totalCount++;
                const cnt = el('gwc-count');
                if (cnt) cnt.textContent = totalCount;
                el('gwc-list').insertAdjacentHTML('afterbegin', renderComment(newComment, currentUser.uid, isAdmin));
                el('gwc-empty').style.display = 'none';
                bindListActions();
                refreshCount();

            } catch (err) {
                el('gwc-error').textContent = err.message || 'Error al publicar.';
                el('gwc-error').style.display = 'block';
            } finally {
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-paper-plane"></i> Publicar comentario';
            }
        }

        /* ── Check admin ──────────────────────────── */
        async function checkAdmin(user) {
            if (!user) return false;
            try {
                const ud = await db.collection('users').doc(user.uid).get();
                return ud.exists && ud.data().role === 'admin';
            } catch (_) { return false; }
        }

        /* ── Auth listener ────────────────────────── */
        if (auth) {
            auth.onAuthStateChanged(async user => {
                currentUser = user;
                if (user) isAdmin = await checkAdmin(user);
                updateAuthUI(user);
                if (!initialized) { initialized = true; await loadMore(true); }
            });
        } else {
            updateAuthUI(null);
            await loadMore(true);
        }

        el('gwc-submit').addEventListener('click', submitComment);
        el('gwc-load-more').addEventListener('click', () => loadMore(false));
    }

    window.GWComments = { init };
})();