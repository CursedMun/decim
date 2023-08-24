import { useToast } from '@/components/ui/use-toast';

export const useServerAlert = () => {
  const { toast } = useToast();
  const alertSuccess = (description?: string | JSX.Element) => {
    toast({
      variant: 'success',
      title: 'success',
      description,
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
