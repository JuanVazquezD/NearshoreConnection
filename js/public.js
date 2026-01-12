// Public View - Read-only display of themes, subtopics, resources, and speakers
let themes = [];

// Load data when page loads
document.addEventListener('DOMContentLoaded', async () => {
    themes = await DataStore.loadFromJSON();
    renderPublicView();
});

// Render the public view
function renderPublicView() {
    const container = document.getElementById('themesContainer');
    
    if (themes.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No hay contenido disponible</h3>
                <p>El contenido se mostrará aquí una vez que esté disponible</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = themes.map(theme => `
        <div class="theme-card">
            <div class="theme-info">
                <h3>${escapeHtml(theme.name)}</h3>
                ${theme.description ? `<p class="theme-description">${escapeHtml(theme.description)}</p>` : ''}
            </div>
            
            ${theme.subtopics && theme.subtopics.length > 0 ? `
                <div class="subtopics">
                    ${theme.subtopics.map(subtopic => renderPublicSubtopic(subtopic)).join('')}
                </div>
            ` : ''}
        </div>
    `).join('');
}

function renderPublicSubtopic(subtopic) {
    return `
        <div class="subtopic-item">
            <h4 class="subtopic-title">${escapeHtml(subtopic.name)}</h4>
            
            ${subtopic.resources && subtopic.resources.length > 0 ? `
                <div class="resources">
                    <h5 class="section-title">Recursos</h5>
                    ${subtopic.resources.map(resource => renderPublicResource(resource)).join('')}
                </div>
            ` : ''}
            
            ${subtopic.speakers && subtopic.speakers.length > 0 ? `
                <div class="speakers-section">
                    <h5 class="section-title">Speakers</h5>
                    <table class="speakers-table">
                        <thead>
                            <tr>
                                <th>Nombre</th>
                                <th>Título/Rol</th>
                                <th>Empresa</th>
                                <th>Estatus</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${subtopic.speakers.map(speaker => renderPublicSpeaker(speaker)).join('')}
                        </tbody>
                    </table>
                </div>
            ` : ''}
        </div>
    `;
}

function renderPublicResource(resource) {
    let content = '';
    
    if (resource.type === 'html') {
        const uniqueId = `resource-${resource.id}`;
        content = `
            <div class="resource-item html-resource">
                <span class="resource-type html">HTML/CSS/JS</span>
                <div class="resource-display" id="${uniqueId}">
                    <!-- El contenido se renderizará aquí -->
                </div>
            </div>
        `;
        
        // Renderizar el contenido después de que el DOM esté listo
        setTimeout(() => {
            renderHTMLResource(uniqueId, resource);
        }, 0);
        
    } else if (resource.type === 'link') {
        content = `
            <div class="resource-item">
                <span class="resource-type link">Enlace</span>
                <div class="resource-display">
                    <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(resource.title || resource.url)}
                    </a>
                </div>
            </div>
        `;
    } else if (resource.type === 'file') {
        content = `
            <div class="resource-item">
                <span class="resource-type file">Archivo</span>
                <div class="resource-display">
                    <a href="${escapeHtml(resource.url)}" target="_blank" rel="noopener noreferrer" download>
                        📎 ${escapeHtml(resource.name || 'Descargar archivo')}
                    </a>
                </div>
            </div>
        `;
    }
    
    return content;
}

function renderPublicSpeaker(speaker) {
    return `
        <tr>
            <td>${escapeHtml(speaker.name)}</td>
            <td>${escapeHtml(speaker.title || '')}</td>
            <td>${escapeHtml(speaker.company || '')}</td>
            <td>
                <div class="status-indicator">
                    <span class="status-circle status-${speaker.status}"></span>
                    <span class="status-text">${getStatusText(speaker.status)}</span>
                </div>
            </td>
        </tr>
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
            }
        }
    }
}

// Reuse renderFullHTML from app.js
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
            return new Promise(resolve => setTimeout(resolve, 500));
        })
        .then(() => {
            // Execute inline scripts after external scripts are loaded and DOM is ready
            inlineScripts.forEach((scriptContent, index) => {
                if (scriptContent.trim()) {
                    try {
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
                            const lastIndex = modifiedScript.lastIndexOf('});');
                            if (lastIndex !== -1) {
                                modifiedScript = modifiedScript.substring(0, lastIndex) + '})();' + modifiedScript.substring(lastIndex + 3);
                            }
                        }
                        
                        modifiedScript = modifiedScript.replace(
                            /if\s*\(\s*document\.readyState\s*===\s*['"]loading['"]\s*\)\s*{/g,
                            'if (false) {'
                        );
                        
                        // Execute in global context so libraries are accessible
                        const scriptFunc = new Function(modifiedScript);
                        scriptFunc.call(window);
                    } catch (error) {
                        console.error('Error ejecutando JavaScript:', error);
                    }
                }
            });
        })
        .catch(error => {
            console.error('Error cargando scripts externos:', error);
        });
}

function loadScriptsSequentially(scriptUrls, container) {
    return scriptUrls.reduce((promise, url) => {
        return promise.then(() => loadScript(url, container));
    }, Promise.resolve());
}

function loadScript(url, container) {
    return new Promise((resolve, reject) => {
        const existingScript = document.querySelector(`script[src="${url}"]`);
        if (existingScript) {
            setTimeout(() => resolve(), 100);
            return;
        }
        
        const script = document.createElement('script');
        script.src = url;
        script.async = false;
        
        script.onload = () => {
            setTimeout(() => resolve(), 200);
        };
        
        script.onerror = () => {
            reject(new Error(`No se pudo cargar: ${url}`));
        };
        
        document.head.appendChild(script);
    });
}

function waitForLibrary(libraryName, maxAttempts = 50) {
    return new Promise((resolve, reject) => {
        let attempts = 0;
        const checkInterval = setInterval(() => {
            attempts++;
            if (window[libraryName]) {
                clearInterval(checkInterval);
                resolve();
            } else if (attempts >= maxAttempts) {
                clearInterval(checkInterval);
                reject(new Error(`Timeout esperando ${libraryName}`));
            }
        }, 100);
    });
}

