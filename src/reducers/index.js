import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import { reducer as network } from 'react-native-offline';

//import homeReducer from "../screens/Home/reducer";
import sessionReducer from "./session";
import organizationsReducer from "./organizations";
import activitiesReducer from "./activities";
import subscriptionsReducer from "./subscriptions";
import errors from "./errors";
import events from './events';
import persons from './persons';

const appReducer = combineReducers({
  form: formReducer,
  session: sessionReducer,
  organizations: organizationsReducer,
  activities: activitiesReducer,
  subscriptions: subscriptionsReducer,
  errors: errors,
  persons,
  events,
  network
});


export default (state, action) => {
  if (action.type === 'LOGOUT') {
    state = undefined
  }

  return appReducer(state, action)
}
