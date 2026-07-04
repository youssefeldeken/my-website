import { motion } from 'framer-motion';
import { Download, FolderGit2, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import NetworkBackground from '../../components/NetworkBackground.jsx';
import TerminalHero from '../../components/TerminalHero.jsx';
import ProfilePhoto from '../../components/ProfilePhoto.jsx';
import { profile } from '../../data/portfolioData.js';

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden grid-overlay">
      <NetworkBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-bg/40 via-bg/70 to-bg pointer-events-none" />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center gap-5 mb-6">
            <p className="font-mono text-secondary text-sm tracking-wide">
              // access granted — welcome to my portfolio
            </p>
          </div>
          <h1 className="font-display text-4xl sm:text-6xl font-bold leading-tight mb-6">
            {profile.name}
          </h1>
          <p className="text-muted text-lg max-w-lg mb-8">{profile.summary}</p>

          <div className="flex flex-wrap gap-4">
            <a
              href="/api/resume"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-bg font-medium hover:shadow-glow transition-shadow focus-ring"
            >
              <Download size={18} /> Download CV
            </a>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg glass hover:border-primary/40 transition-colors focus-ring"
            >
              <FolderGit2 size={18} /> View Projects
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg text-muted hover:text-text transition-colors focus-ring"
            >
              <Mail size={18} /> Contact Me
            </Link>
          </div>
        </motion.div>

        <div className="flex flex-col items-center lg:items-end gap-6">
          <ProfilePhoto size={168} />
          <TerminalHero taglines={profile.taglines} />
        </div>
      </div>
    </section>
  );
}
