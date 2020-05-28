// @flow
import React, { Component } from "react";
import {AppState} from 'react-native'
import moment from 'moment/min/moment-with-locales'
import { connect } from 'react-redux';

class AppStateCheckOnPastDate extends Component {
  constructor(props){
    super(props);
    this.state =  {
      appState: AppState.currentState
    }
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange = (nextAppState) => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if(this.props.currentDate.year() < moment().year()){
        this.setState({appState: nextAppState});
        this.props.navigation.navigate("Activities", {forceReload: moment().valueOf()});
        return;
      }

      if(this.props.currentDate.year() === moment().year() && this.props.currentDate.dayOfYear() < moment().dayOfYear()){
        this.setState({appState: nextAppState});
        this.props.navigation.navigate("Activities", {forceReload: moment().valueOf()})
        return;
      }

    }
    this.setState({appState: nextAppState});
  }

  render() {
    return (null);
  }
}
const mapStateToProps = state => ({
  currentDate: moment(state.session.currentActivityDate)
});
function bindActions(dispatch) {
  return {
  };
}
export default connect(mapStateToProps, bindActions)(AppStateCheckOnPastDate);
