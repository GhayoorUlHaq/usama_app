const initialState = {
  email: null,
  userSignedIn: false,
  host: null,
  itemPodioId: null,
  token: null,
  currentActivityDate: null
};

export default function (state:any = initialState, action:Function): State {
  if (action.type === "LOGIN") {
    return {
      ...state,
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
      show_gdpr_icon: action.payload.show_gdpr_icon,
      max_days_in_the_future: action.payload.max_days_in_the_future || 31,
      userSignedIn: true
    };
  }

  if (action.type === "CURRENT_DATE_CHANGED") {
    return {
      ...state,
      currentActivityDate: action.payload.date
    }
  }

  return state;
}
