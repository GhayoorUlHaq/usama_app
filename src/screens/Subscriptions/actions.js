import axios from 'axios';
import moment from 'moment/min/moment-with-locales'
import uuidv4 from 'uuid/v4';

export function subscriptionsFetched(a_id, data) {
  return {
    type: "SUBSCRIPTIONS_FETCHED",
    payload: {
      activity_id: a_id,
      subscriptions_ids: data.subscriptions_ids,
      subscriptions: data.subscriptions,
      persons: data.persons,
      events: data.events,
      comments: data.comments
    }
  };
}

export function subscriptionsFetching(activity_id) {
  return {
    type: "SUBSCRIPTIONS_FETCHING",
    payload: {fetching: true}
  };
}
export function subscriptionLoading(activity, subscription, loading) {
  return {
    type: "SUBSCRIPTION_LOADING",
    payload: {activity, subscription, loading}
  };
}

export function subscriptionStateChanged(activity_id, data) {
  return {
    type: "SUBSCRIPTION_STATE_CHANGED",
    payload: {
      ...data,
      activity_id: activity_id,
    }
  };
}
export function subscriptionStateLoading(activity_id, subscription_id, day, loading){
  return {
    type: "SUBSCRIPTION_STATE_LOADING",
    payload: {
      subscription_id,
      day,
      activity_id,
      loading
    }
  };
}


export function subscriptionsFetch(activity_id) {
  return(dispatch) => {
    dispatch(subscriptionsFetching());

    axios.get('api/v1/activities/'+activity_id+'/subscriptions', {}).then(function (response) {
      dispatch(subscriptionsFetched(activity_id, response.data));
    }).catch(function (response) {
    });
  };
}

export function subscriptionStateChange(activityId, subscriptionId, participantId, day, value){
  function thunk(dispatch){
    var action = value ? 'checkin' : 'checkout'

    axios.put("api/v1/activities/"+activityId+"/subscriptions/"+subscriptionId+"/"+action, {participant: participantId, day: day, timestamp: moment()}).then(function(response){
      dispatch(subscriptionStateChanged(activityId, response.data));
    }).catch(function (response) {
    });
  };
  thunk.interceptInOffline = true;
  thunk.meta = { activityId, subscriptionId, participantId, day, value, retry: true, orig: "subscriptionStateChange" };
  return thunk;
}
export function subscriptionCustomIconChange(activity, subscription, icons){
  function thunk(dispatch){
    dispatch(subscriptionLoading(activity, subscription, true));

    axios.put("api/v1/activities/"+activity.id+"/subscriptions/"+subscription.id+"/custom_icons", {icons: icons}).then(function(response){
      dispatch(subscriptionCustomIconChanged(activity, subscription, icons));
    }).catch(function (response) {
    });
  };
  thunk.interceptInOffline = true;
  thunk.meta = { retry: true };
  return thunk;
}
export function subscriptionCustomIconChanged(activity, subscription, icons){
  return {
    type: "SUBSCRIPTION_CUSTOM_ICON_CHANGED",
    payload: {
      activity, subscription, icons
    }
  }
}

export function subscriptionPushComment(activity, subscription, message, commented_on, person){
  var uuid = uuidv4();

  function thunk(dispatch){
    axios.put("api/v1/activities/"+activity.id+"/subscriptions/"+subscription.id+"/comments", {uuid, message, commented_on}).then(function(response){
      dispatch(subscriptionCommentPushed(uuid, activity, subscription, message, commented_on, person));
    }).catch(function (response) {
    });
  };
  thunk.interceptInOffline = true;
  thunk.meta = { uuid, activity, subscription, message, commented_on, person, retry: true, orig: "subscriptionPushComment" };
  return thunk;
}

export function subscriptionCommentPushed(uuid, activity, subscription, message, commented_on, person){
  return {
    type: "SUBSCRIPTION_COMMENT_PUSHED",
    payload: {
      uuid, subscription, person, message, commented_on: commented_on.format()
    }
  }
}
