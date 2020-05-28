// @flow
// If password is correct the user is authenticated and we set the redux state with the basic infor for his account, then we go to Activities
import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, ImageBackground, Platform, StatusBar , Linking} from "react-native";
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
import axios from 'axios';
import { login } from "../../actions";

import styles from "./styles";
// import commonColor from "../../theme/variables/commonColor";

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
    ? "Invalid email address"
    : undefined;
const alphaNumeric = value =>
  value && /[^a-zA-Z0-9 ]/i.test(value)
    ? "Only alphanumeric characters"
    : undefined;

declare type Any = any;


import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';

class PromptPasswordForm extends Component {
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

  authenticate() {
    var that = this;
    axios.post('api/v1/sessions', {
      email: this.props.navigation.state.params.email,
      password: this.props.password,
      organisation_podio_id: this.props.navigation.state.params.organization.id
    }).then(function (response) {
      that.props.login({...response.data, email: that.props.email})
      that.props.navigation.navigate("Activities")
    }).catch(function (error) {
      if(error.response.status === 401){
        Toast.show({
                text: i18n.t("wrong_password"),
                position: 'top',
                buttonText: 'Dismiss',
                duration: 5000,
              })
      }
    });
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
                  name="password"
                  component={this.renderInput}
                  type="password"
                  validate={[required]}
                />
                <Button
                  rounded
                  dark
                  block
                  large
                  disabled={!this.props.network.isConnected}
                  style={styles.loginBtn}
                  onPress={ () => this.authenticate() }
                >
                  <Text
                    style={
                      Platform.OS === "android"
                        ? { fontSize: 16, textAlign: "center", top: -5 }
                        : { fontSize: 16, fontWeight: "900" }
                    }
                  >
                    {i18n.t("login")}
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
                  <Left>
                    <Button
                      small
                      transparent
                      style={{ alignSelf: "flex-start" }}
                    >
                      <Text onPress={() => {
                        Linking.openURL(`${navigation.state.params.organization.base_url_for_embed}?kampadmin=/t/${navigation.state.params.organization.id}/leaders/forgot_password`).catch(err => console.error('An error occurred', err))}} style={styles.helpBtns}>{i18n.t("forgot_password")}</Text>
                    </Button>
                  </Left>
                  <Right>
                    <Button
                      small
                      transparent
                      style={{ alignSelf: "flex-end" }}
                    >
                      <Text onPress={() => {
                        Linking.openURL("https://kampadmin.zendesk.com/hc/en-us/articles/360029028212").catch(err => console.error('An error occurred', err))}} style={styles.helpBtns}>{i18n.t("need_help")}</Text>
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
var PromptPassword = reduxForm({
  form: "promptPassword"
})(PromptPasswordForm);

const selector = formValueSelector("promptPassword")

PromptPassword = connect(
  state => {
    return {
      initialValues: {password: ""}, // pull initial values from account reducer
      password: selector(state, "password")
    }
  }
)(PromptPassword)

function bindActions(dispatch) {
  return {
    login: data => dispatch(login(data))
  };
}

const mapStateToProps = state => ({
  session: state.session,
  network: state.network
});
export default connect(mapStateToProps, bindActions)(PromptPassword);
