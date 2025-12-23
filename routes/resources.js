const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Index = require('../models/Index');
const { sanitizeUserHtml } = require('../utils/sanitize');

// Configurar multer para almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || 'public/uploads/resources';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 52428800 // 50MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg|pdf|zip|html/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Tipo de archivo no permitido'));
  }
});

// Middleware de autenticación placeholder
const requireAuth = (req, res, next) => {
  // TODO: Implementar autenticación real (JWT/session)
  next();
};

// POST /api/indexes - Crear índice
router.post('/indexes', requireAuth, async (req, res) => {
  try {
    const { name, description } = req.body;
    const newIndex = new Index({ name, description });
    await newIndex.save();
    res.status(201).json(newIndex);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/indexes/:indexId - Obtener índice
router.get('/indexes/:indexId', async (req, res) => {
  try {
    const index = await Index.findById(req.params.indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/indexes/:indexId/topics - Agregar tema
router.post('/indexes/:indexId/topics', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const index = await Index.findById(req.params.indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    
    index.topics.push({ title, description, subtopics: [] });
    await index.save();
    res.status(201).json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/indexes/:indexId/topics/:topicId/subtopics - Agregar subtema
router.post('/indexes/:indexId/topics/:topicId/subtopics', requireAuth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const index = await Index.findById(req.params.indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    
    const topic = index.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    
    topic.subtopics.push({ title, description, resources: [] });
    await index.save();
    res.status(201).json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/upload - Subir recurso
router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  try {
    const { indexId, topicId, subtopicId, url, type } = req.body;
    
    const index = await Index.findById(indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    
    const topic = index.topics.id(topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    
    let resource = {};
    
    if (req.file) {
      // Recurso tipo archivo
      const ext = path.extname(req.file.originalname).toLowerCase().slice(1);
      resource = {
        type: ext,
        path: req.file.path,
        originalName: req.file.originalname,
        size: req.file.size
      };
    } else if (url) {
      // Recurso tipo URL
      resource = {
        type: type || 'url',
        path: url,
        originalName: url
      };
    } else {
      return res.status(400).json({ error: 'Se requiere archivo o URL' });
    }
    
    if (subtopicId) {
      const subtopic = topic.subtopics.id(subtopicId);
      if (!subtopic) {
        return res.status(404).json({ error: 'Subtema no encontrado' });
      }
      subtopic.resources.push(resource);
    } else {
      // Si no hay subtopicId, añadir al topic directamente (requiere modificar esquema)
      return res.status(400).json({ error: 'Se requiere subtopicId' });
    }
    
    await index.save();
    res.status(201).json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/indexes/:indexId/topics/:topicId/header - Configurar header
router.post('/indexes/:indexId/topics/:topicId/header', requireAuth, async (req, res) => {
  try {
    const { color, image, title, subtitle, html } = req.body;
    const index = await Index.findById(req.params.indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    
    const topic = index.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    
    topic.header = {
      color,
      image,
      title,
      subtitle,
      html: html ? sanitizeUserHtml(html) : undefined
    };
    
    await index.save();
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/indexes/:indexId/topics/:topicId/subtopics/:subtopicId/footer - Configurar footer
router.post('/indexes/:indexId/topics/:topicId/subtopics/:subtopicId/footer', requireAuth, async (req, res) => {
  try {
    const { color, image, title, subtitle, html } = req.body;
    const index = await Index.findById(req.params.indexId);
    if (!index) {
      return res.status(404).json({ error: 'Índice no encontrado' });
    }
    
    const topic = index.topics.id(req.params.topicId);
    if (!topic) {
      return res.status(404).json({ error: 'Tema no encontrado' });
    }
    
    const subtopic = topic.subtopics.id(req.params.subtopicId);
    if (!subtopic) {
      return res.status(404).json({ error: 'Subtema no encontrado' });
    }
    
    subtopic.footer = {
      color,
      image,
      title,
      subtitle,
      html: html ? sanitizeUserHtml(html) : undefined
    };
    
    await index.save();
    res.json(index);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
