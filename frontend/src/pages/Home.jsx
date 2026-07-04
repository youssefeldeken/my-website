import Hero from './sections/Hero.jsx';
import About from './sections/About.jsx';
import Skills from './sections/Skills.jsx';
import Experience from './sections/Experience.jsx';
import ProjectsPreview from './sections/ProjectsPreview.jsx';
import ContactCTA from './sections/ContactCTA.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Experience />
      <ProjectsPreview />
      <ContactCTA />
    </>
  );
}
