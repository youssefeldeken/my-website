import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, X } from 'lucide-react';
import api from '../../services/api.js';

const CATEGORIES = [
  'Programming', 'Cybersecurity', 'Networking', 'Cloud',
  'Databases', 'Frameworks', 'Machine Learning', 'Tools', 'Languages',
];

const emptyForm = { name: '', category: CATEGORIES[0], level: 70, order: 0 };

export default function AdminSkills() {
  const [skills, setSkills] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filter, setFilter] = useState('All');

  const load = () => api.get('/skills').then(({ data }) => setSkills(data.data)).catch(() => {});
  useEffect(() => { load(); }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, category: s.category, level: s.level, order: s.order });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await api.put(`/skills/${editing._id}`, form);
        toast.success('Skill updated');
      } else {
        await api.post('/skills', form);
        toast.success('Skill added');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this skill?')) return;
    try {
      await api.delete(`/skills/${id}`);
      toast.success('Skill deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  const filtered = filter === 'All' ? skills : skills.filter((s) => s.category === filter);

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Skills</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow focus-ring">
          <Plus size={16} /> New Skill
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-mono border ${filter === cat ? 'border-primary text-primary' : 'border-white/10 text-muted'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="glass rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-white/5 text-muted font-mono text-xs uppercase">
            <tr>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Category</th>
              <th className="text-left px-4 py-3">Level</th>
              <th className="text-right px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((s) => (
              <tr key={s._id} className="border-t border-white/5">
                <td className="px-4 py-3">{s.name}</td>
                <td className="px-4 py-3 text-muted">{s.category}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${s.level}%` }} />
                    </div>
                    <span className="text-xs text-muted font-mono">{s.level}%</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => openEdit(s)} className="p-1.5 rounded hover:bg-white/5 text-muted"><Pencil size={14} /></button>
                    <button onClick={() => remove(s._id)} className="p-1.5 rounded hover:bg-danger/10 text-danger"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-muted text-sm">No skills in this category yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold text-lg">{editing ? 'Edit Skill' : 'New Skill'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Skill name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div>
                <label className="text-xs font-mono text-muted flex justify-between mb-1">
                  <span>Proficiency</span><span>{form.level}%</span>
                </label>
                <input type="range" min={0} max={100} value={form.level} onChange={(e) => setForm({ ...form, level: Number(e.target.value) })} className="w-full" />
              </div>
              <input type="number" placeholder="Display order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="w-full px-4 py-2.5 rounded-lg bg-primary text-bg font-medium hover:shadow-glow">
                {editing ? 'Save Changes' : 'Add Skill'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
