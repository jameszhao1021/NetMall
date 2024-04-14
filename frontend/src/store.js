// import { createStore, applyMiddleware } from 'redux';
// import { composeWithDevTools} from 'redux-devtools-extension';
// import  { thunk }  from 'redux-thunk';
// import rootReducer from './reducers'

// const initialState = {}
// const  middleware = [thunk]
// const store = createStore(
//     rootReducer,
//     initialState,
//     composeWithDevTools(applyMiddleware(...middleware))
// );

// export default store


import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';

const store = configureStore({
  reducer: rootReducer,
  // Optionally, you can provide middleware here as well
});

export default store;