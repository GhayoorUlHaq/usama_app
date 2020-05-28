import React, { Component } from 'react'
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native'
import { Button, Row, FriendRow } from '../../../js/component'
import { Navigation } from 'react-native-navigation'
import {
  PRIMARY_DARK_COLOR,
  STANDARD_TEXT_STYLE,
  STANDARD_HEADER_HEIGHT,
  WIDTH_DEVICE
} from '../../../js/constants'
import t from '../../../js/i18n'
import Icon from 'react-native-vector-icons/MaterialIcons'
import CartProductsListScreen from './list'
import { getOrder, registerNewCard, deleteCart} from '../../../js/service'
import Spinner from 'react-native-loading-spinner-overlay';

class CheckoutSuccessful extends Component {
  state = {
    spinner: false,
    order: {
      total: 0
    },
    products: []
  }

  _goToScreen = (screenName, params) => {
    Navigation.push(this.props.componentId, {
      component: {
        name: screenName,
        passProps: params
      },
    })
  }

  _goBack = () => {
    Navigation.pop(this.props.componentId)
  }
  componentDidMount() {
    //registerNewCard("99999999", {birthdate: new Date("1984-01-01")})
    this.setState({spinner: true})
    getOrder(this.props.order.uid).then((order) => {
      console.log("Order->", order)
      products = Object.values(order.products) 
      this.setState({order, products, spinner: false})
    })
  }
  render() {
    const { order, products  } = this.state
    return (
      <View style={styles.container}>
        <Spinner
          visible={this.state.spinner}
          textContent={'Loading...'}
          color={"black"}
          textStyle={{color: "black"}}
        />
        <View style={[styles.row]}>
          <View style={[styles.col, {width: 50}]}>

          </View>
          <View style={[styles.col, {flex: 1, alignItems: 'stretch'}]}>
            <Text style={styles.title}>{t('congratulation')}</Text>
            <Text style={styles.title}>{t('successful_checkout')}</Text>

          </View>
          <View style={[styles.col, {width: 30}]}>
            <TouchableOpacity onPress={() => this._goToScreen("Profile")}>
              <Icon name="close" size={30} color="#00AEF0" />
            </TouchableOpacity>
          </View>
        </View>
        <CartProductsListScreen
          products={products}
          orderDetail={true}
          type={this.props.type}
          onPress={screenName => this._goToScreen(screenName)}
        />
      <View style={[styles.row, {position: 'absolute', height: 100, width: WIDTH_DEVICE, bottom: 0, backgroundColor: "#145ABA"}]}>
          <View style={[styles.col, {flex: 0.5, alignItems: 'flex-start'}]}>

          </View>
          <View style={[styles.col, {flex: 0.5, alignItems: 'center'}]}>
            <Button style={styles.button}
              invertColor
               text={t('go_to_home')}
              onPress={() => this._goToScreen("Profile")}
            />
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: STANDARD_HEADER_HEIGHT + 10,
  },
  overlay: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 30,
    marginRight: 20,
    height: 30,
  },
  totalText:{
    marginLeft: 20,
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    fontWeight: '100'
  },
  totalAmount: {
    marginLeft: 20,
    marginTop: 10,
    color: 'white',
    fontSize: 16,
    fontWeight: '800'
  },
  title: {
    ...STANDARD_TEXT_STYLE,
    color: PRIMARY_DARK_COLOR,
    fontSize: 20,
    fontWeight: '800',
    textAlign: "left"
  },
  rowButtons: {
    paddingTop: 10,
    height: 40,
    flex: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    marginTop: 20,
    width: 150
  },
  textButton: {
    ...STANDARD_TEXT_STYLE,
    color: PRIMARY_DARK_COLOR,
    fontWeight: '600',
    fontSize: 15,
  },
  flatList: {},
  row: {
    flexDirection: 'row',
  },
  col: {
    //flex: 1,
    //flexDirection: 'column',
    alignItems: 'flex-start',
  },
})

export default CheckoutSuccessful
