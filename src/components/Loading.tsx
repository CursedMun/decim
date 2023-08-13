import { Icons } from './icons';

export default function Loading({ className }: { className?: string }) {
  return (
    <div
      className={
        className ??
        'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
      }
    >
      <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
    </div>
  );
}
