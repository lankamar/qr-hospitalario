# Guía de Instalación - QR Hospitalario

Esta extensión está diseñada para ser instalada de forma manual en los navegadores Chrome o Edge de tu equipo o el de tus compañeros sin necesidad de subirla a la tienda pública.

## Método 1: Instalación desde archivo ZIP (Para compartir por email)

Si te enviaron el archivo `qr-hospitalario-v1.zip` por correo o WhatsApp:

1. **Descomprime el archivo**: Haz clic derecho sobre el `.zip` y selecciona "Extraer todo...". 
2. Guarda esa carpeta extraída en un lugar donde no la vayas a borrar (por ejemplo, en tus `Documentos` o en una carpeta de `Herramientas de Trabajo`).
3. Abre Google Chrome o Microsoft Edge.
4. Ve al panel de extensiones:
   - En Chrome copia en la barra superior: `chrome://extensions/`
   - En Edge copia: `edge://extensions/`
5. Activa el **"Modo de desarrollador"** (es un interruptor pequeño en la esquina superior derecha).
6. Presiona el botón que dice **"Cargar extensión sin empaquetar"** (o *Load unpacked*).
7. Se abrirá una ventana de Windows. **Selecciona la carpeta** que descomprimiste antes y haz clic en "Seleccionar carpeta".
8. ¡Listo! Arriba a la derecha en tu navegador aparecerá el loguito de la extensión (si está oculta, haz clic en el ícono del rompecabezas para fijarla 📌).

---

## Método 2: Instalación desde GitHub (Para desarrolladores)

Si acabas de bajar el código fuente desde el repositorio:

1. Clona el repositorio con Git o descarga el ZIP de GitHub.
2. Sigue exactamente los mismos pasos del Método 1, pero seleccionando la carpeta raíz del repositorio `qr-hospitalario`.

---

## Actualizar la extensión a futuro

Cuando el autor libere una nueva versión y te envíe un nuevo ZIP:

1. Reemplaza los archivos de la carpeta viaje donde la guardaste en tus Documentos, pegando los nuevos encima.
2. Abre la ventana de `chrome://extensions/`.
3. Haz clic en el botón de **Refrescar** (la flecha redonda 🔄) en la tarjeta de la extensión QR Hospitalario.
4. Los cambios se habrán aplicado.
