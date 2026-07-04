import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AdminLogin() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  const onSubmit = async ({ email, password }) => {
    setError('');
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin/dashboard', { replace: true });
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid credentials');
      toast.error('Login failed');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-5 grid-overlay">
      <div className="w-full max-w-sm glass rounded-xl p-8">
        <div className="flex items-center gap-2 mb-6 justify-center text-primary">
          <ShieldCheck size={24} />
          <span className="font-display font-semibold text-lg">Admin Access</span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            {...register('email', { required: true })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
          />
          <input
            type="password"
            placeholder="Password"
            {...register('password', { required: true })}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
          />
          {error && <p className="text-danger text-xs">{error}</p>}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-primary text-bg font-medium hover:shadow-glow transition-shadow disabled:opacity-60 focus-ring"
          >
            <Lock size={16} /> {isSubmitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}
