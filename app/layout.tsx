import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InterviewAI - Enterprise Interview Simulator',
  description: 'AI-powered interview simulation platform for professional development',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className} suppressHydrationWarning={true}>
        <Header />
        {children}
      </body>
    </html>
  );
}