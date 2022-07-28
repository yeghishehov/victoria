import { combineReducers } from 'redux';
import app from './modules/app';
// import flowers from './modules/flowers';
// import users from './modules/users';
// import orders from './modules/orders';

// import registration from './modules/registration';
import authorization from './modules/authorization';

export default combineReducers({
  app,
  // flowers,
  // users,
  // orders,
  // registration,
  authorization,
});
