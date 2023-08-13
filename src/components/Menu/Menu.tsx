'use client';

import { Maximize, Sailboat, X } from 'lucide-react';
import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from '@/components/ui/menubar';

import { ModeToggle } from '../ModeToggle';
import { ExamplesNav } from '../examples-nav';
import { Icons } from '../icons';
import { UserNav } from './UserMenu';

export function Menu() {
  const minimizeWindow = useCallback(async () => {
    const { appWindow } = await import('@tauri-apps/plugin-window');

    appWindow?.minimize();
  }, []);

  const maximizeWindow = useCallback(async () => {
    const { appWindow } = await import('@tauri-apps/plugin-window');
    const isMaximized = await appWindow?.isMaximized();

    if (isMaximized) {
      appWindow?.unmaximize();
    } else {
      appWindow?.maximize();
    }
  }, []);

  const closeWindow = useCallback(async () => {
    const { appWindow } = await import('@tauri-apps/plugin-window');

    appWindow.close();
  }, []);

  return (
    <Menubar className="rounded-none border-b border-none pl-2 lg:pl-3">
      {/* App Logo */}
      <MenubarMenu>
        <div className="inline-flex h-fit w-fit items-center text-cyan-500">
          <Sailboat className="h-5 w-5" />
        </div>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger className="font-bold">Decim</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>About App</MenubarItem>
          <MenubarSeparator />
        </MenubarContent>
      </MenubarMenu>

      <ExamplesNav />

      <div
        data-tauri-drag-region
        className="inline-flex h-full w-full justify-end"
      >
        <div className="pr-3">
          <UserNav />
        </div>

        <div className="pr-3">
          <ModeToggle />
        </div>

        <Button
          onClick={minimizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Icons.minimize className="h-3 w-3" />
        </Button>
        <Button
          onClick={maximizeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <Maximize className="h-4 w-4" />
        </Button>
        <Button
          onClick={closeWindow}
          variant="ghost"
          className="h-8 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Menubar>
  );
}
