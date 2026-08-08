export function sameOrigin(request: Request) {
  const origin = request.headers.get('origin');

  // Request tanpa Origin, misalnya server-to-server, tetap diizinkan.
  if (!origin) return true;

  try {
    const originUrl = new URL(origin);

    const configured = process.env.NEXT_PUBLIC_SITE_URL
      ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
      : null;

    // Origin publik resmi Science News 360.
    if (configured && originUrl.origin === configured.origin) {
      return true;
    }

    // Cocokkan dengan host yang diteruskan oleh reverse proxy / platform.
    const forwardedHost =
      request.headers.get('x-forwarded-host') ||
      request.headers.get('host');

    if (forwardedHost) {
      const host = forwardedHost.split(',')[0].trim().toLowerCase();
      if (originUrl.host.toLowerCase() === host) {
        return true;
      }
    }

    // Fallback untuk lingkungan lokal / direct runtime.
    const requestOrigin = new URL(request.url).origin;
    return originUrl.origin === requestOrigin;
  } catch {
    return false;
  }
}
