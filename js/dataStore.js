// Data Store - Handles loading and saving data from JSON file and localStorage
const DataStore = {
    DATA_FILE: 'data/temas.json',
    STORAGE_KEY: 'nearshorethemes',
    
    // Load data from JSON file (primary source)
    async loadFromJSON() {
        try {
            const response = await fetch(this.DATA_FILE);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.themes || [];
        } catch (error) {
            console.error('Error loading from JSON:', error);
            // Fallback to localStorage
            return this.loadFromLocalStorage();
        }
    },
    
    // Load data from localStorage (fallback)
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.error('Error loading from localStorage:', error);
        }
        return [];
    },
    
    // Save data to localStorage (for admin preview before export)
    saveToLocalStorage(themes) {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(themes));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    },
    
    // Export data as JSON file (for admin to download and commit)
    exportToJSON(themes) {
        const data = {
            version: 1,
            themes: themes
        };
        const dataStr = JSON.stringify(data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'temas.json';
        link.click();
        URL.revokeObjectURL(url);
        alert('✅ JSON exportado. Guárdalo como data/temas.json y haz commit al repo.');
    },
    
    // Import data from JSON file (for admin)
    importFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const imported = JSON.parse(e.target.result);
                    let themes;
                    
                    // Support both formats: {version, themes} or direct array
                    if (imported.themes && Array.isArray(imported.themes)) {
                        themes = imported.themes;
                    } else if (Array.isArray(imported)) {
                        themes = imported;
                    } else {
                        throw new Error('Formato de JSON inválido');
                    }
                    
                    resolve(themes);
                } catch (error) {
                    reject(error);
                }
            };
            reader.onerror = () => reject(new Error('Error leyendo el archivo'));
            reader.readAsText(file);
        });
    }
};
