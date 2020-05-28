import React from "react";
import Setup from "./src/boot/setup";
import * as Sentry from 'sentry-expo';
import Constants from 'expo-constants';
Sentry.init({
  dsn: 'https://4e78e37bfb6546f1ac2d84056a2a3d59@sentry.io/1778519',
  enableInExpoDevelopment: true,
  debug: true
});

export default class App extends React.Component {
  render() {
    return <Setup />;
  }
}
