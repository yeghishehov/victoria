import { flowersRequest } from '../../utils/api';

const GET_ALL_FLOWERS = 'GET_ALL_FLOWERS';
const GET_ALL_FLOWERS_SUCCESS = 'GET_ALL_FLOWERS_SUCCESS';
const GET_ALL_FLOWERS_FAILURE = 'GET_ALL_FLOWERS_FAILURE';

const initialState = {
  data: [],
  loading: false,
  error: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_FLOWERS:
      return {
        data: [],
        loading: true,
        error: '',
      };
    case GET_ALL_FLOWERS_SUCCESS:
      return {
        data: action.payload,
        loading: false,
        error: '',
      };
    case GET_ALL_FLOWERS_FAILURE:
      return {
        data: [],
        loading: false,
        error: action.error,
      };
    default:
      return state;
  }
}

const loading = () => ({ type: GET_ALL_FLOWERS });
const success = (payload) => ({ type: GET_ALL_FLOWERS_SUCCESS, payload });
const failure = (error) => ({ type: GET_ALL_FLOWERS_FAILURE, error });

export const addFlower =
  ({ formData, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await flowersRequest.add(formData);
      dispatch(success(response.flowers));
    } catch (error) {
      if (error.response) {
        if (error.response.data === 'Unauthorized') {
          dispatch(failure(error.response.data));
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

export const deleteFlower =
  ({ deleteItems, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await flowersRequest.delete(deleteItems);
      dispatch(success(response.flowers));
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

export const editFlower =
  ({ formData, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const response = await flowersRequest.edit(formData);
      dispatch(success(response.flowers));
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

export const getFlowers = () => async (dispatch) => {
  dispatch(loading());
  try {
    const response = await flowersRequest.get();
    dispatch(success(response));
  } catch (error) {
    dispatch(
      failure(`${error.response ? error.response.data.message : error}`)
    );
  }
};
