import type {NextConfig} from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const contentSecurityPolicy = [
  "default-src 'self'",
  "img-src 'self' data: https:",
  "media-src 'self' blob: https:",
  "frame-src https://www.youtube-nocookie.com https://www.youtube.com",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
  "style-src 'self' 'unsafe-inline' https:",
  "font-src 'self' data: https:",
  "connect-src 'self' https:",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  ...(isProduction ? ['upgrade-insecure-requests'] : []),
].join('; ');

const securityHeaders = [
  {key:'X-Content-Type-Options',value:'nosniff'},
  {key:'X-Frame-Options',value:'SAMEORIGIN'},
  {key:'Referrer-Policy',value:'strict-origin-when-cross-origin'},
  {key:'Permissions-Policy',value:'camera=(), microphone=(), geolocation=()'},
  {key:'Cross-Origin-Opener-Policy',value:'same-origin'},
  {key:'Content-Security-Policy',value:contentSecurityPolicy},
];

const nextConfig:NextConfig = {
  reactStrictMode:true,
  allowedDevOrigins:['10.15.4.9'],
  async headers(){
    return [{source:'/:path*',headers:securityHeaders}];
  }
};

export default nextConfig;
