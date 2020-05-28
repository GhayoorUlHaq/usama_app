// All ajax request are queued when the app is offline and triggered once the app comes back online.
// All PK are uuid so there is no issue with key collision. 

import { offlineActionTypes } from 'react-native-offline';
import { subscriptionStateChanged, subscriptionCommentPushed } from '../screens/Subscriptions/actions';
import { activitiesFetch, initWebsocket } from '../screens/Activities/actions';

import moment  from 'moment-timezone';
export default store => next => action => {
  if(action.type === offlineActionTypes.CONNECTION_CHANGE && action.payload){
    activitiesFetch(moment(store.getState().session.currentActivityDate), true)
    console.log("CONNECTION_CHANGE", action);
  }else if(action.type === offlineActionTypes.FETCH_OFFLINE_MODE){
    switch (action.meta.orig) {
      case "subscriptionStateChange":
        evt = store.getState().events[action.meta.subscriptionId][action.meta.day]
        console.log(evt)
        var state = evt.state;
        var checkedInTime = evt.checkedInTime;
        var checkedOutTime = evt.checkedOutTime;
        if(evt.state !== "now-present" && action.meta.value){
          state = "now-present"
          checkedInTime = moment();
          checkedOutTime = null;
        }else if(evt.state === "now-present" && !action.meta.value){
          console.log(moment().tz('Europe/Rome').diff(moment(evt.checkedInTime), "minutes"));
          if(moment().tz('Europe/Rome').diff(moment(evt.checkedInTime), "minutes") < 10){
            state = "draft"
            checkedInTime = null;
            checkedOutTime = null;
          }else{
            checkedInTime = evt.checkedInTime
            checkedOutTime = moment();
            state = "attended"
          }
        }
        console.log(moment())
        store.dispatch(subscriptionStateChanged(action.meta.activityId, {
          day: action.meta.day,
          subscription_id: action.meta.subscriptionId,
          value: action.meta.value,
          state: state,
          checkedInTime: checkedInTime,//.tz("Europe/Berlin").format("HH:mm"),
          checkedOutTime: checkedOutTime//.tz("Europe/Berlin").format("HH:mm"),
        }));
        break;
      default:

    }
  }

  return next(action);
};
