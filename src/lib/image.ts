/** Downscale an image before upload so the site stays fast. */
export async function resizeImage(file: File, maxSize: number, quality = 0.85): Promise<Blob> {
  if (!file.type.startsWith('image/') || file.type === 'image/gif' || file.type === 'image/svg+xml') {
    return file;
  }
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    return file;
  }
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext('2d');
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return new Promise((resolve) => canvas.toBlob((b) => resolve(b ?? file), 'image/webp', quality));
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

/** Turn "github.com/me" into "https://github.com/me"; leaves full URLs alone. */
export function toHref(value: string, kind: 'url' | 'email' | 'phone' = 'url'): string {
  const v = value.trim();
  if (!v) return '';
  if (kind === 'email') return v.startsWith('mailto:') ? v : `mailto:${v}`;
  if (kind === 'phone') return `tel:${v.replace(/[^\d+]/g, '')}`;
  return /^[a-z]+:/i.test(v) ? v : `https://${v}`;
}
