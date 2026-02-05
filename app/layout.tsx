import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import Header from '@/components/ui/Header';
import NoExtensionWarning from '@/components/ui/NoExtensionWarning';

const outfit = Outfit({ subsets: ['latin'] });

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
    <html lang="en" suppressHydrationWarning>
      <body className={`${outfit.className} bg-slate-950 text-white antialiased`} suppressHydrationWarning>
        <div className="fixed inset-0 z-[-1] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
        <Header />
        <main className="min-h-screen relative">
          {children}
        </main>
        <NoExtensionWarning />
      </body>
    </html>
  );
}