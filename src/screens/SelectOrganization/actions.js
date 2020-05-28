import axios from 'axios';

export function organizationsFetched(data) {
  return {
    type: "ORGANIZATIONS_FETCHED",
    payload: {
      data: data,
      fetching: false
    }
  };
}
export function organizationsFetching() {
  return {
    type: "ORGANIZATIONS_FETCHING",
    payload: {fetching: true}
  };
}
export function organizationsFetch(email) {
  return(dispatch) => {
    dispatch(organizationsFetching());
    axios.get('/api/v1/leader/organizations', {
      params: {
        email: email
      }
    }).then(function (response) {
      dispatch(organizationsFetched( response.data));
    }).catch(function (response) {
    });
  };
  /*return {
    type: "ORGANIZATIONS_FETCH"
  };*/
}
