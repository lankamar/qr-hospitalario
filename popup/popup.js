// ===== QR Hospitalario - Main Popup Logic =====
// Autor: Lankamar | UBA
// Versión: 1.0.0

// ===== Estado Global =====
let currentQRCode = null;
let selectedLogo = null;
let customLogoData = null;
let db = null;



// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[QR Hospitalario] Iniciando...');

    // Inicializar base de datos
    try {
        db = await HistorialDB.init();
    } catch (e) {
        console.error('No se pudo inicializar la DB del Historial', e);
    }

    // Cargar tema guardado
    loadTheme();

    // Setup event listeners
    setupTabNavigation();
    setupQRGenerator();

    setupHistorial();
    setupThemeToggle();
    
    // Cargar los items guardados
    try {
        await loadHistorial();
    } catch (e) {
        console.error('No se pudo renderizar la tabla del Historial', e);
    }

    console.log('[QR Hospitalario] Listo');
});

// ===== Tab Navigation =====
function setupTabNavigation() {
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;

            // Remover active de todos
            tabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(tc => tc.classList.remove('active'));

            // Activar seleccionado
            tab.classList.add('active');
            document.getElementById(targetTab).classList.add('active');

            // Si es historial, recargar
            if (targetTab === 'historial-tab') {
                loadHistorial();
            }
        });
    });

}



// ===== QR Generator =====
function setupQRGenerator() {
    const input = document.getElementById('qrInput');
    const qrTypeRadios = document.getElementsByName('qrType');
    const colorInput = document.getElementById('qrColor');
    const colorValue = document.getElementById('colorValue');
    
    // Panel 2 elements
    const dotShapeSelect = document.getElementById('dotShape');
    const cornerSquareShapeSelect = document.getElementById('cornerSquareShape');
    
    // Panel 3 elements
    const repImageInput = document.getElementById('repImageInput');
    const repImagePreview = document.getElementById('repImagePreview');
    const selectRepImageBtn = document.getElementById('selectRepImageBtn');
    const clearRepImageBtn = document.getElementById('clearRepImageBtn');
    const imageSettings = document.getElementById('imageSettings');
    const imageModeRadios = document.getElementsByName('imageMode');
    const proOptionsDiv = document.getElementById('proOptions');
    const artisticOptionsDiv = document.getElementById('artisticOptions');

    // Pro
    const hideBackgroundDots = document.getElementById('hideBackgroundDots');
    const logoSizeInput = document.getElementById('logoSizeInput');
    const logoSizeValue = document.getElementById('logoSizeValue');
    
    // Artistic
    const dotScaleInput = document.getElementById('dotScaleInput');
    const dotScaleValue = document.getElementById('dotScaleValue');
    const bgAlphaInput = document.getElementById('bgAlphaInput');
    const bgAlphaValue = document.getElementById('bgAlphaValue');

    // Actions
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const exportSvgBtn = document.getElementById('exportSvgBtn');

    // Generate event (debounced)
    let generateTimeout;
    const triggerGenerate = () => {
        if (input.value.trim().length > 0) {
            clearTimeout(generateTimeout);
            generateTimeout = setTimeout(() => {
                generateQRCode();
            }, 250); // 250ms debounce para evitar tildes al escribir rápido
        }
    };

    // Listeners
    input.addEventListener('input', triggerGenerate);
    colorInput.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
        triggerGenerate();
    });
    dotShapeSelect.addEventListener('change', triggerGenerate);
    cornerSquareShapeSelect.addEventListener('change', triggerGenerate);
    hideBackgroundDots.addEventListener('change', triggerGenerate);
    
    logoSizeInput.addEventListener('input', (e) => {
        logoSizeValue.textContent = e.target.value;
        triggerGenerate();
    });

    imageModeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if(e.target.value === 'pro') {
                proOptionsDiv.style.display = 'block';
                artisticOptionsDiv.style.display = 'none';
            } else {
                proOptionsDiv.style.display = 'none';
                artisticOptionsDiv.style.display = 'block';
            }
            triggerGenerate();
        });
    });

    dotScaleInput.addEventListener('input', (e) => {
        dotScaleValue.textContent = e.target.value;
        triggerGenerate();
    });

    bgAlphaInput.addEventListener('input', (e) => {
        bgAlphaValue.textContent = e.target.value;
        triggerGenerate();
    });

    // Logo Handling
    selectRepImageBtn.addEventListener('click', () => repImageInput.click());
    clearRepImageBtn.addEventListener('click', () => {
        customLogoData = null;
        repImagePreview.innerHTML = '<p style="font-size: 11px;">Subir o pegar imagen (Ctrl+V)</p>';
        imageSettings.style.display = 'none';
        clearRepImageBtn.style.display = 'none';
        triggerGenerate();
    });

    const handleRepImage = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            customLogoData = event.target.result;
            repImagePreview.innerHTML = `<img src="${customLogoData}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
            imageSettings.style.display = 'block';
            clearRepImageBtn.style.display = 'block';
            triggerGenerate();
        };
        reader.readAsDataURL(file);
    };

    repImageInput.addEventListener('change', (e) => handleRepImage(e.target.files[0]));

    document.addEventListener('paste', (e) => {
        const items = e.clipboardData.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                const blob = items[i].getAsFile();
                handleRepImage(blob);
                break;
            }
        }
    });

    // Descargar PNG
    downloadBtn.addEventListener('click', () => {
        if (!currentQRCode) return;
        const selectedMode = document.querySelector('input[name="imageMode"]:checked')?.value || 'pro';
        if (customLogoData && selectedMode === 'artistic') {
            const canvas = document.querySelector('#qrPreview canvas');
            const link = document.createElement('a');
            link.download = `qr-hospitalario-artistico-${Date.now()}.png`;
            link.href = canvas.toDataURL();
            link.click();
        } else {
            currentQRCode.download({ name: `qr-hospitalario-pro-${Date.now()}`, extension: "png" });
        }
    });

    // Descargar SVG
    exportSvgBtn.addEventListener('click', () => {
        if (!currentQRCode) return;
        const selectedMode = document.querySelector('input[name="imageMode"]:checked')?.value || 'pro';
        if (customLogoData && selectedMode === 'artistic') {
           alert("El modo fondo artístico renderiza pixel a pixel la imagen y no soporta SVG. Elija Modo Pro para exportar SVG vectorial limpio.");
        } else {
            currentQRCode.download({ name: `qr-hospitalario-${Date.now()}`, extension: "svg" });
        }
    });

    // Copiar
    copyBtn.addEventListener('click', async () => {
        if (!currentQRCode) return;
        try {
            const selectedMode = document.querySelector('input[name="imageMode"]:checked')?.value || 'pro';
            let blob;
            if (customLogoData && selectedMode === 'artistic') {
                const canvas = document.querySelector('#qrPreview canvas');
                blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
            } else {
                blob = await currentQRCode.getRawData("png");
            }

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            copyBtn.textContent = '✓ Copiado';
            setTimeout(() => { copyBtn.textContent = 'Copiar'; }, 2000);
        } catch (err) {
            console.error('Error al copiar:', err);
        }
    });
}

function updateFeedback(type, message) {
    const box = document.getElementById('feedbackBox');
    box.className = `feedback-box ${type}`;
    let icon = '';
    if (type === 'success') icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
    else if (type === 'warning') icon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2"/></svg>`;
    box.innerHTML = `${icon} <span>${message}</span>`;
}

function generateQRCode() {
    const input = document.getElementById('qrInput').value.trim();
    if (!input) return;

    const color = document.getElementById('qrColor').value;
    const dotShape = document.getElementById('dotShape').value;
    const cornerSquareShape = document.getElementById('cornerSquareShape').value;
    
    // Pro Params
    const hideBackgroundDots = document.getElementById('hideBackgroundDots').checked;
    const logoSize = parseFloat(document.getElementById('logoSizeInput').value);
    
    // Artistic Params
    const dotScale = parseFloat(document.getElementById('dotScaleInput').value);
    const bgAlpha = parseFloat(document.getElementById('bgAlphaInput').value);

    // Selected Mode
    const selectedMode = document.querySelector('input[name="imageMode"]:checked')?.value || 'pro';

    // Heurísticas de seguridad
    if (customLogoData && selectedMode === 'pro' && logoSize > 0.4) {
        updateFeedback('warning', 'Advertencia: El logo Pro es muy grande, podría fallar al escanearse.');
    } else if (customLogoData && selectedMode === 'artistic' && dotScale < 0.3) {
        updateFeedback('warning', 'Advertencia: Los puntos artísticos son minúsculos. Súbelos o podría no leerse.');
    } else if (customLogoData && selectedMode === 'artistic' && bgAlpha > 0.6 && dotScale < 0.5) {
        updateFeedback('warning', 'Advertencia: Combinación difícil. Un fondo opaco requerirá un buen tamaño de puntos (mayor a 0.5) para que contraste la cámara.');
    } else {
        updateFeedback('success', 'Perfecto: Tu QR tiene parámetros aparentemente correctos para ser leídos.');
    }

    const preview = document.getElementById('qrPreview');
    preview.innerHTML = '';

    const options = {
        width: 300,
        height: 300,
        type: "canvas",
        data: input,
        image: customLogoData || undefined,
        margin: 10,
        qrOptions: {
            typeNumber: 0,
            mode: "Byte",
            errorCorrectionLevel: customLogoData ? "H" : "Q"
        },
        imageOptions: {
            hideBackgroundDots: hideBackgroundDots,
            imageSize: logoSize,
            margin: 5,
            crossOrigin: "anonymous",
        },
        dotsOptions: {
            color: color,
            type: dotShape 
        },
        backgroundOptions: {
            color: "#ffffff",
        },
        cornersSquareOptions: {
            color: color,
            type: cornerSquareShape 
        },
        cornersDotOptions: {
            color: color,
            type: cornerSquareShape === 'square' ? 'square' : 'dot'
        }
    };

    if (customLogoData && selectedMode === 'artistic') {
        exportSvgBtn.disabled = true;
        // MODO ARTÍSTICO CLÁSICO USANDO EASYQRCODEJS
        const artisticOptions = {
            text: input,
            width: 300,
            height: 300,
            colorDark: color,
            colorLight: '#ffffff',
            correctLevel: QRCode.CorrectLevel.H,
            format: 'PNG',
            backgroundImage: customLogoData,
            backgroundImageAlpha: bgAlpha,
            dotScale: dotScale,
            autoColor: false,
            PO: color,
            PI: color
        };

        const qr = new QRCode(preview, artisticOptions);
        currentQRCode = qr;
    } else {
        exportSvgBtn.disabled = false;
        // MODO PRO / DEFAULT USANDO QRCODESTYLING
        currentQRCode = new QRCodeStyling(options);
        currentQRCode.append(preview);
    }

    document.getElementById('downloadBtn').disabled = false;
    document.getElementById('copyBtn').disabled = false;
    
    // Configurar Botón Guardar en Historial
    const saveBtn = document.getElementById('saveHistoryBtn');
    saveBtn.onclick = async () => {
        const titleInput = document.getElementById('qrTitle').value.trim();
        const feedback = document.getElementById('saveFeedback');
        
        const qrData = {
            id: Date.now(),
            titulo: titleInput,
            contenido: input,
            fechaRegistro: Date.now(),
            opciones: {
                selectedMode,
                color,
                dotShape,
                cornerSquareShape,
                hideBackgroundDots,
                logoSize,
                dotScale,
                bgAlpha,
                customLogoData
            }
        };

        try {
            await HistorialDB.saveQR(qrData);
            feedback.style.color = 'var(--success)';
            feedback.textContent = '¡Guardado en el historial!';
            loadHistorial(); // Refrescar lista
        } catch (e) {
            feedback.style.color = 'var(--danger)';
            feedback.textContent = 'Error al guardar.';
        }

        setTimeout(() => feedback.textContent = '', 3000);
    };

    document.getElementById('exportSvgBtn').disabled = false;
}

// La función drawBrandingOnQR ya no es necesaria con easyqrcodejs



// ===== Historial =====
async function loadHistorial() {
    const qrs = await HistorialDB.getAllQRs();
    const list = document.getElementById('historialList');

    // Renderizar lista
    if (qrs.length === 0) {
        list.innerHTML = `
            <div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" opacity="0.3" style="margin-bottom: 16px;">
                    <path d="M13 3c-4.97 0-9 4.03-9 9H1l3.89 3.89.07.14L9 12H6c0-3.87 3.13-7 7-7s7 3.13 7 7-3.13 7-7 7c-1.93 0-3.68-.79-4.94-2.06l-1.42 1.42C8.27 19.99 10.51 21 13 21c4.97 0 9-4.03 9-9s-4.03-9-9-9zm-1 5v5l4.28 2.54.72-1.21-3.5-2.08V8H12z"/>
                </svg>
                <p style="font-size: 14px; font-weight: 500;">No hay QRs guardados en el historial</p>
                <p style="font-size: 12px; margin-top: 8px;">Usa el botón "Guardar configuración" en el generador</p>
            </div>
        `;

    } else {
        list.innerHTML = qrs.map(qr => `
            <div class="equipo-card" style="padding: 12px; cursor: default; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-element); display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px; font-size: 14px;">${qr.titulo || 'QR Sin Título'}</div>
                    <div style="color: var(--text-secondary); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${qr.contenido}</div>
                    <div style="color: var(--text-secondary); font-size: 11px; margin-top: 6px;">📅 ${new Date(qr.fechaRegistro).toLocaleString()} • Modo ${qr.opciones.selectedMode === 'pro' ? 'Pro' : 'Artístico'}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="btn btn-primary btn-sm reuse-btn" data-id="${qr.id}" style="padding: 6px 12px; font-size: 12px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border: 1px solid var(--primary);">
                        Reutilizar Config
                    </button>
                    <button class="btn btn-secondary btn-sm delete-btn" data-id="${qr.id}" style="padding: 6px 12px; font-size: 12px; color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3);">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');

        // Listeners for Reuse
        document.querySelectorAll('.reuse-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                const qr = await HistorialDB.getQR(id);
                if (qr) applyHistorialQR(qr);
            });
        });

        // Listeners for Delete
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = parseInt(e.target.dataset.id);
                if(confirm("¿Seguro que deseas eliminar este QR del historial?")) {
                    await HistorialDB.deleteQR(id);
                    loadHistorial();
                }
            });
        });
    }
}

function applyHistorialQR(qrData) {
    // 1. Poblating UI Elements
    document.getElementById('qrInput').value = qrData.contenido;
    document.getElementById('qrTitle').value = qrData.titulo || '';
    
    document.getElementById('qrColor').value = qrData.opciones.color;
    document.getElementById('colorValue').textContent = qrData.opciones.color;
    document.getElementById('dotShape').value = qrData.opciones.dotShape;
    document.getElementById('cornerSquareShape').value = qrData.opciones.cornerSquareShape;
    
    // Set Mode Radio
    const radios = document.getElementsByName('imageMode');
    for (const radio of radios) {
        if (radio.value === qrData.opciones.selectedMode) {
            radio.checked = true;
            // Dispatch change event to toggle panels visibility
            radio.dispatchEvent(new Event('change'));
            break;
        }
    }

    // Pro options
    document.getElementById('hideBackgroundDots').checked = qrData.opciones.hideBackgroundDots;
    document.getElementById('logoSizeInput').value = qrData.opciones.logoSize;
    document.getElementById('logoSizeValue').textContent = qrData.opciones.logoSize;

    // Artistic options
    document.getElementById('dotScaleInput').value = qrData.opciones.dotScale;
    document.getElementById('dotScaleValue').textContent = qrData.opciones.dotScale;
    document.getElementById('bgAlphaInput').value = qrData.opciones.bgAlpha;
    document.getElementById('bgAlphaValue').textContent = qrData.opciones.bgAlpha;

    // Image Setup
    customLogoData = qrData.opciones.customLogoData;
    const repImagePreview = document.getElementById('repImagePreview');
    const imageSettings = document.getElementById('imageSettings');
    const clearRepImageBtn = document.getElementById('clearRepImageBtn');

    if (customLogoData) {
        repImagePreview.innerHTML = `<img src="${customLogoData}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
        imageSettings.style.display = 'block';
        clearRepImageBtn.style.display = 'block';
    } else {
        repImagePreview.innerHTML = '<p style="font-size: 11px;">Subir o pegar imagen (Ctrl+V)</p>';
        imageSettings.style.display = 'none';
        clearRepImageBtn.style.display = 'none';
    }

    // 2. Switch Tab back to Generator and Trigger Render
    document.querySelectorAll('.tab-btn')[0].click(); // Generator Tab
    generateQRCode();
    updateFeedback('success', `¡Configuración cargada desde el historial exitosamente!`);
    
    // Hide visual confirmation slightly
    setTimeout(() => {
        document.getElementById('feedbackBox').className = `feedback-box success`;
    }, 3000);
}

function setupHistorial() {
    const search = document.getElementById('searchHistorial');

    // Search 
    search.addEventListener('input', async (e) => {
        const query = e.target.value.trim();
        if (query.length === 0) {
            loadHistorial();
            return;
        }
        
        const qrs = await HistorialDB.searchQRs(query);
        const list = document.getElementById('historialList');
        // Re-use rendering logic (we can refactor render into a pure function later if needed)
        
        if (qrs.length === 0) {
           list.innerHTML = `<div class="empty-state" style="text-align: center; padding: 40px; color: var(--text-secondary);">
                                <p style="font-size: 14px; font-weight: 500;">No se encontraron resultados para "${query}"</p>
                             </div>`;
        } else {
            // Render found QRs... (code repetition shortened here for brevity, standard mapping applies)
            list.innerHTML = qrs.map(qr => `
            <div class="equipo-card" style="padding: 12px; cursor: default; border: 1px solid var(--border); border-radius: 8px; background: var(--bg-element); display: flex; align-items: center; gap: 12px;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px; font-size: 14px;">${qr.titulo || 'QR Sin Título'}</div>
                    <div style="color: var(--text-secondary); font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${qr.contenido}</div>
                    <div style="color: var(--text-secondary); font-size: 11px; margin-top: 6px;">📅 ${new Date(qr.fechaRegistro).toLocaleString()} • Modo ${qr.opciones.selectedMode === 'pro' ? 'Pro' : 'Artístico'}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 6px;">
                    <button class="btn btn-primary btn-sm reuse-btn" data-id="${qr.id}" style="padding: 6px 12px; font-size: 12px; background: rgba(59, 130, 246, 0.1); color: var(--primary); border: 1px solid var(--primary);">
                        Reutilizar Config
                    </button>
                    <button class="btn btn-secondary btn-sm delete-btn" data-id="${qr.id}" style="padding: 6px 12px; font-size: 12px; color: var(--danger); border: 1px solid rgba(239, 68, 68, 0.3);">
                        Eliminar
                    </button>
                </div>
            </div>
        `).join('');

            // Listeners for Reuse/Delete
            document.querySelectorAll('.reuse-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = parseInt(e.target.dataset.id);
                    const qr = await HistorialDB.getQR(id);
                    if (qr) applyHistorialQR(qr);
                });
            });

            document.querySelectorAll('.delete-btn').forEach(btn => {
                btn.addEventListener('click', async (e) => {
                    const id = parseInt(e.target.dataset.id);
                    if(confirm("¿Seguro que deseas eliminar este QR del historial?")) {
                        await HistorialDB.deleteQR(id);
                        loadHistorial();
                    }
                });
            });
        }
    });
}


// ===== Theme Toggle =====
function setupThemeToggle() {
    const toggle = document.getElementById('themeToggle');

    toggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.dataset.theme;
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.dataset.theme = newTheme;
        localStorage.setItem('qr-theme', newTheme);

        updateThemeIcon(newTheme);
    });
}

function loadTheme() {
    const savedTheme = localStorage.getItem('qr-theme') || 'light';
    document.documentElement.dataset.theme = savedTheme;
    updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (theme === 'dark') {
        icon.innerHTML = `<path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05z"/>`;
    } else {
        icon.innerHTML = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>`;
    }
}
