import mongoose from 'mongoose';

const settingsSchema = new mongoose.Schema(
  {
    heroTitle: { type: String, default: 'Youssef Ahmed Lotfy' },
    heroTaglines: [{ type: String }],
    summary: { type: String, default: '' },
    profileImage: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    location: { type: String, default: '' },
    socialLinks: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      website: { type: String, default: '' },
    },
    languages: [
      {
        name: String,
        level: String,
      },
    ],
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

export default mongoose.model('Settings', settingsSchema);
