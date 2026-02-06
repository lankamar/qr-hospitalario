// ===== IndexedDB Handler para Equipos Médicos =====
// Gestión de base de datos local

const EquiposDB = {
    dbName: 'QRHospitalarioDB',
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
                console.log('[DB] Base de datos abierta');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // Crear object store para equipos
                if (!db.objectStoreNames.contains('equipos')) {
                    const equiposStore = db.createObjectStore('equipos', { keyPath: 'id' });

                    // Índices para búsqueda rápida
                    equiposStore.createIndex('categoria', 'categoria', { unique: false });
                    equiposStore.createIndex('ubicacion', 'ubicacion', { unique: false });
                    equiposStore.createIndex('fechaRegistro', 'fechaRegistro', { unique: false });

                    console.log('[DB] Object store "equipos" creado');
                }
            };
        });
    },

    // Guardar equipo
    async saveEquipo(equipo) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readwrite');
            const store = transaction.objectStore('equipos');
            const request = store.add(equipo);

            request.onsuccess = () => {
                console.log('[DB] Equipo guardado:', equipo.id);
                resolve(equipo);
            };

            request.onerror = () => {
                console.error('[DB] Error al guardar:', request.error);
                reject(request.error);
            };
        });
    },

    // Obtener equipo por ID
    async getEquipo(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readonly');
            const store = transaction.objectStore('equipos');
            const request = store.get(id);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Obtener todos los equipos
    async getAllEquipos() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readonly');
            const store = transaction.objectStore('equipos');
            const request = store.getAll();

            request.onsuccess = () => {
                // Ordenar por fecha de registro (más recientes primero)
                const equipos = request.result.sort((a, b) =>
                    new Date(b.fechaRegistro) - new Date(a.fechaRegistro)
                );
                resolve(equipos);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Buscar equipos por categoría
    async getEquiposByCategoria(categoria) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readonly');
            const store = transaction.objectStore('equipos');
            const index = store.index('categoria');
            const request = index.getAll(categoria);

            request.onsuccess = () => {
                resolve(request.result);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Eliminar equipo
    async deleteEquipo(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readwrite');
            const store = transaction.objectStore('equipos');
            const request = store.delete(id);

            request.onsuccess = () => {
                console.log('[DB] Equipo eliminado:', id);
                resolve(true);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Actualizar equipo
    async updateEquipo(equipo) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['equipos'], 'readwrite');
            const store = transaction.objectStore('equipos');
            const request = store.put(equipo);

            request.onsuccess = () => {
                console.log('[DB] Equipo actualizado:', equipo.id);
                resolve(equipo);
            };

            request.onerror = () => {
                reject(request.error);
            };
        });
    },

    // Buscar equipos (texto libre)
    async searchEquipos(query) {
        const allEquipos = await this.getAllEquipos();
        const lowerQuery = query.toLowerCase();

        return allEquipos.filter(equipo =>
            equipo.nombre.toLowerCase().includes(lowerQuery) ||
            (equipo.ubicacion && equipo.ubicacion.toLowerCase().includes(lowerQuery)) ||
            (equipo.uso && equipo.uso.toLowerCase().includes(lowerQuery))
        );
    },

    // Obtener estadísticas
    async getStats() {
        const equipos = await this.getAllEquipos();

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const stats = {
            total: equipos.length,
            today: equipos.filter(e => new Date(e.fechaRegistro) >= today).length,
            byCategory: {}
        };

        equipos.forEach(equipo => {
            if (!stats.byCategory[equipo.categoria]) {
                stats.byCategory[equipo.categoria] = 0;
            }
            stats.byCategory[equipo.categoria]++;
        });

        return stats;
    }
};

// Exponer globalmente
window.EquiposDB = EquiposDB;
