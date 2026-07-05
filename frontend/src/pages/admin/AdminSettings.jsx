import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Save, Upload, User } from 'lucide-react';
import api from '../../services/api.js';
import ImageCropModal from '../../components/ImageCropModal.jsx';

export default function AdminSettings() {
  const [settings, setSettings] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [cropSrc, setCropSrc] = useState(null); // object URL of the photo currently being cropped

  useEffect(() => {
    api.get('/settings').then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  if (!settings) return <p className="text-muted text-sm">Loading settings…</p>;

  const save = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', settings);
      toast.success('Settings saved');
    } catch {
      toast.error('Save failed');
    }
  };

  const onPhotoSelected = (file) => {
    if (!file) return;
    setCropSrc(URL.createObjectURL(file));
  };

  const onCropCancel = () => {
    if (cropSrc) URL.revokeObjectURL(cropSrc);
    setCropSrc(null);
  };

  const onCropConfirm = async (croppedBlob) => {
    setUploadingPhoto(true);
    const fd = new FormData();
    fd.append('image', croppedBlob, 'profile.jpg');
    try {
      const { data } = await api.post('/uploads/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      const updated = { ...settings, profileImage: data.url };
      setSettings(updated);
      await api.put('/settings', updated);
      toast.success('Profile photo updated — refresh the site to see it live');
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploadingPhoto(false);
      if (cropSrc) URL.revokeObjectURL(cropSrc);
      setCropSrc(null);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return toast.error('Choose a PDF first');
    const fd = new FormData();
    fd.append('resume', resumeFile);
    try {
      await api.post('/resume', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('CV uploaded');
    } catch {
      toast.error('Upload failed');
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold mb-6">Site Settings</h1>

      <form onSubmit={save} className="glass rounded-xl p-6 space-y-4 mb-6">
        <div>
          <label className="text-xs font-mono text-muted">Hero Title</label>
          <input value={settings.heroTitle} onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono text-muted">Summary</label>
          <textarea value={settings.summary} onChange={(e) => setSettings({ ...settings, summary: e.target.value })} rows={3} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-mono text-muted">Email</label>
            <input value={settings.email} onChange={(e) => setSettings({ ...settings, email: e.target.value })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-muted">Phone</label>
            <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
          </div>
        </div>
        <div>
          <label className="text-xs font-mono text-muted">Location</label>
          <input value={settings.location || ''} onChange={(e) => setSettings({ ...settings, location: e.target.value })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono text-muted">GitHub URL</label>
          <input value={settings.socialLinks?.github || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, github: e.target.value } })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono text-muted">LinkedIn URL</label>
          <input value={settings.socialLinks?.linkedin || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, linkedin: e.target.value } })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="text-xs font-mono text-muted">Website URL</label>
          <input value={settings.socialLinks?.website || ''} onChange={(e) => setSettings({ ...settings, socialLinks: { ...settings.socialLinks, website: e.target.value } })} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <button type="submit" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-bg font-medium hover:shadow-glow">
          <Save size={16} /> Save Settings
        </button>
      </form>

      <div className="glass rounded-xl p-6 mb-6">
        <h2 className="font-display font-semibold mb-3 flex items-center gap-2"><User size={16} /> Profile Photo</h2>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
            {settings.profileImage ? (
              <img src={settings.profileImage} alt="Current profile" className="w-full h-full object-cover" />
            ) : (
              <User size={24} className="text-muted" />
            )}
          </div>
          <p className="text-xs text-muted">Current photo shown on the homepage hero. Choosing a new file opens a crop step so you can frame it before it's saved.</p>
        </div>
        <div className="flex gap-3">
          <input
            type="file"
            accept="image/*"
            disabled={uploadingPhoto}
            onChange={(e) => onPhotoSelected(e.target.files[0])}
            className="text-sm flex-1"
          />
          {uploadingPhoto && <span className="text-xs text-muted font-mono self-center">Uploading…</span>}
        </div>
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-semibold mb-3">Upload New CV</h2>
        <div className="flex gap-3">
          <input type="file" accept="application/pdf" onChange={(e) => setResumeFile(e.target.files[0])} className="text-sm flex-1" />
          <button onClick={uploadResume} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-bg text-sm font-medium">
            <Upload size={16} /> Upload
          </button>
        </div>
      </div>

      {cropSrc && (
        <ImageCropModal
          imageSrc={cropSrc}
          aspect={1}
          onCancel={onCropCancel}
          onConfirm={onCropConfirm}
        />
      )}
    </div>
  );
}
