import { createStore, applyMiddleware } from 'redux';
import think from 'redux-thunk';
import rootReducer from '../store';
const initialState = {};

const store = createStore(rootReducer, initialState, applyMiddleware(think));

export default store;
