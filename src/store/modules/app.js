const CHANGE_PAGE = 'CHANGE_PAGE';

const initialState = {
  selectedPage: 'stock',
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CHANGE_PAGE:
      return {
        ...state,
        selectedPage: action.payload,
      };
    default:
      return state;
  }
}

export const changePage = (page) => ({ type: CHANGE_PAGE, payload: page });
