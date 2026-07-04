import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading.jsx';
import { experience as staticExperience } from '../../data/portfolioData.js';
import api from '../../services/api.js';

export default function Experience() {
  const [experience, setExperience] = useState(staticExperience);

  useEffect(() => {
    api
      .get('/experience')
      .then(({ data }) => {
        if (!data.data?.length) return;
        const mapped = data.data
          .sort((a, b) => a.order - b.order)
          .map((e) => ({
            company: e.company,
            role: e.role,
            location: e.location,
            dates: `${e.startDate} – ${e.endDate}`,
            points: [...(e.responsibilities || []), ...(e.achievements || [])],
          }));
        setExperience(mapped);
      })
      .catch(() => {
        // Backend unreachable — static fallback from the CV stays in place
      });
  }, []);

  return (
    <section id="experience" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <SectionHeading eyebrow="career.timeline" title="Experience" index="03" />

      <div className="relative border-l border-white/10 ml-2">
        {experience.map((exp, i) => (
          <motion.div
            key={exp.company}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.45, delay: i * 0.1 }}
            className="relative pl-8 pb-12 last:pb-0"
          >
            <span className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-bg border-2 border-primary shadow-glow flex items-center justify-center">
              <Briefcase size={9} className="text-primary" />
            </span>
            <p className="font-mono text-xs text-secondary mb-1">{exp.dates}</p>
            <h3 className="font-display text-xl font-semibold">{exp.role}</h3>
            <p className="text-muted text-sm mb-3">
              {exp.company}
              {exp.location ? ` — ${exp.location}` : ''}
            </p>
            <ul className="space-y-2">
              {exp.points.map((p) => (
                <li key={p} className="flex gap-2 text-sm text-text">
                  <span className="text-primary mt-1">▹</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
