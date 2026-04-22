/**
 * GalaxWiki — Global Chat Widget
 * Real-time chat with emojis + auto-translation via MyMemory API
 * Uses Firestore `global_chat` collection
 */

(function() {
    'use strict';

    // ── Config ──────────────────────────────────────────────────
    const COLLECTION   = 'global_chat';
    const MSG_LIMIT    = 80;        // messages to load
    const RATE_MS      = 1500;      // min interval between sends
    const TRANSLATE_API = 'https://api.mymemory.translated.net/get';

    // Emoji sets
    const EMOJI_CATEGORIES = {
        '😀': ['😀','😁','😂','🤣','😃','😄','😅','😆','😉','😊','😎','🤩','😍','🥰','😘','😋','🤗','🤔','🤭','🤫','😶','😏','😌','😴','🤤','😷','🤒','🤕','🤮','🤧','🥵','🥶','😱','😨','😰','😥','😢','😭','🤬','😈','👿','💀','☠️','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾'],
        '👋': ['👋','🤚','🖐️','✋','🖖','👌','🤌','🤏','✌️','🤞','🤟','🤘','🤙','👈','👉','👆','👇','☝️','👍','👎','✊','👊','🤛','🤜','👏','🙌','👐','🤲','🤝','🙏','💪','🦾','🖕'],
        '🚀': ['🚀','🛸','🌍','🌎','🌏','🌕','🌖','🌗','🌘','🌑','🌒','🌓','🌔','🌙','⭐','🌟','✨','💫','☀️','🌤️','⛅','🌦️','🌈','☁️','❄️','💨','🌊','🔥','💥','⚡','🌀','🪐','☄️'],
        '🎮': ['🎮','🕹️','🎲','🃏','🎯','🏆','🥇','🥈','🥉','🎖️','🏅','⚔️','🛡️','💎','🔮','🗡️','🏹','🔫','💣','🧨','🪓','⛏️','🔧','🔩','⚙️','🧲','💰','💎','🪙','📡','🛰️','🔭','🔬'],
        '❤️': ['❤️','🧡','💛','💚','💙','💜','🖤','🤍','🤎','💔','❣️','💕','💞','💓','💗','💖','💘','💝','💟','♥️','🔴','🟠','🟡','🟢','🔵','🟣','⚫','⚪','🟤','✅','❌','⭕','💯','🔥','👑','🎉','🎊','✨','⚡','🌈']
    };

    let lastSend = 0;
    let chatOpen = false;
    let unsubscribe = null;
    let emojiPickerOpen = false;
    let currentUser = null;
    let unreadCount = 0;

    // ── Build DOM ───────────────────────────────────────────────
    function buildChat() {
        // FAB button
        const fab = document.createElement('button');
        fab.className = 'gc-fab';
        fab.id = 'gcFab';
        fab.title = 'Global Chat';
        fab.innerHTML = '<i class="fas fa-comments"></i><span class="gc-badge" id="gcBadge">0</span>';
        fab.onclick = toggleChat;

        // Chat window
        const win = document.createElement('div');
        win.className = 'gc-window gc-hidden';
        win.id = 'gcWindow';
        win.innerHTML = `
            <div class="gc-header">
                <div class="gc-header-icon"><i class="fas fa-satellite-dish"></i></div>
                <div class="gc-header-info">
                    <div class="gc-header-title">GalaxChat</div>
                    <div class="gc-header-status" id="gcOnlineStatus">Global • Real-time</div>
                </div>
                <button class="gc-close-btn" id="gcCloseBtn" title="Close"><i class="fas fa-times"></i></button>
            </div>
            <div class="gc-messages" id="gcMessages">
                <div class="gc-empty" id="gcEmpty">
                    <i class="fas fa-satellite-dish"></i>
                    <span>Sin mensajes aún. ¡Sé el primero!</span>
                </div>
            </div>
            <div id="gcFooter"></div>
        `;

        document.body.appendChild(fab);
        document.body.appendChild(win);

        document.getElementById('gcCloseBtn').onclick = toggleChat;

        // Close emoji picker on outside click
        win.addEventListener('click', function(e) {
            if (!e.target.closest('.gc-emoji-btn') && !e.target.closest('.gc-emoji-picker')) {
                closeEmojiPicker();
            }
        });

        // Listen for auth changes
        if (window.auth) {
            window.auth.onAuthStateChanged(function(user) {
                currentUser = user;
                renderFooter();
            });
        } else {
            renderFooter();
        }

        // Start listening to messages
        listenMessages();
    }

    // ── Footer (input or login prompt) ──────────────────────────
    function renderFooter() {
        const footer = document.getElementById('gcFooter');
        if (!footer) return;

        if (currentUser) {
            footer.innerHTML = `
                <div class="gc-input-area">
                    <div style="position:relative;">
                        <button class="gc-emoji-btn" id="gcEmojiBtn" title="Emojis">😊</button>
                        <div class="gc-emoji-picker" id="gcEmojiPicker"></div>
                    </div>
                    <textarea class="gc-text-input" id="gcInput" rows="1" placeholder="Escribe un mensaje..." maxlength="500"></textarea>
                    <button class="gc-send-btn" id="gcSendBtn" title="Enviar"><i class="fas fa-paper-plane"></i></button>
                </div>
            `;

            document.getElementById('gcEmojiBtn').onclick = function(e) {
                e.stopPropagation();
                toggleEmojiPicker();
            };
            document.getElementById('gcSendBtn').onclick = sendMessage;

            var input = document.getElementById('gcInput');
            input.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
            // Auto-resize
            input.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = Math.min(this.scrollHeight, 80) + 'px';
            });

            buildEmojiPicker();
        } else {
            footer.innerHTML = `
                <div class="gc-login-prompt">
                    <p><i class="fas fa-lock"></i> Inicia sesión para chatear</p>
                    <button class="gc-login-btn" onclick="window.location.href=(window._basePath||'')+'login.html'">
                        <i class="fas fa-sign-in-alt"></i> Iniciar sesión
                    </button>
                </div>
            `;
        }
    }

    // ── Emoji picker ────────────────────────────────────────────
    function buildEmojiPicker() {
        var picker = document.getElementById('gcEmojiPicker');
        if (!picker) return;

        var cats = Object.keys(EMOJI_CATEGORIES);
        var tabsHtml = '<div class="gc-emoji-tabs">';
        cats.forEach(function(cat, i) {
            tabsHtml += '<button class="gc-emoji-tab' + (i === 0 ? ' active' : '') + '" data-cat="' + i + '">' + cat + '</button>';
        });
        tabsHtml += '</div>';

        var gridHtml = '<div class="gc-emoji-grid" id="gcEmojiGrid"></div>';
        picker.innerHTML = tabsHtml + gridHtml;

        // Show first category
        showEmojiCategory(0);

        // Tab switching
        picker.querySelectorAll('.gc-emoji-tab').forEach(function(tab) {
            tab.onclick = function(e) {
                e.stopPropagation();
                picker.querySelectorAll('.gc-emoji-tab').forEach(function(t) { t.classList.remove('active'); });
                this.classList.add('active');
                showEmojiCategory(parseInt(this.dataset.cat));
            };
        });
    }

    function showEmojiCategory(index) {
        var grid = document.getElementById('gcEmojiGrid');
        if (!grid) return;
        var cats = Object.keys(EMOJI_CATEGORIES);
        var emojis = EMOJI_CATEGORIES[cats[index]];
        grid.innerHTML = '';
        emojis.forEach(function(e) {
            var btn = document.createElement('button');
            btn.className = 'gc-emoji-item';
            btn.textContent = e;
            btn.onclick = function(ev) {
                ev.stopPropagation();
                insertEmoji(e);
            };
            grid.appendChild(btn);
        });
    }

    function insertEmoji(emoji) {
        var input = document.getElementById('gcInput');
        if (input) {
            input.value += emoji;
            input.focus();
        }
    }

    function toggleEmojiPicker() {
        var picker = document.getElementById('gcEmojiPicker');
        if (!picker) return;
        emojiPickerOpen = !emojiPickerOpen;
        picker.classList.toggle('show', emojiPickerOpen);
    }

    function closeEmojiPicker() {
        emojiPickerOpen = false;
        var picker = document.getElementById('gcEmojiPicker');
        if (picker) picker.classList.remove('show');
    }

    // ── Toggle chat window ──────────────────────────────────────
    function toggleChat() {
        chatOpen = !chatOpen;
        var win = document.getElementById('gcWindow');
        if (win) {
            win.classList.toggle('gc-hidden', !chatOpen);
            if (chatOpen) {
                unreadCount = 0;
                updateBadge();
                scrollToBottom();
                var input = document.getElementById('gcInput');
                if (input) setTimeout(function() { input.focus(); }, 300);
            }
        }
        closeEmojiPicker();
    }

    function scrollToBottom() {
        var msgs = document.getElementById('gcMessages');
        if (msgs) setTimeout(function() { msgs.scrollTop = msgs.scrollHeight; }, 100);
    }

    function updateBadge() {
        var badge = document.getElementById('gcBadge');
        if (!badge) return;
        badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
        badge.classList.toggle('show', unreadCount > 0);
    }

    // ── Send message ────────────────────────────────────────────
    function sendMessage() {
        if (!currentUser || !window.db) return;

        var input = document.getElementById('gcInput');
        var text = (input ? input.value : '').trim();
        if (!text || text.length > 500) return;

        var now = Date.now();
        if (now - lastSend < RATE_MS) return;
        lastSend = now;

        // Disable button temporarily
        var sendBtn = document.getElementById('gcSendBtn');
        if (sendBtn) sendBtn.disabled = true;

        // Get display name from Firestore user profile
        var displayName = currentUser.displayName || 'Piloto';

        window.db.collection(COLLECTION).add({
            uid:       currentUser.uid,
            name:      displayName,
            text:      text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        }).then(function() {
            if (input) { input.value = ''; input.style.height = 'auto'; }
        }).catch(function(err) {
            console.error('Chat send error:', err);
        }).finally(function() {
            if (sendBtn) setTimeout(function() { sendBtn.disabled = false; }, RATE_MS);
        });

        closeEmojiPicker();
    }

    // ── Listen messages (real-time) ─────────────────────────────
    function listenMessages() {
        if (!window.db) return;

        unsubscribe = window.db.collection(COLLECTION)
            .orderBy('timestamp', 'asc')
            .limitToLast(MSG_LIMIT)
            .onSnapshot(function(snapshot) {
                var msgs = document.getElementById('gcMessages');
                var empty = document.getElementById('gcEmpty');
                if (!msgs) return;

                if (snapshot.empty) {
                    if (empty) empty.style.display = 'flex';
                    return;
                }
                if (empty) empty.style.display = 'none';

                // Clear and rebuild
                msgs.innerHTML = '';
                var lastDate = null;

                snapshot.forEach(function(doc) {
                    var data = doc.data();
                    if (!data.timestamp) return;

                    var ts = data.timestamp.toDate();
                    var dateStr = ts.toLocaleDateString();

                    // Date divider
                    if (dateStr !== lastDate) {
                        lastDate = dateStr;
                        var divider = document.createElement('div');
                        divider.className = 'gc-date-divider';
                        divider.textContent = formatDateLabel(ts);
                        msgs.appendChild(divider);
                    }

                    var el = createMessageEl(doc.id, data, ts);
                    msgs.appendChild(el);
                });

                scrollToBottom();

                // Unread badge
                if (!chatOpen && snapshot.docChanges) {
                    var changes = snapshot.docChanges();
                    changes.forEach(function(ch) {
                        if (ch.type === 'added' && ch.doc.data().uid !== (currentUser ? currentUser.uid : '')) {
                            unreadCount++;
                        }
                    });
                    updateBadge();
                }
            }, function(err) {
                console.error('Chat listen error:', err);
            });
    }

    // ── Create message element ──────────────────────────────────
    function createMessageEl(id, data, ts) {
        var isOwn = currentUser && data.uid === currentUser.uid;
        var initials = (data.name || '??').substring(0, 2);

        var msg = document.createElement('div');
        msg.className = 'gc-msg' + (isOwn ? ' gc-own' : '');
        msg.dataset.id = id;

        var timeStr = ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msg.innerHTML = `
            <div class="gc-msg-avatar" style="background:${avatarGradient(data.uid)}">${escapeHtml(initials)}</div>
            <div class="gc-msg-body">
                <div class="gc-msg-meta">
                    <span class="gc-msg-name">${escapeHtml(data.name || 'Piloto')}</span>
                    <span class="gc-msg-time">${timeStr}</span>
                </div>
                <div class="gc-msg-text">${escapeHtml(data.text)}</div>
                <div class="gc-msg-translate" data-text="${escapeAttr(data.text)}" onclick="window._gcTranslate(this)">
                    <i class="fas fa-language"></i> Traducir
                </div>
                <div class="gc-msg-translated" style="display:none;"></div>
            </div>
        `;

        return msg;
    }

    // ── Translation ─────────────────────────────────────────────
    window._gcTranslate = function(el) {
        var text = el.getAttribute('data-text');
        var target = el.nextElementSibling;
        if (!text || !target) return;

        // If already translated, toggle visibility
        if (target.style.display === 'block') {
            target.style.display = 'none';
            return;
        }

        var lang = (typeof window.getCurrentLang === 'function') ? window.getCurrentLang() : 'es';
        el.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Traduciendo...';

        fetch(TRANSLATE_API + '?q=' + encodeURIComponent(text) + '&langpair=autodetect|' + lang)
            .then(function(r) { return r.json(); })
            .then(function(data) {
                if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
                    target.textContent = data.responseData.translatedText;
                    target.style.display = 'block';
                    el.innerHTML = '<i class="fas fa-language"></i> Ocultar traducción';
                } else {
                    el.innerHTML = '<i class="fas fa-language"></i> Error al traducir';
                    setTimeout(function() { el.innerHTML = '<i class="fas fa-language"></i> Traducir'; }, 2000);
                }
            })
            .catch(function() {
                el.innerHTML = '<i class="fas fa-language"></i> Error al traducir';
                setTimeout(function() { el.innerHTML = '<i class="fas fa-language"></i> Traducir'; }, 2000);
            });
    };

    // ── Helpers ──────────────────────────────────────────────────
    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    function escapeAttr(str) {
        return str.replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function avatarGradient(uid) {
        var hash = 0;
        for (var i = 0; i < (uid || '').length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash);
        var h = Math.abs(hash) % 360;
        return 'linear-gradient(135deg, hsl(' + h + ',70%,55%), hsl(' + ((h + 40) % 360) + ',60%,45%))';
    }

    function formatDateLabel(date) {
        var today = new Date();
        var yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);

        if (date.toDateString() === today.toDateString()) return 'Hoy';
        if (date.toDateString() === yesterday.toDateString()) return 'Ayer';
        return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    }

    // ── Init ────────────────────────────────────────────────────
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() { setTimeout(buildChat, 400); });
    } else {
        setTimeout(buildChat, 400);
    }
})();
