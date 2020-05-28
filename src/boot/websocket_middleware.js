// Comments, checkin/out and icons are live. The sync happens through websocket. The message we receive from the websocket is dispatched as
// 'WEBSOCKET:'+data.message.type. The payload of the websocket is the same of the actions triggered from within the app,
// so a websocket event can be trated like an action triggered remotely. 

import {WS_URL} from "./env"
const React = require("react-native");
const { Platform, Dimensions } = React;


export default store => next => action => {
  switch (action.type) {
    // User request to connect
    case 'WEBSOCKET:CONNECT':
      console.log(Platform.OS, "SW: INIT", WS_URL)
      // Configure the object
      websocket = new WebSocket(WS_URL);
      websocket.onerror = (e) => {
        // an error occurred
        console.log("WS: error",Platform.OS, e.message);
      };

      // Attach the callbacks
      websocket.onopen = () => {
        try{
           websocket.send(JSON.stringify({
             command: "subscribe",
             identifier: JSON.stringify({channel: action.payload.channel, activity_id: action.payload.activity_id})
           }))
        }catch(error){ console.log("WS: error",Platform.OS, error)}
       }
      websocket.onclose = (event) => store.dispatch({ type: 'WEBSOCKET:CLOSE', payload: event });
      websocket.onmessage = (event) => {
        data = JSON.parse(event.data)
        if(data.hasOwnProperty('identifier')){
          identifier = JSON.parse(data['identifier'])
          if(identifier["channel"] === "SubscriptionEventChannel" && data.hasOwnProperty("message")){
            store.dispatch({ type: 'WEBSOCKET:'+data.message.type, payload: data.message.payload });
          }
        }
      }

      break;

    // User request to send a message
    case 'WEBSOCKET:SEND':
    //  websocket.send(JSON.stringify(action.payload));
      break;

    // User request to disconnect
    case 'WEBSOCKET:DISCONNECT':
      websocket.close();
      break;

    default: // We don't really need the default but ...
      break;
  };

  return next(action);
};
