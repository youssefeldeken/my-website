import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Star, Eye, EyeOff, Pencil, X, Upload, ImagePlus } from 'lucide-react';
import api from '../../services/api.js';

const emptyForm = {
  title: '', shortDescription: '', description: '', technologies: '', category: 'Web App',
  githubUrl: '', liveUrl: '', features: '', coverImage: '', galleryImages: [],
};

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);

  const load = () => api.get('/projects?all=true').then(({ data }) => setProjects(data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, shortDescription: p.shortDescription, description: p.description,
      technologies: p.technologies?.join(', ') || '', category: p.category,
      githubUrl: p.githubUrl || '', liveUrl: p.liveUrl || '', features: p.features?.join(', ') || '',
      coverImage: p.coverImage || '', galleryImages: p.galleryImages || [],
    });
    setShowForm(true);
  };

  const uploadCover = async (file) => {
    if (!file) return;
    setUploadingCover(true);
    const fd = new FormData();
    fd.append('image', file);
    try {
      const { data } = await api.post('/uploads/single', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, coverImage: data.url }));
      toast.success('Cover image uploaded');
    } catch {
      toast.error('Cover upload failed');
    } finally {
      setUploadingCover(false);
    }
  };

  const uploadGallery = async (files) => {
    if (!files?.length) return;
    setUploadingGallery(true);
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('images', f));
    try {
      const { data } = await api.post('/uploads/multiple', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setForm((f) => ({ ...f, galleryImages: [...f.galleryImages, ...data.urls] }));
      toast.success(`${data.urls.length} image(s) added to gallery`);
    } catch {
      toast.error('Gallery upload failed');
    } finally {
      setUploadingGallery(false);
    }
  };

  const removeGalleryImage = (url) => {
    setForm((f) => ({ ...f, galleryImages: f.galleryImages.filter((u) => u !== url) }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      technologies: form.technologies.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`/projects/${editing._id}`, payload);
        toast.success('Project updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this project permanently?')) return;
    try {
      await api.delete(`/projects/${id}`);
      toast.success('Project deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const toggle = async (id, field) => {
    try {
      await api.patch(`/projects/${id}/toggle`, { field });
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Projects</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow focus-ring">
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-muted font-mono text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Cover</th>
              <th className="text-left px-4 py-3">Title</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Status</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-t border-white/5">
                <td className="px-4 py-3">
                  <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center">
                    {p.coverImage ? (
                      <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImagePlus size={16} className="text-muted" />
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">{p.title}</td>
                <td className="px-4 py-3 text-muted">{p.category}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${p.published ? 'bg-secondary/10 text-secondary' : 'bg-white/5 text-muted'}`}>
                    {p.published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => toggle(p._id, 'featured')} title="Toggle featured" className={`p-1.5 rounded hover:bg-white/5 ${p.featured ? 'text-primary' : 'text-muted'}`}>
                      <Star size={14} fill={p.featured ? 'currentColor' : 'none'} />
                    </button>
                    <button onClick={() => toggle(p._id, 'published')} title="Toggle published" className="p-1.5 rounded hover:bg-white/5 text-muted">
                      {p.published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <button onClick={() => openEdit(p)} title="Edit" className="p-1.5 rounded hover:bg-white/5 text-muted">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => remove(p._id)} title="Delete" className="p-1.5 rounded hover:bg-danger/10 text-danger">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold text-lg">{editing ? 'Edit Project' : 'New Project'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Short description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <textarea required placeholder="Full description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Technologies (comma separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Features (comma separated)" value={form.features} onChange={(e) => setForm({ ...form, features: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                {['Web App', 'Mobile App', 'Cybersecurity', 'Networking', 'Machine Learning', 'Other'].map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />

              <div className="pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-muted block mb-2">Cover image</label>
                {form.coverImage && (
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-2 bg-white/5">
                    <img src={form.coverImage} alt="Cover preview" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <input type="file" accept="image/*" onChange={(e) => uploadCover(e.target.files[0])} className="text-xs flex-1" />
                  {uploadingCover && <span className="text-xs text-muted font-mono">Uploading…</span>}
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <label className="text-xs font-mono text-muted block mb-2">Gallery images</label>
                {form.galleryImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-2 mb-2">
                    {form.galleryImages.map((url) => (
                      <div key={url} className="relative w-full h-16 rounded-lg overflow-hidden bg-white/5 group">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeGalleryImage(url)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-danger transition-opacity"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex gap-2">
                  <input type="file" accept="image/*" multiple onChange={(e) => uploadGallery(e.target.files)} className="text-xs flex-1" />
                  {uploadingGallery && <span className="text-xs text-muted font-mono">Uploading…</span>}
                </div>
              </div>

              <button type="submit" className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-bg font-medium hover:shadow-glow">
                <Upload size={16} /> {editing ? 'Save Changes' : 'Create Project'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
