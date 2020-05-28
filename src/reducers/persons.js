import moment from 'moment/min/moment-with-locales'

const initialState = {
};

export default function (state:any = initialState, action:Function): State {
  if (action.type === "SUBSCRIPTIONS_FETCHED") {
    return {
      ...state,
      ...action.payload.persons
    };
  }

  return state;
}
