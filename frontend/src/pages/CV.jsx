import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import SectionHeading from '../components/SectionHeading.jsx';
import api from '../services/api.js';

export default function CV() {
  const [resumeUrl, setResumeUrl] = useState(null);

  useEffect(() => {
    api
      .get('/resume')
      .then(({ data }) => setResumeUrl(data.data.fileUrl))
      .catch(() => setResumeUrl(null));
  }, []);

  return (
    <main className="pt-32 pb-24 max-w-4xl mx-auto px-5 sm:px-8">
      <SectionHeading eyebrow="download.exe" title="Curriculum Vitae" />

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        {resumeUrl ? (
          <>
            <div className="flex flex-wrap gap-4 mb-8">
              <a
                href={resumeUrl}
                download
                className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-bg font-medium hover:shadow-glow transition-shadow focus-ring"
              >
                <Download size={18} /> Download CV (PDF)
              </a>
            </div>
            <div className="glass rounded-xl overflow-hidden" style={{ height: '80vh' }}>
              <iframe src={resumeUrl} title="Youssef Lotfy CV" className="w-full h-full" />
            </div>
          </>
        ) : (
          <div className="glass rounded-xl p-10 text-center">
            <FileText className="mx-auto mb-4 text-muted" size={32} />
            <p className="text-muted">
              No CV has been uploaded yet. Once the admin uploads one from the dashboard, it will appear
              here for preview and download.
            </p>
          </div>
        )}
      </motion.div>
    </main>
  );
}
