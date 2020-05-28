const initialState = {
  list: {},
  details: {},
  fetching: false,
  error: null
};

export default function (state:any = initialState, action:Function): State {

  if (action.type === "ACTIVITIES_FETCHED") {
    details = {}
    action.payload.activities.forEach((i) => {
      details[i] = {fetching: true}
    })
    return {
      ...state,
      list: {
        ...state.list,
        [action.payload.date]: action.payload.activities
      },
      fetching: action.payload.fetching
    };
  }

  if (action.type === "ACTIVITIES_FETCHING") {
    return {
      ...state,
      fetching: action.payload.fetching
    };
  }

  if (action.type === "ACTIVITY_FETCHED") {
    return {
      ...state,
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
