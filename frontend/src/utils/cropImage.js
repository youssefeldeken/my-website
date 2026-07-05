// Draws the cropped region of an image onto a canvas and returns it as a
// Blob, so react-easy-crop's pixel-crop selection can be turned into an
// actual uploadable file instead of just a CSS preview.
export function getCroppedImageBlob(imageSrc, croppedAreaPixels, outputSize = 600) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = 'anonymous';
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = outputSize;
      canvas.height = outputSize;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        outputSize,
        outputSize
      );

      canvas.toBlob(
        (blob) => {
          if (!blob) return reject(new Error('Canvas is empty'));
          resolve(blob);
        },
        'image/jpeg',
        0.92
      );
    };
    image.onerror = reject;
  });
}
