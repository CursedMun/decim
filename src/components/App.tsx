import Loading from '@/components/Loading';
import { Menu } from '@/components/Menu/Menu';
import { Sidebar } from '@/components/global/Sidebar';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { initGlobalApp } from '@/hooks/useApp';
import { useServerAlert } from '@/hooks/useServerAlert';
import { cn } from '@/lib/utils';
import { useAuth } from '@/provider/AuthProvider';
import '@/styles/globals.css';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Copy } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import Login from './authentication/Login';
export default function AppComp({ children }: { children: React.ReactNode }) {
  const { isAuthorized } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
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

    setIsLoading(false);
  }, [isLoading]);

  console.log('AppComp');
  useEffect(() => {
    if (isLoading) {
      initApp();
    }
  }, [isLoading]);

  return (
    <div
      className={cn(
        'h-screen border-t bg-background pb-8',
        // "scrollbar-none"
        'scrollbar-thumb-rounded-md',
        'scrollbar scrollbar-track-transparent scrollbar-thumb-accent '
      )}
    >
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <Menu />
          <div className="h-screen">
            {isAuthorized ? (
              <div className="flex w-full flex-row">
                <Sidebar />
                <div className="flex h-full w-full flex-col">
                  <ScrollArea
                    className="w-full gap-2"
                    style={{
                      height: 'calc(100vh - 4rem)',
                    }}
                  >
                    <div className="overflow-y-auto p-8">{children}</div>
                  </ScrollArea>
                </div>
              </div>
            ) : (
              <Login></Login>
            )}
          </div>
        </>
      )}
    </div>
  );
}
