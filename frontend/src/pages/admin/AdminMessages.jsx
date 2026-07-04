import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Trash2, MailOpen, Archive, Mail } from 'lucide-react';
import api from '../../services/api.js';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => api.get('/messages', { params: filter ? { status: filter } : {} }).then(({ data }) => setMessages(data.data)).catch(() => {});
  useEffect(() => { load(); }, [filter]);

  const setStatus = async (id, status) => {
    try {
      await api.patch(`/messages/${id}/status`, { status });
      load();
    } catch {
      toast.error('Update failed');
    }
  };

  const remove = async (id) => {
    if (!confirm('Delete this message?')) return;
    try {
      await api.delete(`/messages/${id}`);
      toast.success('Message deleted');
      load();
    } catch {
      toast.error('Delete failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-2xl font-bold">Messages</h1>
        <div className="flex gap-2">
          {['', 'unread', 'read', 'archived'].map((s) => (
            <button
              key={s || 'all'}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border ${filter === s ? 'border-primary text-primary' : 'border-white/10 text-muted'}`}
            >
              {s || 'all'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m._id} className={`glass rounded-xl p-5 ${m.status === 'unread' ? 'border-primary/30' : ''}`}>
            <div className="flex justify-between items-start flex-wrap gap-2">
              <div>
                <p className="font-display font-semibold">{m.subject}</p>
                <p className="text-sm text-muted">{m.name} · {m.email}{m.phone ? ` · ${m.phone}` : ''}</p>
              </div>
              <span className={`text-[10px] font-mono px-2 py-1 rounded-full ${
                m.status === 'unread' ? 'bg-primary/15 text-primary' : m.status === 'archived' ? 'bg-white/5 text-muted' : 'bg-secondary/10 text-secondary'
              }`}>{m.status}</span>
            </div>
            <p className="text-sm mt-3 text-text">{m.message}</p>
            <div className="flex gap-2 mt-4">
              {m.status !== 'read' && (
                <button onClick={() => setStatus(m._id, 'read')} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                  <MailOpen size={13} /> Mark read
                </button>
              )}
              {m.status !== 'archived' && (
                <button onClick={() => setStatus(m._id, 'archived')} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                  <Archive size={13} /> Archive
                </button>
              )}
              {m.status !== 'unread' && (
                <button onClick={() => setStatus(m._id, 'unread')} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10">
                  <Mail size={13} /> Mark unread
                </button>
              )}
              <button onClick={() => remove(m._id)} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-danger/10 text-danger hover:bg-danger/20">
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        ))}
        {messages.length === 0 && <p className="text-muted text-sm">No messages found.</p>}
      </div>
    </div>
  );
}
