import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, ShieldCheck } from 'lucide-react';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/cv', label: 'CV' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all ${
        scrolled ? 'glass shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="max-w-6xl mx-auto flex items-center justify-between px-5 sm:px-8 h-16">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg focus-ring rounded">
          <ShieldCheck className="text-primary" size={22} strokeWidth={2} />
          <span>
            Youssef<span className="text-primary">.</span>Lotfy
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 font-mono text-sm">
          {links.map((l) => (
            <li key={l.to}>
              <NavLink
                to={l.to}
                className={({ isActive }) =>
                  `focus-ring rounded transition-colors ${
                    isActive ? 'text-primary' : 'text-muted hover:text-text'
                  }`
                }
              >
                {`0${links.indexOf(l) + 1}.`} {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <button
          className="md:hidden focus-ring rounded p-1"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden glass border-t border-white/5 px-5 py-4 flex flex-col gap-4 font-mono text-sm">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'text-primary' : 'text-muted')}
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </header>
  );
}
