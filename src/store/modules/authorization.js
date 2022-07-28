// import { userRequest } from 'utils/api';

const LOGIN = 'LOGIN';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAILURE = 'LOGIN_FAILURE';
const LOGOUT = 'LOGOUT';

const initialState = {
  loading: false,
  authorized: false,
  error: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LOGIN:
      return {
        loading: true,
        authorized: false,
        error: '',
      };
    case LOGIN_SUCCESS:
      return {
        loading: false,
        authorized: true,
        error: '',
      };
    case LOGIN_FAILURE:
      return {
        loading: false,
        authorized: false,
        error: action.payload,
      };
    case LOGOUT:
      return {
        loading: false,
        authorized: false,
        error: '',
      };
    default:
      return state;
  }
}

const loading = () => ({ type: LOGIN });
const success = () => ({ type: LOGIN_SUCCESS });
const failure = (payload) => ({ type: LOGIN_FAILURE, payload });
const logoutAction = () => ({ type: LOGOUT });

export const login = (form) => async (dispatch) => {
  dispatch(loading());
  form; // jsjel
  // try {
  //   const response = await userRequest.login(form);
  //   sessionStorage.setItem('access_token', response.token);
  //   axios.setToken(response.token);
  //   dispatch(success());
  // } catch (error) {
  //   dispatch(
  //     failure(`${error.response ? error.response?.data?.message : error}`)
  //   );
  // }
};

export const checkToken = () => async (dispatch) => {
  // const token = sessionStorage.getItem('access_token');
  // if (token) {
  //   axios.setToken(token);
  dispatch(loading());
  try {
    //     const response = await userRequest.checkToken();
    //     sessionStorage.setItem('access_token', response.token);
    //     axios.setToken(response.token);
    dispatch(success());
  } catch (error) {
    dispatch(
      failure(`${error.response ? error.response.data.message : error}`)
    );
  }
  // }
};

export const logout = () => (dispatch) => {
  dispatch(logoutAction());
  // sessionStorage.removeItem('access_token');
  // axios.removeToken();
};
