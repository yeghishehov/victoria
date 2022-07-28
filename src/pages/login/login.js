import { useState } from 'react';
import { useAuthContext } from 'hooks/auth/auth.provider';
import Spinner from 'components/styled/spinner';
import Modal from 'components/styled/modal';
import Input from 'components/styled/input';
import {
  Container, Title, Button, ErrorText,
} from './styled.login';

export default function Login() {
  const { login, authLoading, error } = useAuthContext();
  const [form, setForm] = useState({ login: '', password: '' });

  const handleChangeForm = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const checkForm = () => !!(form.login && form.password);

  const handleLogin = () => {
    if (checkForm()) login(form);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      if (checkForm()) login(form);
    }
  };

  return (
    <Container>
      <Title>Victoria</Title>
      <Input
        value={form.login}
        onChange={handleChangeForm}
        onKeyDown={handleEnter}
        name="login"
        type="text"
        placeholder="E-mail"
        required
      />
      <Input
        value={form.password}
        name="password"
        onChange={handleChangeForm}
        onKeyDown={handleEnter}
        type="password"
        placeholder="Пароль"
        required
      />
      {error && <ErrorText>{error}</ErrorText>}
      <Button type="submit" onClick={handleLogin}>Войти</Button>
      {authLoading && <Modal show><Spinner /></Modal>}
    </Container>
  );
}
