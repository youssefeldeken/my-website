import { Github, Linkedin, Mail, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-24">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} Youssef Ahmed Lotfy — status: <span className="text-secondary">online</span>
        </p>
        <div className="flex gap-5">
          <a href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub" className="text-muted hover:text-primary transition-colors focus-ring rounded">
            <Github size={18} />
          </a>
          <a href="https://linkedin.com/in/" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="text-muted hover:text-primary transition-colors focus-ring rounded">
            <Linkedin size={18} />
          </a>
          <a href="mailto:youssefllotfyy@gmail.com" aria-label="Email" className="text-muted hover:text-primary transition-colors focus-ring rounded">
            <Mail size={18} />
          </a>
          <a href="https://www.yousseflotfy.com/" target="_blank" rel="noreferrer" aria-label="Website" className="text-muted hover:text-primary transition-colors focus-ring rounded">
            <Globe size={18} />
          </a>
        </div>
      </div>
    </footer>
  );
}
