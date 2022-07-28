import { useEffect, useState } from 'react';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../../utils/firebase';

export default function useAuth() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [error, setError] = useState('');

  const login = async ({ login, password }) => {
    setAuthLoading(true);
    setError('');
    try {
     await signInWithEmailAndPassword(auth, login, password);
    } catch (e) {
      setError("Неверный E-mail или пароль");
      setIsAuthorized(false);
    }
    setAuthLoading(false);
  };

  const logout = () => {
    signOut(auth);
  };

  useEffect(() => {
      setAuthLoading(true);
      const unSubscribe = auth.onAuthStateChanged((user) => {
        setIsAuthorized(!!user);
        setAuthLoading(false);
      });
    return unSubscribe;
  }, []);

  return {
    login, logout, isAuthorized, authLoading, error
  };
}
