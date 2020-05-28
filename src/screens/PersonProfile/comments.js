import React, { Component } from 'react';
import { Image, View, TouchableOpacity, Platform, Switch, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment/min/moment-with-locales'
import replaceAll  from 'voca/replace_all';
import truncate from 'voca/truncate';
import { Container, Content, Text, List, ListItem, Left, Body, Right, Icon, H3,Card,
CardItem, Input, Button, Toast} from 'native-base';
import { Grid, Col, Row } from 'react-native-easy-grid';
import PropTypes from 'prop-types'; // ES6

import styles from './styles';
const primary = styles.primary;

import {subscriptionPushComment} from "../Subscriptions/actions"
import * as Localization from 'expo-localization';
import i18n from 'i18n-js';
import {nl, en} from '../../i18n.js';
i18n.fallbacks = true;
i18n.translations = { en, nl };
i18n.locale = 'nl';
class Comments extends Component {

  constructor(props) {
    super(props);
    this.submitComment = this.submitComment.bind(this)
    this.state = {
      message: "",
      showToast: false,
      commentsList: null,
    }
  }
  static propTypes = {
    navigation: PropTypes.shape({
      key: PropTypes.string,
    }),
  }


  submitComment(){
    if(this.state.message==="")
      return;
    var subscription = this.props.subscription;
    var activity = {id: subscription.activity_id};
    this.props.pushComment(activity, subscription, this.state.message, this.props.session.fullname)
    this.setState({message: ""})
    /*Toast.show({
              text: 'Comment Sent',
              position: 'top',
              buttonText: 'Okay',
              duration: 5000
            })*/
  }
  render() {
    var subscription = this.props.subscription;
    var activity = {id: subscription.activity_id};

    var comments = (this.props.subscriptions.comments[subscription.id]||[]).slice(0)

    if(subscription.subscriptionComment)
      comments.unshift({message: subscription.subscriptionComment, person: 'Parent'})

    if(subscription.friendsComment)
      comments.unshift({message: subscription.friendsComment, person: 'Friends'})

    return (
      <Container style={{backgroundColor: "#fff"}}>
        <ScrollView ref={ ( ref ) => this.scrollView = ref }
          onContentSizeChange={ () => {
              this.scrollView.scrollToEnd( { animated: false } )
          } } >

          {comments.length > 0 ?
          <List
            dataArray={comments}
            renderRow={item =>
              <Card style={styles.card}>
                <CardItem style={styles.cardHeader} header>
                  <View>
                    <Text style={styles.commentName}>
                      {truncate(item.person, 35, "...")}
                    </Text>
                    <Text style={styles.commentText}>
                      {replaceAll(item.message, "\n", " ")}
                    </Text>
                    {item.commented_on &&
                    <View style={styles.commentDateView}>
                      <Icon name="ios-time" style={styles.timeIcon} />
                      <Text style={styles.date}>
                        {item.commented_on.format("dddd, MMMM Do YYYY, h:mm:ss a")}
                      </Text>
                    </View>
                    }
                  </View>
                </CardItem>
              </Card>
            }>
          </List>:
          <H3 style={{color: "#333", textAlign: "center", paddingTop: 10}}>{i18n.t("no_comments")}</H3>
          }

        </ScrollView>

              <Input
                placeholder={i18n.t("write_something")}
                placeholderTextColor="rgba(0,0,0,0.5)"
                style={styles.inputBox}
                returnKeyType="done"
                onChangeText={(message) => this.setState({message})}
                value={this.state.message}
              />

            <Button style={{ margin: 10, height: 40}} full block rounded onPress={this.submitComment}>
              <Text>{i18n.t("send")}</Text>
            </Button>

      </Container>
    );
  }
}
function bindAction(dispatch) {
  return {
    pushComment: (activity, subscription, message, person) => {
      dispatch(subscriptionPushComment(activity, subscription, message, moment(), person))
    },
  };
}
const mapStateToProps = state => ({
  navigation: state.cardNavigation,
  session: state.session,
  subscriptions: state.subscriptions
});

export default connect(mapStateToProps, bindAction)(Comments);
