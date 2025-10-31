import mongoose from 'mongoose';
const publicationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  authors: [{
    name: String,
    email: String
  }],
  abstract: {
    type: String,
    required: true
  },
  keywords: [String],
  journal: {
    type: String,
    required: true
  },
  volume: String,
  issue: String,
  pages: String,
  publicationDate: {
    type: Date,
    required: true
  },
  doi: String,
  citations: {
    type: Number,
    default: 0
  },
  fileName: String,
  filePath: String,
  fileType: {
    type: String,
    enum: ['pdf', 'docx'],
    required: true
  },
  summaries: {
    extractive: String,
    abstractive: String,
    hybrid: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String,
    required: true
  },
  visibility: {
    type: String,
    enum: ['public', 'private', 'department'],
    default: 'public'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});
export default mongoose.models.Publication || mongoose.model('Publication', publicationSchema);
