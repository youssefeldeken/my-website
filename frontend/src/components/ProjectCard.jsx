import { motion } from 'framer-motion';
import { Github, ExternalLink, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProjectCard({ project, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.45, delay: index * 0.06 }}
      className="group relative rounded-xl glass overflow-hidden hover:border-primary/30 transition-colors"
    >
      {project.featured && (
        <span className="absolute top-3 right-3 z-10 flex items-center gap-1 text-[10px] font-mono bg-primary/15 text-primary px-2 py-1 rounded-full">
          <Star size={10} fill="currentColor" /> Featured
        </span>
      )}

      <div className="h-40 bg-gradient-to-br from-bgSecondary to-card flex items-center justify-center border-b border-white/5 overflow-hidden">
        {project.coverImage ? (
          <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
        ) : (
          <span className="font-mono text-3xl text-white/10">{project.title.slice(0, 2).toUpperCase()}</span>
        )}
      </div>

      <div className="p-5">
        <p className="font-mono text-[11px] text-secondary mb-1">{project.category}</p>
        <h3 className="font-display font-semibold text-lg mb-2">{project.title}</h3>
        <p className="text-sm text-muted mb-4 line-clamp-2">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-1.5 mb-5">
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t} className="text-[10px] font-mono px-2 py-1 rounded bg-white/5 text-muted">
              {t}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <Link
            to={`/projects/${project.slug}`}
            className="text-sm text-primary font-medium hover:underline focus-ring rounded"
          >
            View details →
          </Link>
          <div className="flex gap-3 text-muted">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub" className="hover:text-text focus-ring rounded">
                <Github size={16} />
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noreferrer" aria-label="Live demo" className="hover:text-text focus-ring rounded">
                <ExternalLink size={16} />
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
