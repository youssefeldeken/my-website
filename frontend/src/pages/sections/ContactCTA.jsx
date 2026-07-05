import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Send, Mail, Phone, MapPin } from 'lucide-react';
import SectionHeading from '../../components/SectionHeading.jsx';
import { profile as staticProfile } from '../../data/portfolioData.js';
import api from '../../services/api.js';

export default function ContactCTA() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();
  const [contact, setContact] = useState({
    email: staticProfile.email,
    phone: staticProfile.phone,
    location: staticProfile.location,
  });

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        const s = data.data;
        setContact((prev) => ({
          email: s?.email || prev.email,
          phone: s?.phone || prev.phone,
          location: s?.location || prev.location,
        }));
      })
      .catch(() => {
        // Backend unreachable — static fallback from the CV stays in place
      });
  }, []);

  const onSubmit = async (formData) => {
    try {
      await api.post('/messages', formData);
      toast.success('Message sent — I\'ll get back to you soon.');
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
      <SectionHeading eyebrow="establish.connection" title="Get In Touch" index="05" />

      <div className="grid md:grid-cols-5 gap-10">
        <div className="md:col-span-2 space-y-5">
          <p className="text-muted">
            Have a role, project, or security question in mind? My inbox is open.
          </p>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-primary" />
            <a href={`mailto:${contact.email}`} className="hover:text-primary focus-ring rounded">{contact.email}</a>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Phone size={16} className="text-primary" />
            <span>{contact.phone}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <MapPin size={16} className="text-primary" />
            <span>{contact.location}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="md:col-span-3 glass rounded-xl p-6 space-y-4" noValidate>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <input
                {...register('name', { required: 'Name is required' })}
                placeholder="Your name"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
              />
              {errors.name && <p className="text-danger text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <input
                type="email"
                {...register('email', { required: 'Email is required' })}
                placeholder="Your email"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email.message}</p>}
            </div>
          </div>

          <input
            {...register('phone')}
            placeholder="Phone (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
          />

          <div>
            <input
              {...register('subject', { required: 'Subject is required' })}
              placeholder="Subject"
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50"
            />
            {errors.subject && <p className="text-danger text-xs mt-1">{errors.subject.message}</p>}
          </div>

          <div>
            <textarea
              {...register('message', { required: 'Message is required' })}
              placeholder="Your message"
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm focus-ring focus:border-primary/50 resize-none"
            />
            {errors.message && <p className="text-danger text-xs mt-1">{errors.message.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-lg bg-primary text-bg font-medium hover:shadow-glow transition-shadow disabled:opacity-60 focus-ring"
          >
            <Send size={16} /> {isSubmitting ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  );
}
