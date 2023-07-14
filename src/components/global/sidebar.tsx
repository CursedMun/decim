'use client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

import { Parentheses, Tags } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}
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
];

export function Sidebar({ className }: SidebarProps) {
  const path = usePathname();

  console.log(path);
  return (
    <div className={cn(className)}>
      <div className="space-y-4 py-4">
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
                    {tab.name}
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
