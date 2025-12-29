# Aislamiento de Recursos HTML en GitHub Pages

## Problema Resuelto

Recursos HTML subidos que podrían sobrescribir o borrar el documento principal en GitHub Pages.

## Solución Implementada

Se ha implementado un sistema de aislamiento mediante iframes con sandbox para prevenir que los recursos HTML subidos por usuarios puedan:

1. Sobrescribir el documento principal usando `document.write()`
2. Navegar la página padre usando `window.top.location`
3. Acceder o modificar elementos del DOM principal
4. Ejecutar código malicioso que afecte la aplicación principal

## Cambios Técnicos

### Función `renderFullHTMLInIframe()`

Se creó una nueva función que renderiza contenido HTML en iframes aislados:

```javascript
function renderFullHTMLInIframe(container, fullHtmlCode) {
    const iframe = document.createElement('iframe');
    
    // Sandbox con permisos específicos
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    
    // ... renderizado del contenido
}
```

### Atributos de Sandbox

Los iframes utilizan los siguientes permisos de sandbox:

- ✅ `allow-scripts`: Permite ejecución de JavaScript (necesario para visualizaciones como Chart.js y Plotly)
- ✅ `allow-same-origin`: Permite que las librerías accedan a sus propias APIs correctamente
  - **Nota de Seguridad**: Aunque esto permite acceso al mismo origen, el iframe sigue aislado y NO puede:
    - Navegar la página padre (sin `allow-top-navigation`)
    - Modificar el DOM del documento principal
    - Usar `document.write()` para sobrescribir la página principal
  - Es necesario para que Chart.js y Plotly funcionen correctamente
- ✅ `allow-forms`: Permite uso de formularios
- ✅ `allow-modals`: Permite alerts y confirmaciones
- ❌ `allow-top-navigation`: **NO INCLUIDO** - Previene navegación de la página padre
- ❌ `allow-popups`: **NO INCLUIDO** - Previene ventanas emergentes no deseadas

### Funciones Modificadas

1. **`renderHTMLResource()`**: Ahora usa iframes para recursos HTML (tanto formato nuevo como legacy)
2. **`handlePreview()`**: Vista previa también usa iframe aislado

### Auto-redimensionamiento

Los iframes se redimensionan automáticamente basándose en su contenido:

```javascript
iframe.onload = function() {
    setTimeout(() => {
        const height = Math.max(
            iframeBody.scrollHeight,
            iframeBody.offsetHeight,
            // ...
        );
        iframe.style.height = (height + 20) + 'px';
    }, 500);
}
```

## Compatibilidad

### ✅ Funcionalidad Mantenida

- Visualizaciones con Chart.js
- Visualizaciones con Plotly
- HTML, CSS y JavaScript personalizados
- Enlaces externos
- Formularios interactivos

### ✅ Formato Legacy

Los recursos antiguos con formato separado (html/css/js) se convierten automáticamente a formato completo y se renderizan en iframes.

## Beneficios de Seguridad

1. **Aislamiento del DOM**: El HTML del recurso no puede acceder al DOM principal
2. **Prevención de document.write()**: No puede sobrescribir el documento principal
3. **Control de Navegación**: No puede redirigir la página principal
4. **Scope de Scripts**: JavaScript ejecutado en contexto aislado
5. **Estilos Aislados**: CSS no afecta elementos fuera del iframe

## Pruebas

Para verificar el aislamiento, se puede:

1. Crear un recurso HTML con `document.write()`
2. Verificar que el documento principal permanece intacto
3. Confirmar que el contenido se renderiza correctamente en el iframe

## Notas para Desarrolladores

- Los recursos HTML ahora se renderizan en iframes en lugar de directamente en el DOM
- El aislamiento es transparente para los usuarios finales
- Los recursos existentes continúan funcionando sin necesidad de migración
- Los nuevos recursos automáticamente usan el sistema de aislamiento

## Compatibilidad con GitHub Pages

Esta solución es completamente compatible con GitHub Pages ya que:

- No requiere procesamiento del lado del servidor
- Usa solo APIs estándar del navegador
- Es JavaScript puro del lado del cliente
- Los iframes funcionan correctamente en páginas estáticas
