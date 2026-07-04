// Populates the database with Youssef Lotfy's real CV content so the site
// works immediately after `npm run seed`, without an admin manually
// re-typing everything. Safe to re-run: it wipes and recreates content
// collections but never touches Messages/Notifications from real visitors.
import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Project from '../models/Project.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Skill from '../models/Skill.js';
import Settings from '../models/Settings.js';

dotenv.config();

const run = async () => {
  await connectDB();
  console.log('Seeding database...');

  // --- Admin user ---
  await User.deleteMany();
  await User.create({
    name: process.env.ADMIN_NAME || 'Youssef Ahmed Lotfy',
    email: process.env.ADMIN_EMAIL || 'youssefllotfyy@gmail.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
  });

  // --- Settings / hero content ---
  await Settings.deleteMany();
  await Settings.create({
    heroTitle: 'Youssef Ahmed Lotfy',
    heroTaglines: ['Cybersecurity Engineer', 'Network Engineer', 'MERN Developer', 'Ethical Hacker'],
    summary:
      'Cybersecurity-focused Computer Science student at GIU with hands-on experience in ERP systems, network infrastructure, and full-stack development. Delivered production systems including enterprise dashboards, secure web platforms, and factory-scale networks.',
    email: 'youssefllotfyy@gmail.com',
    phone: '+20 115 966 6782',
    location: 'Cairo, Egypt',
    socialLinks: {
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
  });

  // --- Education ---
  await Education.deleteMany();
  await Education.create([
    {
      institution: 'German International University',
      degree: 'B.Sc. Informatics & Computer Science',
      field: 'Cybersecurity Specialization (Year 3 completed)',
      startYear: '2023',
      endYear: '2027',
      details: ['Cybersecurity Specialization, Year 3 Completed'],
      order: 1,
    },
    {
      institution: 'Lycée International Balzac',
      degree: 'French Baccalaureate',
      field: 'Math, Physics-Chemistry & Economics',
      startYear: '2009',
      endYear: '2023',
      details: [],
      order: 2,
    },
  ]);

  // --- Experience ---
  await Experience.deleteMany();
  await Experience.create([
    {
      company: 'ElSewedy Electric',
      role: 'IT & ERP Intern',
      location: 'SEDCO Factory, 10th of Ramadan City',
      startDate: 'Jul 2025',
      endDate: 'Aug 2025',
      responsibilities: [
        'Managed Microsoft Dynamics ERP across a 500+ employee facility, streamlining cross-department workflows.',
      ],
      achievements: [
        'Built Power BI dashboards reducing manual reporting time by ~40%.',
        'Strengthened ERP access controls.',
      ],
      order: 1,
    },
    {
      company: 'Gulf Trading Group',
      role: 'Network Development Intern',
      location: '',
      startDate: 'Jul 2024',
      endDate: 'Sep 2024',
      responsibilities: [
        'Deployed a 3-floor LAN with routers, switches, and 15+ IP cameras; delivered a fully operational network.',
      ],
      achievements: [
        "Developed and launched the company's production website (gtgit.com).",
      ],
      order: 2,
    },
  ]);

  // --- Skills ---
  await Skill.deleteMany();
  const skillGroups = {
    Programming: [
      ['JavaScript', 85], ['Python', 85], ['Java', 75], ['C++', 75], ['C#', 70], ['HTML/CSS', 90],
    ],
    Frameworks: [
      ['MERN Stack', 88], ['Flutter', 78], ['Mobile Development', 75], ['Redux', 75],
    ],
    Cybersecurity: [
      ['Penetration Testing', 80], ['Ethical Hacking', 80], ['Kali Linux', 82],
      ['Nmap', 80], ['Vulnerability Assessment', 78], ['System Hardening', 76],
    ],
    Cloud: [
      ['Cloud Fundamentals', 75], ['IaaS / PaaS / SaaS', 72], ['Virtualization', 74], ['Cloud Deployment', 72],
    ],
    'Machine Learning': [
      ['Supervised Learning', 72], ['Classification', 72], ['Regression', 70],
      ['scikit-learn', 74], ['Data Preprocessing', 74], ['Model Evaluation', 70],
    ],
    Tools: [
      ['Wireshark', 82], ['Burp Suite', 78], ['MySQL', 80], ['MongoDB', 82],
      ['Git', 85], ['Power BI', 80], ['Microsoft Dynamics ERP', 78], ['FTK Imager', 74],
    ],
    Networking: [
      ['LAN/WAN', 82], ['TCP/IP', 80], ['Network Infrastructure', 82], ['IP Camera Systems', 76],
    ],
    Languages: [
      ['Arabic (Native)', 100], ['French (Fluent)', 90], ['English (Fluent)', 90], ['Spanish (Intermediate)', 60],
    ],
  };

  let order = 0;
  const skillDocs = [];
  for (const [category, items] of Object.entries(skillGroups)) {
    for (const [name, level] of items) {
      skillDocs.push({ name, category, level, order: order++ });
    }
  }
  await Skill.insertMany(skillDocs);

  // --- Projects ---
  await Project.deleteMany();
  await Project.create([
    {
      title: 'HR Management System',
      slug: 'hr-management-system',
      shortDescription: 'MERN-based HR platform with role-based access control and secure JWT authentication.',
      description:
        'A full HR management platform built on the MERN stack, covering employee records, roles, and permissions with a secure authentication layer.',
      technologies: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT'],
      category: 'Web App',
      features: ['Role-based access control', 'Secure JWT authentication', 'Employee record management'],
      featured: true,
      order: 1,
    },
    {
      title: 'Masarify — Expense Tracker',
      slug: 'masarify-expense-tracker',
      shortDescription: 'Cross-platform Flutter app with offline-first data and analytics dashboards.',
      description:
        'A cross-platform personal finance app built with Flutter, designed to work fully offline with local-first storage and sync, plus analytics dashboards for spending insights.',
      technologies: ['Flutter', 'Dart'],
      category: 'Mobile App',
      features: ['Offline-first data storage', 'Analytics dashboards'],
      featured: true,
      order: 2,
    },
    {
      title: 'Event Reservation Platform',
      slug: 'event-reservation-platform',
      shortDescription: 'Booking system with authentication, real-time seat management, and admin controls.',
      description:
        'A booking platform for events supporting real-time seat availability, user authentication, and an admin control panel for managing events.',
      technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
      category: 'Web App',
      features: ['Real-time seat management', 'Admin controls', 'Authentication'],
      order: 3,
    },
    {
      title: 'E-Commerce Store',
      slug: 'e-commerce-store',
      shortDescription: 'MERN store with cart logic and secure multi-step checkout.',
      description:
        'A full e-commerce storefront built on the MERN stack with cart management and a secure, multi-step checkout flow.',
      technologies: ['MongoDB', 'Express', 'React', 'Node.js'],
      category: 'Web App',
      features: ['Cart logic', 'Multi-step checkout', 'Secure payments flow'],
      order: 4,
    },
    {
      title: 'GTG Website',
      slug: 'gtg-website',
      shortDescription: 'Live, responsive corporate website delivered during the Gulf Trading Group internship.',
      description:
        "Designed and launched Gulf Trading Group's production corporate website during a network development internship.",
      technologies: ['HTML/CSS', 'JavaScript'],
      category: 'Web App',
      liveUrl: 'https://gtgit.com',
      features: ['Responsive design', 'Production deployment'],
      order: 5,
    },
  ]);

  console.log('Seed complete. Admin login:', process.env.ADMIN_EMAIL || 'youssefllotfyy@gmail.com');
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
