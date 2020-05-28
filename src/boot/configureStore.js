// @flow
import { AsyncStorage } from "react-native";
import Promise from 'promise';
import devTools from "remote-redux-devtools";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
//import { createNetworkMiddleware } from 'react-native-offline';
import { persistStore, persistReducer } from 'redux-persist'
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import hardSet from 'redux-persist/lib/stateReconciler/hardSet'
import storage from 'redux-persist/lib/storage';
import websocketMiddleware from "./websocket_middleware";
import offlineDispatch from "./offlineDispatch";
import logger from 'redux-logger'
import reducer from "../reducers";
import axios from 'axios';
import { composeWithDevTools } from 'remote-redux-devtools';

import {API_URL} from "./env"
const persistConfig = {
  key: 'root22',
  storage,
  // stateReconciler: hardSet,
  stateReconciler: autoMergeLevel2,
  blacklist: ['errors']//, 'activities', 'subscriptions']
}
//const networkMiddleware = createNetworkMiddleware();
const persistedReducer = persistReducer(persistConfig, reducer)

export default function configureStore(onCompletion: () => void): any {
  const enhancer = composeWithDevTools(
    //applyMiddleware(networkMiddleware),
    applyMiddleware(thunk),
    applyMiddleware(websocketMiddleware),
    applyMiddleware(offlineDispatch),
    applyMiddleware(logger),
  );
  const persistConfig = {
    key: 'root',
    storage,
  }
  const store = createStore(persistedReducer, enhancer);
  //const store = createStore(reducer, enhancer);
  let persistor = persistStore(store)
  //persistor.purge()

  const setSetupAxios = function(state){
    //console.log(state)
    axios.defaults.baseURL = API_URL;
    axios.defaults.headers.common['X-Podio-Id'] = state.session.itemPodioId;
    axios.defaults.headers.common['X-Token'] =  state.session.token;
    axios.defaults.headers.common['X-Organisation-Id'] =  state.session.organization_id;
  }

  store.subscribe(function(){
    var state = store.getState();
    setSetupAxios(state);
  });
  axios.interceptors.response.use(null, function(err) {
    if(!store.getState().network.isConnected){
      return Promise.reject(err);
    }
    if(err.response.status === 401 || err.response.status === 404) {
      store.dispatch({type: "4XX_ERROR"});
    }
    if(err.response.status === 500) {
      store.dispatch({type: "500_ERROR"});
    }
    return Promise.reject(err);
  });

  return { store, persistor };
  //return { store };
}
