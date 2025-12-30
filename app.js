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
        // Combine html, css, and js into a complete HTML document
        let completeHtml = '<!DOCTYPE html>\n<html>\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        
        // Add CSS if present
        if (resource.css) {
            completeHtml += '<style>\n' + resource.css + '\n</style>\n';
        }
        
        completeHtml += '</head>\n<body>\n';
        
        // Add HTML if present
        if (resource.html) {
            completeHtml += resource.html + '\n';
        }
        
        // Add JavaScript if present
        if (resource.js) {
            completeHtml += '<script>\n' + resource.js + '\n</script>\n';
        }
        
        completeHtml += '</body>\n</html>';
        
        // Create isolated iframe with the combined content
        const iframe = createIsolatedIframe(completeHtml);
        container.appendChild(iframe);
    }
}

function renderFullHTML(container, fullHtmlCode) {
    // Clear container
    container.innerHTML = '';
    
    // Ensure the HTML has proper document structure
    let completeHtml = fullHtmlCode.trim();
    
    // If the HTML doesn't have DOCTYPE, html, head, or body tags, wrap it
    if (!completeHtml.match(/<!DOCTYPE/i)) {
        const hasHtmlTag = completeHtml.match(/<html/i);
        const hasHeadTag = completeHtml.match(/<head/i);
        const hasBodyTag = completeHtml.match(/<body/i);
        
        if (!hasHtmlTag || !hasHeadTag || !hasBodyTag) {
            // Extract style and script tags to put in proper locations
            const styles = [];
            const headScripts = [];
            const bodyContent = [];
            
            const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
            let match;
            while ((match = styleRegex.exec(completeHtml)) !== null) {
                styles.push(match[0]);
            }
            
            const scriptRegex = /<script[^>]*>[\s\S]*?<\/script>/gi;
            while ((match = scriptRegex.exec(completeHtml)) !== null) {
                headScripts.push(match[0]);
            }
            
            // Remove style and script tags from original HTML
            let bodyHtml = completeHtml;
            bodyHtml = bodyHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
            bodyHtml = bodyHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
            
            // Extract link tags for head
            const links = [];
            const linkRegex = /<link[^>]+>/gi;
            while ((match = linkRegex.exec(bodyHtml)) !== null) {
                links.push(match[0]);
            }
            bodyHtml = bodyHtml.replace(/<link[^>]+>/gi, '');
            
            completeHtml = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${links.join('\n    ')}
    ${styles.join('\n    ')}
</head>
<body>
    ${bodyHtml}
    ${headScripts.join('\n    ')}
</body>
</html>`;
        }
    }
    
    // Create isolated iframe with the HTML content
    const iframe = createIsolatedIframe(completeHtml);
    container.appendChild(iframe);
}

// Utility function to create isolated iframes for HTML content
function createIsolatedIframe(htmlContent) {
    const iframe = document.createElement('iframe');
    iframe.className = 'isolated-html-iframe';
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '300px';
    
    // Set sandbox attribute to isolate the content
    // allow-scripts: permits scripts to run within the iframe
    // Note: We intentionally do NOT use 'allow-same-origin' to maintain strong isolation
    // and prevent iframe content from accessing the parent document
    iframe.setAttribute('sandbox', 'allow-scripts');
    
    // Use srcdoc if available (modern browsers)
    if ('srcdoc' in iframe) {
        iframe.srcdoc = htmlContent;
    } else {
        // Fallback for older browsers
        iframe.src = 'data:text/html;charset=utf-8,' + encodeURIComponent(htmlContent);
    }
    
    // Auto-resize iframe based on content
    iframe.onload = function() {
        try {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            if (iframeDoc && iframeDoc.body) {
                const resizeIframe = () => {
                    const height = iframeDoc.documentElement.scrollHeight || iframeDoc.body.scrollHeight;
                    if (height > 0) {
                        iframe.style.height = height + 'px';
                    }
                };
                
                // Initial resize
                resizeIframe();
                
                // Use ResizeObserver if available for better performance
                if (window.ResizeObserver) {
                    const resizeObserver = new ResizeObserver(resizeIframe);
                    resizeObserver.observe(iframeDoc.body);
                    
                    // Store observer for cleanup when iframe is removed
                    iframe._resizeObserver = resizeObserver;
                } else {
                    // Fallback: Use MutationObserver for older browsers
                    const mutationObserver = new MutationObserver(resizeIframe);
                    mutationObserver.observe(iframeDoc.body, {
                        attributes: true,
                        childList: true,
                        subtree: true
                    });
                    
                    // Store observer for cleanup
                    iframe._mutationObserver = mutationObserver;
                    
                    // Also do periodic checks for dynamic content
                    setTimeout(resizeIframe, 500);
                    setTimeout(resizeIframe, 1500);
                }
            }
        } catch (e) {
            // Cross-origin or security error - use default height
            console.log('Unable to auto-resize iframe:', e.message);
            // Set a reasonable default height
            iframe.style.height = '400px';
        }
    };
    
    return iframe;
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
