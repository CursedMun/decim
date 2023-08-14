import { useServerAlert } from '@/hooks/useServerAlert';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { Copy } from 'lucide-react';
import { Button } from './ui/button';

export default function CopyToClipboard({ text }: { text: string }) {
  const { alertSuccess } = useServerAlert();

  return (
    <Button
      onClick={async () => {
        await writeText(text);
        alertSuccess(`copied to clipboard`);
      }}
      variant="ghost"
      size="sm"
      className=" p-2"
    >
      <Copy size={16} />
      <span className="sr-only">Copy</span>
    </Button>
  );
}
