import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { UserRound } from 'lucide-react';
import api from '../services/api.js';

// Shows the admin-uploaded profile photo if one exists in Settings; otherwise
// falls back to /public/profile.jpg (a photo dropped directly into the
// frontend's public folder); otherwise shows a placeholder icon so the
// layout never breaks with a broken image.
export default function ProfilePhoto({ size = 176 }) {
  const [src, setSrc] = useState('/profile.jpg');
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    api
      .get('/settings')
      .then(({ data }) => {
        if (data?.data?.profileImage) {
          setSrc(data.data.profileImage);
          setFailed(false);
        }
      })
      .catch(() => {
        // Backend not running yet — keep the static /profile.jpg fallback
      });
  }, []);

  // Reset the "failed" flag any time the src itself changes, so an earlier
  // failure (e.g. the default /profile.jpg placeholder 404ing before the
  // real uploaded URL arrives) doesn't permanently hide a later, valid photo.
  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="relative shrink-0 animate-floatY"
      style={{ width: size, height: size }}
    >
      <div className="absolute -inset-1.5 rounded-full bg-gradient-to-br from-primary to-secondary opacity-40 blur-lg" />
      <div className="relative w-full h-full rounded-full overflow-hidden glass border-2 border-primary/40 flex items-center justify-center">
        {!failed ? (
          <img
            src={src}
            alt="Youssef Ahmed Lotfy"
            className="w-full h-full object-cover"
            onError={() => setFailed(true)}
          />
        ) : (
          <UserRound size={size * 0.45} className="text-muted" />
        )}
      </div>
    </motion.div>
  );
}
