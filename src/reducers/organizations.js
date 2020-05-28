const initialState = {
  list: [],
  details: {},
  fetching: false,
  error: null
};

export default function (state:any = initialState, action:Function): State {
  if (action.type === "ORGANIZATIONS_FETCHED") {
    return {
      ...state,
      list: action.payload.data,
      fetching: action.payload.fetching
    };
  }

  if (action.type === "ORGANIZATIONS_FETCHING") {
    return {
      ...state,
      fetching: action.payload.fetching
    };
  }
  return state;
}
