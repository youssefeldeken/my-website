import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, MessageSquare, Settings, LogOut, ShieldCheck, Wrench, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

const links = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/education', label: 'About Me', icon: GraduationCap },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen grid lg:grid-cols-[240px_1fr]">
      <aside className="glass border-r border-white/5 p-5 flex flex-col">
        <div className="flex items-center gap-2 mb-8 px-1">
          <ShieldCheck className="text-primary" size={22} />
          <span className="font-display font-semibold">Admin Panel</span>
        </div>
        <nav className="flex-1 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-muted hover:text-text hover:bg-white/5'
                }`
              }
            >
              <Icon size={16} /> {label}
            </NavLink>
          ))}
        </nav>
        <div className="pt-4 border-t border-white/5">
          <p className="text-xs text-muted mb-2 px-1 truncate">{user?.email}</p>
          <button
            onClick={async () => {
              await logout();
              navigate('/admin/login');
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-danger hover:bg-danger/10 w-full focus-ring"
          >
            <LogOut size={16} /> Log out
          </button>
        </div>
      </aside>
      <main className="p-6 sm:p-8 overflow-x-auto">
        <Outlet />
      </main>
    </div>
  );
}
