// @flow
// Follows the Login only when multiple orgs are associated to the leader. After selecting an org we go to PromptPassword
import React, { Component } from "react";
import { connect } from 'react-redux';
import { Image, Platform, StatusBar } from "react-native";
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
  Spinner
} from "native-base";
import axios from 'axios';
import OrganizationsList from './organizationsList';
import { organizationsFetch } from "../../actions";

import styles from "./styles";
import PropTypes from 'prop-types'; // ES6

const headerLogo = require("../../../assets/header-logo.png");
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';

class SelectOrganization extends Component {
  static childContextTypes = {
    organizations: PropTypes.array,
    email: PropTypes.string,
    navigation: PropTypes.object
  }
  
  getChildContext() {
    return {
      organizations: this.props.organizations.list,
      email: this.props.email,
      navigation: this.props.navigation
    };
  }

  render() {
    const navigation = this.props.navigation;
    const primary = require("../../theme/variables/commonColor").brandPrimary;
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <View style={styles.overviewHeaderContainer}>
          <Text style={styles.overviewHeader}>{i18n.t("select_organizations")}</Text>
        </View>

        <Content
          showsVerticalScrollIndicator={false}
          style={{ backgroundColor: "#fff" }}
        >
          <View style={styles.bg}>
            {
              this.props.organizations.fetching ? <Spinner /> :
              <OrganizationsList />
            }
          </View>
        </Content>
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
  organizations: state.organizations
});
export default connect(mapStateToProps, bindActions)(SelectOrganization);
