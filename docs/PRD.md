# Product Requirements Document (PRD)
# QR Hospitalario - Extensión de Navegador

**Versión:** 1.0.0  
**Fecha:** 2026-02-06  
**Autor:** Lankamar  
**Estado:** IMPLEMENTADO

---

## 1. Resumen Ejecutivo

**QR Hospitalario** es una extensión de navegador diseñada para el sector salud que permite generar códigos QR personalizados y mantener un inventario digital de equipos médicos.

**Valor Único:** Combina generación de QR con logos personalizados + sistema de catálogo de activos hospitalarios en una única herramienta.

---

## 2. Problema

**Contexto:**
- Los profesionales de salud necesitan compartir formularios (evaluaciones, check lists, protocolos) mediante códigos QR
- La gestión de inventario de equipos médicos (bombas de infusión, ventiladores, nebulizadores) es manual y desorganizada
- Las soluciones actuales:
  - Generadores QR genéricos sin logos personalizados
  - Sistemas de inventario complejos y costosos
  - Sin integración entre ambas funcionalidades

**Pain Points:**  
1. Generar QR requiere abrir sitios web externos
2. No se pueden agregar logos institucionales fácilmente
3. No hay trazabilidad de equipos médicos
4. Falta documentación centralizada de activos

---

## 3. Solución

Una extensión de navegador que:

### Core Features

#### 3.1 Generador de QR
- Generar QR desde URLs o texto
- Personalización con 8 logos predefinidos
- Selector de colores para branding
- Vista previa en tiempo real
- Descarga PNG o copiar al portapapeles

#### 3.2 Registro de Equipos Médicos
- Formulario completo de catalogación
- Captura de fotos de etiquetas
- Campos específicos: uso, funcionamiento, ubicación
- Generación automática de QR del equipo
- Almacenamiento local (IndexedDB)

#### 3.3 Integración con Formularios
- Detección automática de Google Forms, Typeform, Microsoft Forms
- Botón flotante para generación rápida
- Compatible con formularios HTML estándar

#### 3.4 Menú Contextual
- Click derecho en enlaces → Generar QR
- Click derecho en texto seleccionado → Generar QR
- Acceso rápido desde cualquier página

#### 3.5 Gestión de Inventario
- Historial completo de equipos
- Búsqueda y filtrado por categoría
- Estadísticas (total equipos, registros del día)
- Exportación CSV/JSON

---

## 4. Usuarios Objetivo

### Primarios
- **Enfermeros/as:** Gestión de equipos en servicios (UCO, UTI, Emergencias)
- **Docentes de salud:** Compartir materiales educativos vía QR
- **Biomédicos:** Inventario técnico de activos

### Secundarios
- Gestores hospitalarios
- Médicos residentes
- Personal administrativo de salud

---

## 5. User Stories

| ID | Como... | Quiero... | Para... |
|----|---------|-----------|---------|
| US-01 | Enfermera | Generar rápidamente un QR de un Google Form | Que los pacientes completen evaluaciones |
| US-02 | Enfermera | Agregar el logo de mi hospital al QR | Que sea reconocible institucionalmente |
| US-03 | Biomédico | Registrar una bomba de infusión con foto | Tener documentación del equipo |
| US-04 | Biomédico | Generar QR por equipo | Pegar en el activo y acceder a su info |
| US-05 | Gestora | Exportar inventario completo | Reportes para administración |
| US-06 | Docente | Desde cualquier URL hacer QR | No tener que abrir sitios externos |

---

## 6. Requisitos Funcionales

### RF-01: Generador QR
- **Entrada:** URL o texto (max 2000 caracteres)
- **Salida:** Imagen PNG 280x280px
- **Personalización:** 8 logos, color configurable
- **Acciones:** Descargar, copiar, vista previa

### RF-02: Registro de Equipos
- **Campos obligatorios:** Nombre, categoría
- **Campos opcionales:** Foto, uso, funcionamiento, ubicación
- **Categorías:** Infusión, Ventilación, Nebulización, Monitoreo, Otro
- **ID único:** Formato `EQ-{timestamp}`

### RF-03: Base de Datos Local
- **Motor:** IndexedDB
- **Almacenamiento:** Sin límite definido (sujeto a cuota del navegador)
- **Índices:** Por categoría, ubicación, fecha
- **Operaciones:** CRUD completo + búsqueda

### RF-04: Exportación
- **Formatos:** CSV, JSON
- **Contenido:** Todos los campos excepto fotos en CSV
- **Descarga:** Directa al navegador

### RF-05: Menú Contextual
- **Contextos:** Link, selección, página
- **Acción:** Abrir popup con contenido prellenado 

### RF-06: Detección de Formularios
- **Plataformas:** Google Forms, Typeform, Microsoft Forms, HTML genérico
- **UI:** Botón flotante en esquina inferior derecha
- **Interacción:** Click → genera QR de la URL

---

## 7. Requisitos No Funcionales

### RNF-01: Performance
- Tiempo de generación de QR: < 200ms
- Carga de historial de 100 equipos: < 500ms
- Tamaño de extensión empaquetada: < 500KB

### RNF-02: Compatibilidad
- Chrome 88+
- Edge 88+
- Firefox 85+
- Opera 74+
- Brave (versiones recientes)

### RNF-03: Usabilidad
- Interfaz en español
- Diseño responsive (mín 380px ancho)
- Modo oscuro/claro
- Accesibilidad WCAG 2.1 AA

### RNF-04: Seguridad
- Sin permisos de cookies
- Sin acceso a historial de navegación
- Almacenamiento local únicamente
- Sin conexiones externas (excepto carga inicial de lib QR)

### RNF-05: Privacidad
- Sin tracking
- Sin telemetría
- Sin compartir datos con terceros
- Datos 100% locales

---

## 8. Arquitectura

### Componentes

```
┌─────────────┐       ┌──────────────┐       ┌─────────────┐
│   Popup UI  │◄─────►│ Background   │◄─────►│  Content    │
│             │       │Service Worker│       │  Script     │
└──────┬──────┘       └──────────────┘       └─────────────┘
       │
       ▼
┌─────────────┐       ┌──────────────┐
│  IndexedDB  │       │  QRCode.js   │
│   equipos   │       │   Library    │
└─────────────┘       └──────────────┘
```

### Stack
- **Frontend:** Vanilla JS, HTML5, CSS3
- **Base de datos:** IndexedDB
- **Biblioteca QR:** qrcodejs 1.0.0
- **Manifest:** v3 (Chrome), v2 compatible (Firefox)

---

## 9. Wireframes (Descripciones)

### Popup Principal
- **Header:** Logo + tema toggle + settings
- **Tabs:** QR Rápido | Equipos | Historial
- **Tab QR:** Input + selector logos + preview + botones
- **Tab Equipos:** Formulario completo con captura de foto
- **Tab Historial:** Lista de equipos + búsqueda + stats

### Botón Flotante (Content)
- Circular, fondo azul gradiente
- Icono QR blanco
- Sombra pronunciada
- Animación de entrada desde abajo

---

## 10. Métricas de Éxito

### Adopción
- 50+ instalaciones en primer mes (sector salud UBA)
- 10+ equipos registrados por usuario activo

### Uso
- 5+ QRs generados por usuario/semana
- Tasa de retención 30 días: > 60%

### Satisfacción
- Rating Chrome Web Store: > 4.5/5
- Feedback positivo de enfermería UBA

---

## 11. Roadmap Futuro

### v1.1 (Q2 2026)
- Sincronización en la nube (opcional)
- Códigos de barras además de QR
- Templates de QR guardados

### v1.2 (Q3 2026)
- Integración con sistemas HCIS
- Escaneo de QR desde la extensión
- Reportes avanzados con gráficos

### v2.0 (Q4 2026)
- PWA móvil complementaria
- Multi-idioma (inglés, portugués)
- Modo colaborativo entre equipos

---

## 12. Restricciones

### Técnicas
- Sin backend propio (solo browser APIs)
- Límite de storage del navegador (~50MB típico)
- Fotos limitadas a 2MB c/u para performance

### De Negocio
- Gratuito y open-source
- Sin monetización directa
- Mantenimiento por comunidad

---

## 13. Criterios de Aceptación

| ID | Criterio | Estado |
|----|----------|--------|
| AC-01 | Generar QR desde URL en < 1 segundo | ✅ |
| AC-02 | Logos se aplican correctamente | ✅ |
| AC-03 | Equipos se guardan en IndexedDB | ✅ |
| AC-04 | Exportar CSV con formato correcto | ✅ |
| AC-05 | Botón flotante aparece en formularios | ✅ |
| AC-06 | Menú contextual funcional | ✅ |
| AC-07 | Dark mode persiste entre sesiones | ✅ |
| AC-08 | Funciona sin conexión a internet | ✅ |

---

## 14. Riesgos y Mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Límite de storage alcanzado | Media | Alto | Compresión de fotos, alertas al usuario |
| Cambios en APIs de navegadores | Baja | Alto | Usar web standards estables |
| Competencia con apps similares | Media | Medio | Enfoque específico en salud |

---

## 15. Glosario

- **QR:** Quick Response Code
- **UCO:** Unidad de Cuidados Coronarios
- **UTI:** Unidad de Terapia Intensiva
- **HCIS:** Hospital Clinical Information System
- **Glassmorphism:** Estilo de diseño con efecto de vidrio esmerilado

---

**Aprobado por:** Lankamar  
**Fecha de aprobación:** 2026-02-06  
**Próxima revisión:** Q2 2026
