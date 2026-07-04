export default function SectionHeading({ eyebrow, title, index }) {
  return (
    <div className="mb-12">
      <p className="font-mono text-xs text-secondary tracking-widest uppercase mb-2">
        {index ? `[ ${index} ] ` : ''}
        {eyebrow}
      </p>
      <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
      <div className="mt-4 h-px w-16 bg-gradient-to-r from-primary to-transparent" />
    </div>
  );
}
