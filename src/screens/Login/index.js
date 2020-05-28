// @flow
// Login Screen, we ask for the email and then we go to SelectOrganization only if the leader belongs to multiple orgs otherwise we jump to PromptPassword
// If the user is already logged in we go strait to Activities
import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, ImageBackground, Platform, StatusBar, Linking } from "react-native";
import {
  Container,
  Content,
  Text,
  Item,
  Input,
  Button,
  Icon,
  View,
  Left,
  Right,
  Toast
} from "native-base";
import { Field, reduxForm, formValueSelector } from "redux-form";
import { organizationsFetched } from "../SelectOrganization/actions";
import axios from 'axios';

import styles from "./styles";
// import commonColor from "../../theme/variables/commonColor";
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
const bg = require("../../../assets/bg.png");
const logo = require("../../../assets/logo.png");

const required = value => (value ? undefined : "Required");
const maxLength = max => value =>
  value && value.length > max ? `Must be ${max} characters or less` : undefined;
const maxLength15 = maxLength(15);
const minLength = min => value =>
  value && value.length < min ? `Must be ${min} characters or more` : undefined;
const minLength8 = minLength(8);
const email = value =>
  value && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)
    ? i18n.t('invalid_email_address')
    : undefined;
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? i18n.t('only_alphanumeric')
    : undefined;

declare type Any = any;
class LoginForm extends Component {
  textInput: Any;
  renderInput({ input, label, type, meta: { touched, error, warning } }) {
    return (
      <View>
        <Item error={error && touched} rounded style={styles.inputGrp}>
          <Icon
            active
            name={input.name === "email" ? "mail" : "unlock"}
            style={{ color: "#fff" }}
          />
          <Input
            ref={c => (this.textInput = c)}
            placeholderTextColor="#FFF"
            autoCapitalize='none'
            style={styles.input}
            placeholder={input.name === "email" ? "Email" : "Password"}
            secureTextEntry={input.name === "password" ? true : false}
            {...input}
          />
          {touched && error
            ? <Icon
                active
                style={styles.formErrorIcon}
                onPress={() => this.textInput._root.clear()}
                name="close"
              />
            : <Text />}
        </Item>
        {touched && error
          ? <Text style={styles.formErrorText1}>
              {error}
            </Text>
          : <Text style={styles.formErrorText2}>error here</Text>}
      </View>
    );
  }

  login() {
    var that = this;
    if (this.props.valid) {
      axios.get('/api/v1/leader/organizations', {
        params: {
          email: that.props.email
        }
      }).then(function(response) {
        that.props.organizationsFetched( response.data);
        if(response.data.length === 0){
          Toast.show({
            text: i18n.t('cannot_login'),
            duration: 2500,
            position: "top",
            textStyle: { textAlign: "center" }
          });
        }else if(response.data.length === 1){
          that.props.navigation.navigate("PromptPassword", {email: that.props.email, organization: response.data[0]});
        }
        else{
          that.props.navigation.navigate("SelectOrganization", {email: that.props.email});
        }
      }).catch(function (response) {
      });

      //this.props.navigation.navigate("SelectOrganization", {email: this.props.email});
    } else {
      Toast.show({
        text: i18n.t('enter_valid_email'),
        duration: 2500,
        position: "top",
        textStyle: { textAlign: "center" }
      });
    }
  }

  componentDidMount(){
    if(this.props.session.userSignedIn){
      this.props.navigation.navigate("Activities");
    }
  }

  render() {
    const navigation = this.props.navigation;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <ImageBackground source={bg} style={styles.background}>
          <Content contentContainerStyle={{ flex: 1 }}>
            <View style={styles.container}>
              <Image source={logo} style={styles.logo} />
            </View>
            <View style={styles.container}>
              <View style={styles.form}>
                <Field
                  name="email"
                  component={this.renderInput}
                  type="email"
                  validate={[required]}
                />
                <Button
                  rounded
                  dark
                  block
                  large
                  disabled={!this.props.network.isConnected}
                  style={styles.loginBtn}
                  onPress={ () => this.login() }
                >
                  <Text
                    style={
                      Platform.OS === "android"
                        ? { fontSize: 16, textAlign: "center", top: -5 }
                        : { fontSize: 16, fontWeight: "900" }
                    }
                  >
                    {i18n.t('login')}
                  </Text>
                  <Text
                    style={
                      Platform.OS === "android"
                        ? { fontSize: 16, textAlign: "center", top: -5 }
                        : { fontSize: 16, fontWeight: "900" }
                    }
                  >
                  </Text>
                </Button>

                <View style={styles.otherLinksContainer}>
                  <Right>
                    <Button
                      small
                      transparent
                      style={{ alignSelf: "flex-end" }}>
                      <Text onPress={() => {
                        Linking.openURL("https://kampadmin.zendesk.com/hc/en-us/articles/360029028212").catch(err => console.error('An error occurred', err))}} style={styles.helpBtns}>{i18n.t('need_help')}</Text>
                    </Button>
                  </Right>
                </View>
              </View>
            </View>
          </Content>
        </ImageBackground>
      </Container>
    );
  }
}
var Login = reduxForm({
  form: "login"
})(LoginForm);

const selector = formValueSelector("login")

Login = connect(
  state => {
    return {
      initialValues: {email: ""}, // pull initial values from account reducer
      email: selector(state, "email")
    }
  }
)(Login)

function bindActions(dispatch) {
  return {
    organizationsFetched: data => dispatch(organizationsFetched(data))
  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network
});
export default connect(mapStateToProps, bindActions)(Login);
