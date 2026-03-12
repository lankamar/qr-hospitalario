# QR Hospitalario - Extensión de Navegador

**Versión:** 1.0.0  
**Autor:** Lankamar (Enfermería + Tech)  
**Licencia:** MIT

---

## 📋 Descripción

**QR Hospitalario** es una extensión de navegador diseñada específicamente para el sector de salud que permite:

- 🔲 Generar códigos QR personalizados con logos
- 🏥 Registrar equipos médicos con inventario digital
- 📸 Capturar fotos de etiquetas de equipos
- 📊 Gestión de activos hospitalarios por servicio
- 🎨 Personalización premium con logos médicos

---

## ✨ Características Principales

### Generación de QR
- QR desde URLs o texto plano
- Personalización con logos (hospital, equipos médicos, alertas)
- Selector de colores para branding institucional
- Niveles de corrección de errores configurables
- Vista previa en tiempo real

### Registro de Equipos Médicos
- **Catalogación completa:** Bombas de infusión, nebulizadores, ventiladores, monitores
- **Captura de fotos:** Documentar etiquetas de serie y características
- **Información técnica:** Uso, funcionamiento, ubicación por servicio
- **Almacenamiento local:** Sin necesidad de conexión a internet

### Integración con Formularios
- Detección automática de Google Forms, Typeform, Microsoft Forms
- Botón flotante para generación rápida
- Compatible con formularios HTML estándar

### Menú Contextual
- Click derecho para generar QR desde cualquier enlace
- Generar QR del texto seleccionado
- Acceso rápido a registro de equipos

---

## 🚀 Instalación

### Chrome/Edge/Brave/Opera/Vivaldi

1. Descarga o clona este repositorio
2. Abre `chrome://extensions/` (o `edge://extensions/`)
3. Activa "Modo de desarrollador"
4. Click en "Cargar extensión sin empaquetar"
5. Selecciona la carpeta `extension_qr`

### Firefox

1. Descarga o clona este repositorio
2. Abre `about:debugging#/runtime/this-firefox`
3. Click en "Cargar complemento temporal"
4. Selecciona el archivo `manifest.json` dentro de `extension_qr`

---

## 📖 Uso Rápido

### Generar QR de un Formulario

1. Abre un Google Form o cualquier formulario web
2. Verás aparecer un botón flotante 🔲 en la esquina
3. Click → Extensión se abre con QR ya generado
4. Selecciona logo (opcional)
5. Descarga o copia al portapapeles

### Registrar Equipo Médico

1. Click en el icono de la extensión
2. Ve al tab "Equipos Médicos"
3. Completa el formulario:
   - Nombre del equipo
   - Categoría (Infusión, Ventilación, etc.)
   - Captura foto de la etiqueta
   - Descripción de uso y funcionamiento
   - Ubicación/servicio
4. Click "Guardar y Generar QR"
5. El QR se genera automáticamente con el logo sugerido
6. Descarga para imprimir y pegar en el equipo

### Desde Menú Contextual

- **Click derecho en un enlace** → "Generar QR de esta URL"
- **Selecciona texto** → Click derecho → "Generar QR del texto"

---

## 🎨 Logos Disponibles

La extensión incluye iconos SVG optimizados para:

- 🏥 Hospital (cruz médica)
- 💉 Bomba de infusión
- 🫁 Nebulizador
- 🌬️ Ventilador
- 📊 Monitor de signos vitales
- ⚠️ Alerta médica
- ➕ Opción para subir logo personalizado

---

## 📂 Gestión de Inventario

### Exportar Datos

Desde el tab "Historial":
- **Exportar CSV:** Para Excel o Google Sheets
- **Exportar JSON:** Backup completo de equipos

### Búsqueda y Filtros

- Buscar por nombre de equipo
- Filtrar por categoría
- Filtrar por ubicación/servicio
- Ordenar por fecha de registro

### Estadísticas

- Total de equipos registrados
- Distribución por servicio
- Equipos más recientes

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Generador QR | qrcode.js (vanilla) |
| Base de datos | IndexedDB (nativa) |
| UI Framework | Vanilla JS |
| Estilos | CSS3 (Glassmorphism) |
| Iconografía | SVG custom |

**Sin dependencias externas pesadas** → Extensión ligera y rápida

---

## 🏗️ Estructura del Proyecto

```
extension_qr/
├── manifest.json              # Configuración multi-navegador
├── popup/
│   ├── popup.html            # Interfaz principal
│   ├── popup.css             # Estilos premium
│   └── popup.js              # Lógica de generación QR
├── background/
│   └── background.js         # Service worker + menú contextual
├── content/
│   └── content.js            # Detección de formularios
├── assets/
│   ├── icons/                # Logos SVG
│   └── images/               # Assets UI
├── libs/
│   └── qrcode.min.js         # Biblioteca QR
├── database/
│   └── equipos.js            # Handler de IndexedDB
└── docs/
    ├── PRD.md                # Product Requirements Document
    └── USER_GUIDE.md         # Guía de usuario detallada
```

---

## 🎯 Casos de Uso

### 1. Enfermería - Control de Equipos
Registrar todas las bombas de infusión del servicio de UCO con QR en cada equipo. Al escanear el QR, acceder a manual de uso y última calibración.

### 2. Gestión Hospitalaria
Crear inventario digital de nebulizadores, ventiladores y monitores con ubicación por piso y sala.

### 3. Capacitación
Generar QR para formularios de evaluación de competencias en manejo de equipos médicos.

### 4. Mantenimiento Biomédico
QR codes en equipos críticos que redireccionen a historial de mantenimientos y protocolos de reparación.

---

## 🔒 Privacidad y Seguridad

- ✅ **Datos locales:** Todo se almacena en IndexedDB del navegador
- ✅ **Sin conexión a internet:** Funciona 100% offline
- ✅ **Sin tracking:** No se envían datos a servidores externos
- ✅ **Sin permisos invasivos:** Solo acceso a tabs activos y almacenamiento local

---

## 🤝 Contribuciones

Este proyecto está abierto a contribuciones. Áreas prioritarias:

- [ ] Integración con sistemas HCIS (Hospital Clinical Information System)
- [ ] Sincronización en la nube opcional
- [ ] Versión móvil (PWA)
- [ ] Soporte para códigos de barras (además de QR)

---

## 📄 Licencia

MIT License - Uso libre para instituciones hospitalarias y educativas.

---

## 👨‍💻 Autor

**Lankamar**  
Enfermero especializado en gestión + Desarrollador  
Universidad de Buenos Aires (UBA)

**Contacto:** [GitHub/LinkedIn]

---

## 🙏 Agradecimientos

- Equipo de Enfermería de UCO por feedback en requisitos
- Comunidad open-source de qrcode.js
- Testing realizado en entorno hospitalario real

---

## 📝 Changelog

### v1.0.0 (2026-02-06)
- ✨ Lanzamiento inicial
- 🔲 Generador de QR con logos
- 🏥 Sistema de registro de equipos médicos
- 📸 Captura de fotos
- 🎨 8 logos predefinidos
- 📊 Exportación CSV/JSON
- 🌐 Soporte multi-navegador
