import moment from 'moment/min/moment-with-locales'

const initialState = {
  list: {},
  details: {},
  comments: {},
  fetching: false,
  error: null
};

export default function (state:any = initialState, action:Function): State {
  if (action.type === "SUBSCRIPTIONS_FETCHED") {


    action.payload.subscriptions_ids.forEach(function(sid){
      var comments = action.payload.comments[sid]
      comments = (comments||[]).map(function(c){
          return {...c, commented_on: moment(c.commented_on)};
        } ).sort(function(a, b){ return a.commented_on.diff(b.commented_on)})
      action.payload.comments[sid] = comments
    })
    return {
      ...state,
      list: {
        ...state.list,
        [action.payload.activity_id]: action.payload.subscriptions_ids
      },
      details: {
        ...state.details,
        [action.payload.activity_id]: action.payload.subscriptions
      },
      comments: {
        ...state.comments,
        ...action.payload.comments
      }
    };
  }


  if (action.type === "SUBSCRIPTION_CUSTOM_ICON_CHANGED"){
    return {
      ...state,
      details: {
        ...state.details,
        [action.payload.activity.id]: {
          ...state.details[action.payload.activity.id],
          [action.payload.subscription.id]: {
            ...state.details[action.payload.activity.id][action.payload.subscription.id],
            check_in_out_custom_icon_codes: action.payload.icons,
            loading: false
          }
        }
      }
    }
  }

  if (action.type === "SUBSCRIPTION_LOADING"){
    return {
      ...state,
      details: {
        ...state.details,
        [action.payload.activity.id]: {
          ...state.details[action.payload.activity.id],
          [action.payload.subscription.id]: {
            ...state.details[action.payload.activity.id][action.payload.subscription.id],
            loading: action.payload.loading
          }
        }
      }
    }
  }
  if (action.type === "SUBSCRIPTION_COMMENT_PUSHED" || action.type === "WEBSOCKET:SUBSCRIPTION_COMMENT_PUSHED"){
    var duplicated = (state.comments[action.payload.subscription.id]||[]).filter(function(e){
      return e.uuid === action.payload.uuid
    }).length > 0

    if(duplicated)
      return state;

    var comments = [
        ...(state.comments[action.payload.subscription.id]||[]),
        {
          uuid: action.payload.uuid,
          person: action.payload.person,
          message: action.payload.message,
          commented_on: action.payload.commented_on
        }
    ]
    comments = (comments||[]).map(function(c){
      return {...c, commented_on: moment(c.commented_on)};
    } ).sort(function(a, b){ return a.commented_on.diff(b.commented_on)})

    return {
      ...state,
      comments: {
        ...state.comments,
        [action.payload.subscription.id]: comments
      }
    }
  }
  if (action.type === "SUBSCRIPTIONS_FETCHING") {
    return {
      ...state,
      fetching: action.payload.fetching
    };
  }

  if (action.type === "SUBSCRIPTION_LOADING") {
    return {
      ...state,
      fetching: action.payload.fetching
    };
  }

  if (action.type === "SUBSCRIPTION_FETCHED") {
    return {
      ...state,
      // details: {
      //   ...state.details,
      //   pa
      // },
      details: {
        ...state.details,
        [action.payload.id]: {
          ...action.payload.data,
          fetching: false
        }
      }
    };
  }

  return state;
}
