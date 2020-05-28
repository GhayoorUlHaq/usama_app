import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
import { subscriptionsFetch } from '../Subscriptions/actions';

export function activitiesFetched(date, activities) {
  return {
    type: "ACTIVITIES_FETCHED",
    payload: {
      date: date,
      activities: activities,
      fetching: false
    }
  };
}
export function activityFetched(id, data) {
  return {
    type: "ACTIVITY_FETCHED",
    payload: {
      id: id,
      data: data,
    }
  };
}
export function activitiesFetching() {
  return {
    type: "ACTIVITIES_FETCHING",
    payload: {fetching: true}
  };
}
export function initWebsocket(activity_id) {
  return {
    type: 'WEBSOCKET:CONNECT',
    payload: { channel: "SubscriptionEventChannel", activity_id: activity_id}
  };
}
export function currentDateChanged(date) {
  function thunk(dispatch){
    dispatch({
      type: "CURRENT_DATE_CHANGED",
      payload: {
        date: date
      }
    })
  }
  return thunk;
}
export function activitiesFetch(start_date, only_today) {
  function thunk(dispatch){
    dispatch(activitiesFetching());
    if(typeof start_date === "undefined")
      start_date = moment();
    var date = start_date.format("YYYY-MM-DD")
    var days_in_the_future = only_today ? 1 : 3;
    // Fetches activities for N days oin the future, to make it possible to use the app offline


    var index = 0;
 // for (var index = 0; index < days_in_the_future; index++) {
      axios.get('api/v1/activities', {params: {date: date}}).then(function (response) {
        response.data.activities.forEach((v) => {
          v.start_date = moment(v.start_date)
          v.end_date = moment(v.end_date)
          dispatch(activityFetched(v.id, v));
          dispatch(initWebsocket(v.id)); // RUN IT ONLY ON ACTIVE DAYS
          dispatch(subscriptionsFetch(v.id));
        })
        dispatch(activitiesFetched(response.data.date, response.data.activities.map((v) => { return v.id} )));


      }).catch(function (response) {
      });
      date = start_date.add({days: 1}).format("YYYY-MM-DD")

 // }
  };

  return thunk; // Return it afterwards
  /*return {
    type: "ACTIVITIES_FETCH"
  };*/
}
