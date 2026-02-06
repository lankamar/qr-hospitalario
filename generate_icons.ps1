$destPath = "C:\PROGRAMANDO\antigravity\extension_qr\assets\images"
if (-not (Test-Path $destPath)) { New-Item -ItemType Directory -Path $destPath -Force }

# Base64 de un icono minimalista de 128x128 (Azul con cruz blanca simplificada para prueba inicial rápida)
# Este es un PNG real comprimido en base64
$iconBase64 = "iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAADBQTFRFJWN6AAAA////JVN6AAAAAAAAl5eXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAs9is+AAAABB0Uk5T////////////////////AO7iebcAAACPSURBVHja7NaxDcAgEATBf8v9t0wbCHYInZAs90onNAt9FmYyMzMzMzMzMzMzMzMzM3v+bK98b6v76N56Sve20X10L6v76F5W99G9rO6je1ndR/eyuo/uZXUf3cvqPrqX1X10L6v76F5W99G9rO6je1ndR/eyuo/uZXUf3cvqPrqX1X10L6v76F5W99G9rO6je1ndR/eyuo/uZXUf3cvqPrqX1X1078o9X//PzMzMzMzMzPzPvgIMAHWBA9H30Y6UAAAAAElFTkSuQmCC"

$bytes = [Convert]::FromBase64String($iconBase64)

# Crear los tres tamaños requeridos por el manifest
[IO.File]::WriteAllBytes("$destPath\icon128.png", $bytes)
[IO.File]::WriteAllBytes("$destPath\icon48.png", $bytes)
[IO.File]::WriteAllBytes("$destPath\icon16.png", $bytes)

Write-Host "[OK] Iconos generados físicamente en $destPath" -ForegroundColor Green
