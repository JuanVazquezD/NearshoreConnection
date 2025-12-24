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
            subtopics: []
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
            resources: []
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
    const htmlCode = document.getElementById('htmlCode').value;
    const cssCode = document.getElementById('cssCode').value;
    const jsCode = document.getElementById('jsCode').value;
    
    const previewContainer = document.getElementById('previewContainer');
    const previewFrame = document.getElementById('previewFrame');
    
    // Clear previous preview
    previewFrame.innerHTML = '';
    
    // Create style element
    const styleElement = document.createElement('style');
    styleElement.textContent = cssCode;
    
    // Set HTML content
    previewFrame.innerHTML = htmlCode;
    previewFrame.appendChild(styleElement);
    
    // Execute JavaScript in a safe way
    if (jsCode) {
        try {
            // Create a function scope for the JS code
            const scriptFunc = new Function(jsCode);
            scriptFunc.call(previewFrame);
        } catch (error) {
            console.error('Error en JavaScript:', error);
            alert('Error en el código JavaScript: ' + error.message);
        }
    }
    
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
        resource.html = document.getElementById('htmlCode').value;
        resource.css = document.getElementById('cssCode').value;
        resource.js = document.getElementById('jsCode').value;
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
    
    // Create a wrapper div
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
            // Create a function with the container as context
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
