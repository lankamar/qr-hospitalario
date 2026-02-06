// ===== Background Service Worker =====
// Menú contextual y gestión de eventos

// Crear menús contextuales al instalar
chrome.runtime.onInstalled.addListener(() => {
    console.log('[QR Hospitalario] Extensión instalada');

    // Menú para enlaces
    chrome.contextMenus.create({
        id: 'qr-from-link',
        title: '🔲 Generar QR de esta URL',
        contexts: ['link']
    });

    // Menú para texto seleccionado
    chrome.contextMenus.create({
        id: 'qr-from-selection',
        title: '🔲 Generar QR de este texto',
        contexts: ['selection']
    });

    // Menú para imágenes (obtener URL)
    chrome.contextMenus.create({
        id: 'qr-from-image',
        title: '🔲 Generar QR de esta imagen',
        contexts: ['image']
    });
});

// Manejar clics en el menú contextual
chrome.contextMenus.onClicked.addListener((info, tab) => {
    let urlToShare = '';

    if (info.menuItemId === 'qr-from-link') {
        urlToShare = info.linkUrl;
    } else if (info.menuItemId === 'qr-from-selection') {
        urlToShare = info.selectionText;
    } else if (info.menuItemId === 'qr-from-image') {
        urlToShare = info.srcUrl;
    }

    if (urlToShare) {
        // Guardar temporalmente en storage para que el popup lo tome al abrir
        chrome.storage.local.set({ 'pendingQR': urlToShare }, () => {
            // Notificar al usuario (badges u otra forma si popup no está abierto)
            chrome.action.setBadgeText({ text: '!' });
            chrome.action.setBadgeBackgroundColor({ color: '#2563eb' });
        });
    }
});

// Limpiar badge cuando se abre el popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'clearBadge') {
        chrome.action.setBadgeText({ text: '' });
    }
});

// Mensajería simple para el content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'openPopup') {
        // En MV3 no se puede abrir el popup programáticamente por seguridad,
        // pero podemos enviar una notificación o guardar el estado.
        console.log('[Background] Solicitud de apertura recibida');
    }
});
