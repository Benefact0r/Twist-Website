export type TransparentFaviconOptions = {
  sourceHref?: string;
  /** 0-255; higher removes more of the light halo/shadow */
  thresholdLow?: number;
  /** 0-255; higher keeps more of the edge */
  thresholdHigh?: number;
  /** 0-255; max chroma (max-min RGB) considered "background-like" (prevents erasing colorful icon pixels) */
  chromaMax?: number;
};


const colorDistance = (r: number, g: number, b: number, br: number, bg: number, bb: number) => {
  const dr = r - br;
  const dg = g - bg;
  const db = b - bb;
  return Math.sqrt(dr * dr + dg * dg + db * db);
};

const getCornerAverage = (data: Uint8ClampedArray, width: number, height: number) => {
  const corners = [
    [0, 0],
    [width - 1, 0],
    [0, height - 1],
    [width - 1, height - 1],
  ];

  let r = 0,
    g = 0,
    b = 0;

  for (const [x, y] of corners) {
    const idx = (y * width + x) * 4;
    r += data[idx];
    g += data[idx + 1];
    b += data[idx + 2];
  }

  return {
    r: Math.round(r / corners.length),
    g: Math.round(g / corners.length),
    b: Math.round(b / corners.length),
  };
};

const setFaviconHref = (href: string) => {
  const links = Array.from(document.querySelectorAll<HTMLLinkElement>(
    'link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
  ));

  if (links.length === 0) {
    const link = document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = href;
    document.head.appendChild(link);
    return;
  }

  for (const link of links) {
    link.href = href;
    if (!link.type) link.type = 'image/png';
  }

  // Force refresh in some browsers by cloning the primary icon link
  const primary = links.find((l) => l.rel.includes('icon')) ?? links[0];
  if (primary?.parentNode) {
    const clone = primary.cloneNode(true) as HTMLLinkElement;
    primary.parentNode.replaceChild(clone, primary);
  }
};

export const applyTransparentFavicon = async (options: TransparentFaviconOptions = {}) => {
  const {
    sourceHref = '/favicon.png',
    thresholdLow = 14,
    thresholdHigh = 55,
    chromaMax = 26,
  } = options;

  try {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    // Cache-bust so changes are visible immediately
    const cacheBusted = `${sourceHref}${sourceHref.includes('?') ? '&' : '?'}v=${Date.now()}`;
    img.src = cacheBusted;

    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Failed to load favicon source image'));
    });

    // Use a standard favicon size and scale icon to fill more space
    const faviconSize = 64;
    const canvas = document.createElement('canvas');
    canvas.width = faviconSize;
    canvas.height = faviconSize;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return;

    // Scale icon to fill ~95% of the space (makes it bigger like other favicons)
    const scale = (faviconSize * 0.95) / Math.max(img.naturalWidth, img.naturalHeight);
    const scaledW = img.naturalWidth * scale;
    const scaledH = img.naturalHeight * scale;
    const offsetX = (faviconSize - scaledW) / 2;
    const offsetY = (faviconSize - scaledH) / 2;

    // Fill with white first (will be made transparent for outer area)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, faviconSize, faviconSize);

    // Draw scaled icon centered
    ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const bg = getCornerAverage(data, canvas.width, canvas.height);

    // Flood-fill from corners to find ONLY the outer background region.
    // This preserves any "white" shapes inside the icon (like the T) because
    // they are not connected to the outside.
    const w = canvas.width;
    const h = canvas.height;
    const size = w * h;

    // -1 = not background; otherwise stores distance-to-bg color for feathering
    const bgDist = new Float32Array(size);
    bgDist.fill(-1);

    const qx: number[] = [];
    const qy: number[] = [];

    const push = (x: number, y: number) => {
      qx.push(x);
      qy.push(y);
    };

    push(0, 0);
    push(w - 1, 0);
    push(0, h - 1);
    push(w - 1, h - 1);

    while (qx.length) {
      const x = qx.pop()!;
      const y = qy.pop()!;
      if (x < 0 || y < 0 || x >= w || y >= h) continue;

      const i = y * w + x;
      if (bgDist[i] !== -1) continue;

      const di = i * 4;
      const r = data[di];
      const g = data[di + 1];
      const b = data[di + 2];

      const maxC = Math.max(r, g, b);
      const minC = Math.min(r, g, b);
      const chroma = maxC - minC;

      // Treat only neutral colors (white/gray-ish) as background candidates.
      // This prevents erasing the green fill or the white T if a flood-fill ever gets near.
      if (chroma > chromaMax) continue;

      const d = colorDistance(r, g, b, bg.r, bg.g, bg.b);

      // Barrier: don't cross into non-background colors
      if (d > thresholdHigh) continue;

      bgDist[i] = d;

      // 4-neighbour flood fill
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }

    for (let i = 0; i < size; i++) {
      const d = bgDist[i];
      if (d === -1) continue; // not outer background

      const di = i * 4;

      if (d <= thresholdLow) {
        data[di] = bg.r;
        data[di + 1] = bg.g;
        data[di + 2] = bg.b;
        data[di + 3] = 0;
      } else {
        // Soft edge for anti-aliasing without touching interior details
        const t = (d - thresholdLow) / (thresholdHigh - thresholdLow);
        data[di + 3] = Math.max(0, Math.min(255, Math.round(255 * t)));
      }
    }

    ctx.putImageData(imageData, 0, 0);

    const transparentDataUrl = canvas.toDataURL('image/png');
    setFaviconHref(transparentDataUrl);
  } catch {
    // If anything fails, keep the existing favicon.
  }
};
