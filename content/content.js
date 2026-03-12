// ===== Content Script =====
// Detecta formularios y agrega botón flotante

(function () {
    'use strict';

    console.log('[QR Hospitalario] Content script cargado');

    // Detectar si la página tiene formularios
    const detectForms = () => {
        // Google Forms
        if (window.location.hostname.includes('docs.google.com') &&
            window.location.pathname.includes('/forms/')) {
            return 'google-forms';
        }

        // Typeform
        if (window.location.hostname.includes('typeform.com')) {
            return 'typeform';
        }

        // Buscar inputs de texto comunes en formularios de salud
        const formInputs = document.querySelectorAll('form input[type="text"], form textarea');
        if (formInputs.length > 3) {
            return 'generic-form';
        }

        return null;
    };

    // Agregar botón flotante (FAB)
    const createFAB = () => {
        if (document.getElementById('qr-hospitalario-fab')) return;

        const fab = document.createElement('div');
        fab.id = 'qr-hospitalario-fab';
        fab.title = 'QR Hospitalario - Generar QR para este formulario';
        fab.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zM13 3v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4zM18 13h-2v3h-3v2h3v3h2v-3h3v-2h-3z"/>
            </svg>
        `;

        fab.addEventListener('click', () => {
            // Guardar la URL actual
            const currentUrl = window.location.href;
            chrome.storage.local.set({ 'pendingQR': currentUrl }, () => {
                alert('URL del formulario capturada. Abre el QR Hospitalario desde la barra de herramientas para generar el QR.');
            });
        });

        document.body.appendChild(fab);
    };

    // Inicializar después de un breve delay
    setTimeout(() => {
        const formType = detectForms();
        if (formType) {
            console.log('[QR Hospitalario] Formulario detectado:', formType);
            createFAB();
        }
    }, 2000);

    // Re-detectar si el DOM cambia significativamente (para SPAs)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            const formType = detectForms();
            if (formType) createFAB();
        }
    }).observe(document, { subtree: true, childList: true });

})();
