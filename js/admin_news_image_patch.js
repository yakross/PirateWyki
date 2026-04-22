/**
 * ═══════════════════════════════════════════════════════════════════
 *  PARCHE ADMIN — Subida de imágenes para Componentes, Pinturas,
 *  Drones, Cortex y Gravitones (Firebase Storage)
 * ═══════════════════════════════════════════════════════════════════
 *
 *  El dashboard.html ya incluye este script.
 *  Sube la imagen y coloca la URL en el campo correspondiente.
 */

(function () {
    'use strict';

    // Mapeo: { fileInputId, urlInputId, previewImgId, progressId, barId, msgId, folder }
    const UPLOAD_CONFIGS = [
        { file: 'componentImageFile', url: 'componentImage',  preview: 'componentImagePreview', wrap: 'componentImagePreviewContainer', folder: 'component_images' },
        { file: 'paintImageFile',     url: 'paintImage',      preview: 'paintImagePreview',     wrap: 'paintImagePreviewContainer',     folder: 'paint_images'     },
        { file: 'droneImageFile',     url: 'droneImage',      preview: 'droneImagePreview',     wrap: 'droneImagePreviewContainer',     folder: 'drone_images'     },
        { file: 'cortexImageFile',    url: 'cortexImage',     preview: 'cortexImagePreview',    wrap: 'cortexImagePreviewContainer',    folder: 'cortex_images'    },
        { file: 'gravitonImageFile',  url: 'gravitonImage',   preview: 'gravitonImagePreview',  wrap: 'gravitonImagePreviewContainer',  folder: 'graviton_images'  },
    ];

    function setupUploader(cfg) {
        const fileInput   = document.getElementById(cfg.file);
        const urlInput    = document.getElementById(cfg.url);
        const previewImg  = document.getElementById(cfg.preview);
        const previewWrap = document.getElementById(cfg.wrap);
        if (!fileInput || !urlInput) return;

        // Preview cuando se escribe URL a mano
        urlInput.addEventListener('input', function () {
            const url = urlInput.value.trim();
            if (previewImg && previewWrap) {
                previewImg.src = url;
                previewWrap.style.display = url ? 'block' : 'none';
            }
        });

        // Si ya hay valor al cargar (edit mode)
        const existing = urlInput.value.trim();
        if (existing && previewImg && previewWrap) {
            previewImg.src = existing;
            previewWrap.style.display = 'block';
        }

        fileInput.addEventListener('change', function () {
            const file = fileInput.files[0];
            if (!file) return;
            if (file.size > 10 * 1024 * 1024) { alert('Imagen demasiado grande. Máximo 10 MB.'); fileInput.value = ''; return; }
            if (!file.type.startsWith('image/')) { alert('Solo se permiten imágenes.'); fileInput.value = ''; return; }

            const storage    = firebase.storage();
            const safeName   = file.name.replace(/[^a-z0-9._-]/gi, '_');
            const storageRef = storage.ref(cfg.folder + '/' + Date.now() + '_' + safeName);

            // Barra de progreso inline
            let progressEl = document.getElementById(cfg.file + '_progress');
            if (!progressEl) {
                progressEl = document.createElement('div');
                progressEl.id = cfg.file + '_progress';
                progressEl.innerHTML = `
                    <div style="height:4px;background:var(--border-color);border-radius:4px;overflow:hidden;margin-top:6px;">
                        <div id="${cfg.file}_bar" style="height:100%;background:var(--accent);width:0%;transition:width .2s;"></div>
                    </div>
                    <p id="${cfg.file}_msg" style="font-size:12px;color:var(--text-tertiary);margin:4px 0 0;"></p>`;
                urlInput.parentNode.appendChild(progressEl);
            }
            progressEl.style.display = 'block';
            const bar = document.getElementById(cfg.file + '_bar');
            const msg = document.getElementById(cfg.file + '_msg');
            if (bar) bar.style.width = '0%';
            if (msg) msg.textContent = 'Subiendo imagen…';

            const task = storageRef.put(file, { contentType: file.type });
            task.on('state_changed',
                snap => {
                    const pct = Math.round((snap.bytesTransferred / snap.totalBytes) * 100);
                    if (bar) bar.style.width = pct + '%';
                    if (msg) msg.textContent = 'Subiendo… ' + pct + '%';
                },
                err => {
                    console.error('Error subiendo imagen:', err);
                    if (msg) msg.textContent = '❌ Error al subir. Intenta de nuevo.';
                    fileInput.value = '';
                    setTimeout(() => { if (progressEl) progressEl.style.display = 'none'; }, 3000);
                },
                async () => {
                    try {
                        const url = await task.snapshot.ref.getDownloadURL();
                        urlInput.value = url;
                        if (previewImg && previewWrap) { previewImg.src = url; previewWrap.style.display = 'block'; }
                        if (msg) msg.textContent = '✅ Imagen subida correctamente';
                        setTimeout(() => { if (progressEl) progressEl.style.display = 'none'; }, 2500);
                    } catch(e) {
                        console.error('Error obteniendo URL:', e);
                        if (msg) msg.textContent = '❌ Error al obtener URL.';
                    } finally { fileInput.value = ''; }
                }
            );
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        UPLOAD_CONFIGS.forEach(setupUploader);
    });

    // Re-inicializar cuando se abra un formulario de edición (para el preview)
    window.refreshImageUploaderPreviews = function () {
        UPLOAD_CONFIGS.forEach(cfg => {
            const urlInput    = document.getElementById(cfg.url);
            const previewImg  = document.getElementById(cfg.preview);
            const previewWrap = document.getElementById(cfg.wrap);
            if (!urlInput || !previewImg || !previewWrap) return;
            const url = urlInput.value.trim();
            previewImg.src = url;
            previewWrap.style.display = url ? 'block' : 'none';
        });
    };
})();