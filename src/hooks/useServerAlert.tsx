import { useToast } from '@/components/ui/use-toast';

export const useServerAlert = () => {
  const { toast } = useToast();
  const alertSuccess =
    (callback?: (response?: any) => void) => (response?: any) => {
      callback?.(response);
      toast({
        variant: 'success',
        title: 'success',
      });
    };

  const alertError = (error: string | JSX.Element) => {
    console.log(error);
    toast({
      variant: 'destructive',
      title: 'error',
      description: error,
    });
  };

  return {
    alertSuccess,
    alertError,
  };
};
