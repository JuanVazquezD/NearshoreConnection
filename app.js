// Nearshore Connection - Gestión de Temas y Recursos
// Almacenamiento de datos
let themes = [];
let currentThemeId = null;
let currentSubtopicId = null;

// Cargar datos del localStorage al iniciar
document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage();
    renderThemes();
    initializeEventListeners();
});

// Inicializar event listeners
function initializeEventListeners() {
    // Botón agregar tema
    document.getElementById('addThemeBtn').addEventListener('click', () => {
        openThemeModal();
    });

    // Forms
    document.getElementById('themeForm').addEventListener('submit', handleThemeSubmit);
    document.getElementById('subtopicForm').addEventListener('submit', handleSubtopicSubmit);
    document.getElementById('resourceForm').addEventListener('submit', handleResourceSubmit);
    document.getElementById('uploadForm').addEventListener('submit', handleUploadSubmit);

    // Resource type selector
    document.getElementById('resourceType').addEventListener('change', handleResourceTypeChange);

    // Preview button
    document.getElementById('previewBtn').addEventListener('click', handlePreview);

    // Close modals
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });

    // Close modal on outside click
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
}

// LocalStorage functions
function saveToLocalStorage() {
    localStorage.setItem('nearshorethemes', JSON.stringify(themes));
}

function loadFromLocalStorage() {
    const stored = localStorage.getItem('nearshorethemes');
    if (stored) {
        themes = JSON.parse(stored);
    }
}

// Theme functions
function openThemeModal(themeId = null) {
    const modal = document.getElementById('themeModal');
    const form = document.getElementById('themeForm');
    const title = document.getElementById('modalTitle');
    
    form.reset();
    
    if (themeId) {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            title.textContent = 'Editar Tema';
            document.getElementById('themeName').value = theme.name;
            document.getElementById('themeDescription').value = theme.description;
            currentThemeId = themeId;
        }
    } else {
        title.textContent = 'Agregar Tema';
        currentThemeId = null;
    }
    
    modal.style.display = 'block';
}

function handleThemeSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('themeName').value;
    const description = document.getElementById('themeDescription').value;
    
    if (currentThemeId) {
        // Edit existing theme
        const theme = themes.find(t => t.id === currentThemeId);
        if (theme) {
            theme.name = name;
            theme.description = description;
        }
    } else {
        // Add new theme
        const newTheme = {
            id: Date.now().toString(),
            name: name,
            description: description,
            subtopics: [],
            attachments: []
        };
        themes.push(newTheme);
    }
    
    saveToLocalStorage();
    renderThemes();
    document.getElementById('themeModal').style.display = 'none';
}

function deleteTheme(themeId) {
    if (confirm('¿Estás seguro de que deseas eliminar este tema y todos sus subtemas?')) {
        themes = themes.filter(t => t.id !== themeId);
        saveToLocalStorage();
        renderThemes();
    }
}

// Subtopic functions
function openSubtopicModal(themeId) {
    currentThemeId = themeId;
    currentSubtopicId = null;
    document.getElementById('subtopicForm').reset();
    document.getElementById('subtopicModal').style.display = 'block';
}

function handleSubtopicSubmit(e) {
    e.preventDefault();
    
    const name = document.getElementById('subtopicName').value;
    const theme = themes.find(t => t.id === currentThemeId);
    
    if (theme) {
        const newSubtopic = {
            id: Date.now().toString(),
            name: name,
            resources: [],
            attachments: []
        };
        theme.subtopics.push(newSubtopic);
        
        saveToLocalStorage();
        renderThemes();
        document.getElementById('subtopicModal').style.display = 'none';
    }
}

function deleteSubtopic(themeId, subtopicId) {
    if (confirm('¿Estás seguro de que deseas eliminar este subtema y todos sus recursos?')) {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            theme.subtopics = theme.subtopics.filter(s => s.id !== subtopicId);
            saveToLocalStorage();
            renderThemes();
        }
    }
}

// Resource functions
function openResourceModal(themeId, subtopicId) {
    currentThemeId = themeId;
    currentSubtopicId = subtopicId;
    document.getElementById('resourceForm').reset();
    document.getElementById('resourceType').value = '';
    hideAllResourceFields();
    document.getElementById('previewContainer').style.display = 'none';
    document.getElementById('resourceModal').style.display = 'block';
}

function handleResourceTypeChange(e) {
    const type = e.target.value;
    hideAllResourceFields();
    
    if (type === 'html') {
        document.getElementById('htmlFields').style.display = 'block';
    } else if (type === 'link') {
        document.getElementById('linkFields').style.display = 'block';
    } else if (type === 'file') {
        document.getElementById('fileFields').style.display = 'block';
    }
}

function hideAllResourceFields() {
    document.querySelectorAll('.resource-fields').forEach(field => {
        field.style.display = 'none';
    });
}

function handlePreview() {
    const fullHtmlCode = document.getElementById('fullHtmlCode').value;
    
    const previewContainer = document.getElementById('previewContainer');
    const previewFrame = document.getElementById('previewFrame');
    
    // Clear previous preview
    previewFrame.innerHTML = '';
    
    // Render the full HTML
    renderFullHTML(previewFrame, fullHtmlCode);
    
    previewContainer.style.display = 'block';
}

function handleResourceSubmit(e) {
    e.preventDefault();
    
    const type = document.getElementById('resourceType').value;
    const theme = themes.find(t => t.id === currentThemeId);
    
    if (!theme) return;
    
    const subtopic = theme.subtopics.find(s => s.id === currentSubtopicId);
    if (!subtopic) return;
    
    let resource = {
        id: Date.now().toString(),
        type: type
    };
    
    if (type === 'html') {
        resource.fullHtml = document.getElementById('fullHtmlCode').value;
    } else if (type === 'link') {
        resource.url = document.getElementById('linkUrl').value;
        resource.title = document.getElementById('linkTitle').value;
    } else if (type === 'file') {
        resource.url = document.getElementById('fileUrl').value;
        resource.name = document.getElementById('fileName').value;
    }
    
    subtopic.resources.push(resource);
    
    saveToLocalStorage();
    renderThemes();
    document.getElementById('resourceModal').style.display = 'none';
}

function deleteResource(themeId, subtopicId, resourceId) {
    if (confirm('¿Estás seguro de que deseas eliminar este recurso?')) {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            const subtopic = theme.subtopics.find(s => s.id === subtopicId);
            if (subtopic) {
                subtopic.resources = subtopic.resources.filter(r => r.id !== resourceId);
                saveToLocalStorage();
                renderThemes();
            }
        }
    }
}

// Render functions
function renderThemes() {
    const container = document.getElementById('themesContainer');
    
    if (themes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay temas aún</h3>
                <p>Comienza agregando un nuevo tema usando el botón de arriba</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = themes.map(theme => `
        <div class="theme-card" data-theme-id="${theme.id}">
            <div class="theme-header">
                <div class="theme-info">
                    <h3>${escapeHtml(theme.name)}</h3>
                    ${theme.description ? `<p>${escapeHtml(theme.description)}</p>` : ''}
                </div>
                <div class="theme-actions">
                    <button class="btn btn-secondary btn-small" onclick="openSubtopicModal('${theme.id}')">
                        + Agregar Subtema
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="openUploadModal('theme', '${theme.id}')">
                        📎 Subir Info
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteTheme('${theme.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
            
            ${theme.subtopics.length > 0 ? `
                <div class="subtopics">
                    ${theme.subtopics.map(subtopic => renderSubtopic(theme.id, subtopic)).join('')}
                </div>
            ` : '<p style="color: #666; font-style: italic;">No hay subtemas en este tema</p>'}
            
            ${theme.attachments && theme.attachments.length > 0 ? `
                <div class="attachments-section" style="margin-top: 20px; padding-top: 15px; border-top: 1px solid #dee2e6;">
                    <h4 style="font-size: 1rem; color: var(--primary-dark); margin-bottom: 10px;">📎 Archivos Adjuntos:</h4>
                    <div class="attachments-list">
                        ${theme.attachments.map(att => `
                            <div class="attachment-item" style="display: flex; align-items: center; gap: 10px; padding: 8px; background: #f8f9fa; border-radius: 6px; margin-bottom: 8px;">
                                <span style="font-size: 1.5rem;">${getFileIcon(att.name)}</span>
                                <div style="flex: 1;">
                                    <strong>${escapeHtml(att.title)}</strong>
                                    ${att.description ? `<br><small style="color: #666;">${escapeHtml(att.description)}</small>` : ''}
                                </div>
                                <a href="${att.dataUrl}" download="${att.name}" class="btn btn-secondary btn-small" style="text-decoration: none;">
                                    ⬇ Descargar
                                </a>
                                <button class="btn btn-danger btn-small" onclick="deleteAttachment('theme', '${theme.id}', null, '${att.id}')">
                                    🗑
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderSubtopic(themeId, subtopic) {
    return `
        <div class="subtopic-item">
            <div class="subtopic-header">
                <h4>${escapeHtml(subtopic.name)}</h4>
                <div class="subtopic-actions">
                    <button class="btn btn-secondary btn-small" onclick="openResourceModal('${themeId}', '${subtopic.id}')">
                        + Agregar Recurso
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="openUploadModal('subtopic', '${themeId}', '${subtopic.id}')">
                        📎 Subir Info
                    </button>
                    <button class="btn btn-danger btn-small" onclick="deleteSubtopic('${themeId}', '${subtopic.id}')">
                        Eliminar
                    </button>
                </div>
            </div>
            
            ${subtopic.resources.length > 0 ? `
                <div class="resources">
                    ${subtopic.resources.map(resource => renderResource(themeId, subtopic.id, resource)).join('')}
                </div>
            ` : '<p style="color: #999; font-size: 0.9rem; margin-top: 10px;">No hay recursos en este subtema</p>'}
            
            ${subtopic.attachments && subtopic.attachments.length > 0 ? `
                <div class="attachments-section" style="margin-top: 15px; padding-top: 10px; border-top: 1px dashed #ccc;">
                    <h5 style="font-size: 0.9rem; color: var(--primary-dark); margin-bottom: 8px;">📎 Archivos:</h5>
                    <div class="attachments-list">
                        ${subtopic.attachments.map(att => `
                            <div class="attachment-item" style="display: flex; align-items: center; gap: 8px; padding: 6px; background: white; border-radius: 4px; margin-bottom: 6px; font-size: 0.9rem;">
                                <span>${getFileIcon(att.name)}</span>
                                <div style="flex: 1;">
                                    <strong>${escapeHtml(att.title)}</strong>
                                    ${att.description ? `<br><small style="color: #666;">${escapeHtml(att.description)}</small>` : ''}
                                </div>
                                <a href="${att.dataUrl}" download="${att.name}" class="btn btn-secondary btn-small" style="text-decoration: none; font-size: 0.8rem; padding: 4px 8px;">
                                    ⬇
                                </a>
                                <button class="btn btn-danger btn-small" onclick="deleteAttachment('subtopic', '${themeId}', '${subtopic.id}', '${att.id}')" style="font-size: 0.8rem; padding: 4px 8px;">
                                    🗑
                                </button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        </div>
    `;
}

function renderResource(themeId, subtopicId, resource) {
    let content = '';
    
    if (resource.type === 'html') {
        const uniqueId = `resource-${resource.id}`;
        content = `
            <span class="resource-type html">HTML/CSS/JS</span>
            <div class="resource-display" id="${uniqueId}">
                <!-- El contenido se renderizará aquí -->
            </div>
        `;
        
        // Renderizar el contenido después de que el DOM esté listo
        setTimeout(() => {
            renderHTMLResource(uniqueId, resource);
        }, 0);
        
    } else if (resource.type === 'link') {
        content = `
            <span class="resource-type link">Enlace</span>
            <div class="resource-display">
                <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">
                    ${escapeHtml(resource.title || resource.url)}
                </a>
            </div>
        `;
    } else if (resource.type === 'file') {
        content = `
            <span class="resource-type file">Archivo</span>
            <div class="resource-display">
                <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" download>
                    📎 ${escapeHtml(resource.name || 'Descargar archivo')}
                </a>
            </div>
        `;
    }
    
    return `
        <div class="resource-item">
            <div class="resource-content">
                ${content}
            </div>
            <button class="btn btn-danger btn-small" onclick="deleteResource('${themeId}', '${subtopicId}', '${resource.id}')">
                Eliminar
            </button>
        </div>
    `;
}

function renderHTMLResource(containerId, resource) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    // Clear container
    container.innerHTML = '';
    
    // Check if it's the new format (fullHtml) or old format (separate html/css/js)
    if (resource.fullHtml) {
        // New format: full HTML in one field
        renderFullHTML(container, resource.fullHtml);
    } else {
        // Old format: separate fields (for backward compatibility)
        const wrapper = document.createElement('div');
        wrapper.className = 'html-resource-wrapper';
        
        // Add CSS
        if (resource.css) {
            const style = document.createElement('style');
            style.textContent = resource.css;
            wrapper.appendChild(style);
        }
        
        // Add HTML
        if (resource.html) {
            const htmlContainer = document.createElement('div');
            htmlContainer.innerHTML = resource.html;
            wrapper.appendChild(htmlContainer);
        }
        
        container.appendChild(wrapper);
        
        // Execute JavaScript
        if (resource.js) {
            try {
                const scriptFunc = new Function('container', resource.js);
                scriptFunc.call(wrapper, wrapper);
            } catch (error) {
                console.error('Error ejecutando JavaScript del recurso:', error);
                const errorDiv = document.createElement('div');
                errorDiv.style.color = '#dc3545';
                errorDiv.style.padding = '10px';
                errorDiv.style.background = '#f8d7da';
                errorDiv.style.borderRadius = '4px';
                errorDiv.textContent = 'Error en JavaScript: ' + error.message;
                container.appendChild(errorDiv);
            }
        }
    }
}

function renderFullHTML(container, fullHtmlCode) {
    // Create an iframe to isolate the HTML content
    const iframe = document.createElement('iframe');
    iframe.className = 'html-resource-iframe';
    
    // Sandbox attributes to prevent malicious actions:
    // - allow-scripts: Allow scripts to run (needed for interactive content)
    // - allow-popups: Allow popups if needed
    // - allow-forms: Allow form submission
    // IMPORTANT: We do NOT include 'allow-same-origin' because when combined with
    // 'allow-scripts', it would allow the iframe to access parent.window and navigate it.
    // By omitting 'allow-same-origin', the iframe gets a unique origin and cannot access
    // the parent document, preventing XSS and navigation attacks.
    iframe.sandbox = 'allow-scripts allow-popups allow-forms allow-modals';
    
    // Set a reasonable default height
    iframe.style.width = '100%';
    iframe.style.border = '1px solid #ddd';
    iframe.style.borderRadius = '4px';
    iframe.style.minHeight = '400px';
    
    // Prepare the HTML document for the iframe
    // Ensure we have a complete HTML document
    let iframeContent = fullHtmlCode;
    
    // If the HTML doesn't have DOCTYPE, html, head, or body tags, wrap it
    if (!iframeContent.match(/<!DOCTYPE/i)) {
        // Extract any style and script tags to put them in proper locations
        const styles = [];
        const headScripts = [];
        
        // Extract styles
        const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
        let match;
        while ((match = styleRegex.exec(iframeContent)) !== null) {
            styles.push(match[0]);
        }
        
        // Extract scripts (we'll put them at the end of body)
        const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
        while ((match = scriptRegex.exec(iframeContent)) !== null) {
            headScripts.push(match[0]);
        }
        
        // Extract link tags (fonts, stylesheets)
        const links = [];
        const linkRegex = /<link[^>]+>/gi;
        while ((match = linkRegex.exec(iframeContent)) !== null) {
            links.push(match[0]);
        }
        
        // Remove extracted elements from content
        let bodyHtml = iframeContent;
        bodyHtml = bodyHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
        bodyHtml = bodyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
        bodyHtml = bodyHtml.replace(/<link[^>]+>/gi, '');
        
        // Build complete HTML document
        iframeContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${links.join('\n    ')}
    ${styles.join('\n    ')}
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }
    </style>
</head>
<body>
    ${bodyHtml}
    ${headScripts.join('\n    ')}
</body>
</html>
        `;
    }
    
    // Use srcdoc attribute for better security
    // srcdoc creates a unique origin for the iframe, preventing access to parent
    iframe.srcdoc = iframeContent;
    
    // Auto-resize iframe based on content
    // Set up a message listener for height updates from the iframe
    const resizeHandler = function(event) {
        // Verify the message is from our iframe
        if (event.source === iframe.contentWindow && event.data && event.data.type === 'resize') {
            iframe.style.height = (event.data.height + 40) + 'px';
        }
    };
    window.addEventListener('message', resizeHandler);
    
    // Inject resize script into iframe content
    const resizeScript = `
    <script>
        // Send height updates to parent
        function updateHeight() {
            const height = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            try {
                window.parent.postMessage({ type: 'resize', height: height }, '*');
            } catch(e) {
                // Ignore if postMessage is blocked
            }
        }
        
        // Update height when loaded and when content changes
        window.addEventListener('load', updateHeight);
        window.addEventListener('resize', updateHeight);
        
        // Also check periodically for dynamic content
        setInterval(updateHeight, 1000);
        
        // Initial update
        setTimeout(updateHeight, 100);
    </script>
    `;
    
    iframe.srcdoc = iframeContent.replace('</body>', resizeScript + '</body>');
    
    // Append iframe to container
    container.appendChild(iframe);
    
    // Cleanup listener when iframe is removed
    iframe.addEventListener('remove', () => {
        window.removeEventListener('message', resizeHandler);
    });
}


// Utility functions
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Upload/Attachment functions
let currentUploadType = null;
let currentUploadThemeId = null;
let currentUploadSubtopicId = null;

function openUploadModal(type, themeId, subtopicId = null) {
    currentUploadType = type;
    currentUploadThemeId = themeId;
    currentUploadSubtopicId = subtopicId;
    
    const modal = document.getElementById('uploadModal');
    const title = document.getElementById('uploadModalTitle');
    
    if (type === 'theme') {
        const theme = themes.find(t => t.id === themeId);
        title.textContent = `Subir Información - ${theme.name}`;
    } else if (type === 'subtopic') {
        const theme = themes.find(t => t.id === themeId);
        const subtopic = theme?.subtopics.find(s => s.id === subtopicId);
        title.textContent = `Subir Información - ${subtopic.name}`;
    }
    
    document.getElementById('uploadForm').reset();
    modal.style.display = 'block';
}

function handleUploadSubmit(e) {
    e.preventDefault();
    
    const title = document.getElementById('uploadTitle').value;
    const description = document.getElementById('uploadDescription').value;
    const fileInput = document.getElementById('uploadFile');
    const file = fileInput.files[0];
    
    if (!file) {
        alert('Por favor selecciona un archivo');
        return;
    }
    
    // Convert file to base64
    const reader = new FileReader();
    reader.onload = function(event) {
        const attachment = {
            id: Date.now().toString(),
            title: title,
            description: description,
            name: file.name,
            type: file.type,
            size: file.size,
            dataUrl: event.target.result,
            uploadDate: new Date().toISOString()
        };
        
        // Add attachment to appropriate location
        if (currentUploadType === 'theme') {
            const theme = themes.find(t => t.id === currentUploadThemeId);
            if (theme) {
                if (!theme.attachments) theme.attachments = [];
                theme.attachments.push(attachment);
            }
        } else if (currentUploadType === 'subtopic') {
            const theme = themes.find(t => t.id === currentUploadThemeId);
            if (theme) {
                const subtopic = theme.subtopics.find(s => s.id === currentUploadSubtopicId);
                if (subtopic) {
                    if (!subtopic.attachments) subtopic.attachments = [];
                    subtopic.attachments.push(attachment);
                }
            }
        }
        
        saveToLocalStorage();
        renderThemes();
        document.getElementById('uploadModal').style.display = 'none';
        alert('✅ Archivo subido exitosamente');
    };
    
    reader.onerror = function() {
        alert('❌ Error al leer el archivo');
    };
    
    reader.readAsDataURL(file);
}

function deleteAttachment(type, themeId, subtopicId, attachmentId) {
    if (!confirm('¿Eliminar este archivo adjunto?')) return;
    
    if (type === 'theme') {
        const theme = themes.find(t => t.id === themeId);
        if (theme && theme.attachments) {
            theme.attachments = theme.attachments.filter(a => a.id !== attachmentId);
        }
    } else if (type === 'subtopic') {
        const theme = themes.find(t => t.id === themeId);
        if (theme) {
            const subtopic = theme.subtopics.find(s => s.id === subtopicId);
            if (subtopic && subtopic.attachments) {
                subtopic.attachments = subtopic.attachments.filter(a => a.id !== attachmentId);
            }
        }
    }
    
    saveToLocalStorage();
    renderThemes();
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'doc': '📝', 'docx': '📝',
        'xls': '📊', 'xlsx': '📊',
        'ppt': '📽️', 'pptx': '📽️',
        'jpg': '🖼️', 'jpeg': '🖼️', 'png': '🖼️', 'gif': '🖼️',
        'zip': '🗜️', 'rar': '🗜️',
        'txt': '📃'
    };
    return icons[ext] || '📎';
}

// Export/Import functions (bonus feature)
function exportData() {
    const dataStr = JSON.stringify(themes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'nearshore-themes-backup.json';
    link.click();
    URL.revokeObjectURL(url);
}

function importData(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (Array.isArray(imported)) {
                themes = imported;
                saveToLocalStorage();
                renderThemes();
                alert('Datos importados correctamente');
            }
        } catch (error) {
            alert('Error al importar los datos: ' + error.message);
        }
    };
    reader.readAsText(file);
}
