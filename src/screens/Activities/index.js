// @flow
// Shows a list of activities for the selected days or jump automatically to the first day with an activity.
// The list contains the activities as returned by the backend and  meta activity (ALL) that contains all subs for the selected date.
// Once an item is selected we go to Subscriptions, passing the selected activity
import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, Platform, StatusBar } from "react-native";
import { Calendar as MonthCalendar } from "react-native-calendars";
import {
  Container,
  Header,
  Content,
  Text,
  Left,
  Right,
  Body,
  Button,
  Icon,
  View,
  Grid,
  Col,
  H1,
  Spinner,
  List,
  ListItem
} from "native-base";
import Activity from './activity';
import axios from 'axios';
//import { fetchActivitiesDetails } from "../../actions";
//import { subscriptionsListFetch, subscriptionsListSuccess, subscriptionsListFail } from '../../actions';
import { activitiesFetch, currentDateChanged } from "../../actions";
import PropTypes from 'prop-types'; // ES6
import AppStateCheckOnPastDate from '../../components/AppStateCheckOnPastDate'
import moment from 'moment/min/moment-with-locales'

import styles from "./styles";

const headerLogo = require("../../../assets/header-logo.png");
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
import {LocaleConfig} from 'react-native-calendars';

LocaleConfig.locales['nl'] = {
  monthNames: ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December'],
  monthNamesShort: ['Jan.','Feb.','Mrt.','Apr.','Mei','Jun.','Jul.','Aug.','Sept.','Okt.','Nov.','Dec.'],
  dayNames: ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'],
  dayNamesShort: ['zo','ma','di','wo','do','vrij','zat'],
  today: 'Vandaag'
};
LocaleConfig.defaultLocale = 'nl';
class Activities extends Component {
  constructor(props) {
    super(props);
    moment.locale(i18n.locale);
    this.state = {
      calendarOpen: false,
      date: moment(),
      loading: true,
      noValidDate: false,
      forceReload: 0,
    };
  }
  static childContextTypes = {
    navigation: PropTypes.object
  }
  getChildContext() {
    return {
      navigation: this.props.navigation
    };
  }
  componentDidMount(){
    // this.props.activitiesFetch()
    var that = this;
    //this.fetchActivities();
    axios.get('api/v1/activities/get_first_day_with_activity').then(function (response) {
      if(response.data.first_date){
        that.setState({ loading: false, noValidDate: false, calendarOpen: false, date: moment(response.data.first_date) });
        that.props.currentDateChanged(moment(response.data.first_date))

        if(that.props.network.isConnected)
          that.props.activitiesFetch(moment.utc(response.data.first_date));
      }else{
        that.setState({ loading: false, noValidDate: true});
        if(that.props.network.isConnected)
          that.props.activitiesFetch();
      }
    }).catch(function (response) {
      that.setState({ loading: false});
    });
  }
  componentWillReceiveProps(nextProps){
    var newForceReload = (nextProps.navigation.state.params||{}).forceReload || 0
      if(newForceReload > this.state.forceReload){
        this.setState({ loading: true, forceReload: newForceReload})
        var that = this;
        //this.fetchActivities();
        // axios.get('api/v1/activities/get_first_day_with_activity').then(function (response) {
        //   if(response.data.first_date){
        //     that.setState({ loading: false, noValidDate: false, calendarOpen: false, date: moment(response.data.first_date) });
        //     that.props.currentDateChanged(moment(response.data.first_date))
        //
        //     if(that.props.network.isConnected)
        //       that.props.activitiesFetch(moment.utc(response.data.first_date));
        //   }else{
        //     that.setState({ loading: false, noValidDate: true});
        //   }
        // }).catch(function (response) {
        // });
      }
  }

  onDateChange(date) {
    this.setState({ date: moment.utc(date.dateString), calendarOpen: false });
    this.props.currentDateChanged(moment.utc(date.dateString))

    if(this.props.network.isConnected)
      this.props.activitiesFetch(moment.utc(date.dateString));
  }
  openCalendar(){
    this.setState({calendarOpen: true});
  }
  renderActivities(){
    var activities = this.props.activities.list[this.state.date.format('YYYY-MM-DD')]
    var isConnected = this.props.network.isConnected;
    if(typeof activities === "undefined"){
      if(!isConnected)
        return [(<Text key={0} style={{color: "#333", textAlign: "center", paddingTop: 20, paddingLeft: 30, paddingRight: 30}}>Not connected: data non available in cache</Text>)]
      else
        return [(<Spinner key={0}/>)]
    }

    if(activities.length === 0)
      return [(<Text key={0} style={{color: "#333", textAlign: "center", paddingTop: 20, paddingLeft: 25, paddingRight: 25}}>
          {i18n.t("no_activities")}
        </Text>),(<View key={2}
          style={{
            margin: 10,
            marginTop: 20,
            borderBottomColor: '#fff',
            borderBottomWidth: 1,
          }}
        />),
        (<Text key={1} style={{color: "#333", textAlign: "center", paddingTop: 20, paddingLeft: 25, paddingRight: 25}}>
          {i18n.t("click_on_date")}
        </Text>)];

    var that = this
    elems = activities.map(function(id, i){
      return (<Activity activity={that.props.activities.details[id]} date={that.state.date} key={id}/>)
    })
    elems.unshift((<Activity all={true}  activitiesList={activities.map(function(id, i){return id})} date={that.state.date} key={0} style={{color: "#333"}}/>))
    return elems;
  }

  render() {
    const navigation = this.props.navigation;
    const primary = require("../../theme/variables/commonColor").brandPrimary;
    if(this.state.loading){
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent style={styles.btnHeader} onPress={() => navigation.openDrawer()} >
                <Icon active name="menu" />
              </Button>
            </Left>
            <Body style={{minWidth: 200}}>
              <Text >{i18n.t("looking_for_first_date")}</Text>
            </Body>
            <Right>

            </Right>
          </Header>


          <Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
          >
            <Spinner/>
          </Content>
        </Container>
      )
    }else{
      return (
        <Container>
          <Header>
            <Left>
              <Button transparent style={styles.btnHeader} onPress={() => navigation.openDrawer()} >
                <Icon active name="menu" />
              </Button>
            </Left>
            <Body style={{minWidth: 200}}>
              <Text onPress={() => this.openCalendar() }>{moment(this.state.date).format("dd DD/MM")}</Text>
            </Body>
            <Right>

            </Right>
          </Header>
          <AppStateCheckOnPastDate navigation={navigation} />


          <Content
            showsVerticalScrollIndicator={false}
            style={{ backgroundColor: "#fff" }}
          >
            { this.state.calendarOpen &&
              <View style={styles.bg}>
                <MonthCalendar
                                selected={[this.state.date.format('YYYY-MM-DD')]}
                                minDate={moment().subtract(1, 'months').format('YYYY-MM-DD')}
                                maxDate={moment().add(this.props.session.max_days_in_the_future, 'days').format('YYYY-MM-DD')}
                                onDayPress={this.onDateChange.bind(this)}
                                firstDay={1}
                />
              </View>
            }
            { this.state.noValidDate ?
              <Text key={1} style={{color: "#333", textAlign: "center", paddingTop: 20, paddingLeft: 25, paddingRight: 25}}>
                {i18n.t("no_activity_assigned")}
              </Text>
              :
              <Content>
                <Text style={{color: "#aaa", textAlign: "center", paddingTop: 5, paddingLeft: 25, paddingRight: 25}} onPress={() => this.openCalendar() }>
                  {i18n.t("change_date")}
                </Text>
                <List>
                  <ListItem itemHeader first>
                    <Text style={styles.listHeader}>{i18n.t("overview")}</Text>
                  </ListItem>
                  {this.renderActivities()}
                </List>
              </Content>
            }


          </Content>
        </Container>
      );
    }
  }
}
function bindActions(dispatch) {
  return {
    activitiesFetch: (date) => dispatch(activitiesFetch(date)),
    currentDateChanged: (date) => dispatch(currentDateChanged(date))
  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network,
  organizations: state.organizations,
  activities: state.activities
});
export default connect(mapStateToProps, bindActions)(Activities);
