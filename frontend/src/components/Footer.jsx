import { useEffect, useState } from 'react';
import { Github, Linkedin, Mail, Globe } from 'lucide-react';
import { profile as staticProfile } from '../data/portfolioData.js';
import api from '../services/api.js';

export default function Footer() {
  const [social, setSocial] = useState(staticProfile.social);
  const [email, setEmail] = useState(staticProfile.email);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        const s = data.data;
        if (s?.socialLinks) setSocial((prev) => ({ ...prev, ...s.socialLinks }));
        if (s?.email) setEmail(s.email);
      })
      .catch(() => {
        // Backend unreachable — static fallback from the CV stays in place
      });
  }, []);

  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Youssef Ahmed Lotfy — status: <span className="text-secondary">online</span>
        </p>
        <div className="flex gap-5">
          {social.github && (
            <a href={social.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-primary transition-colors focus-ring rounded">
              <Github size={18} />
            </a>
          )}
          {social.linkedin && (
            <a href={social.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-primary transition-colors focus-ring rounded">
              <Linkedin size={18} />
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} aria-label="Email" className="text-muted hover:text-primary transition-colors focus-ring rounded">
              <Mail size={18} />
            </a>
          )}
          {social.website && (
            <a href={social.website} target="_blank" rel="noreferrer" aria-label="Website" className="text-muted hover:text-primary transition-colors focus-ring rounded">
              <Globe size={18} />
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
