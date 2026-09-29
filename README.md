# QR Hospitalario - Extensión Avanzada

**Versión:** 1.5.0  
**Autor:** Lankamar (Enfermería + Tech)  
**Licencia:** MIT

---

## 📋 Descripción

**QR Hospitalario** es una extensión de navegador de uso profesional. Diseñada inicialmente para el sector salud, su potente motor dual permite a cualquier educador, coordinador o profesional generar códigos QR de altísima calidad, integrando imágenes de forma inteligente (respetando la corrección de errores) o de forma artística (como fondo de los módulos).

- 🔲 Generador Híbrido: Modo Pro (vectorial seguro) y Modo Artístico (estético)
- 💾 Historial Inteligente de configuraciones guardadas localmente
- 🎨 Personalización premium con colores, formas de puntos y de anclajes
- 📥 Descarga instantánea en PNG o SVG (vector puro)

---

## ✨ Características Principales

### Motor de Generación Dual
- **Modo Pro (Seguro):** Utiliza un mapa de módulos avanzado que hace espacio (clear zone) para tu logo en el centro. Permite descargas SVG y máxima fidelidad de lectura.
- **Modo Artístico (Creativo):** La imagen que subas se coloca como fondo y los módulos del QR ajustan su opacidad e integración sobre la misma. 

### Historial y Reutilización
- **Guardado Automático:** Cada QR que crees puede ser guardado con un **Título o Nota** (ej. "Curso RCP Marzo").
- **Recarga Instantánea:** Al hacer clic en "Reutilizar" en el historial, la extensión recarga por completo tu texto, colores, forma de puntos y ¡hasta el logo que habías subido!
- Todo se almacena localmente en la base de datos segura del navegador (IndexedDB), sin necesidad de internet.

### Personalización Vectorial
- Formas de Puntos (Cuadrados, Circulares, Redondeados, Clásicos)
- Formas de Anclaje (Punto o Cuadrado)
- Color picker exacto
- Escala y opacidad para el modo artístico

---

## 🚀 Instalación 

Revisa el archivo `INSTALL.md` para ver los pasos detallados de instalación para tu equipo o para enviarlo a compañeros.

---

## 📖 Uso Rápido

1. Abre la extensión haciendo clic en el ícono de la cruz médica oscura en tu navegador.
2. Pega un enlace (Google Forms, asistencia, documentos) en el campo "Contenido".
3. **(Opcional):** Elige tus colores institucionales y la forma de los puntos.
4. **(Opcional):** Sube o *pega (Ctrl+V)* el logo de la organización. Ajusta si lo quieres como logo central (Pro) o fondo (Artístico).
5. Haz clic en el botón de Guardar Configuración en el Historial si vas a repetirlo a futuro.
6. Descárgalo en PNG o cópialo al portapapeles.

---

## 🛠️ Stack Tecnológico

| Componente | Tecnología |
|-----------|------------|
| Motor Pro | qr-code-styling (Canvas/SVG) |
| Motor Artístico | easy.qrcode (Canvas) |
| Base de datos | IndexedDB (nativa) |
| UI Framework | Vanilla JS |
| Estilos | CSS3 (Glassmorphism) |

**Sin dependencias externas conectadas a internet** → Totalmente privada y offline.

---

## 🔒 Privacidad y Seguridad

- ✅ **Datos locales:** Tu historial y logos subidos se almacenan en tu propia máquina (IndexedDB).
- ✅ **Sin tracking:** No recolectamos información ni enlaces generados.

---

## 📄 Licencia

MIT License - Uso libre.

---

## 👨‍💻 Autor

**Lankamar**  
Enfermero especializado en gestión + Desarrollador  
Universidad de Buenos Aires (UBA)equisitos
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
