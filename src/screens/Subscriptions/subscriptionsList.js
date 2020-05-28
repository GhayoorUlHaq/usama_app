import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Switch, FlatList } from 'react-native';
import { connect } from 'react-redux';


import { Container, Content, Text, List, Left, Body, Right, Icon, H3 } from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';

//import SubscriptionItem  from './subscriptionItem';
import PropTypes from 'prop-types'; // ES6

import styles from './styles';
import SubscriptionItem from './subscriptionItem';
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
class SubscriptionsList extends Component {

  constructor(props, context) {
    super(props, context);
    this.emptyMessage = this.emptyMessage.bind(this)
  }
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }
  static contextTypes = {
    navigation: PropTypes.object
  }

  emptyMessage(){
    var base = "";
    switch (this.props.type) {
      case "all":
        base = i18n.t("no_participant")
        break;
      case "in":
        base = i18n.t("no_checked_in")
        break;
      case "out":
        base = i18n.t("no_checked_out")
        break;
    }
    if(this.props.searchString.length > 0){
      base += ` ${i18n.t('matching')} ${this.props.searchString}`
    }
    return base+".";
  }
  render() {
    var activity = this.props.activity;
    var date = this.props.date;
    var nav = this.context.navigation;
    return (
      <Container style={{backgroundColor: "#fff"}}>
        <Content showsVerticalScrollIndicator={false}>
          <View>
          {this.props.subscriptions.length > 0 ?
          <FlatList data={this.props.subscriptions}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({item}) =>{
              return (<SubscriptionItem activity={activity} subscription={item} date={date} navigation={nav}/>)
              }
            }>
          </FlatList> :
          <H3 style={{color: "#333", textAlign: "center", paddingTop: 20, paddingLeft: 30, paddingRight: 30}}>
            {this.emptyMessage()}
          </H3>
          }
        </View>
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  navigation: state.cardNavigation,
});

export default connect(mapStateToProps)(SubscriptionsList);
