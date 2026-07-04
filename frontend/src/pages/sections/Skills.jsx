import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import SectionHeading from '../../components/SectionHeading.jsx';
import { skillCategories as staticSkillCategories } from '../../data/portfolioData.js';
import api from '../../services/api.js';

export default function Skills() {
  const [skillCategories, setSkillCategories] = useState(staticSkillCategories);
  const [active, setActive] = useState(Object.keys(staticSkillCategories)[0]);

  useEffect(() => {
    api
      .get('/skills')
      .then(({ data }) => {
        if (!data.data?.length) return; // keep static fallback if DB is empty
        const grouped = {};
        data.data
          .sort((a, b) => a.order - b.order)
          .forEach((s) => {
            if (!grouped[s.category]) grouped[s.category] = [];
            grouped[s.category].push({ name: s.name, level: s.level });
          });
        setSkillCategories(grouped);
        setActive(Object.keys(grouped)[0]);
      })
      .catch(() => {
        // Backend unreachable — static fallback from the CV stays in place
      });
  }, []);

  const categories = Object.keys(skillCategories);

  return (
    <section id="skills" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <SectionHeading eyebrow="capabilities.map" title="Skills" index="02" />

      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActive(cat)}
            className={`px-4 py-2 rounded-full font-mono text-xs border transition-colors focus-ring ${
              active === cat
                ? 'bg-primary/10 border-primary text-primary'
                : 'border-white/10 text-muted hover:text-text hover:border-white/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
        {(skillCategories[active] || []).map((skill, i) => (
          <motion.div
            key={skill.name}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.04 }}
          >
            <div className="flex justify-between mb-1.5 font-mono text-xs">
              <span className="text-text">{skill.name}</span>
              <span className="text-muted">{skill.level}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                initial={{ width: 0 }}
                whileInView={{ width: `${skill.level}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
