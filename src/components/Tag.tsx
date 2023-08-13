import { cn } from '@/lib/utils';
const colors = {
  dev: 'bg-blue-500',
  prod: 'bg-green-500',
  test: 'bg-yellow-500',
  db: 'bg-purple-500',
  cska: 'bg-red-500',
  work: 'bg-gray-500',
  mine: 'bg-pink-500',
  bitrealm: 'bg-indigo-500',
  personal: 'bg-pink-500',
  zavidovo: 'bg-yellow-500',
  yfl: 'bg-green-700',
  arktika: 'bg-blue-700',
  build: 'bg-gray-700',
  gmail: 'bg-red-400',
  steam: 'bg-gray-900',
  sapo: 'bg-green-800',
  timeweb: 'bg-blue-800',
} as Record<string, string>;

export function Tag({ text }: { text: string }) {
  return (
    <span
      className={cn(
        ' whitespace-nowrap rounded-lg p-1 px-2 text-sm font-semibold border',
        {
          [`${colors[text.toLowerCase()]}`]: true,
        }
      )}
    >
      {String(text)}
    </span>
  );
}
