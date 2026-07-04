import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

// Signature element: the hero reads as a live terminal session rather than a
// generic gradient-text headline. Roles are "typed" at a shell prompt, which
// is both the visual identity and a literal expression of the CV's
// cybersecurity/networking focus.
export default function TerminalHero({ taglines, name = 'Youssef Ahmed Lotfy' }) {
  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = taglines[lineIndex % taglines.length];
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCharIndex(current.length);
      return;
    }

    let timeout;
    if (!deleting && charIndex < current.length) {
      timeout = setTimeout(() => setCharIndex((c) => c + 1), 55);
    } else if (!deleting && charIndex === current.length) {
      timeout = setTimeout(() => setDeleting(true), 1400);
    } else if (deleting && charIndex > 0) {
      timeout = setTimeout(() => setCharIndex((c) => c - 1), 30);
    } else if (deleting && charIndex === 0) {
      setDeleting(false);
      setLineIndex((i) => i + 1);
    }
    return () => clearTimeout(timeout);
  }, [charIndex, deleting, lineIndex, taglines]);

  const current = taglines[lineIndex % taglines.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.15 }}
      className="w-full max-w-xl rounded-xl glass shadow-glow overflow-hidden"
    >
      <div className="flex items-center gap-1.5 px-4 py-3 border-b border-white/5 bg-white/5">
        <span className="w-3 h-3 rounded-full bg-danger/70" />
        <span className="w-3 h-3 rounded-full bg-yellow-400/70" />
        <span className="w-3 h-3 rounded-full bg-secondary/70" />
        <span className="ml-3 font-mono text-xs text-muted">youssef@portfolio: ~</span>
      </div>
      <div className="p-5 sm:p-6 font-mono text-sm leading-relaxed">
        <p className="text-muted">$ whoami</p>
        <p className="text-text mb-3">{name}</p>
        <p className="text-muted">$ role --current</p>
        <p className="text-primary min-h-[1.5rem]">
          {current.slice(0, charIndex)}
          <span className="animate-blink">_</span>
        </p>
        <p className="text-muted mt-3">$ status</p>
        <p className="text-secondary">Open to cybersecurity & software engineering roles</p>
      </div>
    </motion.div>
  );
}
