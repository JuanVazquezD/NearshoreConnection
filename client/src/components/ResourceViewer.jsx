import React, { useState, useEffect } from 'react';

const ResourceViewer = ({ indexId }) => {
  const [index, setIndex] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [uploadData, setUploadData] = useState({
    file: null,
    url: '',
    type: 'url',
    topicId: '',
    subtopicId: ''
  });

  useEffect(() => {
    if (indexId) {
      fetchIndex();
    }
  }, [indexId]);

  const fetchIndex = async () => {
    try {
      const response = await fetch(`/api/indexes/${indexId}`);
      const data = await response.json();
      setIndex(data);
    } catch (error) {
      console.error('Error fetching index:', error);
    }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    if (uploadData.file) {
      formData.append('file', uploadData.file);
    } else if (uploadData.url) {
      formData.append('url', uploadData.url);
      formData.append('type', uploadData.type);
    }
    
    formData.append('indexId', indexId);
    formData.append('topicId', uploadData.topicId);
    formData.append('subtopicId', uploadData.subtopicId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const updatedIndex = await response.json();
      setIndex(updatedIndex);
      alert('Recurso subido exitosamente');
      setUploadData({ file: null, url: '', type: 'url', topicId: '', subtopicId: '' });
    } catch (error) {
      console.error('Error uploading resource:', error);
    }
  };

  const renderResource = (resource) => {
    switch (resource.type) {
      case 'pdf':
        return <embed src={resource.path} type="application/pdf" width="100%" height="600px" />;
      case 'jpg':
      case 'png':
      case 'svg':
        return <img src={resource.path} alt={resource.originalName} style={{ maxWidth: '100%' }} />;
      case 'html':
        return <iframe src={resource.path} width="100%" height="600px" title={resource.originalName} />;
      case 'url':
        return <a href={resource.path} target="_blank" rel="noopener noreferrer">{resource.originalName}</a>;
      case 'google-doc':
        return <iframe src={`https://docs.google.com/document/d/${resource.path}/preview`} width="100%" height="600px" title="Google Doc" />;
      case 'google-sheet':
        return <iframe src={`https://docs.google.com/spreadsheets/d/${resource.path}/preview`} width="100%" height="600px" title="Google Sheet" />;
      default:
        return <a href={resource.path} download>{resource.originalName}</a>;
    }
  };

  if (!index) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="resource-viewer">
      <h1>{index.name}</h1>
      <p>{index.description}</p>

      <section className="upload-section">
        <h2>Subir Recurso</h2>
        <form onSubmit={handleFileUpload}>
          <select
            value={uploadData.topicId}
            onChange={(e) => setUploadData({ ...uploadData, topicId: e.target.value })}
            required
          >
            <option value="">Seleccionar tema</option>
            {index.topics?.map((topic) => (
              <option key={topic._id} value={topic._id}>{topic.title}</option>
            ))}
          </select>

          {uploadData.topicId && (
            <select
              value={uploadData.subtopicId}
              onChange={(e) => setUploadData({ ...uploadData, subtopicId: e.target.value })}
              required
            >
              <option value="">Seleccionar subtema</option>
              {index.topics
                ?.find(t => t._id === uploadData.topicId)
                ?.subtopics?.map((subtopic) => (
                  <option key={subtopic._id} value={subtopic._id}>{subtopic.title}</option>
                ))}
            </select>
          )}

          <div>
            <label>
              <input
                type="radio"
                value="file"
                checked={uploadData.type === 'file'}
                onChange={() => setUploadData({ ...uploadData, type: 'file', url: '' })}
              />
              Archivo
            </label>
            <label>
              <input
                type="radio"
                value="url"
                checked={uploadData.type === 'url'}
                onChange={() => setUploadData({ ...uploadData, type: 'url', file: null })}
              />
              URL
            </label>
          </div>

          {uploadData.type === 'file' ? (
            <input
              type="file"
              onChange={(e) => setUploadData({ ...uploadData, file: e.target.files[0] })}
              accept=".html,.pdf,.jpg,.jpeg,.png,.svg,.zip"
            />
          ) : (
            <input
              type="url"
              placeholder="URL del recurso"
              value={uploadData.url}
              onChange={(e) => setUploadData({ ...uploadData, url: e.target.value })}
            />
          )}

          <button type="submit">Subir</button>
        </form>
      </section>

      <section className="topics-section">
        {index.topics?.map((topic) => (
          <div key={topic._id} className="topic">
            {topic.header && (
              <div className="topic-header" style={{ backgroundColor: topic.header.color }}>
                {topic.header.image && <img src={topic.header.image} alt="Header" />}
                <h2>{topic.header.title || topic.title}</h2>
                {topic.header.subtitle && <p>{topic.header.subtitle}</p>}
                {topic.header.html && <div dangerouslySetInnerHTML={{ __html: topic.header.html }} />}
              </div>
            )}

            <h2>{topic.title}</h2>
            <p>{topic.description}</p>

            {topic.subtopics?.map((subtopic) => (
              <div key={subtopic._id} className="subtopic">
                <h3>{subtopic.title}</h3>
                <p>{subtopic.description}</p>

                <div className="resources">
                  {subtopic.resources?.map((resource, idx) => (
                    <div key={idx} className="resource">
                      {renderResource(resource)}
                    </div>
                  ))}
                </div>

                {subtopic.footer && (
                  <div className="subtopic-footer" style={{ backgroundColor: subtopic.footer.color }}>
                    {subtopic.footer.image && <img src={subtopic.footer.image} alt="Footer" />}
                    {subtopic.footer.title && <h4>{subtopic.footer.title}</h4>}
                    {subtopic.footer.subtitle && <p>{subtopic.footer.subtitle}</p>}
                    {subtopic.footer.html && <div dangerouslySetInnerHTML={{ __html: subtopic.footer.html }} />}
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
};

export default ResourceViewer;
