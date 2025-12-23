const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['html', 'pdf', 'jpg', 'png', 'svg', 'zip', 'url', 'google-doc', 'google-sheet'],
    required: true
  },
  path: String, // ruta local o URL
  originalName: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now }
});

const SubtopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  resources: [ResourceSchema],
  footer: {
    color: String,
    image: String,
    title: String,
    subtitle: String,
    html: String
  }
});

const TopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  subtopics: [SubtopicSchema],
  header: {
    color: String,
    image: String,
    title: String,
    subtitle: String,
    html: String
  }
});

const IndexSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  topics: [TopicSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

IndexSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Index', IndexSchema);
