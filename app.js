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
    
    // Render the full HTML in an isolated iframe
    renderFullHTMLInIframe(previewFrame, fullHtmlCode);
    
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
        // New format: full HTML in one field - render in iframe for isolation
        renderFullHTMLInIframe(container, resource.fullHtml);
    } else {
        // Old format: separate fields (for backward compatibility)
        // Also use iframe for isolation
        const combinedHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    ${resource.css ? `<style>${resource.css}</style>` : ''}
</head>
<body>
    ${resource.html || ''}
    ${resource.js ? `<script>${resource.js}</script>` : ''}
</body>
</html>`;
        renderFullHTMLInIframe(container, combinedHtml);
    }
}

function renderFullHTMLInIframe(container, fullHtmlCode) {
    // Create an iframe to isolate the HTML content
    const iframe = document.createElement('iframe');
    
    // Set sandbox attributes for security while allowing necessary features
    // - allow-scripts: Allow JavaScript execution
    // - allow-same-origin: Allow access to localStorage and other same-origin features (needed for some visualizations)
    // Note: We explicitly DO NOT include allow-top-navigation to prevent the iframe from navigating the parent page
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-modals');
    
    // Style the iframe to be seamless
    iframe.style.width = '100%';
    iframe.style.border = 'none';
    iframe.style.minHeight = '400px';
    iframe.style.backgroundColor = 'white';
    
    // Add the iframe to the container
    container.appendChild(iframe);
    
    // Write the HTML content to the iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(fullHtmlCode);
    iframeDoc.close();
    
    // Auto-resize iframe based on content height
    iframe.onload = function() {
        try {
            // Wait a bit for content to render
            setTimeout(() => {
                const iframeBody = iframe.contentDocument?.body;
                const iframeHtml = iframe.contentDocument?.documentElement;
                if (iframeBody && iframeHtml) {
                    const height = Math.max(
                        iframeBody.scrollHeight,
                        iframeBody.offsetHeight,
                        iframeHtml.clientHeight,
                        iframeHtml.scrollHeight,
                        iframeHtml.offsetHeight
                    );
                    iframe.style.height = (height + 20) + 'px'; // Add some padding
                }
            }, 500);
            
            // Re-check after a longer delay for dynamic content
            setTimeout(() => {
                const iframeBody = iframe.contentDocument?.body;
                const iframeHtml = iframe.contentDocument?.documentElement;
                if (iframeBody && iframeHtml) {
                    const height = Math.max(
                        iframeBody.scrollHeight,
                        iframeBody.offsetHeight,
                        iframeHtml.clientHeight,
                        iframeHtml.scrollHeight,
                        iframeHtml.offsetHeight
                    );
                    iframe.style.height = (height + 20) + 'px';
                }
            }, 2000);
        } catch (e) {
            // If we can't access iframe content (shouldn't happen with same origin),
            // just use a default height
            console.warn('Could not auto-resize iframe:', e);
        }
    };
}

function renderFullHTML(container, fullHtmlCode) {
    // Create a wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'html-resource-wrapper';
    
    // Extract and handle CSS from <style> tags
    const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
    let styleMatch;
    while ((styleMatch = styleRegex.exec(fullHtmlCode)) !== null) {
        const style = document.createElement('style');
        style.textContent = styleMatch[1];
        wrapper.appendChild(style);
    }
    
    // Extract external scripts and inline scripts separately
    const scriptSrcRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>[\s\S]*?<\/script>/gi;
    const scriptInlineRegex = /<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/gi;
    
    const externalScripts = [];
    const inlineScripts = [];
    
    let scriptMatch;
    
    // Extract external scripts
    while ((scriptMatch = scriptSrcRegex.exec(fullHtmlCode)) !== null) {
        externalScripts.push(scriptMatch[1]);
    }
    
    // Extract inline scripts
    while ((scriptMatch = scriptInlineRegex.exec(fullHtmlCode)) !== null) {
        inlineScripts.push(scriptMatch[2]);
    }
    
    // Remove style and script tags from HTML
    let cleanHtml = fullHtmlCode;
    cleanHtml = cleanHtml.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '');
    cleanHtml = cleanHtml.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '');
    
    // Remove DOCTYPE, html, head, body tags if present to get just the content
    cleanHtml = cleanHtml.replace(/<!DOCTYPE[^>]*>/gi, '');
    cleanHtml = cleanHtml.replace(/<\/?html[^>]*>/gi, '');
    cleanHtml = cleanHtml.replace(/<\/?head[^>]*>/gi, '');
    cleanHtml = cleanHtml.replace(/<\/?body[^>]*>/gi, '');
    
    // Extract link tags (fonts, stylesheets)
    const linkRegex = /<link[^>]+>/gi;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(fullHtmlCode)) !== null) {
        const linkElement = document.createElement('div');
        linkElement.innerHTML = linkMatch[0];
        const actualLink = linkElement.firstChild;
        if (actualLink) {
            wrapper.appendChild(actualLink.cloneNode(true));
        }
    }
    cleanHtml = cleanHtml.replace(/<link[^>]+>/gi, '');
    
    // Set the cleaned HTML
    const htmlContainer = document.createElement('div');
    htmlContainer.innerHTML = cleanHtml.trim();
    wrapper.appendChild(htmlContainer);
    
    container.appendChild(wrapper);
    
    // Load external scripts first, then execute inline scripts
    loadScriptsSequentially(externalScripts, wrapper)
        .then(() => {
            // Wait for Chart.js and Plotly to be available
            const libraryChecks = [];
            
            // Check if Chart.js is needed
            if (externalScripts.some(url => url.includes('chart') || url.includes('Chart'))) {
                libraryChecks.push(waitForLibrary('Chart'));
            }
            
            // Check if Plotly is needed
            if (externalScripts.some(url => url.includes('plotly') || url.includes('Plotly'))) {
                libraryChecks.push(waitForLibrary('Plotly'));
            }
            
            return Promise.all(libraryChecks);
        })
        .then(() => {
            console.log('Todas las librerías están listas. Esperando a que el DOM esté listo...');
            
            // Wait for DOM to be fully rendered before executing scripts
            return new Promise(resolve => setTimeout(resolve, 500));
        })
        .then(() => {
            console.log('DOM listo. Ejecutando scripts...');
            
            // Execute inline scripts after external scripts are loaded and DOM is ready
            inlineScripts.forEach((scriptContent, index) => {
                if (scriptContent.trim()) {
                    try {
                        console.log(`Ejecutando script inline ${index + 1}...`);
                        
                        // Replace DOMContentLoaded with immediate execution since DOM is already loaded
                        let modifiedScript = scriptContent;
                        
                        // Replace all variations of DOMContentLoaded listeners
                        modifiedScript = modifiedScript.replace(
                            /document\.addEventListener\s*\(\s*['"]DOMContentLoaded['"]\s*,\s*function\s*\(\)\s*{/g,
                            '(function() {'
                        );
                        
                        modifiedScript = modifiedScript.replace(
                            /document\.addEventListener\s*\(\s*['"]DOMContentLoaded['"]\s*,\s*\(\)\s*=>\s*{/g,
                            '(function() {'
                        );
                        
                        // Close the IIFE at the end if we made replacements
                        if (modifiedScript !== scriptContent) {
                            // Find the last }); and replace with })();
                            const lastIndex = modifiedScript.lastIndexOf('});');
                            if (lastIndex !== -1) {
                                modifiedScript = modifiedScript.substring(0, lastIndex) + '})();' + modifiedScript.substring(lastIndex + 3);
                            }
                        }
                        
                        // Also handle if (document.readyState === 'loading')
                        modifiedScript = modifiedScript.replace(
                            /if\s*\(\s*document\.readyState\s*===\s*['"]loading['"]\s*\)\s*{/g,
                            'if (false) {'
                        );
                        
                        // Execute in global context so libraries are accessible
                        const scriptFunc = new Function(modifiedScript);
                        scriptFunc.call(window);
                        console.log(`Script ${index + 1} ejecutado exitosamente`);
                    } catch (error) {
                        console.error('Error ejecutando JavaScript:', error);
                        const errorDiv = document.createElement('div');
                        errorDiv.style.color = '#dc3545';
                        errorDiv.style.padding = '10px';
                        errorDiv.style.background = '#f8d7da';
                        errorDiv.style.borderRadius = '4px';
                        errorDiv.style.marginTop = '10px';
                        errorDiv.innerHTML = `<strong>Error en JavaScript:</strong><br>${error.message}<br><small>${error.stack}</small>`;
                        container.appendChild(errorDiv);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error cargando scripts externos:', error);
            const errorDiv = document.createElement('div');
            errorDiv.style.color = '#dc3545';
            errorDiv.style.padding = '10px';
            errorDiv.style.background = '#f8d7da';
            errorDiv.style.borderRadius = '4px';
            errorDiv.style.marginTop = '10px';
            errorDiv.innerHTML = `<strong>Error cargando librerías:</strong><br>${error.message}<br><small>Verifica tu conexión a internet</small>`;
            container.appendChild(errorDiv);
        });
}

function loadScriptsSequentially(scriptUrls, container) {
    return scriptUrls.reduce((promise, url) => {
        return promise.then(() => loadScript(url, container));
    }, Promise.resolve());
}

function loadScript(url, container) {
    return new Promise((resolve, reject) => {
        // Check if script is already loaded globally
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            // Script already loaded, wait a bit to ensure it's ready
            setTimeout(() => {
                console.log(`Script ya existente: ${url}`);
                resolve();
            }, 100);
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.async = false; // Load in order
        
        script.onload = () => {
            console.log(`Script cargado exitosamente: ${url}`);
            // Wait a bit to ensure the library is fully initialized
            setTimeout(() => resolve(), 200);
        };
        
        script.onerror = () => {
            console.error(`Error cargando script: ${url}`);
            reject(new Error(`No se pudo cargar: ${url}`));
        };
        
        // Append to document head for global availability
        document.head.appendChild(script);
    });
}

// Helper function to wait for libraries to be available
function waitForLibrary(libraryName, maxAttempts = 50) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window[libraryName]) {
                clearInterval(checkInterval);
                console.log(`Librería ${libraryName} disponible`);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error(`Timeout esperando ${libraryName}`));
            }
        }, 100);
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
