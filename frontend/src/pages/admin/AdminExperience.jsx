import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import api from '../../services/api.js';

const emptyForm = {
  company: '', role: '', location: '', startDate: '', endDate: 'Present',
  responsibilities: '', achievements: '', order: 0,
};

export default function AdminExperience() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const load = () => api.get('/experience').then(({ data }) => setItems(data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      company: item.company, role: item.role, location: item.location || '',
      startDate: item.startDate, endDate: item.endDate,
      responsibilities: item.responsibilities?.join('\n') || '',
      achievements: item.achievements?.join('\n') || '',
      order: item.order,
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
      achievements: form.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
    };
    try {
      if (editing) {
        await api.put(`/experience/${editing._id}`, payload);
        toast.success('Experience updated');
      } else {
        await api.post('/experience', payload);
        toast.success('Experience added');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this experience entry?')) return;
    try {
      await api.delete(`/experience/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Experience</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow focus-ring">
          <Plus size={16} /> New Entry
        </button>
      </div>

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-xl p-5">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-mono text-xs text-secondary mb-1">{item.startDate} – {item.endDate}</p>
                <p className="font-display font-semibold text-lg">{item.role}</p>
                <p className="text-sm text-muted">{item.company}{item.location ? ` — ${item.location}` : ''}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-white/5 text-muted"><Pencil size={14} /></button>
                <button onClick={() => remove(item._id)} className="p-1.5 rounded hover:bg-danger/10 text-danger"><Trash2 size={14} /></button>
              </div>
            </div>
            {item.responsibilities?.length > 0 && (
              <ul className="mt-3 space-y-1">
                {item.responsibilities.map((r) => (
                  <li key={r} className="text-sm flex gap-2"><span className="text-primary">▹</span>{r}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {items.length === 0 && <p className="text-muted text-sm">No experience entries yet.</p>}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 w-full max-w-lg max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold text-lg">{editing ? 'Edit Experience' : 'New Experience'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Location (optional)" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Start date (e.g. Jul 2025)" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="End date (or 'Present')" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Responsibilities (one per line)" value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <textarea placeholder="Achievements (one per line)" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} rows={3} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Display order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="w-full px-4 py-2.5 rounded-lg bg-primary text-bg font-medium hover:shadow-glow">
                {editing ? 'Save Changes' : 'Add Experience'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
