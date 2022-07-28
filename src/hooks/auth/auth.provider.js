import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';
import useAuth from './useAuth';

const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const {
    login, logout, isAuthorized, authLoading, error, changePassword,
  } = useAuth();

  return (
    <AuthContext.Provider value={{
      login, logout, isAuthorized, authLoading, error, changePassword,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
