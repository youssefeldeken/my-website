import { useEffect, useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../components/SectionHeading.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import { projects as staticProjects } from '../data/portfolioData.js';
import api from '../services/api.js';

export default function Projects() {
  const [projects, setProjects] = useState(staticProjects);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    api
      .get('/projects')
      .then(({ data }) => {
        if (data.data?.length) setProjects(data.data);
      })
      .catch(() => {
        // Backend unreachable — static fallback from the CV stays in place
      });
  }, []);

  const categories = useMemo(() => ['All', ...new Set(projects.map((p) => p.category))], [projects]);
  const filtered = filter === 'All' ? projects : projects.filter((p) => p.category === filter);

  return (
    <main className="pt-32 pb-24 max-w-6xl mx-auto px-5 sm:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <SectionHeading eyebrow="all.systems" title="Projects" />
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full font-mono text-xs border transition-colors focus-ring ${
              filter === cat
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-white/10 text-muted hover:text-text hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </main>
  );
}
