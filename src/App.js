// @flow
import React, { Component } from "react";
import { createStackNavigator, createDrawerNavigator } from "react-navigation";
import { Root } from "native-base";
import { connect,  } from 'react-redux';
import Login from "./screens/Login/";
import SelectOrganization from "./screens/SelectOrganization";
import PromptPassword from "./screens/PromptPassword";
import ForgotPassword from "./screens/ForgotPassword";
import Activities from "./screens/Activities";
import Subscriptions from "./screens/Subscriptions";
import PersonProfile from "./screens/PersonProfile";
import {STATUS_ENDPOINT} from "./boot/env"
import { activitiesFetch } from './screens/Activities/actions';
import moment from 'moment/min/moment-with-locales'

import Sidebar from "./screens/Sidebar";
import { Text, Toast } from "native-base";

/*import SignUp from "./screens/SignUp/";
import Walkthrough from "./screens/Walkthrough/";
import Comments from "./screens/Comments/";
import Channel from "./screens/Channel";
import Story from "./screens/Story";
import Home from "./screens/Home/";
import Channels from "./screens/Channels";
import Overview from "./screens/Overview";
import Calendar from "./screens/Calendar/";
import Timeline from "./screens/Timeline";
import Feedback from "./screens/Feedback/";
import Profile from "./screens/Profile/";
import Settings from "./screens/Settings";*/

//import { withNetworkConnectivity } from 'react-native-offline';

import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from './i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
const Drawer = createDrawerNavigator(
  {
    Activities: { screen: Activities },
    /*Home: { screen: Home },
    Channels: { screen: Channels },
    Overview: { screen: Overview },
    Calendar: { screen: Calendar },
    Timeline: { screen: Timeline },
    Feedback: { screen: Feedback },
    Profile: { screen: Profile },
    Settings: { screen: Settings }*/
  },
  {
    initialRouteName: "Activities",
    contentComponent: props => <Sidebar {...props} />
  }
);

const App = createStackNavigator(
  {
    Login: { screen: Login },
    PromptPassword: {screen: PromptPassword },
    SelectOrganization: { screen: SelectOrganization },
  //  Activities: { screen: Activities },
    Subscriptions: {screen: Subscriptions},
    PersonProfile: {screen: PersonProfile },
    Drawer: { screen: Drawer }
  /*  SignUp: { screen: SignUp },
    ForgotPassword: { screen: ForgotPassword },
    Walkthrough: { screen: Walkthrough },
    Story: { screen: Story },
    Comments: { screen: Comments },
    Channel: { screen: Channel },
    Drawer: { screen: Drawer }*/
  },
  {
    index: 0,
    initialRouteName: "Login",
    headerMode: "none"
  }
);

class MainComponent extends Component {
  componentDidUpdate(){
    if(this.props.errors["4xx_error"] === true){
      Toast.show({
              text: 'Unauthorized request',
              position: 'top',
              buttonText: 'Dismiss',
              duration: 5000,
            })
      this.props.resetErrors();
      return
    }

    if(this.props.errors["500_error"] === true){
      Toast.show({
              text: 'Server Error',
              position: 'top',
              buttonText: 'Dismiss',
              duration: 5000,
            })
      this.props.resetErrors()
      return
    }
  }

  componentWillMount() {
    this._interval = setInterval(() => {
      console.log("timer")
      var isConnected = this.props.network.isConnected;
      if(this.props.currentDate && isConnected){
        this.props.activitiesFetch(moment(this.props.currentDate))
      }
    }, 10*60*1000);
  }
  componentWillUnmount() {
    clearInterval(this._interval);
  }
  render(){
    return (
      <Root>
        <App/>
        {
          !this.props.network.isConnected &&
          <Text style={{backgroundColor: "#f0ad4e", color: "#333", textAlign: "center", fontSize: 12, paddingTop: 5, paddingBottom: 5}}>
            {i18n.t("offline_mode_message")}
          </Text>
        }
      </Root>
    )
  }
}
const mapStateToProps = state => ({
  network: state.network,
  errors: state.errors,
  currentDate: state.session.currentActivityDate
});
function bindActions(dispatch) {
  return {
    resetErrors: () => {type: "RESET_ERRORS"},
    activitiesFetch: (date) => dispatch(activitiesFetch(date, true))
  };
}
export default connect(mapStateToProps, bindActions)(MainComponent);
