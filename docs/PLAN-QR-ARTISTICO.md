# Plan de evolución: QR artístico escaneable

## Decisión de producto

Desarrollar el generador artístico en la rama `feature/qr-artistico` del repositorio `qr-hospitalario`. Mantener `main` estable y conservar el generador hospitalario y sus funciones existentes. La rama permite probar el nuevo motor sin reemplazar ni borrar la versión que ya está publicada.

## Diagnóstico de la versión actual

La interfaz diferencia un modo Pro y un modo Artístico. El modo Pro integra una imagen central. El modo Artístico usa `easy.qrcode` con `backgroundImage`, `backgroundImageAlpha` y `dotScale`. Este último coloca la imagen detrás del QR y regula la apariencia global; no muestrea la imagen para determinar cómo se colorea o modula cada punto del código. Por eso no produce el efecto de imagen construida con los módulos que se buscaba.

## Objetivo

Permitir que una imagen elegida por el usuario se perciba dentro de los módulos de datos del QR mediante color, luminancia y tramado, mientras se preservan las zonas estructurales y se comprueba la decodificación del resultado.

## Alcance incremental

### Etapa 1: prototipo artístico determinista, local y sin IA

- Generar la matriz QR con corrección de errores H.
- Renderizar los módulos de datos sobre un canvas.
- Muestrear una imagen local y mapear color/luminancia de la imagen en cada módulo oscuro; ofrecer mezcla de color y tramado fotográfico.
- Mantener intactos los patrones funcionales del QR (localizadores, temporización, alineación y formato/versionado, según la matriz del encoder).
- Conservar zona silenciosa de cuatro módulos.
- Controles: subir imagen, modo color/monocromo, intensidad, contraste y forma/tamaño de módulo.
- Exportar PNG. Mantener la exportación vectorial solo para estilos que puedan representarse fielmente en SVG.
- Verificar localmente el PNG producido con un decodificador de QR y mostrar estado legible/no legible. Si falla, ofrecer reducir intensidad o simplificar estilo y regenerar.
- La imagen y el contenido se procesan localmente; no subirlos a servidores.

### Etapa 2: integración en la extensión

- Integrar el renderer como módulo separado, sin reescribir inicialmente el modo Pro.
- Incorporar vista previa, exportación y guardado/reutilización de parámetros.
- Actualizar README y documentación para que solo anuncien capacidades verificadas.

### Etapa 3: investigación opcional de generación por IA

- Evaluar ControlNet/difusión como modo experimental separado.
- No presentarlo como garantía de lectura; cada resultado debe pasar decodificación y pruebas con teléfonos.
- Considerar costos, privacidad, tamaño de modelos y hardware antes de integrarlo.

## Criterios de aceptación

1. Una URL corta genera un QR artístico descargable con la imagen visible dentro de los módulos.
2. Los patrones funcionales del QR y la zona silenciosa se preservan.
3. El validador confirma la decodificación del archivo exportado antes de indicar que está listo.
4. Si no se decodifica, la interfaz lo informa de manera explícita y permite regenerar con menor intensidad.
5. El caso sin imagen y el modo Pro siguen funcionando.
6. Los datos y archivos permanecen en el navegador en la primera etapa.
7. README y manual distinguen entre modo Pro (logo central), modo Artístico determinista (imagen en módulos) y cualquier modo experimental con IA.

## Riesgos y límites

- El nivel H no implica que se pueda alterar arbitrariamente el 30 % de los píxeles; la tolerancia depende de la estructura y distribución de errores.
- El contraste, la densidad del QR, la resolución, la impresión y el lector modifican la tasa de lectura.
- La validación con un único decodificador no garantiza lectura universal; probar en al menos dos teléfonos y con el tamaño final de uso.
- El modo de imagen integrada tiene que evitar modificar módulos funcionales; no alcanza con poner una imagen de fondo y subir opacidad.

## Evidencia de referencia

- Su et al. (CVPR 2021), ArtCoder: https://openaccess.thecvf.com/content/CVPR2021/html/Su_ArtCoder_An_End-to-End_Method_for_Generating_Scanning-Robust_Stylized_QR_Codes_CVPR_2021_paper.html
- Liao et al. (WACV 2025), DiffQRCoder: https://openaccess.thecvf.com/content/WACV2025/html/Liao_DiffQRCoder_Diffusion-Based_Aesthetic_QR_Code_Generation_with_Scanning_Robustness_Guided_WACV_2025_paper.html
- DENSO WAVE, corrección de errores: https://www.qrcode.com/en/about/error_correction.html
- DENSO WAVE, margen/zona silenciosa: https://www.qrcode.com/en/howto/code.html
- Referencia de implementación y estilos: https://github.com/deaa-jahjah/artistic_qr

## Siguiente entregable técnico

Construir primero un prototipo mínimo en la rama que transforme una imagen y una URL corta en un QR coloreado por módulos, con preservación de patrones estructurales y una validación de decodificación automatizada. Integrarlo a la UI solo después de verificar ese flujo.