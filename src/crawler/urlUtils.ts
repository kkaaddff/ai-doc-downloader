export function normalizeUrl(base: string, href: string): string | null {
  try {
    const url = new URL(href, base);
    return url.origin === new URL(base).origin ? url.href : null;
  } catch {
    return null;
  }
} 