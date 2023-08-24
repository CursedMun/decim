'use client';

import AppComp from '@/components/App';
import { StyleSwitcher } from '@/components/StyleSwitcher';
import { ThemeProvider } from '@/components/ThemeProvier';
import { Toaster } from '@/components/ui/toaster';
import { fontInter } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import AuthProvider from '@/provider/AuthProvider';
import '@/styles/globals.css';

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function MyApp({ children }: ExamplesLayoutProps) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn('overflow-clip bg-black', fontInter.variable)}
    >
      <head />
      <body className=" bg-transparent font-sans antialiased scrollbar-none">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Toaster />
          <AuthProvider>
            <AppComp>{children}</AppComp>
            <StyleSwitcher />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
