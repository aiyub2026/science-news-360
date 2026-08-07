import type { Metadata } from 'next';
import './design-tokens.css';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sciencenews360.my.id'),
  title: 'Science News 360 — Global Science, Education & Innovation',
  description: 'Global science journalism, academic insight, research, technology, education, and expert opinion.',
  icons:{icon:'/favicon.svg',apple:'/brand/science-news-360-icon.svg'},
  manifest:'/manifest.webmanifest',
  openGraph:{siteName:'Science News 360 — Global Science, Education & Innovation',images:[{url:'/images/social-default-1200x630.webp',width:1200,height:630,alt:'Science News 360'}]},
  twitter:{card:'summary_large_image',images:['/images/social-default-1200x630.webp']},
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id" suppressHydrationWarning><body><AuthProvider>{children}</AuthProvider></body></html>;
}
