// @flow
import React, { Component } from "react";
import { Image, ImageBackground, TouchableOpacity, Alert, Linking } from "react-native";
import { connect } from 'react-redux';
import { NavigationActions, StackActions } from "react-navigation";
import {BASE_URL} from "../../boot/env"

import {
  Container,
  Content,
  Text,
  Icon,
  ListItem,
  Thumbnail,
  View
} from "native-base";
import truncate from 'voca/truncate';

import { Grid, Col } from "react-native-easy-grid";
import {logout} from '../PromptPassword/actions'
const male_pic = require("../../../assets/fallbacks/parent_male.png");
const female_pic = require("../../../assets/fallbacks/parent_female.png");
const gender_unknown_pic = require("../../../assets/fallbacks/gender_unknown.png");

import styles from "./style";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';

const resetAction = StackActions.reset({
  index: 0,
  actions: [NavigationActions.navigate({ routeName: "Login" })]
});
class SideBar extends Component {
  constructor(props){
    super(props)
    this.logout = this.logout.bind(this)
    this.autologin_url_for = this.autologin_url_for.bind(this)
  }
  profile_picture(profile_picture, gender){
    if(profile_picture === "" || profile_picture === null){
      if(gender === "female")
        return female_pic;
      else if(gender === "male")
        return male_pic;
      else
        return gender_unknown_pic;
    }else{
      return {uri: profile_picture};
    }
  }
  logoutHandler() {
    if(this.props.network.actionQueue.length > 0){
      Alert.alert(
        i18n.t("warning"),
        i18n.t("logout_warning_queue"),
        [
          {text: i18n.t("no"), onPress: () => console.log('Discard')},
          {text: i18n.t("yes"), onPress: () => this.logout()},
        ]
      )
    }else{
      this.logout()
    }
  }

  logout(){
    Alert.alert(
      i18n.t("warning"),
      i18n.t("logout_warning"),
      [
        {text: i18n.t("no"), onPress: () => {}},
        {text: i18n.t("yes"), onPress: () => {
          this.props.logout()
          this.props.navigation.dispatch(resetAction)
        }},
      ]
    )
  }
  autologin_url_for(redirect){
    var query = `/autologin/${this.props.session.itemPodioId}_${this.props.session.autologin_token}?r=${redirect}`
    return `${this.props.session.embed_url}?kampadmin=${encodeURIComponent(query)}`
  }

  render() {
    const navigation = this.props.navigation;
    console.log(this.props.session.organization_logo)
    return (
      <Container>
        <ImageBackground
          source={require("../../../assets/sidebar-transparent.png")}
          style={styles.background}
        >
          <Content style={styles.drawerContent}>
            <View style={{paddingLeft: 10, height: 80, flexDirection: 'row'}}>
              <Image
                source={{uri: this.props.session.organization_logo}}
                style={styles.orgPic}
              />
            <Text  style={styles.sidebarHeaderText}>{this.props.session.organization_name}</Text>
            </View>
            <View
              style={{
                borderBottomColor: 'white',
                borderBottomWidth: 1,
              }}
            />

            <ListItem
              button
              onPress={() => {
                navigation.closeDrawer();
                navigation.navigate("Activities");
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-calendar" />
              <Text style={styles.linkText}>{i18n.t("checkin_out")}</Text>
            </ListItem>
            {!this.props.session.with_dummy_leaders && <React.Fragment>
            <ListItem
              button
              onPress={() => {
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-person" />
              <Text style={styles.linkText}>{i18n.t("leader_profile")}</Text>
            </ListItem>

            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/profile')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.sublinks}
            >
              <Text style={styles.sublinkText}>{i18n.t("my_profile")}</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/activities')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.sublinks}
            >
              <Text style={styles.sublinkText}>{i18n.t("my_activities")}</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/contracts')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.sublinks}
            >
              <Text style={styles.sublinkText}>{i18n.t("my_contracts")}</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/evaluations')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.sublinks}
            >
              <Text style={styles.sublinkText}>{i18n.t("my_evaluations")}</Text>
            </ListItem>
            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/personal_info')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.sublinks}
            >
              <Text style={styles.sublinkText}>{i18n.t("personal_info")}</Text>
            </ListItem>
          </React.Fragment>}
            <ListItem
              button
              onPress={() => {
                Linking.openURL(this.autologin_url_for('/leaders/profile')).catch(err => console.error('An error occurred', err))
              }}
              iconLeft
              style={styles.links}
            >
              <Icon name="ios-information-circle" />
              <Text style={styles.linkText} onPress={() => {
                    Linking.openURL(this.props.session.leader_info_for_leader_url).catch(err => console.error('An error occurred', err))}}>{i18n.t("info_for_leader")}</Text>
            </ListItem>
          </Content>
          <View style={styles.logoutContainer}>
            <View style={styles.logoutbtn} foregroundColor={"white"}>
              <Grid style={{padding: 10}}>
                <Col>
                  <TouchableOpacity
                    onPress={() => {
                      this.logoutHandler();
                    }}
                    style={{
                      alignSelf: "flex-start",
                      backgroundColor: "transparent"
                    }}
                  >
                    <Text style={{ fontWeight: "bold", color: "#fff" }}>
                      {i18n.t("logout")}
                    </Text>
                    <Text note style={{ color: "#fff" }}>
                      {truncate(this.props.session.fullname, 35, "...")}
                    </Text>

                  </TouchableOpacity>
                </Col>
                <Col>
                  <TouchableOpacity
                    style={{ alignSelf: "flex-end" }}
                    onPress={() => {
                      navigation.navigate("Profile");
                    }}
                  >
                    <Thumbnail
                      source={this.profile_picture(this.props.session.profile_picture, this.props.session.gender)}
                      style={styles.profilePic}
                    />
                  </TouchableOpacity>
                </Col>
              </Grid>
            </View>
            <Text style={{fontWeight: "normal", fontSize: 12, alignSelf: 'center'}} onPress={() => {
                  Linking.openURL("https://kampadmin.zendesk.com/hc/en-us/articles/360029028212").catch(err => console.error('An error occurred', err))}} >{i18n.t("need_help")}</Text>
            <Text style={{paddingTop: 10, paddingBottom: 5, fontWeight: "normal", fontSize: 12, alignSelf: 'center'}} onPress={() => {
                  Linking.openURL("https://kampadmin.be").catch(err => console.error('An error occurred', err))}} >Powered by Kampadmin</Text>
          </View>
        </ImageBackground>
      </Container>
    );
  }
}
function bindActions(dispatch) {
  return {
    logout: () => dispatch(logout())
  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network
});
export default connect(mapStateToProps, bindActions)(SideBar);
