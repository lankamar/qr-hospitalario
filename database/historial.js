// ===== IndexedDB Handler para Historial de QR =====
// Gestión de base de datos local para guardar configuraciones de QR

const HistorialDB = {
    dbName: 'QRHospitalarioHistorialDB',
    version: 1,
    db: null,

    // Inicializar base de datos
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);

            request.onerror = () => {
                console.error('[DB] Error al abrir DB:', request.error);
                reject(request.error);
            };

            request.onsuccess = () => {
                this.db = request.result;
                console.log('[DB] Base de datos de historial abierta');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crear object store para historial de QR
                if (!db.objectStoreNames.contains('historial')) {
                    const historialStore = db.createObjectStore('historial', { keyPath: 'id' });

                    // Índices para búsqueda
                    historialStore.createIndex('titulo', 'titulo', { unique: false });
                    historialStore.createIndex('fechaRegistro', 'fechaRegistro', { unique: false });

                    console.log('[DB] Object store "historial" creado');
                }
            };
        });
    },

    // Guardar QR en historial
    async saveQR(qrData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['historial'], 'readwrite');
            const store = transaction.objectStore('historial');
            const request = store.add(qrData);

            request.onsuccess = () => {
                console.log('[DB] QR guardado en historial:', qrData.id);
                resolve(qrData);
            };

            request.onerror = () => {
                console.error('[DB] Error al guardar QR:', request.error);
                reject(request.error);
            };
        });
    },

    // Obtener QR por ID
    async getQR(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['historial'], 'readonly');
            const store = transaction.objectStore('historial');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Obtener todos los QRs
    async getAllQRs() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['historial'], 'readonly');
            const store = transaction.objectStore('historial');
            const request = store.getAll();

            request.onsuccess = () => {
                // Ordenar por fecha de registro (más recientes primero)
                const qrs = request.result.sort((a, b) =>
                    new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
                );
                resolve(qrs);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Eliminar QR
    async deleteQR(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['historial'], 'readwrite');
            const store = transaction.objectStore('historial');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('[DB] QR eliminado del historial:', id);
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Buscar QRs (texto libre en título o contenido)
    async searchQRs(query) {
        const allQRs = await this.getAllQRs();
        const lowerQuery = query.toLowerCase();

        return allQRs.filter(qr =>
            (qr.titulo && qr.titulo.toLowerCase().includes(lowerQuery)) ||
            (qr.contenido && qr.contenido.toLowerCase().includes(lowerQuery))
        );
    }
};

// Exponer globalmente
window.HistorialDB = HistorialDB;
