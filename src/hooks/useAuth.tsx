import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';
import { useServerAlert } from './useServerAlert';

export default function useAuth() {
  const router = useRouter();
  const [isAuthorized, setAuthState] = useState(!!getCookie('password'));
  const { alertError } = useServerAlert();
  const login = useCallback(
    async (password: string) => {
      if (!password || !password.length || password !== 'admin') {
        alertError('Invalid password');
      } else {
        setAuthState(true);

        setCookie('password', password, {
          //expires in 10 hours
          expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
        });
        router.replace('/');
      }
    },
    [alertError, router]
  );
  const logout = useCallback(async () => {
    setAuthState(false);
    deleteCookie('password');
    router.replace('/login');
  }, [router]);

  return { isAuthorized, login, logout };
}
