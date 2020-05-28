// @flow
// This screen shows a list of subscriptions in 3 tabs (ALL|IN|OUT). The search is scoped to the selected tab.
// This screen has to render a large list of complex items, so extra effor was made to keep it fast.
import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, ImageBackground, Platform, StatusBar } from "react-native";
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
  Item,
  Input,
  Tabs,
  Tab
} from "native-base";
import SubscriptionsList from "./subscriptionsList";
import TabThree from "./tabThree";
import truncate from 'voca/truncate';
import PropTypes from 'prop-types'; // ES6
import AppStateCheckOnPastDate from '../../components/AppStateCheckOnPastDate';
import moment from 'moment/min/moment-with-locales'

import axios from 'axios';

import styles from "./styles";

const headerLogo = require("../../../assets/header-logo.png");
const bg = require("../../../assets/bg-transparent.png");
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';

class Subscriptions extends Component {
  static childContextTypes = {
    organizations: PropTypes.array,
    email: PropTypes.string,
    navigation: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
    this.state = {
      activity: null,
      searchString: "",
      searchOpen: false,
      filtered: [],
    }
  }

  componentWillMount(){
    this.setState({all: this.props.navigation.state.params.all, list: this.props.navigation.state.params.list,
      activity: this.props.navigation.state.params.activity, date: this.props.navigation.state.params.date})
  }
  componentDidMount(){
    if(this.props.network.isConnected){
      //this.props.fetchOrganization(this.props.navigation.state.params.email);
    }
  }

  getChildContext() {
    return {
      organizations: this.props.organizations.list,
      email: this.props.email,
      navigation: this.props.navigation
    };
  }
  openSearch(){
    this.setState({searchOpen: true})
  }
  closeSearch(){
    this.setState({searchOpen: false})
  }
  search(searchString){
    if(searchString===""){
      this.setState({searchOpen: false})
    }
    this.setState({searchString});
  }

  filtered(type){
    var that = this;
    var day = this.state.date.format("YYYY-MM-DD");
    if(this.state.all){
      var subs = [];
      this.state.list.forEach((id) => {
        (this.props.subscriptions.list[id+""]||[]).forEach((sid) => {
          subs.push(this.props.subscriptions.details[id+""][sid])
        })
      })
    }else{
      var subs = (this.props.subscriptions.list[this.state.activity.id+""]||[]).map((sid) => {
        return this.props.subscriptions.details[this.state.activity.id+""][sid]
      })
    }

    //Object.values(this.props.subscriptions.details[this.state.activity.id+""]||{});
    return subs.filter(function(e){
      p = that.props.persons[e.participant_id]
      evt = (that.props.events[e.id]||{})[day]||{}
      show = false;
      if(type === "all")
        show = true;
      else if(type === "checkedin" && evt.state === "now-present")
        show = true;
      else if(type === "checkedout" && evt.state !== "now-present")
        show = true;
      return p.name.toLowerCase().includes(that.state.searchString.toLowerCase()) && show
    });
  }

  renderHeader(){
    var activityName = ""
    if(this.state.all){
      activityName = i18n.t("all_activities")
    }else{
      activityName = truncate(this.state.activity.name, 35, "...")
    }

    if(this.state.searchOpen){
      return(
        <Header hasTabs searchBar rounded>
            <Item>
              <Icon name="ios-search" />
              <Input placeholder="Search" placeholderTextColor="rgba(255,255,255,0.5)"
                     style={styles.input} value={this.state.searchString}
                     onChangeText={(searchString) => this.search(searchString)}
                     autoFocus={true} clearButtonMode="always"/>
            </Item>
            <Button transparent onPress={() => this.closeSearch()} >
              <Icon active name="close" />
            </Button>
        </Header>
      );
    }else{
      return (
        <Header hasTabs >
            <Left>
              <Button
                transparent
                style={styles.btnHeader}
                onPress={() => this.props.navigation.goBack()}
              >
                <Icon active name="arrow-back" />
              </Button>
            </Left>
            <Body style={{minWidth: 200}}>
              <Text>{this.state.date.format("(DD/MM)")} {activityName}</Text>
            </Body>
            <Right>
              <Button transparent style={styles.btnHeader} onPress={() => this.openSearch()} >
                <Icon active name="search" />
              </Button>
            </Right>
          </Header>
      );
    }
  }
  render() {
    const navigation = this.props.navigation;
    const primary = require("../../theme/variables/commonColor").brandPrimary;

    return (
      <Container>
        <AppStateCheckOnPastDate navigation={navigation} />

        <ImageBackground source={bg} style={styles.container}>
        {this.renderHeader()}
        <Content
          scrollEnabled={false}
          extraScrollHeight={-13}
          contentContainerStyle={styles.commentHeadbg}
        >
          <Tabs style={{ backgroundColor: "#fff" }} >
            <Tab heading={`${i18n.t("all")} (${this.filtered('all').length})`} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
              {(this.props.fetching && this.props.network.isConnected) ? <Spinner /> :
                <SubscriptionsList type="all" activity={this.state.activity} subscriptions={this.filtered('all')} date={this.state.date} searchString={this.state.searchString}/>
              }
            </Tab>
            <Tab heading={`${i18n.t("in")} (${this.filtered('checkedin').length})`} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
              {(this.props.fetching && this.props.network.isConnected) ? <Spinner /> :
                <SubscriptionsList type="in" activity={this.state.activity} subscriptions={this.filtered('checkedin')} date={this.state.date} searchString={this.state.searchString}/>
              }
            </Tab>
            <Tab heading={`${i18n.t("out")} (${this.filtered('checkedout').length})`} tabStyle={styles.tabStyle} activeTabStyle={styles.tabStyle}>
              {(this.props.fetching && this.props.network.isConnected) ? <Spinner /> :
                <SubscriptionsList type="out" activity={this.state.activity} subscriptions={this.filtered('checkedout')} date={this.state.date} searchString={this.state.searchString}/>
              }
            </Tab>
          </Tabs>
        </Content>
      </ImageBackground>
      </Container>
    );
  }
}

function bindActions(dispatch) {
  return {
    fetchOrganization: email => dispatch(organizationsFetch(email))
  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network,
  organizations: state.organizations,
  subscriptions: state.subscriptions,
  persons: state.persons,
  fetching: state.activities.fetching,
  events: state.events
});
export default connect(mapStateToProps, bindActions)(Subscriptions);
