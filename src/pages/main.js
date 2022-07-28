import { useAuthContext } from 'hooks/auth/auth.provider';
import Login from './login';
import Panel from './panel';

export default function Admin() {
  const { isAuthorized } = useAuthContext();

  return (
    <>
      {isAuthorized
        ? <Panel />
        : <Login />}
    </>
  );
}
