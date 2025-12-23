import React, { useState } from 'react';

const IndexEditor = () => {
  const [indexes, setIndexes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [formData, setFormData] = useState({
    indexName: '',
    indexDescription: '',
    topicTitle: '',
    topicDescription: '',
    subtopicTitle: '',
    subtopicDescription: ''
  });

  const createIndex = async () => {
    try {
      const response = await fetch('/api/indexes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.indexName,
          description: formData.indexDescription
        })
      });
      const newIndex = await response.json();
      setIndexes([...indexes, newIndex]);
      setCurrentIndex(newIndex);
      alert('Índice creado exitosamente');
    } catch (error) {
      console.error('Error creating index:', error);
    }
  };

  const addTopic = async () => {
    if (!currentIndex) {
      alert('Selecciona un índice primero');
      return;
    }
    try {
      const response = await fetch(`/api/indexes/${currentIndex._id}/topics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.topicTitle,
          description: formData.topicDescription
        })
      });
      const updatedIndex = await response.json();
      setCurrentIndex(updatedIndex);
      alert('Tema agregado exitosamente');
    } catch (error) {
      console.error('Error adding topic:', error);
    }
  };

  const addSubtopic = async (topicId) => {
    if (!currentIndex) {
      alert('Selecciona un índice primero');
      return;
    }
    try {
      const response = await fetch(`/api/indexes/${currentIndex._id}/topics/${topicId}/subtopics`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.subtopicTitle,
          description: formData.subtopicDescription
        })
      });
      const updatedIndex = await response.json();
      setCurrentIndex(updatedIndex);
      alert('Subtema agregado exitosamente');
    } catch (error) {
      console.error('Error adding subtopic:', error);
    }
  };

  return (
    <div className="index-editor">
      <h1>Editor de Índices</h1>
      
      <section className="create-index">
        <h2>Crear Índice</h2>
        <input
          type="text"
          placeholder="Nombre del índice"
          value={formData.indexName}
          onChange={(e) => setFormData({ ...formData, indexName: e.target.value })}
        />
        <textarea
          placeholder="Descripción"
          value={formData.indexDescription}
          onChange={(e) => setFormData({ ...formData, indexDescription: e.target.value })}
        />
        <button onClick={createIndex}>Crear Índice</button>
      </section>

      {currentIndex && (
        <>
          <section className="add-topic">
            <h2>Agregar Tema</h2>
            <input
              type="text"
              placeholder="Título del tema"
              value={formData.topicTitle}
              onChange={(e) => setFormData({ ...formData, topicTitle: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              value={formData.topicDescription}
              onChange={(e) => setFormData({ ...formData, topicDescription: e.target.value })}
            />
            <button onClick={addTopic}>Agregar Tema</button>
          </section>

          <section className="topics-list">
            <h2>Temas</h2>
            {currentIndex.topics?.map((topic) => (
              <div key={topic._id} className="topic-item">
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                
                <div className="add-subtopic">
                  <input
                    type="text"
                    placeholder="Título del subtema"
                    value={formData.subtopicTitle}
                    onChange={(e) => setFormData({ ...formData, subtopicTitle: e.target.value })}
                  />
                  <button onClick={() => addSubtopic(topic._id)}>Agregar Subtema</button>
                </div>

                <div className="subtopics-list">
                  {topic.subtopics?.map((subtopic) => (
                    <div key={subtopic._id} className="subtopic-item">
                      <h4>{subtopic.title}</h4>
                      <p>{subtopic.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </div>
  );
};

export default IndexEditor;
