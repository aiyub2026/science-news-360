# Social Crawler Validation Report — V2.0.13

## Automated checks included

- HTTPS canonical URL validation.
- Public social image URL validation.
- Detection of localhost, `127.0.0.1`, Blob URL, Base64, and local computer paths.
- Image accessibility check from the Administrator diagnostic page.
- Server-rendered Open Graph and Twitter Card fields.

## External validation required after deployment

Real crawler validation cannot be completed before a public HTTPS deployment exists. After Netlify deployment, test the final URL with Facebook Sharing Debugger, LinkedIn Post Inspector, WhatsApp, X, and Telegram. Social services may retain an older cached preview temporarily.
