# Guía de Instalación - QR Hospitalario

## Instrucciones Rápidas

### Chrome / Edge / Brave / Opera / Vivaldi

1. Abre tu navegador
2. Ve a la página de extensiones:
   - Chrome: `chrome://extensions/`
   - Edge: `edge://extensions/`
   - Brave: `brave://extensions/`
   - Opera: `opera://extensions/`

3. Activa el **"Modo de desarrollador"** (toggle en la esquina superior derecha)

4. Click en **"Cargar extensión sin empaquetar"** o **"Load unpacked"**

5. Navega a la carpeta de este proyecto.

6. Selecciona la carpeta y click **"Seleccionar carpeta"**

7. ¡Listo! Verás el ícono de QR Hospitalario en tu barra de herramientas

### Firefox

1. Abre Firefox
2. Ve a `about:debugging#/runtime/this-firefox`
3. Click en **"Cargar complemento temporal"** o **"Load Temporary Add-on"**
4. Selecciona el archivo `manifest.json`
5. ¡Listo!

**Nota:** En Firefox, las extensiones temporales se desinstalan al cerrar el navegador. Para instalación permanente, se requiere firma de Mozilla.

---

## Verificar Instalación

1. Click en el ícono de la extensión en la barra
2. Deberías ver la interfaz con tres tabs:
   - QR Rápido
   - Equipos
   - Historial

3. Prueba generar un QR:
   - Ingresa `https://google.com`
   - Click "Generar QR"
   - Deberías ver el código QR

---

## Atajo de Teclado

- **Windows/Linux:** `Ctrl + Shift + Q`
- **Mac:** `Cmd + Shift + Q`

Abre la extensión desde cualquier página.

---

## Permisos Solicitados

La extensión solo requiere:
- ✅ `contextMenus` - Para menú de click derecho
- ✅ `storage` - Para guardar equipos localmente
- ✅ `activeTab` - Para detectar formularios en la página actual

**No solicita:**
- ❌ Acceso a historial de navegación
- ❌ Acceso a cookies
- ❌ Permisos de ubicación
- ❌ Permisos de cámara/micrófono

---

## Solución de Problemas

### La extensión no aparece
- Verifica que el "Modo de desarrollador" esté activado
- Reinicia el navegador

### El QR no se genera
- Abre la consola del navegador (F12) y busca errores
- Verifica que ingresaste una URL o texto válido

### Los equipos no se guardan
- Verifica que el navegador permita almacenamiento local
- Revisa en Configuración > Privacidad que no esté bloqueado IndexedDB

---

## Actualizaciones

Cuando salga una nueva versión:

1. Descarga la nueva versión
2. Ve a `chrome://extensions/`
3. Click en el botón de **actualizar** 🔄 de la extensión
4. O simplemente reemplaza los archivos en la carpeta original

---

## Desinstalar

1. Ve a la página de extensiones
2. Click en **"Eliminar"** en la tarjeta de QR Hospitalario
3. Confirma la eliminación

**Nota:** Esto también eliminará todos los equipos registrados. Exporta a CSV/JSON antes si quieres conservarlos.
