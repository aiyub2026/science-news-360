import type { Metadata } from 'next';
import './design-tokens.css';
import './globals.css';
import { AuthProvider } from '@/components/auth/AuthProvider';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://sciencenews360.com'),
  title: 'Science News 360 — Global Science, Education & Innovation',
  description: 'Global science journalism, academic insight, research, technology, education, and expert opinion.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id" suppressHydrationWarning><body><AuthProvider>{children}</AuthProvider></body></html>;
}
