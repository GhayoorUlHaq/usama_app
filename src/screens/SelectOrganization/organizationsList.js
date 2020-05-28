import React, { Component } from 'react';
import { Image, Platform, StatusBar } from 'react-native';
import { connect } from 'react-redux';
import { Container, Content, Text, Item, Icon, View, List, ListItem, Body, Right } from 'native-base';
import axios from 'axios';
import PropTypes from 'prop-types'; // ES6

import styles from './styles';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';

class OrganizationsList extends Component {
  static contextTypes = {
    organizations: PropTypes.array,
    email: PropTypes.string,
    navigation: PropTypes.object
  }

  constructor(props, context) {
    super(props, context);
  }
  selectOrganization(item) {
      this.context.navigation.navigate("PromptPassword", {email: this.context.navigation.state.params.email, organization: item});
  }

  renderItems(){
    var that = this;
    return this.context.organizations.map(function(item, index){
      return (
        <ListItem key={index} icon button onPress={() => that.selectOrganization(item)}>
          <Body><Text style={{textAlign: "center", color: "#000"}}>{item.name}</Text></Body>
          <Right>
            <Icon name="ios-arrow-forward" />
          </Right>
        </ListItem>
      )
    });
  }

  render() {
    return (
      <List>
        {this.renderItems()}
        { this.context.organizations.length == 0 &&
          <Text>{i18n.t("no_orgs")}</Text> }
      </List>
    );
  }
}


function bindActions(dispatch) {
  return {
  };
}

const mapStateToProps = state => ({
});

export default connect(mapStateToProps, bindActions)(OrganizationsList);
