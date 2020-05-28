import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { connect } from 'react-redux';
import truncate from 'voca/truncate';
import { Container, Content, Text, List, Left, Body, Right, Icon, Card, CardItem, ListItem, Spinner} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import moment from 'moment/min/moment-with-locales'

import {subscriptionStateChange, subscriptionStateLoading} from './actions'
//import SubscriptionItem  from './subscriptionItem';

import styles from './styles';
import PropTypes from 'prop-types'; // ES6
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
class SubscriptionItem extends Component {

  constructor(props, context) {
    super(props, context);
  }
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }
  renderIcons(comments){
      var customIcons = this.props.subscription.activeToggles.map(function(e){
        return (
          <Icon name={this.props.icons.find(x => x.podio_category_id === e).icon_code} style={{color: "#333", fontWeight: '700'}}/>
        );
      }.bind(this));
      var p = this.props.participant||{};
      var that = this;
      var hasComments = comments.length > 0;
      hasComments = hasComments || (typeof this.props.subscription.subscriptionComment !== "undefined" && this.props.subscription.subscriptionComment !== null && this.props.subscription.subscriptionComment !== "")
      hasComments = hasComments || (typeof this.props.subscription.friendsComment !== "undefined" && this.props.subscription.friendsComment !== null && this.props.subscription.friendsComment !== "")

      var activeCount = 0;
      if(this.props.subscription.paymentPending)
        activeCount++;
      if(hasComments)
        activeCount++;
      return (
        <Right style={styles.listItemRight}>
            { (this.props.session.show_paid_icon && this.props.subscription.paymentPending) && <Text style={{color: "#aaa", fontWeight: '700', marginRight: 4, marginBottom: 3}}>€</Text> }
            { hasComments && <Icon name="text" active={true} style={{color: "#0090ff", fontWeight: '700', marginRight: 4}}/> }
            { p.has_medical_info &&  <Icon name="heart" active={true} style={{color: "#aaa", fontWeight: '700', marginRight: 4}}/>}

          {/* customIcons */}
          {
            this.props.session.custom_icons.filter((icon) => {
              return this.props.subscription.check_in_out_custom_icon_codes.includes(icon[0])
            }).map((icon, idx) => {
              if(activeCount === 3){
                activeCount++;
                return (<Icon key={idx} name="ios-more" active={true} style={{color: "#aaa", fontWeight: '700', marginRight: 4}}/>)
              }else if(activeCount < 3){
                activeCount++;
                return (<Icon key={idx} name={icon[0]} active={true} style={{color: "#aaa", fontWeight: '700', marginRight: 4}}/>)
              }
              return (null);
            })
          }
          {
            this.props.subscription.options_ids.map(function(i, idx){
              if(typeof that.props.session.options_icons[i] === "undefined")
                return (null);
              if(activeCount === 3){
                activeCount++;
                return (<Icon key={idx} name="ios-more" active={true} style={{color: "#aaa", fontWeight: '700', marginRight: 4}}/>)
              }else if(activeCount < 3){
                activeCount++;
                return (<Icon key={idx} style={{color: "#aaa"}} active name={that.props.session.options_icons[i].check_in_icon} />)
              }
            })
          }
        </Right>
      )
    }
  render() {
    var s = this.props.subscription;
    var p = this.props.participant||{};
    var parent = this.props.parent;
    var evt = (this.props.evt||{})[this.props.date.format("YYYY-MM-DD")]||{};
    var comments = this.props.comments;


    return (
        <ListItem style={styles.listItem} button onPress={() => this.props.navigation.navigate("PersonProfile", {activity: this.props.activity, subscription: s, participant: p, parent: parent}) }>
          <Left style={styles.listItemLeft}>
            {evt.loading ?
            <Spinner />  :
            <Switch
              trackColor="#41BA77"
              _thumbColor="#ccc"
              trackColor="#aaa"
              style={styles.switch}
              onValueChange={(value) => this.props.pushSubscriptionStateChange(s.activity_id, s, evt, p,this.props.date.format("YYYY-MM-DD"),value, comments)}
              value={evt.state === "now-present"}/>
            }
          </Left>
          <Body style={styles.listItemBody}>
            <Text  numberOfLines={1} style={(evt.state !== "now-present" && evt.state !== "draft") ? {color: "#aaa"} : {color: "#333"}}>{truncate(p.name, 45, "...")}</Text>
            <Text>
          { evt.state === "notified_absent" &&
              <Text  numberOfLines={1} style={{color: "red", fontSize: 10}}>{i18n.t("notified_absent")}</Text>
            }
            { evt.state === "now-present" &&
              <Text  numberOfLines={1} style={{color: "#333", fontSize: 10}}>{moment(evt.checkedInTime).format("HH:mm")}</Text>
            }
            { evt.state === "attended" &&
              <Text  numberOfLines={1} style={{color: "#aaa", fontSize: 10}}>{moment(evt.checkedInTime).format("HH:mm")} - {moment(evt.checkedOutTime).format("HH:mm")}</Text>
            }
            { typeof this.props.activity === 'undefined' &&
              <Text style={{color: "#333", fontSize: 10}}>  -  {truncate(this.props.activities[s.activity_id].name, 30, "...")}</Text> }
          </Text>

            </Body>
          {this.renderIcons(comments)}
        </ListItem>
    );
  }
}
function bindAction(dispatch) {
  return {
    pushSubscriptionStateChange: (activityId, subscription, evt, participant, day, value, comments) => {
      dispatch(subscriptionStateLoading(activityId, subscription.id, day, true))
      if(evt.state === "attended" && value){
      Alert.alert(
        i18n.t("warning"),
        i18n.t("already_attended_message"),
        [
          {text: i18n.t("no"), onPress: () => dispatch(subscriptionStateLoading(activityId, subscription.id, day, false))},
          {text: i18n.t("yes"), onPress: () => dispatch(subscriptionStateChange(activityId, subscription.id, participant.id, day, value))},
        ]
      )}
    
      else{
        dispatch(subscriptionStateChange(activityId, subscription.id, participant.id, day, value))
      }
    },
  };
}
const mapStateToProps = (state, ownProps) => ({
  session: state.session,
  icons: state.session.icons,
  activities: state.activities.details,
  participant: state.persons[ownProps.subscription.participant_id],
  parent: state.persons[ownProps.subscription.parent_id],
  evt: state.events[ownProps.subscription.id],
  comments: state.subscriptions.comments[ownProps.subscription.id].filter((c) => moment(c.commented_on).isAfter(moment().subtract(1, 'days')))
});

export default connect(mapStateToProps, bindAction)(SubscriptionItem);
