# Nearshore Connection

Plataforma para gestión y visualización de temas, subtemas, recursos y speakers.

## Estructura del Proyecto

- **`index.html`** - Vista pública (solo lectura)
- **`admin.html`** - Panel de administración (requiere autenticación)
- **`data/temas.json`** - Archivo de datos JSON versionado
- **`js/`** - Scripts JavaScript
  - `public.js` - Lógica de la vista pública
  - `dataStore.js` - Manejo de carga/guardado de datos
  - `utils.js` - Funciones utilitarias compartidas
- **`app.js`** - Lógica del panel de administración
- **`styles.css`** - Estilos CSS

## Uso

### Vista Pública

Visita `/` o `index.html` para ver el contenido público:
- Muestra temas, subtemas y recursos
- Tabla de speakers con círculos de estatus de colores
- Renderiza contenido HTML embebido
- **Sin controles de edición**

### Panel de Administración

1. Visita `/admin.html`
2. Inicia sesión con la contraseña: `admin123`
3. Gestiona:
   - Temas y subtemas
   - Recursos (enlaces, archivos, HTML embebido)
   - Speakers (nombre, título, empresa, estatus)
   - Archivos adjuntos

### Exportar Datos

1. En el panel de administración, haz clic en **"📥 Exportar JSON"**
2. Se descargará `temas.json`
3. Guarda el archivo como `data/temas.json`
4. Haz commit y push al repositorio
5. La vista pública se actualizará automáticamente

### Importar Datos

1. En el panel de administración, haz clic en **"📤 Importar JSON"**
2. Selecciona un archivo `temas.json` válido
3. Los datos se cargarán en la aplicación

## Modelo de Datos

```json
{
  "version": 1,
  "themes": [
    {
      "id": "string",
      "name": "string",
      "description": "string",
      "subtopics": [
        {
          "id": "string",
          "name": "string",
          "resources": [
            {
              "id": "string",
              "type": "html|link|file",
              "fullHtml": "string",  // Para tipo 'html'
              "url": "string",        // Para tipo 'link' o 'file'
              "title": "string",      // Para tipo 'link'
              "name": "string"        // Para tipo 'file'
            }
          ],
          "speakers": [
            {
              "id": "string",
              "name": "string",
              "title": "string",
              "company": "string",
              "status": "white|yellow|red|black"
            }
          ]
        }
      ]
    }
  ]
}
```

## Estatus de Speakers

- **⚪ Blanco** - Estado inicial/neutro
- **🟡 Amarillo** - En progreso/advertencia
- **🔴 Rojo** - Crítico/urgente
- **⚫ Negro** - Completado/final

## Seguridad

### Autenticación
- Contraseña simple para separar vistas públicas y administrativas
- No diseñado para seguridad fuerte, solo para control de acceso básico
- Sesión guardada en `sessionStorage`

### Contenido HTML Embebido
- Solo administradores autenticados pueden agregar contenido HTML
- El contenido HTML se ejecuta intencionalmente para soportar visualizaciones interactivas
- Los administradores son responsables de verificar el contenido antes de agregarlo
- El público solo ve contenido aprobado por administradores

### Recomendaciones
- Cambiar la contraseña en `app.js` (línea 7) para producción
- Revisar todo contenido HTML antes de agregarlo
- Mantener `data/temas.json` versionado en Git para auditoría

## Desarrollo Local

```bash
# Servir archivos localmente
python3 -m http.server 8080

# Visitar
# Vista pública: http://localhost:8080/
# Admin: http://localhost:8080/admin.html
```

## Características

- ✅ Vista pública de solo lectura
- ✅ Panel de administración con autenticación
- ✅ Gestión de temas, subtemas y recursos
- ✅ Sistema de speakers con estatus visual
- ✅ Soporte para HTML/CSS/JS embebido
- ✅ Exportación/Importación de datos JSON
- ✅ Responsive design
- ✅ Sin dependencias de frameworks
