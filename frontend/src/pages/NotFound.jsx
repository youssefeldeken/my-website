import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-primary text-sm mb-3">error 404</p>
      <h1 className="font-display text-4xl font-bold mb-4">Route not found</h1>
      <p className="text-muted mb-8">The page you're looking for doesn't exist on this server.</p>
      <Link to="/" className="px-5 py-3 rounded-lg bg-primary text-bg font-medium hover:shadow-glow focus-ring">
        Return home
      </Link>
    </main>
  );
}
