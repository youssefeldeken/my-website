import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading.jsx';
import ProjectCard from '../../components/ProjectCard.jsx';
import { projects as staticProjects } from '../../data/portfolioData.js';
import api from '../../services/api.js';

export default function ProjectsPreview() {
  const [projects, setProjects] = useState(staticProjects);

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

  const featured = projects.filter((p) => p.featured).concat(projects.filter((p) => !p.featured)).slice(0, 3);

  return (
    <section id="projects" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <SectionHeading eyebrow="deployed.systems" title="Selected Projects" index="04" />
        <Link
          to="/projects"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline mb-12 focus-ring rounded"
        >
          View all <ArrowRight size={14} />
        </Link>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {featured.map((p, i) => (
          <ProjectCard key={p.slug} project={p} index={i} />
        ))}
      </div>
    </section>
  );
}
