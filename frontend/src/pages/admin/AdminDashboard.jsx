import { useEffect, useState } from 'react';
import { FolderKanban, MessageSquare, Wrench, Briefcase, BellDot } from 'lucide-react';
import api from '../../services/api.js';

const StatCard = ({ icon: Icon, label, value, color }) => (
  <div className="glass rounded-xl p-5">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${color}`}>
      <Icon size={16} />
    </div>
    <p className="text-2xl font-display font-bold">{value ?? '—'}</p>
    <p className="text-xs text-muted font-mono">{label}</p>
  </div>
);

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get('/stats').then(({ data }) => setStats(data.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Dashboard</h1>
      <p className="text-muted text-sm mb-8">Overview of your portfolio content and activity.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatCard icon={FolderKanban} label="Projects" value={stats?.projectsCount} color="bg-primary/10 text-primary" />
        <StatCard icon={MessageSquare} label="Messages" value={stats?.messagesCount} color="bg-secondary/10 text-secondary" />
        <StatCard icon={BellDot} label="Unread Messages" value={stats?.unreadMessages} color="bg-danger/10 text-danger" />
        <StatCard icon={Briefcase} label="Experience Entries" value={stats?.experienceCount} color="bg-accent/10 text-accent" />
      </div>

      <div className="glass rounded-xl p-6">
        <h2 className="font-display font-semibold mb-4 flex items-center gap-2"><Wrench size={16} /> Recent Activity</h2>
        {stats?.recentActivity?.length ? (
          <ul className="space-y-3">
            {stats.recentActivity.map((m) => (
              <li key={m._id} className="flex justify-between text-sm border-b border-white/5 pb-3 last:border-0">
                <span>{m.name} — {m.subject}</span>
                <span className="text-muted font-mono text-xs">{new Date(m.createdAt).toLocaleDateString()}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-sm">No recent activity yet.</p>
        )}
      </div>
    </div>
  );
}
