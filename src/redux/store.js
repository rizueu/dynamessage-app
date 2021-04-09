import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import {persistStore} from 'redux-persist';

import rootReducers from './reducers';

const persistedStore = () => {
  let store = createStore(rootReducers, applyMiddleware(thunk, logger));
  let persistor = persistStore(store);
  return {store, persistor};
};

export default persistedStore;
