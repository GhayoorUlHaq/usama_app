const initialState = {
  "4xx_error": false,
  "500_error": false,
};

export default function (state:any = initialState, action:Function): State {

  if (action.type === "4XX_ERROR") {
    return {
      ...state,
      "4xx_error": true,
      "500_error": false,
    };
  }

  if (action.type === "500_ERROR") {
    return {
      ...state,
      "4xx_error": false,
      "500_error": true,
    };
  }

  if (action.type === "RESET_ERRORS") {
    return {
      ...state,
      "4xx_error": false,
      "500_error": false,
    };
  }
  return state;
}
