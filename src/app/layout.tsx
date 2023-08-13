'use client';

import Loading from '@/components/Loading';
import { Menu } from '@/components/Menu/Menu';
import { StyleSwitcher } from '@/components/StyleSwitcher';
import { ThemeProvider } from '@/components/ThemeProvier';
import { Sidebar } from '@/components/global/Sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Toaster } from '@/components/ui/toaster';
import { initGlobalApp } from '@/hooks/useApp';
import useAuth from '@/hooks/useAuth';
import { useServerAlert } from '@/hooks/useServerAlert';
import { fontInter } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import '@/styles/globals.css';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Copy } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface ExamplesLayoutProps {
  children: React.ReactNode;
}

export default function MyApp({ children }: ExamplesLayoutProps) {
  const router = useRouter();
  const path = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthorized } = useAuth();
  const { alertError, alertSuccess } = useServerAlert();
  const initApp = useCallback(async () => {
    if (!isLoading) {
      setIsLoading(true);
    }

    const resp = await initGlobalApp();

    if (!resp) {
      alertError('Something went wrong');

      return;
    }
    if ('path' in resp) {
      alertError(
        <>
          <div className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            <code className="text-white w-[100px] h-[200px] overflow-x-scroll">
              {JSON.stringify(resp, null, 2)}
            </code>
          </div>
          <Button
            onClick={async () => {
              await writeText(resp.path);
              alertSuccess();
            }}
            variant="ghost"
            size="sm"
            className=" p-2"
          >
            <div className="flex flex-row gap-2">
              <span>Copy path</span>
              <Copy className="" />
            </div>
            <span className="sr-only">Copy</span>
          </Button>
        </>
      );

      return;
    }

    if (!isAuthorized) {
      router.replace('/login');
    }
    setIsLoading(false);
  }, [isAuthorized, isLoading, router]);

  useEffect(() => {
    initApp();
  }, [initApp]);

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

          <div
            className={cn(
              'h-screen border-t bg-background pb-8',
              // "scrollbar-none"
              'scrollbar scrollbar-track-transparent scrollbar-thumb-accent scrollbar-thumb-rounded-md'
            )}
          >
            {isLoading ? (
              <Loading />
            ) : (
              <>
                <Menu />
                <div className="h-screen">
                  {path === '/login' ? (
                    <>{children}</>
                  ) : (
                    !!isAuthorized && (
                      <div className="flex w-full flex-row">
                        <Sidebar />
                        <div className="flex h-full w-full flex-col">
                          <ScrollArea
                            className="w-full gap-2"
                            style={{
                              height: 'calc(100vh - 4rem)',
                            }}
                          >
                            <div className="overflow-y-auto p-8">
                              {children}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </>
            )}
          </div>
          <StyleSwitcher />
        </ThemeProvider>
      </body>
    </html>
  );
}
