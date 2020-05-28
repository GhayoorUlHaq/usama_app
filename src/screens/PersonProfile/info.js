

import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Switch, Alert } from 'react-native';
import { connect } from 'react-redux';
import truncate from 'voca/truncate';
import replaceAll  from 'voca/replace_all';
import Communications from 'react-native-communications';
import { Container, Content, Text, List, ListItem, Left, Body, Right, Icon, Spinner } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types'; // ES6
import moment from 'moment/min/moment-with-locales'

import styles from './styles';
const primary = styles.primary;

import {subscriptionCustomIconChange} from "../Subscriptions/actions"
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
class Info extends Component {

  constructor(props) {
    super(props);
  }
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }

  renderCustomIcons(){
    return this.props.session.custom_icons.map(function(i){
      return (<ListItem icon style={styles.listItemWithIcon} key={i[1]}>
        <Left style={styles.listItemWithIconContent}>
          <Icon style={{color: "#333"}} active name={i[0]} />
        </Left>
        <Body style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{i[1]}</Text>
        </Body>
        <Right style={styles.listItemWithIconContent}>
        {this.props.subscription.loading ?
          <Spinner />  :
          <Switch
            trackColor="#41BA77"
            style={styles.switch}
            _thumbColor="#ccc"
            trackColor="#aaa"
            onValueChange={(value) => this.props.pushCustomIconChange({id: this.props.subscription.activity_id}, this.props.subscription, i[0], value)}
            value={this.props.subscription.check_in_out_custom_icon_codes.includes(i[0])}
          />
        }

        </Right>
      </ListItem>)
    }.bind(this))
  }
  renderOptionIcons(){
    return this.props.subscription.options_ids.map(function(i){
      if(typeof this.props.session.options_icons[i] === "undefined")
        return (null);

      return (<ListItem icon style={styles.listItemWithIcon} key={i}>
        <Left style={styles.listItemWithIconContent}>
          <Icon style={{color: "#333"}} active name={this.props.session.options_icons[i].check_in_icon} />
        </Left>
        <Body style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{this.props.session.options_icons[i].option_public_name}</Text>
        </Body>
        <Right style={styles.listItemWithIconContent}>

        </Right>
      </ListItem>)
    }.bind(this))
  }

  renderMedicalContacts(){
    var medical_contacts = this.props.participant.medical_contacts || {};
    return Object.keys(medical_contacts).map(function(key, index){
      return (<ListItem icon style={styles.listItemWithIcon} key={key}>
        <Body style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{i18n.t(key)}</Text>
        </Body>
        <Right style={styles.listItemWithIconContent}>
          <Text
            onPress={() => {
              Alert.alert(
                i18n.t(key),
                medical_contacts[key]
              )
            }} style={{color: "#333"}}>{truncate(medical_contacts[key], 20, "...")}</Text>
        </Right>
      </ListItem>)
    }.bind(this))
  }

  renderMedicalInfo(){
    var medical_info = this.props.participant.medical_info || {};
    return Object.keys(medical_info).map(function(key, index){
      return (<ListItem icon style={styles.listItemWithIcon} key={key}>
        <Body style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{i18n.t(key)}</Text>
        </Body>
        <Right style={styles.listItemWithIconContent}>
          <Text   onPress={() => {
              Alert.alert(
                i18n.t(key),
                medical_info[key]
              )
            }} style={{color: "#333"}}>{truncate(medical_info[key], 20, "...")}</Text>
        </Right>
      </ListItem>)
    }.bind(this))
  }

  renderHistoryItems(){
    var events = this.props.events || {};
    return Object.keys(events).sort(function(a,b){
      return moment(a).diff(moment(b))
    }).map(function(key, index){
      var state = "";
      if(moment(key).isBefore(moment())){
        if(events[key].state === "attended" || events[key].state === "now-present"){
          state = events[key].state;
        }else{
          state = "absent"
        }
      }else if(moment(key).isAfter(moment())){
        if(events[key].state === "notified_absent"){
          state = events[key].state;
        }
      }else{
        state = events[key].state;
      }
      return (<ListItem icon style={styles.listItemWithIcon} key={key}>
        <Body style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{moment(key).format("DD/MM/YYYY")}</Text>
        </Body>
        <Right style={styles.listItemWithIconContent}>
          <Text style={{color: "#333"}}>{state!== "" && i18n.t(state)}</Text>
        </Right>
      </ListItem>)
    }.bind(this))
  }

  render() {
    var parent = this.props.parent || {};
    var participant = this.props.participant;
    this.renderCustomIcons();
    return (
      <Container style={{backgroundColor: "#fff"}}>
        <Content>
        <List>
          <ListItem itemHeader first style={{paddingBottom: 10 }}>
            <Icon style={{color: "#333"}} active name="home" />
            <Text  style={{paddingLeft: 10, color: "#333", fontWeight: 'bold'}}>{i18n.t("profile")}</Text>
          </ListItem>
          <ListItem icon style={styles.listItemWithIcon}>
            <Left style={styles.listItemWithIconContent}>
              <Icon style={{color: "#333"}} active name="people" />
            </Left>
            <Body style={styles.listItemWithIconContent}>
              <Text style={{color: "#333"}}>{parent.name}</Text>
            </Body>
          </ListItem>
          <ListItem icon style={styles.listItemWithIcon}>
            <Left style={styles.listItemWithIconContent}>
              <Icon style={{color: "#333"}} active name="call" />
            </Left>
            <Body style={styles.listItemWithIconContent}>
              <Text onPress={() => Communications.phonecall(parent.tel_1, false)} style={{color: "#333"}}>{parent.tel_1}</Text>
              <Text onPress={() => Communications.phonecall(parent.tel_2, false)} style={{color: "#333"}}>{parent.tel_2}</Text>
            </Body>
          </ListItem>
          <ListItem icon style={styles.listItemWithIcon}>
            <Left style={styles.listItemWithIconContent}>
              <Icon style={{color: "#333"}} active name="calendar" />
            </Left>
            <Body style={styles.listItemWithIconContent}>
              <Text style={{color: "#333"}}>{moment(participant.birthdate).format('DD/MM/YYYY')} ({moment(participant.birthdate).fromNow(true)})</Text>
            </Body>
          </ListItem>
          { this.props.session.show_paid_icon &&
            <ListItem icon style={styles.listItemWithIcon}>
              <Left style={styles.listItemWithIconContent}>
                <Icon style={{color: "#333"}} active name="card" />
              </Left>
              <Body style={styles.listItemWithIconContent}>
                <Text style={{color: "#333"}}>{i18n.t("paid")}</Text>
              </Body>
              <Right style={styles.listItemWithIconContent}>
                { this.props.subscription.paymentPending ?
                  <Icon style={{color: "#d9534f", fontSize: 25}} active name="close" />
                  :
                  <Icon style={{color: "#41BA77", fontSize: 24}} active name="checkmark" />}
              </Right>
            </ListItem>
          }
          { this.props.session.show_gdpr_icon && 
            <ListItem icon style={styles.listItemWithIcon}>
              <Left style={styles.listItemWithIconContent}>
                <Icon style={{color: "#333"}} active name="camera" />
              </Left>
              <Body style={styles.listItemWithIconContent}>
                <Text style={{color: "#333"}}>{i18n.t("gdpr_photo")}</Text>
              </Body>
              <Right style={styles.listItemWithIconContent}>
                { this.props.participant.gdpr_photo ?
                  <Text style={{color: "#333"}}>{i18n.t("yes")}</Text>
                  :
                  <Text style={{color: "#333"}}>{i18n.t("no")}</Text>}
              </Right>
            </ListItem>
          }
          {this.renderCustomIcons()}
          {this.renderOptionIcons()}
          { Object.keys({...this.props.participant.medical_contacts, ...this.props.participant.medical_info}).length > 0 &&
          <ListItem itemHeader style={{paddingBottom: 10 }}>
            <Icon style={{color: "#333"}} active name="heart" />
            <Text  style={{paddingLeft: 10, color: "#333", fontWeight: 'bold'}}>{i18n.t("medical_info")}</Text>
          </ListItem>}
          {this.renderMedicalContacts()}
          {this.renderMedicalInfo()}
          <ListItem itemHeader style={{paddingBottom: 10 }}>
            <Icon style={{color: "#333"}} active name="refresh" />
            <Text  style={{paddingLeft: 10, color: "#333", fontWeight: 'bold'}}>{i18n.t("history")}</Text>
          </ListItem>
          {this.renderHistoryItems()}
        </List>
        </Content>
      </Container>
    );
  }
}
function bindAction(dispatch) {
  return {
    pushCustomIconChange: (activity, subscription, icon, value) => {
      var icons = subscription.check_in_out_custom_icon_codes
      if(value){
        icons.push(icon)
      }else{
        var idx = subscription.check_in_out_custom_icon_codes.indexOf(icon)
        if(idx >= 0){
          icons.splice(idx, 1)
        }
      }
      dispatch(subscriptionCustomIconChange(activity, subscription, icons))
    },
  };
}
const mapStateToProps = (state, ownProps) => ({
  navigation: state.cardNavigation,
  session: state.session,
  subscriptions: state.subscriptions,
  events: state.events[ownProps.subscription.id]
});

export default connect(mapStateToProps, bindAction)(Info);
