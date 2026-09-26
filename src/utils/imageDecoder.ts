/**
 * Proactive image decoding utility.
 * Decodes offscreen images before user interaction / autoplay transitions
 * to prevent frame drops, blank flashes, or main-thread rasterization stalls.
 */

const decodedCache = new Set<string>();

/**
 * Proactively decodes an image URL using the browser's native Image.decode() API.
 * Returns true if successfully decoded or already in cache.
 */
export async function decodeImage(src: string): Promise<boolean> {
  if (typeof window === "undefined" || !src) return false;
  if (decodedCache.has(src)) return true;

  try {
    const img = new Image();
    img.src = src;
    await img.decode();
    decodedCache.add(src);
    return true;
  } catch {
    // Graceful fallback for browsers or network issues
    return false;
  }
}

/**
 * Checks if an image has already been verified and decoded into memory.
 */
export function isImageDecoded(src: string): boolean {
  return decodedCache.has(src);
}

/**
 * Progressively decodes an array of image URLs with staggered delays
 * so as not to contend with the main thread or initial render bandwidth.
 */
export function scheduleProgressiveDecode(urls: string[], initialDelayMs = 400, stepDelayMs = 250): () => void {
  if (typeof window === "undefined") return () => {};

  const timerIds: number[] = [];

  urls.forEach((url, index) => {
    const delay = initialDelayMs + index * stepDelayMs;
    const timerId = window.setTimeout(() => {
      decodeImage(url);
    }, delay);
    timerIds.push(timerId);
  });

  return () => {
    timerIds.forEach((id) => window.clearTimeout(id));
  };
}
