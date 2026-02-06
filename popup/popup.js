// ===== QR Hospitalario - Main Popup Logic =====
// Autor: Lankamar | UBA
// Versión: 1.0.0

// ===== Estado Global =====
let currentQRCode = null;
let selectedLogo = null;
let customLogoData = null;
let db = null;

// ===== Logos Disponibles =====
const LOGOS = [
    { id: 'hospital', icon: '🏥', name: 'Hospital' },
    { id: 'infusion', icon: '💉', name: 'Infusión' },
    { id: 'nebulizer', icon: '🫁', name: 'Nebulizador' },
    { id: 'ventilator', icon: '🌬️', name: 'Ventilador' },
    { id: 'monitor', icon: '📊', name: 'Monitor' },
    { id: 'alert', icon: '⚠️', name: 'Alerta' },
    { id: 'heart', icon: '❤️', name: 'Cardiología' },
    { id: 'none', icon: '◻️', name: 'Sin logo' }
];

// ===== Initialization =====
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[QR Hospitalario] Iniciando...');

    // Inicializar base de datos
    db = await EquiposDB.init();

    // Cargar tema guardado
    loadTheme();

    // Renderizar logos
    renderLogoSelector();

    // Setup event listeners
    setupTabNavigation();
    setupQRGenerator();
    setupEquipoForm();
    setupHistorial();
    setupThemeToggle();

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

    // Botón "Ir a Equipos" desde empty state
    document.getElementById('goToEquiposBtn')?.addEventListener('click', () => {
        document.querySelector('[data-tab="equipos-tab"]').click();
    });
}

// ===== Logo Selector =====
function renderLogoSelector() {
    const container = document.getElementById('logoSelector');

    LOGOS.forEach(logo => {
        const div = document.createElement('div');
        div.className = 'logo-option';
        div.dataset.logoId = logo.id;
        div.title = logo.name;
        div.innerHTML = `<span style="font-size: 32px;">${logo.icon}</span>`;

        div.addEventListener('click', () => {
            document.querySelectorAll('.logo-option').forEach(l => l.classList.remove('selected'));
            div.classList.add('selected');
            selectedLogo = logo.id;

            // Regenerar QR si ya existe
            if (currentQRCode) {
                generateQRCode();
            }
        });

        container.appendChild(div);
    });
}

// ===== QR Generator =====
function setupQRGenerator() {
    const input = document.getElementById('qrInput');
    const generateBtn = document.getElementById('generateBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const copyBtn = document.getElementById('copyBtn');
    const colorInput = document.getElementById('qrColor');
    const colorValue = document.getElementById('colorValue');

    // Color picker
    colorInput.addEventListener('input', (e) => {
        colorValue.textContent = e.target.value;
        if (currentQRCode) {
            generateQRCode();
        }
    });

    // Generar QR
    generateBtn.addEventListener('click', generateQRCode);

    // Descargar
    downloadBtn.addEventListener('click', () => {
        if (!currentQRCode) return;

        const canvas = document.querySelector('#qrPreview canvas');
        const link = document.createElement('a');
        link.download = `qr-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });

    // Copiar al portapapeles
    copyBtn.addEventListener('click', async () => {
        if (!currentQRCode) return;

        const canvas = document.querySelector('#qrPreview canvas');
        canvas.toBlob(async (blob) => {
            try {
                await navigator.clipboard.write([
                    new ClipboardItem({ 'image/png': blob })
                ]);

                // Feedback visual
                copyBtn.textContent = '✓ Copiado';
                setTimeout(() => {
                    copyBtn.innerHTML = `
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                        </svg>
                        Copiar
                    `;
                }, 2000);
            } catch (err) {
                console.error('Error al copiar:', err);
            }
        });
    });

    // --- Imagen Representativa ---
    const repImageInput = document.getElementById('repImageInput');
    const repImagePreview = document.getElementById('repImagePreview');
    const selectRepImageBtn = document.getElementById('selectRepImageBtn');

    if (selectRepImageBtn) {
        selectRepImageBtn.addEventListener('click', () => {
            repImageInput.click();
        });
    }

    const handleRepImage = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            customLogoData = event.target.result;
            repImagePreview.innerHTML = `<img src="${customLogoData}" style="max-height: 100%; max-width: 100%; object-fit: contain;">`;
            if (currentQRCode) generateQRCode();
        };
        reader.readAsDataURL(file);
    };

    repImageInput.addEventListener('change', (e) => handleRepImage(e.target.files[0]));

    // Soportar Pegar Imagen (Ctrl+V)
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
}

function generateQRCode() {
    const input = document.getElementById('qrInput').value.trim();
    const color = document.getElementById('qrColor').value;
    const preview = document.getElementById('qrPreview');

    if (!input) {
        alert('Por favor ingresa una URL o texto');
        return;
    }

    // Limpiar preview
    preview.innerHTML = '';

    // Generar QR
    const qr = new QRCode(preview, {
        text: input,
        width: 280,
        height: 280,
        colorDark: color,
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.H
    });

    currentQRCode = qr;

    // Dibujar logo/imagen si existe
    setTimeout(() => {
        const canvas = document.querySelector('#qrPreview canvas');
        if (canvas && (selectedLogo || customLogoData)) {
            drawBrandingOnQR(canvas);
        }
    }, 150);

    // Habilitar botones
    document.getElementById('downloadBtn').disabled = false;
    document.getElementById('copyBtn').disabled = false;
}

function drawBrandingOnQR(canvas) {
    const ctx = canvas.getContext('2d');
    const size = canvas.width;
    const brandingSize = size * 0.22; // 22% del tamaño
    const x = (size - brandingSize) / 2;
    const y = (size - brandingSize) / 2;

    const logoImg = new Image();
    logoImg.onload = () => {
        // Fondo blanco para legibilidad (un poco más grande que el logo)
        ctx.fillStyle = 'white';
        ctx.fillRect(x - 5, y - 5, brandingSize + 10, brandingSize + 10);

        // Dibujar el logo
        ctx.drawImage(logoImg, x, y, brandingSize, brandingSize);

        // CRITICAL: qrcode.js crea un <img> que oculta al canvas. 
        // Debemos actualizar ese <img> con el nuevo contenido del canvas.
        const qrImg = document.querySelector('#qrPreview img');
        if (qrImg) {
            qrImg.src = canvas.toDataURL('image/png');
        }
    };

    if (customLogoData) {
        logoImg.src = customLogoData;
    } else {
        const logo = LOGOS.find(l => l.id === selectedLogo);
        if (logo && logo.id !== 'none') {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = 100; tempCanvas.height = 100;
            const tCtx = tempCanvas.getContext('2d');
            tCtx.font = '70px Arial'; tCtx.textAlign = 'center'; tCtx.textBaseline = 'middle';
            tCtx.fillText(logo.icon, 50, 50);
            logoImg.src = tempCanvas.toDataURL();
        }
    }
}

// ===== Equipo Form =====
function setupEquipoForm() {
    const form = document.getElementById('equipoForm');
    const photoInput = document.getElementById('photoInput');
    const uploadBtn = document.getElementById('uploadPhotoBtn');
    const photoPreview = document.getElementById('photoPreview');

    let photoData = null;

    // Upload foto
    uploadBtn.addEventListener('click', () => {
        photoInput.click();
    });

    photoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            photoData = event.target.result;
            photoPreview.innerHTML = `<img src="${photoData}" alt="Foto equipo">`;
        };
        reader.readAsDataURL(file);
    });

    // Submit form
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const equipo = {
            id: `EQ-${Date.now()}`,
            nombre: document.getElementById('equipoNombre').value,
            categoria: document.getElementById('equipoCategoria').value,
            foto: photoData,
            uso: document.getElementById('equipoUso').value,
            funcionamiento: document.getElementById('equipoFuncionamiento').value,
            ubicacion: document.getElementById('equipoUbicacion').value,
            fechaRegistro: new Date().toISOString()
        };

        // Guardar en DB
        await EquiposDB.saveEquipo(equipo);

        // Generar QR del equipo
        const qrUrl = `https://hospital-qr.app/equipo/${equipo.id}`;

        // Cambiar a tab QR y generar
        document.getElementById('qrInput').value = qrUrl;
        document.querySelector('[data-tab="qr-tab"]').click();

        // Sugerir logo basado en categoría
        const logoMap = {
            'infusion': 'infusion',
            'ventilacion': 'ventilator',
            'nebulizacion': 'nebulizer',
            'monitoreo': 'monitor',
            'otro': 'hospital'
        };

        const suggestedLogo = logoMap[equipo.categoria] || 'hospital';
        document.querySelector(`[data-logo-id="${suggestedLogo}"]`)?.click();

        generateQRCode();

        // Resetear form
        form.reset();
        photoPreview.innerHTML = `
            <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
            <p>Sin foto</p>
        `;
        photoData = null;

        // Mostrar confirmación
        alert(`✓ Equipo "${equipo.nombre}" registrado correctamente`);
    });
}

// ===== Historial =====
async function loadHistorial() {
    const equipos = await EquiposDB.getAllEquipos();
    const list = document.getElementById('equiposList');
    const statTotal = document.getElementById('statTotal');
    const statToday = document.getElementById('statToday');

    // Actualizar stats
    statTotal.textContent = equipos.length;

    const today = new Date().toDateString();
    const todayCount = equipos.filter(e =>
        new Date(e.fechaRegistro).toDateString() === today
    ).length;
    statToday.textContent = todayCount;

    // Renderizar lista
    if (equipos.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" opacity="0.3">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
                </svg>
                <p>No hay equipos registrados</p>
                <button id="goToEquiposBtn" class="btn btn-secondary">
                    Registrar Primer Equipo
                </button>
            </div>
        `;

        // Re-bind evento
        document.getElementById('goToEquiposBtn').addEventListener('click', () => {
            document.querySelector('[data-tab="equipos-tab"]').click();
        });
    } else {
        list.innerHTML = equipos.map(equipo => `
            <div class="equipo-card" data-equipo-id="${equipo.id}">
                <div class="equipo-card-header">
                    <div class="equipo-card-title">${equipo.nombre}</div>
                    <div class="equipo-card-badge">${equipo.categoria}</div>
                </div>
                <div class="equipo-card-info">📍 ${equipo.ubicacion || 'Sin ubicación'}</div>
                <div class="equipo-card-info">🕐 ${new Date(equipo.fechaRegistro).toLocaleDateString('es-AR')}</div>
            </div>
        `).join('');
    }
}

function setupHistorial() {
    const exportCsv = document.getElementById('exportCsvBtn');
    const exportJson = document.getElementById('exportJsonBtn');
    const search = document.getElementById('searchEquipos');
    const filter = document.getElementById('filterCategoria');

    // Exportar CSV
    exportCsv.addEventListener('click', async () => {
        const equipos = await EquiposDB.getAllEquipos();
        const csv = generateCSV(equipos);
        downloadFile(csv, 'equipos.csv', 'text/csv');
    });

    // Exportar JSON
    exportJson.addEventListener('click', async () => {
        const equipos = await EquiposDB.getAllEquipos();
        const json = JSON.stringify(equipos, null, 2);
        downloadFile(json, 'equipos.json', 'application/json');
    });
}

function generateCSV(equipos) {
    const headers = ['ID', 'Nombre', 'Categoría', 'Ubicación', 'Fecha Registro'];
    const rows = equipos.map(e => [
        e.id,
        e.nombre,
        e.categoria,
        e.ubicacion || '',
        new Date(e.fechaRegistro).toLocaleString('es-AR')
    ]);

    return [
        headers.join(','),
        ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
    ].join('\n');
}

function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
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
