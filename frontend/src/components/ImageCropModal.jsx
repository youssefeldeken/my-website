import { useCallback, useState } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn } from 'lucide-react';
import { getCroppedImageBlob } from '../utils/cropImage.js';

// Interactive drag-and-zoom crop step shown before a profile photo actually
// gets uploaded, so the person can frame their own face/head correctly
// instead of relying on a fixed CSS center-crop that can cut off the top
// of the photo.
export default function ImageCropModal({ imageSrc, aspect = 1, onCancel, onConfirm }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [saving, setSaving] = useState(false);

  const onCropComplete = useCallback((_, pixels) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleConfirm = async () => {
    if (!croppedAreaPixels) return;
    setSaving(true);
    try {
      const blob = await getCroppedImageBlob(imageSrc, croppedAreaPixels);
      onConfirm(blob);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="glass rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-white/10">
          <h2 className="font-display font-semibold">Adjust Photo</h2>
          <button onClick={onCancel} aria-label="Cancel" className="text-muted hover:text-text focus-ring rounded">
            <X size={18} />
          </button>
        </div>

        <div className="relative w-full h-80 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        </div>

        <div className="px-5 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <ZoomIn size={16} className="text-muted shrink-0" />
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full"
              aria-label="Zoom"
            />
          </div>
          <p className="text-xs text-muted font-mono">Drag to reposition · scroll or slide to zoom</p>

          <div className="flex gap-3">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={saving}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-bg text-sm font-medium hover:shadow-glow transition-shadow disabled:opacity-60"
            >
              <Check size={16} /> {saving ? 'Processing…' : 'Use This Photo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
