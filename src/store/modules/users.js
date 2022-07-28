import { userRequest } from '../../utils/api';

const GET_ALL_USERS = 'GET_ALL_USERS';
const GET_ALL_USERS_SUCCESS = 'GET_ALL_USERS_SUCCESS';
const GET_ALL_USERS_FAILURE = 'GET_ALL_USERS_FAILURE';

const initialState = {
  data: [],
  loading: false,
  error: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_USERS:
      return {
        data: [],
        loading: true,
        error: '',
      };
    case GET_ALL_USERS_SUCCESS:
      return {
        data: action.payload,
        loading: false,
        error: '',
      };
    case GET_ALL_USERS_FAILURE:
      return {
        data: [],
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

const loading = () => ({ type: GET_ALL_USERS });
const success = (payload) => ({ type: GET_ALL_USERS_SUCCESS, payload });
const failure = (error) => ({ type: GET_ALL_USERS_FAILURE, error });

export const registerUser =
  ({ form, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await userRequest.registration(form);
      dispatch(success(response.users));
    } catch (error) {
      if (error.response) {
        if (error.response.data === 'Unauthorized') {
          dispatch(failure(error.response?.data));
          logout();
        } else {
          dispatch(failure(error.response.data?.message));
        }
      } else {
        dispatch(
          failure(`${error.response ? error.response.data.message : error}`)
        );
      }
    }
  };

export const deleteUsers =
  ({ deleteItems, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await userRequest.delete(deleteItems);
      dispatch(success(response.users));
    } catch (error) {
      if (error?.response?.data === 'Unauthorized') {
        dispatch(failure(error.response.data));
        logout();
      } else {
        dispatch(
          failure(`${error.response ? error.response.data.message : error}`)
        );
      }
    }
  };

export const editUser =
  ({ form, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await userRequest.edit(form);
      dispatch(success(response.users));
    } catch (error) {
      if (error?.response?.data === 'Unauthorized') {
        dispatch(failure(error.response.data));
        logout();
      } else {
        dispatch(
          failure(`${error.response ? error.response.data.message : error}`)
        );
      }
    }
  };

export const getUsers = () => async (dispatch) => {
  dispatch(loading());
  try {
    const response = await userRequest.getAll();
    dispatch(success(response));
  } catch (error) {
    dispatch(
      failure(`${error.response ? error.response.data.message : error}`)
    );
  }
};
