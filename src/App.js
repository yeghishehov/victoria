import { Provider } from 'react-redux';
import store from './utils/configureStore';
import AuthProvider from './hooks/auth/auth.provider';
import Main from './pages';

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </Provider>
  );
}

export default App;
