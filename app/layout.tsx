import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import UserMenu from '@/components/ui/UserMenu';
import { ThemeProvider } from '@/components/ui/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'InterviewAI - Master Your Tech Interview',
  description: 'AI-powered technical interview simulations adapted to your resume and role.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-white dark:bg-black text-black dark:text-white antialiased selection:bg-white dark:bg-black/10 dark:selection:bg-white/20 transition-colors`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <div className="fixed top-6 right-6 z-50">
            <UserMenu />
          </div>
          <main className="min-h-screen relative flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}