import moment from 'moment/min/moment-with-locales'

const initialState = {

};

export default function (state:any = initialState, action:Function): State {
  if (action.type === "SUBSCRIPTIONS_FETCHED") {

    return {
      ...state,
      ...action.payload.events,
    };
  }

  if (action.type === "SUBSCRIPTION_STATE_LOADING" ){
    var sid = action.payload.subscription_id;
    var day = action.payload.day;
    var loading = action.payload.loading;
    var events = (state[sid]||{})
    return {
      ...state,
      [sid]: {
        ...events,
          [day]: {
            ...events[day],
            loading: loading
          }
        }
      }
    }


  if (action.type === "SUBSCRIPTION_STATE_CHANGED" || action.type === "WEBSOCKET:SUBSCRIPTION_STATE_CHANGED"){
    // var s;
    // var checkedOut = !action.payload.value;
    // var checkedIn = action.payload.value;
    // if(typeof action.payload.state === "undefined"){
    //   if(action.payload.value){ s = "now-present"}
    //   else{ s = "attended" }
    // }else{
    //   s = action.payload.state
    // }
    // if(action.payload.checkedInTime && action.payload.checkedOutTime){
    //   if(moment(`1970-01-01 ${action.payload.checkedOutTime}`).diff(`1970-01-01 ${action.payload.checkedInTime}`, "minutes") <= 9){
    //     s = "draft",
    //     action.payload.checkedOutTime = undefined;
    //     action.payload.checkedInTime = undefined;
    //     checkedOut = false;
    //     checkedIn = undefined;
    //   }
    // }
    var sid = action.payload.subscription_id;
    var day = action.payload.day;
    var events = (state[sid]||{})
    return {
      ...state,
      [sid]: {
        ...events,
        [day]: {
          ...events[day],
          checkedIn: action.payload.value,
          checkedOut: !action.payload.value,
          checkedInTime: action.payload.checkedInTime,
          checkedOutTime: action.payload.checkedOutTime,
          state: action.payload.state,
          loading: false
        }
      }
    }
  }



  return state;
}
