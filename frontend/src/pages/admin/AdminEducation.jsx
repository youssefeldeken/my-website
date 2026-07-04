import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Trash2, Pencil, X, Languages as LangIcon, Save } from 'lucide-react';
import api from '../../services/api.js';

const emptyForm = { institution: '', degree: '', field: '', startYear: '', endYear: '', details: '', order: 0 };

export default function AdminEducation() {
  const [items, setItems] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const [settings, setSettings] = useState(null);
  const [savingLangs, setSavingLangs] = useState(false);

  const load = () => api.get('/education').then(({ data }) => setItems(data.data)).catch(() => {});
  useEffect(() => {
    load();
    api.get('/settings').then(({ data }) => setSettings(data.data)).catch(() => {});
  }, []);

  const openNew = () => { setEditing(null); setForm(emptyForm); setShowForm(true); };
  const openEdit = (item) => {
    setEditing(item);
    setForm({
      institution: item.institution, degree: item.degree, field: item.field || '',
      startYear: item.startYear, endYear: item.endYear || '',
      details: item.details?.join('\n') || '', order: item.order,
    });
    setShowForm(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    const payload = { ...form, details: form.details.split('\n').map((s) => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        await api.put(`/education/${editing._id}`, payload);
        toast.success('Education updated');
      } else {
        await api.post('/education', payload);
        toast.success('Education added');
      }
      setShowForm(false);
      load();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Save failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this education entry?')) return;
    try {
      await api.delete(`/education/${id}`);
      toast.success('Deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  // --- Languages (stored on Settings, not Education, but grouped here under "About Me") ---
  const updateLang = (index, field, value) => {
    const langs = [...settings.languages];
    langs[index] = { ...langs[index], [field]: value };
    setSettings({ ...settings, languages: langs });
  };
  const addLang = () => setSettings({ ...settings, languages: [...(settings.languages || []), { name: '', level: '' }] });
  const removeLang = (index) => setSettings({ ...settings, languages: settings.languages.filter((_, i) => i !== index) });
  const saveLangs = async () => {
    setSavingLangs(true);
    try {
      await api.put('/settings', { languages: settings.languages });
      toast.success('Languages saved');
    } catch {
      toast.error('Save failed');
    } finally {
      setSavingLangs(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">About Me — Education</h1>
        <button onClick={openNew} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow focus-ring">
          <Plus size={16} /> New Entry
        </button>
      </div>

      <div className="space-y-3 mb-10">
        {items.map((item) => (
          <div key={item._id} className="glass rounded-xl p-5">
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-mono text-xs text-secondary mb-1">{item.startYear} – {item.endYear || 'Present'}</p>
                <p className="font-display font-semibold text-lg">{item.institution}</p>
                <p className="text-sm text-text">{item.degree}</p>
                <p className="text-sm text-muted">{item.field}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => openEdit(item)} className="p-1.5 rounded hover:bg-white/5 text-muted"><Pencil size={14} /></button>
                <button onClick={() => remove(item._id)} className="p-1.5 rounded hover:bg-danger/10 text-danger"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-muted text-sm">No education entries yet.</p>}
      </div>

      <div className="glass rounded-xl p-6 max-w-lg">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2"><LangIcon size={16} /> Languages</h2>
        {settings?.languages?.map((lang, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input placeholder="Language" value={lang.name} onChange={(e) => updateLang(i, 'name', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <input placeholder="Level (e.g. Fluent)" value={lang.level} onChange={(e) => updateLang(i, 'level', e.target.value)} className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
            <button onClick={() => removeLang(i)} className="p-2 rounded-lg hover:bg-danger/10 text-danger"><X size={16} /></button>
          </div>
        ))}
        <div className="flex gap-2 mt-3">
          <button onClick={addLang} type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-sm hover:bg-white/10">
            <Plus size={14} /> Add Language
          </button>
          <button onClick={saveLangs} disabled={savingLangs} type="button" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-bg text-sm font-medium disabled:opacity-60">
            <Save size={14} /> {savingLangs ? 'Saving…' : 'Save Languages'}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="glass rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display font-semibold text-lg">{editing ? 'Edit Education' : 'New Education'}</h2>
              <button onClick={() => setShowForm(false)}><X size={18} /></button>
            </div>
            <form onSubmit={submit} className="space-y-3">
              <input required placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input required placeholder="Degree" value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Field / specialization" value={form.field} onChange={(e) => setForm({ ...form, field: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <div className="grid grid-cols-2 gap-3">
                <input required placeholder="Start year" value={form.startYear} onChange={(e) => setForm({ ...form, startYear: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
                <input placeholder="End year" value={form.endYear} onChange={(e) => setForm({ ...form, endYear: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              </div>
              <textarea placeholder="Details (one per line, optional)" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} rows={2} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Display order" value={form.order} onChange={(e) => setForm({ ...form, order: Number(e.target.value) })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm" />
              <button type="submit" className="w-full px-4 py-2.5 rounded-lg bg-primary text-bg font-medium hover:shadow-glow">
                {editing ? 'Save Changes' : 'Add Education'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
