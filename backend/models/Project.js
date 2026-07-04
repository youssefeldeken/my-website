import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    shortDescription: { type: String, required: true, maxlength: 240 },
    description: { type: String, required: true },
    coverImage: { type: String, default: '' },
    galleryImages: [{ type: String }],
    technologies: [{ type: String }],
    category: {
      type: String,
      enum: ['Web App', 'Mobile App', 'Cybersecurity', 'Networking', 'Machine Learning', 'Other'],
      default: 'Web App',
    },
    features: [{ type: String }],
    challenges: { type: String, default: '' },
    solutions: { type: String, default: '' },
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    timeline: { type: String, default: '' },
    featured: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
