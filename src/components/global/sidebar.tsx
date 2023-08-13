'use client';

import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { ChevronLeft, Parentheses, Server, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

type SidebarProps = React.HTMLAttributes<HTMLDivElement>;
const tabs = [
  {
    name: 'Tasks',
    icon: Tags,
    href: '/',
  },
  {
    name: 'Passwords',
    icon: Parentheses,
    href: '/passwords',
  },
  {
    name: 'Hosts',
    icon: Server,
    href: '/hosts',
  },
];

export function Sidebar({ className }: SidebarProps) {
  const path = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  console.log(path);

  return (
    <div
      className={cn(
        'transform transition-all duration-300',
        'static h-screen grow border-r-2',
        {
          'w-[200px] ': !isCollapsed,
          'w-[60px]': isCollapsed,
        }
      )}
    >
      <div className="flex w-full justify-end px-2">
        <Button
          variant="ghost"
          size="sm"
          className="w-9 p-0"
          onClick={() => {
            setIsCollapsed(!isCollapsed);
          }}
        >
          <ChevronLeft
            className={cn('transform transition-all duration-300', {
              'rotate-180': isCollapsed,
            })}
          />
          <span className="sr-only">Toggle</span>
        </Button>
      </div>
      <div className="space-y-4">
        <div className=" py-2">
          <ScrollArea
            className="w-full gap-2"
            style={{
              height: 'calc(100vh - 4rem)',
            }}
          >
            {tabs.map((tab, i) => {
              return (
                <Button
                  key={i}
                  variant={path === tab.href ? 'secondary' : 'ghost'}
                  className="mb-1 w-full justify-start"
                >
                  <Link
                    href={tab.href}
                    className="flex flex-row items-center gap-2 "
                  >
                    <tab.icon />

                    {!isCollapsed && tab.name}
                  </Link>
                </Button>
              );
            })}
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
