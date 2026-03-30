/**
 * Utilidad para mostrar texto con soporte de imágenes (URLs → <img>).
 * Uso: en descripciones, contenido de noticias/foro, etc.
 */
function formatContentWithImages(text) {
    if (text == null || text === '') return '';
    var s = (text + '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    s = s.replace(/\n/g, '<br>');
    s = s.replace(/(https?:\/\/[^\s<>"']+\.(?:png|jpg|jpeg|gif|webp)(?:\?[^\s<>"']*)?)/gi, '<img src="$1" alt="" style="max-width:100%; height:auto; border-radius:8px; margin:8px 0;" loading="lazy">');
    return s;
}

if (typeof window !== 'undefined') window.formatContentWithImages = formatContentWithImages;
