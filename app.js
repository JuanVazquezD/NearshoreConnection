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
    } else {
        // Pre-populate with sample data from previous project
        themes = getInitialSampleData();
        saveToLocalStorage();
    }
}

function getInitialSampleData() {
    return [
        {
            id: '1704063600000',
            name: 'Nearshoring y Estrategia Manufacturera 2026',
            description: 'Análisis de tendencias críticas en manufactura norteamericana: Nearshoring, Energía, Logística e Innovación',
            subtopics: [
                {
                    id: '1704063601000',
                    name: 'Estrategia Manufacturera Norteamérica 2026',
                    resources: [
                        {
                            id: '1704063602000',
                            type: 'html',
                            fullHtml: `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>North American Manufacturing Summit 2026: Strategic Horizons</title>
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js"></script>
    
    <!-- Plotly.js -->
    <script src="https://cdn.plot.ly/plotly-2.27.0.min.js"></script>
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            background-color: #f0f4f8;
            color: #1a202c;
        }
        .chart-container {
            position: relative;
            width: 100%;
            margin-left: auto;
            margin-right: auto;
            height: 300px; 
            max-height: 400px;
        }
        @media (min-width: 768px) {
            .chart-container {
                height: 350px;
            }
        }
        .glass-panel {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        .gradient-text {
            background: linear-gradient(90deg, #023e8a 0%, #0096c7 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .lang-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
            display: flex;
            gap: 10px;
        }
        .lang-btn button {
            padding: 8px 16px;
            background: #0077b6;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: 500;
            transition: all 0.3s;
        }
        .lang-btn button:hover {
            background: #023e8a;
            transform: translateY(-2px);
        }
        .lang-btn button.active {
            background: #ce4839;
        }
    </style>
</head>
<body class="bg-slate-100">

    <!-- Botones de Idioma -->
    <div class="lang-btn">
        <button onclick="cambiarIdioma('es')" id="btnEs" class="active">🇪🇸 Español</button>
        <button onclick="cambiarIdioma('en')" id="btnEn">🇺🇸 English</button>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        <header class="mb-12 text-center">
            <h1 class="text-4xl md:text-6xl font-bold mb-4 gradient-text tracking-tight" data-es="Estrategia Manufacturera Norteamérica 2026" data-en="North American Manufacturing Strategy 2026">Estrategia Manufacturera Norteamérica 2026</h1>
            <p class="text-xl text-gray-600 max-w-3xl mx-auto" data-es="San Antonio, TX | 16 de Abril, 2026" data-en="San Antonio, TX | April 16, 2026">San Antonio, TX | 16 de Abril, 2026</p>
            <p class="mt-4 text-gray-500" data-es="Análisis de tendencias críticas: Nearshoring, Energía, Logística e Innovación." data-en="Critical trends analysis: Nearshoring, Energy, Logistics and Innovation.">Análisis de tendencias críticas: Nearshoring, Energía, Logística e Innovación.</p>
        </header>

        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            <div class="md:col-span-12">
                <div class="bg-white rounded-xl shadow-lg p-8 border-l-8 border-[#0096c7]">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6" data-es="¿Qué sigue del Nearshoring? ¿Crece a Ally-shoring o muere a Off-shoring?" data-en="What's next for Nearshoring? Does it grow into Ally-shoring or die to Off-shoring?">¿Qué sigue del Nearshoring? ¿Crece a Ally-shoring o muere a Off-shoring?</h2>
                    <p class="text-gray-600 mb-8 leading-relaxed" data-es="La manufactura busca aliados geopolíticos (Ally-shoring) bajo el T-MEC, pero la decisión de inversión final será dictada por la **capacidad instalada**. La escasez de agua, la falta de capacidad eléctrica y la nueva competencia de los mega **Data Centers (1.4 GW)** presionan a las industrias de alto consumo a buscar territorios fuera de la región T-MEC donde el suministro y el costo lo permitan, más que la lealtad de alianzas." data-en="Manufacturing seeks geopolitical allies (Ally-shoring) under USMCA, but the final investment decision will be dictated by **installed capacity**. Water scarcity, lack of electrical capacity and new competition from mega **Data Centers (1.4 GW)** pressure high-consumption industries to seek territories outside the USMCA region where supply and cost allow, rather than alliance loyalty.">
                        La manufactura busca aliados geopolíticos (Ally-shoring) bajo el T-MEC, pero la decisión de inversión final será dictada por la **capacidad instalada**. La escasez de agua, la falta de capacidad eléctrica y la nueva competencia de los mega **Data Centers (1.4 GW)** presionan a las industrias de alto consumo a buscar territorios fuera de la región T-MEC donde el suministro y el costo lo permitan, más que la lealtad de alianzas.
                    </p>
                    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                        <div>
                            <h3 class="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200" data-es="Dilema de Recursos vs. Geopolítica" data-en="Resources vs. Geopolitics Dilemma">Dilema de Recursos vs. Geopolítica</h3>
                            <div class="chart-container mt-6">
                                <canvas id="shippingComparisonChart"></canvas>
                            </div>
                            <p class="text-sm text-center text-gray-500 mt-2" data-es="Comparativa de Tiempos de Tránsito (Días)" data-en="Transit Time Comparison (Days)">Comparativa de Tiempos de Tránsito (Días)</p>
                        </div>

                        <div>
                            <h3 class="text-xl font-bold text-gray-700 mb-4 border-b pb-2 border-gray-200" data-es="El Consumo de Data Centers: La Nueva Competencia por la Red" data-en="Data Center Consumption: The New Grid Competition">El Consumo de Data Centers: La Nueva Competencia por la Red</h3>
                            <div class="chart-container">
                                <canvas id="energyConsumptionChart"></canvas>
                            </div>
                            <p class="text-xs text-center text-gray-400 mt-2" data-es="Comparativa de Consumo Pico Estimado" data-en="Estimated Peak Consumption Comparison">Comparativa de Consumo Pico Estimado</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            
            <div class="md:col-span-12 lg:col-span-5">
                <div class="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col justify-between border-t-4 border-[#ffb703]">
                    <div>
                        <h2 class="text-2xl font-bold text-gray-800 mb-4" data-es="El Litio es el Nuevo Uranio: La nueva arma geopolítica y la trampa de la Regla de Origen" data-en="Lithium is the New Uranium: The new geopolitical weapon and the Rule of Origin trap">El Litio es el Nuevo Uranio: La nueva arma geopolítica y la trampa de la Regla de Origen</h2>
                        <div class="chart-container" style="height: 250px; max-height: 300px;">
                            <canvas id="evMarketShareChart"></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div class="md:col-span-12 lg:col-span-7">
                <div class="bg-white rounded-xl shadow-lg p-8 h-full">
                    <h2 class="text-2xl font-bold text-gray-800 mb-6" data-es="La Distancia entre el Istmo de Oaxaca y el Canal de Panamá" data-en="The Distance between the Isthmus of Oaxaca and the Panama Canal">La Distancia entre el Istmo de Oaxaca y el Canal de Panamá</h2>
                    
                    <div class="mt-8">
                        <div id="isthmusPlot" style="width:100%; height:350px;"></div>
                        <p class="text-xs text-center text-gray-500 mt-2" data-es="Proyección de volumen de carga (TEUs) capturado por rutas alternativas." data-en="Projected cargo volume (TEUs) captured by alternative routes.">Proyección de volumen de carga (TEUs) capturado por rutas alternativas.</p>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <script>
        let idiomaActual = 'es';
        
        function cambiarIdioma(idioma) {
            idiomaActual = idioma;
            document.getElementById('btnEs').classList.toggle('active', idioma === 'es');
            document.getElementById('btnEn').classList.toggle('active', idioma === 'en');
            
            // Cambiar todos los textos
            document.querySelectorAll('[data-es][data-en]').forEach(el => {
                el.textContent = el.getAttribute('data-' + idioma);
            });
            
            // Recrear gráficas con nuevo idioma
            crearGraficas();
        }
        
        function crearGraficas() {
            const labels = idiomaActual === 'es' ? {
                shipping: ['Shanghai a Los Angeles', 'Shanghai a Nueva York', 'Monterrey a San Antonio', 'Bajío a Laredo'],
                shippingTitle: 'Comparativa de Tiempos de Envío - Nearshoring',
                days: 'Días',
                energy: ['Consumo Pico Manhattan', 'Mega Data Center (Proyectado)', 'Consumo Pico San Francisco', 'Planta Automotriz Típica'],
                ev: ['Ventas Vehículo Tradicional (ICE)', 'Ventas Nuevas Energías (EV/Híbridos)']
            } : {
                shipping: ['Shanghai to Los Angeles', 'Shanghai to New York', 'Monterrey to San Antonio', 'Bajío to Laredo'],
                shippingTitle: 'Shipping Time Comparison - Nearshoring',
                days: 'Days',
                energy: ['Manhattan Peak Consumption', 'Mega Data Center (Projected)', 'San Francisco Peak', 'Typical Auto Plant'],
                ev: ['Traditional Vehicle Sales (ICE)', 'New Energy Sales (EV/Hybrid)']
            };
            
            // Limpiar gráficas anteriores
            ['shippingComparisonChart', 'energyConsumptionChart', 'evMarketShareChart'].forEach(id => {
                const canvas = document.getElementById(id);
                const existingChart = Chart.getChart(canvas);
                if (existingChart) existingChart.destroy();
            });
            
            // Gráfica de Shipping
            new Chart(document.getElementById('shippingComparisonChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels.shipping,
                    datasets: [{
                        label: labels.days,
                        data: [20, 32, 1, 2],
                        backgroundColor: ['#90E0EF', '#90E0EF', '#FFB703', '#0077B6']
                    }]
                },
                options: {
                    indexAxis: 'y',
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: { display: false },
                        title: { display: true, text: labels.shippingTitle, font: { size: 14 } }
                    }
                }
            });
            
            // Gráfica de Energía
            new Chart(document.getElementById('energyConsumptionChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: labels.energy,
                    datasets: [{
                        label: 'Gigavatios (GW)',
                        data: [1.6, 1.4, 0.9, 0.05],
                        backgroundColor: ['#e0e0e0', '#FFB703', '#e0e0e0', '#e0e0e0']
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: { legend: { display: false } }
                }
            });
            
            // Gráfica EV con más espacio
            new Chart(document.getElementById('evMarketShareChart').getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: labels.ev,
                    datasets: [{
                        data: [82, 18],
                        backgroundColor: ['#e0e0e0', '#00B4D8']
                    }]
                },
                options: {
                    maintainAspectRatio: false,
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                padding: 15,
                                font: { size: 11 },
                                boxWidth: 15
                            }
                        }
                    },
                    layout: {
                        padding: {
                            top: 10,
                            bottom: 20,
                            left: 10,
                            right: 10
                        }
                    }
                }
            });
            
            // Plotly
            if (typeof Plotly !== 'undefined') {
                const plotlyLabels = idiomaActual === 'es' ? {
                    panama: 'Capacidad Canal Panamá',
                    isthmus: 'Capacidad Istmo',
                    year: 'Año',
                    index: 'Índice de Capacidad'
                } : {
                    panama: 'Panama Canal Capacity',
                    isthmus: 'Isthmus Capacity',
                    year: 'Year',
                    index: 'Capacity Index'
                };
                
                Plotly.newPlot('isthmusPlot', [
                    { x: ['2023', '2024', '2025', '2026'], y: [100, 85, 88, 90], mode: 'lines+markers', name: plotlyLabels.panama, line: {color: '#0077B6', width: 3} },
                    { x: ['2023', '2024', '2025', '2026'], y: [5, 15, 30, 45], mode: 'lines+markers', name: plotlyLabels.isthmus, line: {color: '#FFB703', width: 3, dash: 'dot'} }
                ], {
                    showlegend: true,
                    legend: { orientation: 'h', y: -0.2 },
                    margin: { t: 20, r: 20, l: 40, b: 40 },
                    xaxis: { title: plotlyLabels.year },
                    yaxis: { title: plotlyLabels.index }
                }, { responsive: true, displayModeBar: false });
            }
        }
        
        // Ejecutar cuando DOM esté listo
        (function() {
            setTimeout(crearGraficas, 100);
        })();
    </script>
</body>
</html>`
                        }
                    ],
                    attachments: []
                }
            ],
            attachments: []
        }
    ];
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
