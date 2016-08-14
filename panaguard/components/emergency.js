import React, { PropTypes, Component } from 'react';
import ReactNative from 'react-native';
import {
  AsyncStorage,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  NavigatorIOS,
  ListView,
  Alert,
  DatePickerIOS,
  Modal,
  ScrollView,
  Dimensions
} from 'react-native';

import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
var Keychain = require('react-native-keychain');
const UIManager = require('NativeModules').UIManager;
var styles = require('../styles/style');

//socket.io assumes navigator.userAgent is a string, supply a dummy one to make it happy
// window.navigator.userAgent = "react-native";

// var io = require("../node_modules/socket.io-client/socket.io");

const WS_EVENTS = [
  'close',
  'error',
  'message',
  'open',
];
const WS_STATES = [
  /* 0 */ 'CONNECTING',
  /* 1 */ 'OPEN',
  /* 2 */ 'CLOSING',
  /* 3 */ 'CLOSED',
];

module.exports = React.createClass({
  getInitialState(){
    console.log("Creating socket");
    var socket = new WebSocket('ws://localhost:8080/');

    return {
      socket: socket
    }
  },
  componentDidMount(){
    console.log("Adding socket event listener to:", this.state.socket);
  },
  emergency(){
    this.state.socket.send('working');
  },
  cancel(){
    this.props.navigator.pop();
  },
  render(){
    return(
      <View style={styles.container}>
        <View>
          <Text>Help is on the Way!</Text>
          <TouchableOpacity onPress={this.emergency} style={[styles.button, styles.buttonGreen]}>
            <Text style={styles.buttonLabel}>Message</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.cancel} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Cancel request</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
})