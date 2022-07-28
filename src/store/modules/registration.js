import { userRequest } from '../../utils/api';

const REGISTRATION = 'REGISTRATION';
const REGISTRATION_SUCCESS = 'REGISTRATION_SUCCESS';
const REGISTRATION_FAILURE = 'REGISTRATION_FAILURE';

const initialState = {
  loading: false,
  success: '',
  error: '',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case REGISTRATION:
      return {
        ...state,
        loading: true,
        success: '',
        error: '',
      };
    case REGISTRATION_SUCCESS:
      return {
        ...state,
        loading: false,
        success: action.payload,
        error: '',
      };
    case REGISTRATION_FAILURE:
      return {
        ...state,
        loading: false,
        success: '',
        error: action.payload,
      };
    default:
      return state;
  }
}

const registrationStart = () => ({ type: REGISTRATION });
const registrationSuccess = (payload) => ({
  type: REGISTRATION_SUCCESS,
  payload,
});
const registrationFailure = (payload) => ({
  type: REGISTRATION_FAILURE,
  payload,
});

export const registration = (form) => async (dispatch) => {
  dispatch(registrationStart());
  try {
    const response = await userRequest.registration(form);
    dispatch(registrationSuccess(response));
  } catch (error) {
    dispatch(
      registrationFailure(
        `${error.response ? error.response.data.message : error}`
      )
    );
  }
};
