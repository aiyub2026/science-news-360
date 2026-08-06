# Netlify Environment Report — V2.0.13

Required setting:

```text
NEXT_PUBLIC_SITE_URL=https://sciencenews360.com
```

The project includes `netlify.toml`, Node.js 20 configuration, and `@netlify/blobs` for persistent public article snapshots and media. Netlify automatically configures site access for Blobs when the application runs in its Functions environment. For equivalent local platform behavior, use Netlify CLI; ordinary `npm run dev` uses the local `.sn360-data` fallback.
