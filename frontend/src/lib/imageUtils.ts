/**
 * Image Optimization Utilities for Twist Marketplace
 * 
 * Handles:
 * - Light compression for uploads (quality 85+)
 * - Multiple size generation (thumbnail, medium, full)
 * - srcset generation for responsive/Retina displays
 * - Image quality validation
 */

export interface ImageSize {
  width: number;
  height: number;
  suffix: string;
}

// Standard sizes for different use cases
export const IMAGE_SIZES = {
  thumbnail: { width: 400, height: 400, suffix: 'thumb' } as ImageSize,
  medium: { width: 800, height: 800, suffix: 'med' } as ImageSize,
  large: { width: 1200, height: 1200, suffix: 'lg' } as ImageSize,
  full: { width: 1600, height: 1600, suffix: 'full' } as ImageSize,
} as const;

// Minimum recommended dimensions for uploads
export const MIN_RECOMMENDED_SIZE = 1200;
export const MIN_ACCEPTABLE_SIZE = 600;

// Quality settings - keep high to preserve sharpness
export const QUALITY_SETTINGS = {
  jpeg: 0.82, // 82% quality for JPEG - good balance of size/quality
  webp: 0.85, // 85% quality for WebP - better compression than JPEG
  png: 1.0,   // Lossless for PNG
} as const;

// Target file sizes
export const MAX_FILE_SIZE_KB = 300; // Target <300KB per image

/**
 * Check if an image meets minimum quality requirements
 */
export function checkImageQuality(width: number, height: number): {
  isAcceptable: boolean;
  isRecommended: boolean;
  message?: string;
} {
  const minDimension = Math.min(width, height);
  
  if (minDimension < MIN_ACCEPTABLE_SIZE) {
    return {
      isAcceptable: false,
      isRecommended: false,
      message: `Image is too small (${width}x${height}). Minimum size is ${MIN_ACCEPTABLE_SIZE}px.`,
    };
  }
  
  if (minDimension < MIN_RECOMMENDED_SIZE) {
    return {
      isAcceptable: true,
      isRecommended: false,
      message: `Image quality may be reduced. Recommended minimum: ${MIN_RECOMMENDED_SIZE}px.`,
    };
  }
  
  return {
    isAcceptable: true,
    isRecommended: true,
  };
}

/**
 * Get image dimensions from a File or data URL
 */
export function getImageDimensions(source: File | string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    
    if (source instanceof File) {
      img.src = URL.createObjectURL(source);
    } else {
      img.src = source;
    }
  });
}

/**
 * Check if browser supports WebP
 */
export function supportsWebP(): boolean {
  if (typeof document === 'undefined') return false;
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').startsWith('data:image/webp');
}

/**
 * Compress and resize an image with WebP support
 * Automatically uses WebP if supported for better compression
 * Targets <300KB file size
 */
export async function compressImage(
  file: File,
  options: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    format?: 'jpeg' | 'webp' | 'png' | 'auto';
    targetSizeKB?: number;
  } = {}
): Promise<string> {
  const {
    maxWidth = IMAGE_SIZES.large.width, // 1200px max for better compression
    maxHeight = IMAGE_SIZES.large.height,
    quality = QUALITY_SETTINGS.webp,
    format = 'auto', // Auto-detect best format
    targetSizeKB = MAX_FILE_SIZE_KB,
  } = options;

  // Determine best format
  const useWebP = format === 'auto' ? supportsWebP() : format === 'webp';
  const actualFormat = useWebP ? 'webp' : 'jpeg';
  const mimeType = useWebP ? 'image/webp' : 'image/jpeg';
  
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    img.onload = () => {
      // Calculate new dimensions maintaining aspect ratio
      let { naturalWidth: width, naturalHeight: height } = img;
      
      // Only downscale if image exceeds max dimensions
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      // Set canvas size
      canvas.width = width;
      canvas.height = height;

      // Use high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Draw image
      ctx.drawImage(img, 0, 0, width, height);

      // Adaptive quality to meet target size
      let currentQuality = quality;
      let dataUrl = canvas.toDataURL(mimeType, currentQuality);
      
      // If file is too large, reduce quality iteratively
      const base64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
      let estimatedSizeKB = (base64Length * 0.75) / 1024;
      
      while (estimatedSizeKB > targetSizeKB && currentQuality > 0.5) {
        currentQuality -= 0.05;
        dataUrl = canvas.toDataURL(mimeType, currentQuality);
        const newBase64Length = dataUrl.length - dataUrl.indexOf(',') - 1;
        estimatedSizeKB = (newBase64Length * 0.75) / 1024;
      }
      
      // Clean up
      URL.revokeObjectURL(img.src);
      
      resolve(dataUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(img.src);
      reject(new Error('Failed to load image for compression'));
    };

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generate srcset string for responsive images
 * Handles Unsplash and transform-capable CDN/storage URLs
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[] = [400, 600, 800, 1200]
): string {
  // Handle Unsplash URLs with built-in resize
  if (baseUrl.includes('unsplash.com')) {
    return sizes
      .map((size) => {
        const url = new URL(baseUrl);
        url.searchParams.set('w', size.toString());
        url.searchParams.set('h', size.toString());
        url.searchParams.set('fit', 'crop');
        url.searchParams.set('q', '80');
        url.searchParams.set('fm', 'webp'); // Request WebP format
        return `${url.toString()} ${size}w`;
      })
      .join(', ');
  }
  
  // For other URLs, return the original
  return `${baseUrl} 1x`;
}

/**
 * Get optimal image URL for a specific container size
 * Accounts for device pixel ratio for Retina displays
 * Caps at 2x to avoid excessive bandwidth
 */
export function getOptimalImageUrl(
  baseUrl: string,
  containerWidth: number,
  pixelRatio: number = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1
): string {
  const targetWidth = Math.ceil(containerWidth * pixelRatio);
  
  // Handle Unsplash URLs
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', targetWidth.toString());
    url.searchParams.set('q', '80');
    url.searchParams.set('fit', 'crop');
    url.searchParams.set('fm', 'webp'); // Request WebP
    return url.toString();
  }

  return baseUrl;
}

/**
 * Generate sizes attribute for responsive images
 */
export function generateSizesAttribute(breakpoints: {
  mobile?: number;
  tablet?: number;
  desktop?: number;
}): string {
  const { mobile = 180, tablet = 200, desktop = 250 } = breakpoints;
  
  return `(max-width: 640px) ${mobile}px, (max-width: 1024px) ${tablet}px, ${desktop}px`;
}

/**
 * Check if image URL is valid and loadable
 */
export function preloadImage(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Get high-res URL for detail pages
 */
export function getHighResUrl(baseUrl: string, width: number = 1200): string {
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', '90'); // Higher quality for detail pages
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  return baseUrl;
}

/**
 * Get thumbnail URL for grids
 */
export function getThumbnailUrl(baseUrl: string, width: number = 400): string {
  if (baseUrl.includes('unsplash.com')) {
    const url = new URL(baseUrl);
    url.searchParams.set('w', width.toString());
    url.searchParams.set('q', '85');
    url.searchParams.set('fit', 'crop');
    return url.toString();
  }
  return baseUrl;
}
