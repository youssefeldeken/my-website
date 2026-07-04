// Static fallback content sourced directly from Youssef's CV.
// The live site prefers data from the API/admin dashboard; this file is used
// as a seed reference for the frontend and as an offline fallback if the API
// is unreachable (e.g. first local run before the backend/DB is set up).

export const profile = {
  name: 'Youssef Ahmed Lotfy',
  taglines: ['Cybersecurity Engineer', 'Network Engineer', 'MERN Developer', 'Ethical Hacker'],
  email: 'youssefllotfyy@gmail.com',
  phone: '+20 115 966 6782',
  location: 'Cairo, Egypt',
  summary:
    'Cybersecurity-focused Computer Science student at GIU with hands-on experience in ERP systems, network infrastructure, and full-stack development. Delivered production systems including enterprise dashboards, secure web platforms, and factory-scale networks.',
  social: {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/in/',
    website: 'https://www.yousseflotfy.com/',
  },
  languages: [
    { name: 'Arabic', level: 'Native' },
    { name: 'French', level: 'Fluent' },
    { name: 'English', level: 'Fluent' },
    { name: 'Spanish', level: 'Intermediate' },
  ],
};

export const education = [
  {
    institution: 'German International University',
    degree: 'B.Sc. Informatics & Computer Science',
    field: 'Cybersecurity Specialization, Year 3 Completed',
    years: '2023 – 2027',
  },
  {
    institution: 'Lycée International Balzac',
    degree: 'French Baccalaureate',
    field: 'Math, Physics-Chemistry & Economics',
    years: '2009 – 2023',
  },
];

export const experience = [
  {
    company: 'ElSewedy Electric',
    role: 'IT & ERP Intern',
    location: 'SEDCO Factory, 10th of Ramadan City',
    dates: 'Jul – Aug 2025',
    points: [
      'Managed Microsoft Dynamics ERP across a 500+ employee facility, streamlining cross-department workflows.',
      'Built Power BI dashboards reducing manual reporting time by ~40% and strengthened ERP access controls.',
    ],
  },
  {
    company: 'Gulf Trading Group',
    role: 'Network Development Intern',
    location: '',
    dates: 'Jul – Sep 2024',
    points: [
      'Deployed a 3-floor LAN with routers, switches, and 15+ IP cameras; delivered a fully operational network.',
      "Developed and launched the company's production website (gtgit.com).",
    ],
  },
];

export const skillCategories = {
  Programming: [
    { name: 'JavaScript', level: 85 }, { name: 'Python', level: 85 }, { name: 'Java', level: 75 },
    { name: 'C++', level: 75 }, { name: 'C#', level: 70 }, { name: 'HTML/CSS', level: 90 },
  ],
  'Frameworks & Mobile': [
    { name: 'MERN Stack', level: 88 }, { name: 'Flutter', level: 78 },
    { name: 'Mobile Development', level: 75 }, { name: 'Redux', level: 75 },
  ],
  Cybersecurity: [
    { name: 'Penetration Testing', level: 80 }, { name: 'Ethical Hacking', level: 80 },
    { name: 'Kali Linux', level: 82 }, { name: 'Nmap', level: 80 },
    { name: 'Vulnerability Assessment', level: 78 }, { name: 'System Hardening', level: 76 },
  ],
  Cloud: [
    { name: 'Cloud Fundamentals', level: 75 }, { name: 'IaaS / PaaS / SaaS', level: 72 },
    { name: 'Virtualization', level: 74 }, { name: 'Cloud Deployment', level: 72 },
  ],
  'Machine Learning': [
    { name: 'Supervised Learning', level: 72 }, { name: 'Classification', level: 72 },
    { name: 'Regression', level: 70 }, { name: 'scikit-learn', level: 74 },
    { name: 'Data Preprocessing', level: 74 }, { name: 'Model Evaluation', level: 70 },
  ],
  'Software Security': [
    { name: 'Wireshark', level: 82 }, { name: 'Burp Suite', level: 78 }, { name: 'XSS', level: 76 },
    { name: 'CSRF', level: 74 }, { name: 'SQL Injection', level: 78 },
    { name: 'OWASP Top 10', level: 80 }, { name: 'HTTPS/TLS', level: 76 }, { name: 'Session Hijacking', level: 74 },
  ],
  'Digital Forensics': [
    { name: 'FTK Imager', level: 74 }, { name: 'Windows Forensics', level: 72 },
    { name: 'Disk Imaging', level: 72 }, { name: 'Evidence Collection', level: 70 }, { name: 'Log Analysis', level: 76 },
  ],
  'Databases & Tools': [
    { name: 'MySQL', level: 80 }, { name: 'MongoDB', level: 82 }, { name: 'Git', level: 85 },
    { name: 'Power BI', level: 80 }, { name: 'Microsoft Dynamics ERP', level: 78 },
  ],
  Networking: [
    { name: 'LAN/WAN', level: 82 }, { name: 'TCP/IP', level: 80 },
    { name: 'Network Infrastructure', level: 82 }, { name: 'IP Camera Systems', level: 76 },
  ],
};

export const projects = [
  {
    slug: 'hr-management-system',
    title: 'HR Management System',
    shortDescription: 'MERN-based HR platform with RBAC and secure JWT authentication.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
    category: 'Web App',
    featured: true,
  },
  {
    slug: 'masarify-expense-tracker',
    title: 'Masarify — Expense Tracker',
    shortDescription: 'Cross-platform Flutter app with offline-first data and analytics dashboards.',
    technologies: ['Flutter', 'Dart'],
    category: 'Mobile App',
    featured: true,
  },
  {
    slug: 'event-reservation-platform',
    title: 'Event Reservation Platform',
    shortDescription: 'Booking system with authentication, real-time seat management, and admin controls.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    category: 'Web App',
    featured: false,
  },
  {
    slug: 'e-commerce-store',
    title: 'E-Commerce Store',
    shortDescription: 'MERN store with cart logic and secure multi-step checkout.',
    technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
    category: 'Web App',
    featured: false,
  },
  {
    slug: 'gtg-website',
    title: 'GTG Website',
    shortDescription: 'Live, responsive corporate website delivered during internship.',
    technologies: ['HTML/CSS', 'JavaScript'],
    category: 'Web App',
    liveUrl: 'https://gtgit.com',
    featured: false,
  },
];
