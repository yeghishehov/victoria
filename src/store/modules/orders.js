import { orderRequest } from 'utils/api';

const ADD_ORDER = 'ADD_ORDER';
const REMOVE_ORDER = 'REMOVE_ORDER';
const CREATE_ORDER = 'CREATE_ORDER';
const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
const CREATE_ORDER_FAILURE = 'CREATE_ORDER_FAILURE';
const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS';
const GET_ORDER_FAILURE = 'GET_ORDER_FAILURE';

const initialState = {
  data: [],
  price: 0,
  loading: false,
  successMessage: '',
  errorMessage: '',
};

export default function orders(state = initialState, action) {
  switch (action.type) {
    case ADD_ORDER:
      return {
        ...state,
        data: [...state.data, action.payload],
        price:
          state.data.reduce(
            (sum, orderItem) => sum + orderItem.orderDetails.price,
            0
          ) + action.payload.orderDetails.price,
      };
    case REMOVE_ORDER:
      return {
        ...state,
        data: state.data.filter(
          (orderItem) => orderItem.orderId !== action.orderId
        ),
        price: state.data.reduce(
          (sum, orderItem) =>
            orderItem.orderId === action.orderId
              ? sum
              : sum + orderItem.orderDetails.price,
          0
        ),
      };
    case CREATE_ORDER:
      return {
        ...state,
        loading: true,
        successMessage: '',
        errorMessage: '',
      };
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        data: [],
        price: 0,
        loading: false,
        successMessage: action.payload,
        errorMessage: '',
      };
    case CREATE_ORDER_FAILURE:
      return {
        ...state,
        loading: false,
        successMessage: '',
        errorMessage: action.payload,
      };
    case GET_ORDER_SUCCESS:
      return {
        ...state,
        data: action.payload,
        price: 0,
        loading: false,
        successMessage: '',
        errorMessage: '',
      };
    case GET_ORDER_FAILURE:
      return {
        ...state,
        data: [],
        price: 0,
        loading: false,
        successMessage: '',
        errorMessage: action.payload,
      };
    default:
      return state;
  }
}

const add = (payload) => ({ type: ADD_ORDER, payload });
const remove = (orderId) => ({ type: REMOVE_ORDER, orderId });
const loading = () => ({ type: CREATE_ORDER });
const success = (payload) => ({ type: CREATE_ORDER_SUCCESS, payload });
const failure = (payload) => ({ type: CREATE_ORDER_FAILURE, payload });
const getSuccess = (payload) => ({ type: GET_ORDER_SUCCESS, payload });
const getFailure = (payload) => ({ type: GET_ORDER_FAILURE, payload });

export const addOrder = (payload) => (dispatch) => {
  dispatch(add(payload));
};

export const removeOrder = (payload) => (dispatch) => {
  dispatch(remove(payload));
};

export const createOrder = (orders) => async (dispatch) => {
  dispatch(loading());
  try {
    const response = await orderRequest.create(orders);
    dispatch(success(response.message));
  } catch (error) {
    dispatch(
      failure(`${error.response ? error.response.data.message : error}`)
    );
  }
};

export const getAllOrders = () => async (dispatch) => {
  dispatch(loading());
  try {
    const orders = await orderRequest.getAll();
    dispatch(getSuccess(orders));
  } catch (error) {
    dispatch(
      getFailure(`${error.response ? error.response.data.message : error}`)
    );
  }
};

export const viewedOrder = (id) => async (dispatch) => {
  dispatch(loading());
  try {
    const orders = await orderRequest.viewed(id);
    dispatch(getSuccess(orders));
  } catch (error) {
    dispatch(
      getFailure(`${error.response ? error.response.data.message : error}`)
    );
  }
};

export const deleteOrder =
  ({ deleteItems, logout }) =>
  async (dispatch) => {
    dispatch(loading());
    try {
      const orders = await orderRequest.delete(deleteItems);
      dispatch(getSuccess(orders));
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
