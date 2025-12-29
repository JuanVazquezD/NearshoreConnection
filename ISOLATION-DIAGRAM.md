# Diagrama de Aislamiento de Recursos HTML

## 🏗️ Arquitectura del Aislamiento

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCUMENTO PRINCIPAL (index.html)              │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    DOM Principal                            │ │
│  │  • Header con logo                                         │ │
│  │  • Gestión de Temas                                        │ │
│  │  • Controles de la aplicación                             │ │
│  │                                                             │ │
│  │  ┌──────────────────────────────────────────────────────┐ │ │
│  │  │         CONTENEDOR DE RECURSOS                       │ │ │
│  │  │                                                       │ │ │
│  │  │  ╔═══════════════════════════════════════════════╗  │ │ │
│  │  │  ║   IFRAME con Sandbox (Recurso HTML Aislado)  ║  │ │ │
│  │  │  ║                                               ║  │ │ │
│  │  │  ║   sandbox="allow-scripts allow-same-origin    ║  │ │ │
│  │  │  ║             allow-forms allow-modals"         ║  │ │ │
│  │  │  ║                                               ║  │ │ │
│  │  │  ║   ┌───────────────────────────────────────┐  ║  │ │ │
│  │  │  ║   │  Contenido HTML del Usuario          │  ║  │ │ │
│  │  │  ║   │                                       │  ║  │ │ │
│  │  │  ║   │  • Chart.js Visualizations           │  ║  │ │ │
│  │  │  ║   │  • Plotly Graphs                      │  ║  │ │ │
│  │  │  ║   │  • Custom HTML/CSS/JS                 │  ║  │ │ │
│  │  │  ║   │                                       │  ║  │ │ │
│  │  │  ║   │  ⚠️ Scripts aislados - no pueden:    │  ║  │ │ │
│  │  │  ║   │    ❌ document.write() al padre      │  ║  │ │ │
│  │  │  ║   │    ❌ window.top.location            │  ║  │ │ │
│  │  │  ║   │    ❌ Modificar DOM padre            │  ║  │ │ │
│  │  │  ║   │    ❌ Acceder a variables globales   │  ║  │ │ │
│  │  │  ║   │                                       │  ║  │ │ │
│  │  │  ║   └───────────────────────────────────────┘  ║  │ │ │
│  │  │  ╚═══════════════════════════════════════════════╝  │ │ │
│  │  │                                                       │ │ │
│  │  └──────────────────────────────────────────────────────┘ │ │
│  │                                                             │ │
│  │  • Más temas y subtemas...                                 │ │
│  │  • Footer                                                  │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Flujo de Renderizado

```
┌──────────────────┐
│  Usuario sube    │
│  Recurso HTML    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  renderHTMLResource(containerId)     │
│  • Obtiene contenedor                │
│  • Limpia contenido anterior         │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  renderFullHTMLInIframe(container)   │
│  • Crea iframe                       │
│  • Aplica atributos sandbox          │
│  • Estiliza iframe                   │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Inyección Segura de Contenido       │
│                                      │
│  if (srcdoc supported)               │
│    iframe.srcdoc = fullHtmlCode      │
│  else                                │
│    iframeDoc.write(fullHtmlCode)     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Auto-resize del Iframe              │
│                                      │
│  setTimeout(() => {                  │
│    resizeIframe(iframe)              │
│  }, IFRAME_RESIZE_DELAY_INITIAL)     │
│                                      │
│  setTimeout(() => {                  │
│    resizeIframe(iframe)              │
│  }, IFRAME_RESIZE_DELAY_DYNAMIC)     │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  Contenido Renderizado y Aislado     │
│  ✅ Usuario ve visualización         │
│  ✅ Documento principal protegido    │
└──────────────────────────────────────┘
```

## 🛡️ Capas de Seguridad

```
┌─────────────────────────────────────────────────────────────┐
│                NIVEL 1: Sandbox Attributes                   │
│  ✓ allow-scripts      - Scripts solo en iframe             │
│  ✓ allow-same-origin  - APIs necesarias (Chart.js, etc.)   │
│  ✓ allow-forms        - Formularios interactivos           │
│  ✓ allow-modals       - Alerts/confirms                    │
│  ✗ allow-top-navigation - BLOQUEADO                        │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                NIVEL 2: DOM Isolation                        │
│  • Iframe tiene su propio document object                  │
│  • Scripts ejecutan en contexto aislado                     │
│  • Variables globales no compartidas                        │
│  • CSS no afecta elementos fuera del iframe                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                NIVEL 3: Same-Origin Policy                   │
│  • iframe.contentDocument protegido por SOP                │
│  • Comunicación controlada                                  │
│  • No puede acceder a cookies del padre                     │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                NIVEL 4: Code Quality                         │
│  • Uso de srcdoc (más seguro que document.write)           │
│  • Validación de contenido antes de renderizar             │
│  • Manejo de errores robusto                                │
└─────────────────────────────────────────────────────────────┘
```

## 🔍 Comparación: Antes vs Después

### ❌ ANTES (Vulnerable)
```javascript
function renderFullHTML(container, fullHtmlCode) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = fullHtmlCode;  // ⚠️ Inyección directa
    container.appendChild(wrapper);
    
    // Scripts se ejecutan en contexto global
    // Pueden usar document.write() en documento padre
    // Pueden navegar con window.top.location
}
```

**Problemas:**
- ❌ HTML inyectado directamente en DOM principal
- ❌ Scripts corren en contexto global
- ❌ document.write() puede sobrescribir página
- ❌ window.top.location puede redirigir
- ❌ Sin aislamiento de estilos

### ✅ DESPUÉS (Seguro)
```javascript
function renderFullHTMLInIframe(container, fullHtmlCode) {
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 
        'allow-scripts allow-same-origin allow-forms allow-modals');
    
    container.appendChild(iframe);
    
    if ('srcdoc' in iframe) {
        iframe.srcdoc = fullHtmlCode;  // ✅ Inyección segura
    } else {
        const iframeDoc = iframe.contentDocument;
        iframeDoc.open();
        iframeDoc.write(fullHtmlCode);
        iframeDoc.close();
    }
    
    // Auto-resize inteligente
    iframe.onload = () => {
        setTimeout(() => resizeIframe(iframe), 500);
    };
}
```

**Beneficios:**
- ✅ HTML renderizado en iframe aislado
- ✅ Scripts ejecutan en contexto aislado
- ✅ document.write() solo afecta iframe
- ✅ window.top bloqueado (no allow-top-navigation)
- ✅ DOM completamente aislado
- ✅ Estilos no afectan página principal

## 📊 Escenarios de Ataque Bloqueados

### Escenario 1: Sobrescritura con document.write()
```javascript
// En HTML del usuario:
<script>
  document.write('<h1>PÁGINA HACKEADA!</h1>');
</script>

// ❌ ANTES: Sobrescribe toda la página
// ✅ AHORA: Solo afecta al iframe, página principal intacta
```

### Escenario 2: Redirección Maliciosa
```javascript
// En HTML del usuario:
<script>
  window.top.location = 'https://malicious-site.com';
</script>

// ❌ ANTES: Redirige toda la página
// ✅ AHORA: Bloqueado por sandbox (sin allow-top-navigation)
```

### Escenario 3: Manipulación del DOM Padre
```javascript
// En HTML del usuario:
<script>
  parent.document.getElementById('mainContent').remove();
</script>

// ❌ ANTES: Podría eliminar contenido principal
// ✅ AHORA: No puede acceder al DOM padre (aislamiento)
```

### Escenario 4: Robo de Datos
```javascript
// En HTML del usuario:
<script>
  const data = parent.localStorage.getItem('userData');
  sendToServer(data);
</script>

// ❌ ANTES: Podría acceder a localStorage del padre
// ✅ AHORA: Cada iframe tiene su propio localStorage aislado
```

## 🎯 Casos de Uso Soportados

### ✅ Visualizaciones con Chart.js
```javascript
// Funciona correctamente gracias a allow-scripts y allow-same-origin
const ctx = document.getElementById('myChart');
new Chart(ctx, {
    type: 'bar',
    data: { /* ... */ }
});
```

### ✅ Gráficos con Plotly
```javascript
// Funciona correctamente
Plotly.newPlot('plotDiv', data, layout);
```

### ✅ Formularios Interactivos
```html
<!-- Funciona gracias a allow-forms -->
<form onsubmit="handleSubmit(event)">
  <input type="text" name="data">
  <button type="submit">Enviar</button>
</form>
```

### ✅ Modals y Alerts
```javascript
// Funciona gracias a allow-modals
if (confirm('¿Continuar?')) {
  alert('Proceso completado');
}
```

## 🎓 Conclusión

El sistema de aislamiento mediante iframes con sandbox proporciona:

1. **Seguridad Robusta**: Múltiples capas de protección
2. **Funcionalidad Completa**: Todas las visualizaciones funcionan
3. **Compatibilidad**: Funciona en todos los navegadores modernos
4. **Mantenibilidad**: Código limpio y bien documentado
5. **GitHub Pages Compatible**: Solo JavaScript del lado del cliente
