export function normalizeUrl(base: string, href: string): string | null {
  try {
    const url = new URL(href, base)
    const baseUrl = new URL(base)

    // Check if the URL is from the same origin
    if (url.origin !== baseUrl.origin) {
      return null
    }

    // Remove the fragment
    url.hash = ''

    return url.href
  } catch {
    return null
  }
}
