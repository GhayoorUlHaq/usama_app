import React, { Component } from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Item, Icon, View, List, ListItem,  Spinner, Left, Right, Body } from 'native-base';
import axios from 'axios';

import styles from './styles';
import PropTypes from 'prop-types'; // ES6

import { fetchActivityDetails } from './actions';
//import { subscriptions_list_fetch, subscriptions_list_ok, subscriptions_list_fail } from '../../actions/subscriptions';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
class Activity extends Component {
  static propTypes = {
    fetchActivityDetails: PropTypes.func,
    activity: PropTypes.object
  }
  static contextTypes = {
    navigation: PropTypes.object
  }

  componentDidMount(){
    if(this.props.all){
      return;
    }
    //this.props.fetchActivityDetails(this.props.activityId);
  }

  activityName(activities){
    if(this.props.all){
      return i18n.t("all_activities");
    }

    return activities.details[this.props.activityId+""].name
  }

  activityFetching(activities){
    if(this.props.all){
      return false;
    }
    return activities.details[this.props.activityId+""].fetching
  }

  onActivitySelect(all, list){
    this.context.navigation.navigate("Subscriptions", {all: all, list: list, activity: this.props.activity, date: this.props.date });
  }

  render() {
    if(this.props.all){
      return (
        <ListItem key={this.props.key} icon button onPress={() => this.onActivitySelect(true, this.props.activitiesList)}>
              <Body>
                <Text style={{color: "#333"}}>{i18n.t("all_activities")}</Text>
              </Body>
              <Right>
                <Icon name="ios-arrow-forward" />
              </Right>
        </ListItem>
      )
    }else{
      return (
        <ListItem key={this.props.key} icon button onPress={() => this.onActivitySelect(false, [])}>
              <Body>
                {this.props.activity.fetching ? <Spinner /> :
                <Text style={{color: "#333"}}>{this.props.activity.name} - {this.props.activity.location_name}</Text>}
              </Body>
              <Right>
                <Icon name="ios-arrow-forward" />
              </Right>
        </ListItem>
      );
    }
  }
}
function bindAction(dispatch) {
  return {
  /*  fetchActivityDetails: (id) => dispatch(fetchActivityDetails(id)),
    subscriptions_list_fetch: (actId) => dispatch(subscriptions_list_fetch(actId)),
    subscriptions_list_ok: (actId, payload) => dispatch(subscriptions_list_ok(actId, payload)),
    subscriptions_list_fail: (actId) => dispatch(subscriptions_list_fail(actId))*/
  };
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  activities: state.activities,
});

export default connect(mapStateToProps, bindAction)(Activity);
