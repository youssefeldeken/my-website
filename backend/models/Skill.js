import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Programming', 'Cybersecurity', 'Networking', 'Cloud',
        'Databases', 'Frameworks', 'Machine Learning', 'Tools', 'Languages',
      ],
      required: true,
    },
    description: { type: String, default: '' },
    icon: { type: String, default: '' },
    level: { type: Number, min: 0, max: 100, default: 70 },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', skillSchema);
