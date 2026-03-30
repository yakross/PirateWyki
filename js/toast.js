/**
 * GalaxWiki - Sistema de notificaciones toast
 * Uso: window.showToast('Mensaje', 'success'|'error'|'info')
 */
(function () {
    'use strict';

    const types = {
        success: { icon: 'fa-check-circle', class: 'toast--success' },
        error: { icon: 'fa-exclamation-circle', class: 'toast--error' },
        info: { icon: 'fa-info-circle', class: 'toast--info' }
    };

    function showToast(message, type = 'info', duration = 4000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const config = types[type] || types.info;
        const toast = document.createElement('div');
        toast.className = `toast ${config.class}`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `<i class="fas ${config.icon} toast-icon"></i><span class="toast-message">${escapeHtml(message)}</span>`;

        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('toast--visible'));

        const remove = () => {
            toast.classList.remove('toast--visible');
            setTimeout(() => toast.remove(), 300);
        };

        const t = setTimeout(remove, duration);
        toast.addEventListener('click', () => { clearTimeout(t); remove(); });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    window.showToast = showToast;
})();
