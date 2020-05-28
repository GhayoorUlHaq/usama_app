import * as Expo from "expo";
import React, { Component } from "react";
import { Provider } from "react-redux";
import { StyleProvider } from "native-base";
import { PersistGate } from 'redux-persist/integration/react'
import * as Font from 'expo-font';


import App from "../App";
import configureStore from "./configureStore";
import getTheme from "../theme/components";
import variables from "../theme/variables/commonColor";

export default class Setup extends Component {
  state: {
    store: Object,
    isLoading: boolean,
    isReady: boolean
  };
  constructor() {
    super();
    this.state = {
      isLoading: false,
      ...configureStore(() => this.setState({ isLoading: false })),
      isReady: false
    };
  }
  componentWillMount() {
    this.loadFonts();
  }

  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("../../node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("../../node_modules/native-base/Fonts/Roboto_medium.ttf"),
      Ionicons: require("../../node_modules/@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf")
    });

    this.setState({ isReady: true });
  }

  render() {
    if (!this.state.isReady || this.state.isLoading) {
      return <Expo.AppLoading />;
    }

    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={this.state.store}>
          <PersistGate loading={null} persistor={this.state.persistor}>
            <App />
          </PersistGate>
        </Provider>
      </StyleProvider>
    );
    /*
    return (
      <StyleProvider style={getTheme(variables)}>
        <Provider store={this.state.store}>
            <App />
        </Provider>
      </StyleProvider>
    );*/
  }
}
