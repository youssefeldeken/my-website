import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowLeft, ZoomIn } from 'lucide-react';
import ProjectCard from '../components/ProjectCard.jsx';
import Lightbox from '../components/Lightbox.jsx';
import { projects } from '../data/portfolioData.js';
import api from '../services/api.js';

export default function ProjectDetails() {
  const { slug } = useParams();
  const fallback = projects.find((p) => p.slug === slug);
  const [project, setProject] = useState(fallback || null);
  const [related, setRelated] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    let mounted = true;
    api
      .get(`/projects/${slug}`)
      .then(({ data }) => {
        if (mounted) {
          setProject(data.data);
          setRelated(data.related || []);
        }
      })
      .catch(() => {
        // API not reachable yet (e.g. first local run) — fall back to static CV data
      });
    return () => {
      mounted = false;
    };
  }, [slug]);

  if (!project) {
    return (
      <main className="pt-32 pb-24 max-w-3xl mx-auto px-5 text-center">
        <p className="font-mono text-muted">404 — project not found in the registry.</p>
        <Link to="/projects" className="text-primary hover:underline mt-4 inline-block">← Back to projects</Link>
      </main>
    );
  }

  // Cover image (if any) is slide 0; gallery images follow in order, so the
  // lightbox can slide through everything as one continuous set.
  const allImages = [project.coverImage, ...(project.galleryImages || [])].filter(Boolean);
  const openLightbox = (url) => setLightboxIndex(allImages.indexOf(url));

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-5 sm:px-8">
      <Link to="/projects" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary mb-8 focus-ring rounded">
        <ArrowLeft size={16} /> Back to projects
      </Link>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {project.coverImage && (
          <button
            type="button"
            onClick={() => openLightbox(project.coverImage)}
            className="group relative w-full h-64 sm:h-80 rounded-xl overflow-hidden mb-8 glass block focus-ring"
            aria-label="Open cover image in full size"
          >
            <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <ZoomIn size={28} className="text-text opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>
        )}

        <p className="font-mono text-xs text-secondary mb-2">{project.category}</p>
        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
        <p className="text-muted text-lg mb-6">{project.shortDescription}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {project.technologies?.map((t) => (
            <span key={t} className="text-xs font-mono px-3 py-1.5 rounded-full bg-white/5 text-text">{t}</span>
          ))}
        </div>

        <div className="flex gap-4 mb-10">
          {project.githubUrl && (
            <a href={project.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg glass hover:border-primary/40 text-sm focus-ring">
              <Github size={16} /> View Code
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow focus-ring">
              <ExternalLink size={16} /> Live Demo
            </a>
          )}
        </div>

        {project.description && (
          <div className="glass rounded-xl p-6 mb-8">
            <h2 className="font-display font-semibold text-lg mb-3">Overview</h2>
            <p className="text-text leading-relaxed">{project.description}</p>
          </div>
        )}

        {project.features?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display font-semibold text-lg mb-3">Key Features</h2>
            <ul className="space-y-2">
              {project.features.map((f) => (
                <li key={f} className="flex gap-2 text-sm">
                  <span className="text-primary mt-0.5">▹</span> {f}
                </li>
              ))}
            </ul>
          </div>
        )}

        {project.galleryImages?.length > 0 && (
          <div className="mb-8">
            <h2 className="font-display font-semibold text-lg mb-3">Gallery</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {project.galleryImages.map((url) => (
                <button
                  type="button"
                  key={url}
                  onClick={() => openLightbox(url)}
                  className="group relative rounded-xl overflow-hidden glass h-48 block focus-ring"
                  aria-label="Open screenshot in full size"
                >
                  <img src={url} alt={`${project.title} screenshot`} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <ZoomIn size={24} className="text-text opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {(project.challenges || project.solutions) && (
          <div className="grid sm:grid-cols-2 gap-6 mb-8">
            {project.challenges && (
              <div className="glass rounded-xl p-5">
                <h3 className="font-mono text-xs text-danger mb-2">CHALLENGES</h3>
                <p className="text-sm text-text">{project.challenges}</p>
              </div>
            )}
            {project.solutions && (
              <div className="glass rounded-xl p-5">
                <h3 className="font-mono text-xs text-secondary mb-2">SOLUTIONS</h3>
                <p className="text-sm text-text">{project.solutions}</p>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {related.length > 0 && (
        <div className="mt-16">
          <h2 className="font-display font-semibold text-xl mb-6">Related Projects</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((p, i) => (
              <ProjectCard key={p.slug} project={p} index={i} />
            ))}
          </div>
        </div>
      )}

      <Lightbox
        images={allImages}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </main>
  );
}
