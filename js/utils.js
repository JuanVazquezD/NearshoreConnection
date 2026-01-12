// Shared utility functions for Nearshore Connection

// Escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

// Get status text in Spanish
function getStatusText(status) {
    const statusMap = {
        'white': 'Blanco',
        'yellow': 'Amarillo',
        'red': 'Rojo',
        'black': 'Negro'
    };
    return statusMap[status] || status;
}
