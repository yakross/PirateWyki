/**
 * GalaxWiki — Ship Gallery (Community Screenshots)
 * Allows authenticated users to share screenshots for each ship.
 * NO Firebase Storage needed — uses image URLs or free ImgBB hosting.
 * Metadata stored in Firestore collection "ship_gallery".
 */
(function () {
    'use strict';

    const COLLECTION = 'ship_gallery';
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const FREEIMG_KEY = '6d207e02198a847aa98d0a2a901485a5'; // freeimage.host public key
    const FREEIMG_URL = 'https://freeimage.host/api/1/upload';

    let _shipId = null;
    let _photos = [];
    let _lightboxIdx = 0;
    let _currentUser = null;
    let _isAdmin = false;

    // ── Public init ─────────────────────────────────────────────
    window.ShipGallery = { init };

    function init(shipId) {
        _shipId = shipId;
        if (!_shipId || !window.db) return;

        const auth = window.auth;
        if (auth) {
            auth.onAuthStateChanged(async u => {
                _currentUser = u;
                if (u) {
                    try {
                        const uDoc = await window.db.collection('users').doc(u.uid).get();
                        _isAdmin = uDoc.exists && (uDoc.data().role === 'admin' || uDoc.data().role === 'superadmin');
                    } catch (e) { _isAdmin = false; }
                }
                renderSection();
            });
        } else {
            renderSection();
        }
    }

    // ── Render the gallery section ──────────────────────────────
    function renderSection() {
        let container = document.getElementById('sg-section');
        if (!container) {
            container = document.createElement('div');
            container.id = 'sg-section';
            container.className = 'sg-section';
            const after = document.getElementById('ship-comments-section') || document.getElementById('shipContent');
            if (after && after.parentNode) {
                after.parentNode.insertBefore(container, after);
            } else {
                document.querySelector('.main-container')?.appendChild(container);
            }
        }

        const canUpload = !!_currentUser;

        container.innerHTML =
            '<div class="sg-header">' +
                '<div class="sg-title"><i class="fas fa-images"></i> Galería de la Comunidad <span class="sg-count" id="sgCount">0</span></div>' +
                (canUpload
                    ? '<button class="sg-upload-btn" id="sgUploadToggle"><i class="fas fa-camera"></i> Subir screenshot</button>'
                    : '<span class="sg-login-hint"><i class="fas fa-lock"></i> Inicia sesión para subir fotos</span>') +
            '</div>' +
            '<div class="sg-upload-area" id="sgUploadArea">' +
                '<!-- Tab selector -->' +
                '<div class="sg-tabs" id="sgTabs">' +
                    '<button class="sg-tab active" data-tab="upload"><i class="fas fa-upload me-1"></i> Subir imagen</button>' +
                    '<button class="sg-tab" data-tab="url"><i class="fas fa-link me-1"></i> Pegar URL</button>' +
                '</div>' +
                '<!-- Tab: File upload (via ImgBB) -->' +
                '<div class="sg-tab-content" id="sgTabUpload">' +
                    '<div class="sg-dropzone" id="sgDropzone">' +
                        '<i class="fas fa-cloud-upload-alt"></i>' +
                        '<p>Arrastra una imagen aquí o haz clic para seleccionar</p>' +
                        '<p class="sg-hint">JPG, PNG, WEBP o GIF · máx 5 MB · gratis</p>' +
                    '</div>' +
                    '<input type="file" id="sgFileInput" accept="image/jpeg,image/png,image/webp,image/gif" style="display:none">' +
                    '<div class="sg-preview-row" id="sgPreviewRow" style="display:none">' +
                        '<img id="sgPreviewImg" class="sg-preview-thumb" src="" alt="">' +
                        '<input type="text" class="sg-caption-input" id="sgCaptionFile" placeholder="Descripción de la imagen (opcional)" maxlength="120">' +
                    '</div>' +
                '</div>' +
                '<!-- Tab: URL paste -->' +
                '<div class="sg-tab-content" id="sgTabUrl" style="display:none">' +
                    '<div class="sg-url-row">' +
                        '<input type="url" class="sg-caption-input" id="sgUrlInput" placeholder="https://i.imgur.com/ejemplo.jpg" style="flex:2">' +
                    '</div>' +
                    '<div class="sg-preview-row" id="sgUrlPreviewRow" style="display:none; margin-top:10px;">' +
                        '<img id="sgUrlPreviewImg" class="sg-preview-thumb" src="" alt="">' +
                        '<input type="text" class="sg-caption-input" id="sgCaptionUrl" placeholder="Descripción de la imagen (opcional)" maxlength="120">' +
                    '</div>' +
                '</div>' +
                '<div class="sg-progress" id="sgProgress"><div class="sg-progress-bar" id="sgProgressBar"></div></div>' +
                '<div class="sg-submit-row" id="sgSubmitRow" style="display:none">' +
                    '<button class="sg-cancel-btn" id="sgCancelBtn">Cancelar</button>' +
                    '<button class="sg-submit-btn" id="sgSubmitBtn"><i class="fas fa-paper-plane me-1"></i> Publicar</button>' +
                '</div>' +
            '</div>' +
            '<div class="sg-grid" id="sgGrid"></div>' +
            '<div class="sg-empty" id="sgEmpty" style="display:none">' +
                '<i class="fas fa-camera-retro"></i>' +
                '<p>Aún no hay fotos. ¡Sé el primero en compartir un screenshot!</p>' +
            '</div>';

        // Lightbox
        if (!document.getElementById('sgLightbox')) {
            const lb = document.createElement('div');
            lb.id = 'sgLightbox';
            lb.className = 'sg-lightbox';
            lb.innerHTML =
                '<button class="sg-lightbox-close" id="sgLbClose"><i class="fas fa-times"></i></button>' +
                '<button class="sg-lightbox-nav prev" id="sgLbPrev"><i class="fas fa-chevron-left"></i></button>' +
                '<button class="sg-lightbox-nav next" id="sgLbNext"><i class="fas fa-chevron-right"></i></button>' +
                '<img class="sg-lightbox-img" id="sgLbImg" src="" alt="">' +
                '<div class="sg-lightbox-caption" id="sgLbCaption"></div>' +
                '<div class="sg-lightbox-meta" id="sgLbMeta"></div>';
            document.body.appendChild(lb);

            document.getElementById('sgLbClose').onclick = closeLightbox;
            document.getElementById('sgLbPrev').onclick = () => navigateLightbox(-1);
            document.getElementById('sgLbNext').onclick = () => navigateLightbox(1);
            lb.addEventListener('click', e => { if (e.target === lb) closeLightbox(); });
            document.addEventListener('keydown', e => {
                if (!lb.classList.contains('show')) return;
                if (e.key === 'Escape') closeLightbox();
                if (e.key === 'ArrowLeft') navigateLightbox(-1);
                if (e.key === 'ArrowRight') navigateLightbox(1);
            });
        }

        if (canUpload) bindUploadEvents();
        loadPhotos();
    }

    // ── Upload events ───────────────────────────────────────────
    function bindUploadEvents() {
        const toggleBtn = document.getElementById('sgUploadToggle');
        const area = document.getElementById('sgUploadArea');
        const dropzone = document.getElementById('sgDropzone');
        const fileInput = document.getElementById('sgFileInput');
        const cancelBtn = document.getElementById('sgCancelBtn');
        const submitBtn = document.getElementById('sgSubmitBtn');
        const urlInput = document.getElementById('sgUrlInput');

        let selectedFile = null;
        let activeTab = 'upload'; // 'upload' or 'url'

        toggleBtn.onclick = () => {
            area.classList.toggle('show');
            if (!area.classList.contains('show')) resetUpload();
        };

        // Tab switching
        document.getElementById('sgTabs').addEventListener('click', e => {
            const tab = e.target.closest('.sg-tab');
            if (!tab) return;
            activeTab = tab.dataset.tab;
            document.querySelectorAll('.sg-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById('sgTabUpload').style.display = activeTab === 'upload' ? 'block' : 'none';
            document.getElementById('sgTabUrl').style.display = activeTab === 'url' ? 'block' : 'none';
            resetUpload();
        });

        // File drag & drop
        dropzone.onclick = () => fileInput.click();
        ['dragenter', 'dragover'].forEach(evt => {
            area.addEventListener(evt, e => { e.preventDefault(); area.classList.add('drag-over'); });
        });
        ['dragleave', 'drop'].forEach(evt => {
            area.addEventListener(evt, e => { e.preventDefault(); area.classList.remove('drag-over'); });
        });
        area.addEventListener('drop', e => {
            if (activeTab !== 'upload') return;
            const f = e.dataTransfer.files[0];
            if (f) handleFile(f);
        });
        fileInput.onchange = () => {
            if (fileInput.files[0]) handleFile(fileInput.files[0]);
        };

        function handleFile(f) {
            if (!f.type.match(/^image\/(jpeg|png|webp|gif)$/)) {
                alert('Formato no soportado. Usa JPG, PNG, WEBP o GIF.');
                return;
            }
            if (f.size > MAX_FILE_SIZE) {
                alert('La imagen es demasiado grande. Máximo 5 MB.');
                return;
            }
            selectedFile = f;
            const url = URL.createObjectURL(f);
            document.getElementById('sgPreviewImg').src = url;
            document.getElementById('sgPreviewRow').style.display = 'flex';
            document.getElementById('sgSubmitRow').style.display = 'flex';
        }

        // URL preview
        urlInput.addEventListener('input', () => {
            const val = urlInput.value.trim();
            const previewRow = document.getElementById('sgUrlPreviewRow');
            const previewImg = document.getElementById('sgUrlPreviewImg');
            if (val && /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)/i.test(val)) {
                previewImg.src = val;
                previewImg.onerror = () => { previewRow.style.display = 'none'; };
                previewImg.onload = () => { previewRow.style.display = 'flex'; };
                document.getElementById('sgSubmitRow').style.display = 'flex';
            } else if (val && val.startsWith('http')) {
                // Could be a URL without extension (Discord CDN, etc.)
                previewImg.src = val;
                previewImg.onerror = () => { previewRow.style.display = 'none'; };
                previewImg.onload = () => { previewRow.style.display = 'flex'; };
                document.getElementById('sgSubmitRow').style.display = 'flex';
            } else {
                previewRow.style.display = 'none';
                document.getElementById('sgSubmitRow').style.display = 'none';
            }
        });

        cancelBtn.onclick = () => {
            resetUpload();
            area.classList.remove('show');
        };

        // Submit
        submitBtn.onclick = async () => {
            if (!_currentUser) return;
            submitBtn.disabled = true;
            const progress = document.getElementById('sgProgress');
            const progressBar = document.getElementById('sgProgressBar');

            try {
                let imageUrl = '';
                let caption = '';

                if (activeTab === 'url') {
                    // URL tab
                    imageUrl = (urlInput.value || '').trim();
                    caption = (document.getElementById('sgCaptionUrl').value || '').trim();
                    if (!imageUrl) { alert('Ingresa una URL de imagen válida.'); return; }
                } else {
                    // Upload tab — use ImgBB free hosting
                    if (!selectedFile) { alert('Selecciona una imagen.'); return; }
                    caption = (document.getElementById('sgCaptionFile').value || '').trim();

                    progress.classList.add('show');
                    progressBar.style.width = '30%';

                    // Convert to base64
                    const base64 = await fileToBase64(selectedFile);
                    progressBar.style.width = '60%';

                    // Upload to freeimage.host (free, no registration)
                    const formData = new FormData();
                    formData.append('key', FREEIMG_KEY);
                    formData.append('source', base64.split(',')[1]); // base64 without prefix
                    formData.append('format', 'json');

                    const res = await fetch(FREEIMG_URL, {
                        method: 'POST',
                        body: formData
                    });
                    const data = await res.json();
                    progressBar.style.width = '90%';

                    if (data.status_code !== 200 && !data.image) throw new Error(data.status_txt || 'Upload failed');
                    imageUrl = (data.image && data.image.url) || data.image?.display_url || '';
                }

                // Save metadata to Firestore
                await window.db.collection(COLLECTION).add({
                    shipId: _shipId,
                    imageUrl: imageUrl,
                    caption: caption,
                    userId: _currentUser.uid,
                    userName: _currentUser.displayName || _currentUser.email.split('@')[0],
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });

                progressBar.style.width = '100%';
                resetUpload();
                area.classList.remove('show');
                loadPhotos();
            } catch (err) {
                console.error('Gallery upload error:', err);
                alert('Error al subir la imagen: ' + (err.message || 'Intenta de nuevo.'));
            } finally {
                submitBtn.disabled = false;
                progress.classList.remove('show');
                progressBar.style.width = '0%';
            }
        };

        function resetUpload() {
            selectedFile = null;
            fileInput.value = '';
            document.getElementById('sgPreviewRow').style.display = 'none';
            document.getElementById('sgUrlPreviewRow').style.display = 'none';
            document.getElementById('sgSubmitRow').style.display = 'none';
            document.getElementById('sgCaptionFile').value = '';
            document.getElementById('sgCaptionUrl').value = '';
            urlInput.value = '';
            document.getElementById('sgProgress').classList.remove('show');
            document.getElementById('sgProgressBar').style.width = '0%';
        }
    }

    // ── Convert File to base64 ──────────────────────────────────
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    // ── Load photos from Firestore ──────────────────────────────
    function loadPhotos() {
        window.db.collection(COLLECTION)
            .where('shipId', '==', _shipId)
            .orderBy('createdAt', 'desc')
            .limit(50)
            .get()
            .then(snap => {
                _photos = [];
                snap.forEach(doc => _photos.push({ id: doc.id, ...doc.data() }));
                renderGrid();
            })
            .catch(err => {
                console.warn('Gallery load error:', err);
                renderGrid();
            });
    }

    // ── Render the photo grid ───────────────────────────────────
    function renderGrid() {
        const grid = document.getElementById('sgGrid');
        const empty = document.getElementById('sgEmpty');
        const count = document.getElementById('sgCount');
        if (!grid) return;

        count.textContent = _photos.length;
        if (_photos.length === 0) {
            grid.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        empty.style.display = 'none';

        grid.innerHTML = _photos.map((p, i) => {
            const canDelete = _currentUser && (_currentUser.uid === p.userId || _isAdmin);
            const timeAgo = typeof window.gwTimeAgo === 'function' && p.createdAt
                ? window.gwTimeAgo(p.createdAt) : '';
            return '<div class="sg-item" data-idx="' + i + '">' +
                '<img src="' + esc(p.imageUrl) + '" alt="' + esc(p.caption || 'Screenshot') + '" loading="lazy" onerror="this.src=\'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22200%22 height=%22120%22><rect fill=%22%23334155%22 width=%22200%22 height=%22120%22/><text x=%2250%25%22 y=%2250%25%22 fill=%22%2364748b%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2214%22>Imagen no disponible</text></svg>\'">' +
                '<div class="sg-item-overlay">' +
                    (p.caption ? '<span class="sg-item-caption">' + esc(p.caption) + '</span>' : '') +
                    '<span class="sg-item-meta"><i class="fas fa-user"></i> ' + esc(p.userName || 'Anónimo') +
                    (timeAgo ? ' · ' + timeAgo : '') + '</span>' +
                '</div>' +
                (canDelete ? '<button class="sg-item-delete" data-id="' + p.id + '" title="Eliminar"><i class="fas fa-trash"></i></button>' : '') +
            '</div>';
        }).join('');

        // Click handlers
        grid.querySelectorAll('.sg-item').forEach(item => {
            item.addEventListener('click', e => {
                if (e.target.closest('.sg-item-delete')) return;
                openLightbox(parseInt(item.dataset.idx));
            });
        });
        grid.querySelectorAll('.sg-item-delete').forEach(btn => {
            btn.addEventListener('click', e => {
                e.stopPropagation();
                deletePhoto(btn.dataset.id);
            });
        });
    }

    // ── Delete a photo ──────────────────────────────────────────
    async function deletePhoto(docId) {
        if (!confirm('¿Eliminar esta imagen de la galería?')) return;
        try {
            await window.db.collection(COLLECTION).doc(docId).delete();
            _photos = _photos.filter(p => p.id !== docId);
            renderGrid();
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error al eliminar la imagen.');
        }
    }

    // ── Lightbox ────────────────────────────────────────────────
    function openLightbox(idx) {
        _lightboxIdx = idx;
        const lb = document.getElementById('sgLightbox');
        if (!lb) return;
        updateLightbox();
        lb.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        const lb = document.getElementById('sgLightbox');
        if (lb) lb.classList.remove('show');
        document.body.style.overflow = '';
    }

    function navigateLightbox(dir) {
        _lightboxIdx += dir;
        if (_lightboxIdx < 0) _lightboxIdx = _photos.length - 1;
        if (_lightboxIdx >= _photos.length) _lightboxIdx = 0;
        updateLightbox();
    }

    function updateLightbox() {
        const p = _photos[_lightboxIdx];
        if (!p) return;
        document.getElementById('sgLbImg').src = p.imageUrl;
        document.getElementById('sgLbCaption').textContent = p.caption || '';
        const timeAgo = typeof window.gwTimeAgo === 'function' && p.createdAt ? window.gwTimeAgo(p.createdAt) : '';
        document.getElementById('sgLbMeta').textContent =
            (p.userName || 'Anónimo') + (timeAgo ? ' · ' + timeAgo : '') +
            ' · ' + (_lightboxIdx + 1) + '/' + _photos.length;
    }

    function esc(s) {
        if (!s) return '';
        const d = document.createElement('div');
        d.textContent = s;
        return d.innerHTML;
    }
})();
