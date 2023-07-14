'use client';
import { Menu } from '@/components/Menu';
import { StyleSwitcher } from '@/components/StyleSwitcher';
import { TailwindIndicator } from '@/components/TailwindIndicator';
import { ThemeProvider } from '@/components/ThemeProvier';
import Login from '@/components/authentication/Login';
import { Sidebar } from '@/components/global/sidebar';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';
import { TICKS } from '@/lib/constants';
import { fontInter } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { Metadata } from 'next';
import { useEffect, useState } from 'react';

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function MyApp({ children }: ExamplesLayoutProps) {
  const [progress, setProgress] = useState(0);
  const [authorized, setAuthorized] = useState(false);
  useEffect(() => {
    setProgress(20);
    const lastLogin = localStorage.getItem('lastLogin');
    console.log(lastLogin);
    if (lastLogin && parseInt(lastLogin) > Date.now() - TICKS.oneHour) {
      console.log('got here');
      setProgress(40);
      const password = localStorage.getItem('password');
      if (password && password === 'admin') {
        setProgress(60);
        setAuthorized(true);
      }
    } else {
      setAuthorized(false);
    }
    setProgress(100);
    // localStorage.setItem('qwe', 'qwe');
  }, []);
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
          <Menu authorized />
          {progress < 100 ? (
            <div className="w-screen h-screen justify-center">
              <Progress value={progress} />
            </div>
          ) : !authorized ? (
            <div className="w-screen h-screen">
              <Login />
            </div>
          ) : (
            <div className="h-screen">
              <div
                className={cn(
                  'h-screen border-t bg-background pb-8',
                  // "scrollbar-none"
                  'scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md'
                )}
              >
                <div className="flex w-full flex-row">
                  <Sidebar className="static h-screen min-w-[200px] max-w-[200px] grow border-r-2 " />
                  <div className="flex h-full w-full flex-col">
                    <ScrollArea
                      className="w-full gap-2"
                      style={{
                        height: 'calc(100vh - 4rem)',
                      }}
                    >
                      <div className="overflow-y-auto">{children}</div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          )}
          <TailwindIndicator />
        </ThemeProvider>
        <StyleSwitcher />
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  icons: {
    shortcut: ['#'],
  },
};
