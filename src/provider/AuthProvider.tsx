import { useServerAlert } from '@/hooks/useServerAlert';
import { deleteCookie, getCookie, setCookie } from 'cookies-next';
import React, {
  useCallback,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';

interface IAuthContextValue {
  isAuthorized: boolean;
  login: (password: string) => void;
  logout: () => void;
}

export const AuthContext = React.createContext<IAuthContextValue>({
  isAuthorized: false,
  logout: () => {}, // TODO: invalidate session
  login: () => {},
});

const AuthProvider: React.FC<PropsWithChildren> = (props) => {
  const [isAuthorized, setAuthState] = useState(!!getCookie('password'));
  const { alertError } = useServerAlert();

  const login = useCallback(
    async (password: string) => {
      if (!password || !password.length || password !== 'admin') {
        alertError('Invalid password');
      } else {
        setCookie('password', password, {
          //expires in 10 hours
          expires: new Date(Date.now() + 10 * 60 * 60 * 1000),
        });
        setAuthState(true);
      }
    },
    [alertError]
  );

  const logout = useCallback(async () => {
    deleteCookie('password');
    setAuthState(false);
  }, []);

  const value = useMemo(
    (): IAuthContextValue => ({
      isAuthorized,
      logout,
      login,
    }),
    [isAuthorized, logout, login]
  );

  return (
    <AuthContext.Provider value={value}>{props.children}</AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);

export default AuthProvider;
