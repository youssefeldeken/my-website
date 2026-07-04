import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Languages } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading.jsx';
import { education as staticEducation, profile as staticProfile } from '../../data/portfolioData.js';
import api from '../../services/api.js';

export default function About() {
  const [education, setEducation] = useState(staticEducation);
  const [languages, setLanguages] = useState(staticProfile.languages);
  const [summary, setSummary] = useState(staticProfile.summary);

  useEffect(() => {
    api
      .get('/education')
      .then(({ data }) => {
        if (!data.data?.length) return;
        const mapped = data.data
          .sort((a, b) => a.order - b.order)
          .map((e) => ({
            institution: e.institution,
            degree: e.degree,
            field: e.field,
            years: `${e.startYear} – ${e.endYear || 'Present'}`,
          }));
        setEducation(mapped);
      })
      .catch(() => {});

    api
      .get('/settings')
      .then(({ data }) => {
        if (data.data?.languages?.length) setLanguages(data.data.languages);
        if (data.data?.summary) setSummary(data.data.summary);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="about" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <SectionHeading eyebrow="whoami" title="About Me" index="01" />

      <div className="grid md:grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-secondary font-mono text-sm">
            <GraduationCap size={18} /> education.log
          </div>
          <ul className="space-y-6">
            {education.map((e) => (
              <li key={e.institution} className="relative pl-6 border-l border-white/10">
                <span className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-primary shadow-glow" />
                <p className="font-mono text-xs text-muted">{e.years}</p>
                <p className="font-display font-semibold">{e.institution}</p>
                <p className="text-sm text-text">{e.degree}</p>
                <p className="text-sm text-muted">{e.field}</p>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-2 mb-4 text-secondary font-mono text-sm">
            <Languages size={18} /> languages.json
          </div>
          <div className="grid grid-cols-2 gap-4">
            {languages.map((l) => (
              <div key={l.name} className="glass rounded-lg p-4">
                <p className="font-display font-semibold">{l.name}</p>
                <p className="text-xs text-muted font-mono">{l.level}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 glass rounded-lg p-5">
            <p className="font-mono text-xs text-muted mb-2">$ cat summary.txt</p>
            <p className="text-sm text-text leading-relaxed">{summary}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
