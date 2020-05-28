




The files in screens/unused are not needed we kept them around to cannibalize code as needed. They can be removed.

in src/boot/env.js there are the ENV variables. To test with a local instance of KA change the domain

EXPO (check expo changelog when updating the SDK, likely you will need to bump the react-native version)
https://docs.expo.io/versions/latest/workflow/expo-cli/
- install expo cli (the same version of the SDK we have specified in package.json)
- expo login

# to test locally
npm start (then scan QRcode)

# to publish
expo build:ios
expo build:android

Once the build completes an url to the ipa/apk will be returned
Upload the file to the respective app stores.

STATE

{
  session: sessionReducer,
  organizations: organizationsReducer,
  activities: activitiesReducer,
  subscriptions: subscriptionsReducer,
  errors: errors,
  persons,
  events,
  network
}


SESSION

{
  email: action.payload.email,
  host: action.payload.host,
  organization_id: action.payload.organization_id,
  organization_name: action.payload.organization_name,
  organization_logo: action.payload.organization_logo,
  leader_info_for_leader_url: action.payload.leader_info_for_leader_url,
  itemPodioId: action.payload.item_podio_id,
  autologin_token: action.payload.autologin_token,
  with_dummy_leaders: action.payload.with_dummy_leaders,
  embed_url: action.payload.embed_url,
  token: action.payload.token,
  icons: action.payload.icons,
  custom_icons: action.payload.custom_icons,
  sort_by: action.payload.sort_by,
  comments_alert: action.payload.comments_alert,
  fullname: action.payload.fullname,
  profile_picture: action.payload.profile_picture,
  gender: action.payload.gender,
  options_icons: action.payload.options_icons,
  show_paid_icon: action.payload.show_paid_icon,
  userSignedIn: true
};

ORGANIZATIONS
{
  list: [], //List of objects that describes the org
  fetching: false,
  error: null
}


ACTIVITIES

{
  list: {}, //Light weight used to render the list of activities
  details: {}, // Detailed version used in the subscriptions
  fetching: false,
  error: null
};

SUBSCRIPTIONS
{
  list: {}, //Contains only the ids
  details: {},
  comments: {},
  fetching: false,
  error: null
};

events

Contanis an hash indexed by subscription id and day of the checkin/out events
