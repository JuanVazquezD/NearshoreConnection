// Estado global de la aplicación
let appData = {
    header: { title: 'Nearshore Connection', subtitle: 'Sistema de Gestión de Contenido', color: '', image: '' },
    topics: [],
    footer: { text: '© 2025 Nearshore Connection', color: '', html: '' },
    currentTopic: null,
    currentSubtopic: null,
    editMode: false
};

document.addEventListener('DOMContentLoaded', () => { loadFromLocalStorage(); renderMenu(); setupEventListeners(); });

function setupEventListeners() {
    document.getElementById('main-header').addEventListener('click', () => { if (appData.editMode) openModal('header-modal'); });
    document.getElementById('main-footer').addEventListener('click', () => { if (appData.editMode) openModal('footer-modal'); });
}

function toggleEditMode() {
    appData.editMode = !appData.editMode;
    document.body.classList.toggle('edit-mode', appData.editMode);
    alert(appData.editMode ? 'Modo Edición ACTIVADO' : 'Modo Edición DESACTIVADO');
}

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if (modalId === 'header-modal') {
        document.getElementById('edit-header-title').value = appData.header.title;
        document.getElementById('edit-header-subtitle').value = appData.header.subtitle;
    }
}

function closeModal(modalId) { document.getElementById(modalId).classList.remove('active'); }

function updateHeader() {
    appData.header.title = document.getElementById('edit-header-title').value;
    appData.header.subtitle = document.getElementById('edit-header-subtitle').value;
    document.getElementById('header-title').textContent = appData.header.title;
    document.getElementById('header-subtitle').textContent = appData.header.subtitle;
    closeModal('header-modal'); saveToLocalStorage();
}

function updateFooter() {
    appData.footer.text = document.getElementById('edit-footer-text').value;
    document.getElementById('footer-text').textContent = appData.footer.text;
    closeModal('footer-modal'); saveToLocalStorage();
}

function addTopic() {
    document.getElementById('topic-name').value = '';
    document.getElementById('topic-description').value = '';
    openModal('topic-modal');
}

function saveTopic() {
    const name = document.getElementById('topic-name').value.trim();
    if (!name) return alert('El nombre del tema es obligatorio');
    appData.topics.push({ id: Date.now(), name, description: document.getElementById('topic-description').value, subtopics: [] });
    closeModal('topic-modal'); renderMenu(); saveToLocalStorage();
}

function deleteTopic(index) {
    if (confirm('¿Eliminar este tema?')) {
        appData.topics.splice(index, 1); renderMenu(); saveToLocalStorage();
    }
}

function toggleSubtopics(index) {
    document.getElementById(`subtopics-${index}`).classList.toggle('active');
}

function addSubtopic(topicIndex) {
    appData.currentTopic = topicIndex;
    document.getElementById('subtopic-name').value = '';
    document.getElementById('subtopic-description').value = '';
    openModal('subtopic-modal');
}

function saveSubtopic() {
    const name = document.getElementById('subtopic-name').value.trim();
    if (!name) return alert('El nombre del subtema es obligatorio');
    appData.topics[appData.currentTopic].subtopics.push({
        id: Date.now(), name, description: document.getElementById('subtopic-description').value, resources: []
    });
    closeModal('subtopic-modal'); renderMenu(); saveToLocalStorage();
}

function showTopicContent(topicIndex) {
    const topic = appData.topics[topicIndex];
    let html = `<h2>${topic.name}</h2><p>${topic.description}</p><div class="resource-container"><h3>Subtemas</h3>`;
    topic.subtopics.forEach((sub, i) => {
        html += `<div class="subtopic-content" style="margin:20px 0;padding:15px;background:white;border-radius:8px;">
            <h4>${sub.name}</h4><p>${sub.description}</p>
            <button onclick="addResource(${topicIndex}, ${i})" class="add-resource-btn">+ Agregar Recurso</button>
            <div class="resources-list">${renderResources(sub.resources, topicIndex, i)}</div></div>`;
    });
    document.getElementById('topic-content').innerHTML = html + '</div>';
}

function renderResources(resources, topicIndex, subtopicIndex) {
    if (!resources || resources.length === 0) return '<p style="color:#6c757d;font-style:italic;">No hay recursos</p>';
    return resources.map((r, i) => {
        let content = '';
        if (r.type === 'pdf') content = `<embed src="${r.url}" type="application/pdf" width="100%" height="600px">`;
        else if (r.type === 'image') content = `<img src="${r.url}" alt="${r.name}" style="max-width:100%;">`;
        else if (r.type === 'html') content = `<iframe src="${r.url}" width="100%" height="600px"></iframe>`;
        else if (r.type === 'google-doc') content = `<iframe src="https://docs.google.com/document/d/${r.url.match(/\/d\/([^/]+)/)?.[1]}/preview" width="100%" height="600px"></iframe>`;
        else if (r.type === 'google-sheet') content = `<iframe src="https://docs.google.com/spreadsheets/d/${r.url.match(/\/d\/([^/]+)/)?.[1]}/preview" width="100%" height="600px"></iframe>`;
        else if (r.type === 'url') content = `<a href="${r.url}" target="_blank">${r.name}</a>`;
        else if (r.type === 'embed-code') content = r.code;
        return `<div class="resource-item"><h5>${r.name}</h5>${content}<button onclick="deleteResource(${topicIndex},${subtopicIndex},${i})" class="btn-danger">Eliminar</button></div>`;
    }).join('');
}

function addResource(topicIndex, subtopicIndex) {
    appData.currentTopic = topicIndex;
    appData.currentSubtopic = subtopicIndex;
    document.getElementById('resource-type').value = '';
    document.getElementById('resource-form-container').innerHTML = '';
    openModal('resource-modal');
}

function updateResourceForm() {
    const type = document.getElementById('resource-type').value;
    let form = '<label>Nombre:</label><input type="text" id="resource-name" placeholder="Nombre descriptivo">';
    if (['html','css','js','pdf','image','google-doc','google-sheet','url'].includes(type)) {
        form += '<label>URL:</label><input type="url" id="resource-url" placeholder="https://...">';
    } else if (type === 'embed-code') {
        form += '<label>Código:</label><textarea id="resource-code"></textarea>';
    }
    document.getElementById('resource-form-container').innerHTML = form;
}

function saveResource() {
    const type = document.getElementById('resource-type').value;
    const name = document.getElementById('resource-name')?.value.trim();
    if (!type || !name) return alert('Completa todos los campos');
    const resource = { id: Date.now(), type, name };
    if (type === 'embed-code') resource.code = document.getElementById('resource-code')?.value;
    else resource.url = document.getElementById('resource-url')?.value;
    appData.topics[appData.currentTopic].subtopics[appData.currentSubtopic].resources.push(resource);
    closeModal('resource-modal'); showTopicContent(appData.currentTopic); saveToLocalStorage();
}

function deleteResource(topicIndex, subtopicIndex, resourceIndex) {
    if (confirm('¿Eliminar?')) {
        appData.topics[topicIndex].subtopics[subtopicIndex].resources.splice(resourceIndex, 1);
        showTopicContent(topicIndex); saveToLocalStorage();
    }
}

function renderMenu() {
    const container = document.getElementById('menu-container');
    if (appData.topics.length === 0) return container.innerHTML = '<p style="color:#ecf0f1;font-style:italic;">No hay temas</p>';
    let html = '';
    appData.topics.forEach((topic, i) => {
        html += `<div class="menu-topic"><div class="topic-header" onclick="toggleSubtopics(${i})">
            <span class="topic-title">${topic.name}</span>
            <div class="topic-actions" onclick="event.stopPropagation();">
                <button class="icon-btn" onclick="showTopicContent(${i})">👁️</button>
                <button class="icon-btn" onclick="deleteTopic(${i})">🗑️</button>
            </div></div><div id="subtopics-${i}" class="subtopic-list">`;
        topic.subtopics.forEach(sub => {
            html += `<div class="subtopic-item" onclick="showTopicContent(${i})"><span>${sub.name}</span></div>`;
        });
        html += `<button class="add-subtopic-btn" onclick="addSubtopic(${i})">+ Subtema</button></div></div>`;
    });
    container.innerHTML = html;
}

function saveContent() { saveToLocalStorage(); alert('Guardado!'); }
function saveToLocalStorage() { localStorage.setItem('nearshoreData', JSON.stringify(appData)); }
function loadFromLocalStorage() {
    const saved = localStorage.getItem('nearshoreData');
    if (saved) {
        appData = JSON.parse(saved);
        document.getElementById('header-title').textContent = appData.header.title;
        document.getElementById('header-subtitle').textContent = appData.header.subtitle;
    }
}
function exportContent() {
    const blob = new Blob([JSON.stringify(appData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'nearshore-data.json';
    link.click();
}
