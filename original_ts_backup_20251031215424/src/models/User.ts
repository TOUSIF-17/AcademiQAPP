import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  userType: {
    type: String,
    required: true,
    enum: ['Faculty', 'Student']
  },
  profileImage: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  publications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Publication'
  }],
  citations: {
    type: Number,
    default: 0,
  },
  hIndex: {
    type: Number,
    default: 0,
  },
  teachingWeight: {
    type: Number,
    default: 1.0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.User || mongoose.model('User', userSchema);