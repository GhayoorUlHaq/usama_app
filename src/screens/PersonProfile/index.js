// @flow
// This screen shows the details of the participant with a tab for comments.

import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, ImageBackground, Platform, StatusBar, TouchableOpacity } from "react-native";
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
  Tab,
  Thumbnail,
  TabHeading
} from "native-base";

import truncate from 'voca/truncate';

import PropTypes from 'prop-types'; // ES6

import axios from 'axios';

import styles from "./styles";
import Info from "./info";
import Comments from "./comments";
const headerLogo = require("../../../assets/header-logo.png");
const bg = require("../../../assets/bg-transparent.png");
const male_pic = require("../../../assets/fallbacks/child_male.png");
const female_pic = require("../../../assets/fallbacks/child_female.png");
const gender_unknown_pic = require("../../../assets/fallbacks/gender_unknown.png");
import AppStateCheckOnPastDate from '../../components/AppStateCheckOnPastDate';


class PersonProfile extends Component {


  static childContextTypes = {
    organizations: PropTypes.array,
    navigation: PropTypes.object
  }
  constructor(props, context) {
    super(props, context);
    this.state = {

    }
  }
  componentWillMount(){
    this.setState({activity: this.props.navigation.state.params.activity, date: this.props.navigation.state.params.date})
  }
  componentDidMount(){
    if(this.props.network.isConnected){
      //this.props.fetchOrganization(this.props.navigation.state.params.email);
    }
  }
  getChildContext() {
    return {
      navigation: this.props.navigation
    };
  }


  renderHeader(participant){
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
            </Body>
            <Right>

            </Right>
          </Header>
      );
  }
  profile_picture(p){
    if(p.profile_picture === "" || p.profile_picture === null || typeof p.profile_picture === "undefined" ){
      if(p.gender === "female")
        return female_pic;
      else if(p.gender === "male")
        return male_pic;
      else
        return gender_unknown_pic;
    }else{
      return {uri: p.profile_picture};
    }
  }
  render() {
    const navigation = this.props.navigation;
    const primary = require("../../theme/variables/commonColor").brandPrimary;
    const { params } = this.props.navigation.state;
    const participant = params ? params.participant : {};
    const parent = params ? params.parent : {};
    const subscription = params ? params.subscription : {};
    const activity = params ? params.activity : {};

    return (
      <Container>
        <AppStateCheckOnPastDate navigation={navigation} />

        <ImageBackground source={bg} style={styles.container}>
        {this.renderHeader(participant)}
        <Content
          scrollEnabled={false}
          extraScrollHeight={-13}
          contentContainerStyle={styles.commentHeadbg}
        >
          <View style={{height: 80, flexDirection: 'row'}}>
            <View style={{ flex: 2, alignSelf: 'center'}}>
              <Text style={{paddingLeft: 20, fontWeight: 'bold',fontSize: 24}}>{truncate(participant.name, 35, "...")}</Text>
            </View>
            <TouchableOpacity style={{flex: 1, alignSelf: 'center'}}>
              <Thumbnail source={this.profile_picture(participant)} style={styles.profilePic} />
            </TouchableOpacity>
          </View>
          <Tabs style={{ backgroundColor: "#fff" }}>
            <Tab heading={ <TabHeading style={{backgroundColor: "#2A3854"}}><Icon name="information-circle" /></TabHeading>}>
              <Info activity={activity} subscription={subscription} parent={parent} participant={participant} />
            </Tab>
            <Tab heading={ <TabHeading style={{backgroundColor: "#2A3854"}}><Icon name="text" /></TabHeading>}>
              <Comments activity={activity} subscription={subscription}  />
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

  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network,
  organizations: state.organizations,
  subscriptions: state.subscriptions
});
export default connect(mapStateToProps, bindActions)(PersonProfile);
