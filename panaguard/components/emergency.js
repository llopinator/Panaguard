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
      socket: socket,
      paired: false
    }
  },
  componentDidMount(){

    AsyncStorage.getItem('user')
    .then(result => {
      if(!result){
        console.log('ur not a user fuck off');
      } else {
       // console.log('socket!!!!!!!!: ', this.state.socket.send, ' result: ', result);
        
        this.state.socket.addEventListener('open', () => {
          this.state.socket.send(JSON.stringify({
            type: 'auth',
            token: result
          }));
        });
      }
    })
    .catch((err) => {
      if(err){
        Alert.alert(
          err.message
        );
      }
    });


    this.state.socket.addEventListener('message', (event) => {
      var msg = JSON.parse(event.data);

      if(msg.type === 'tryAgain'){ //no dispatchers available
        this.state.socket.send(JSON.stringify({
          type: 'auth',
          token: msg.token
        }));
      }

      if(msg.type === 'ack'){ //emergency request acknowledged
        console.log('Emergency request acknowledged');
        //retrieve medical information to send dispatcher
        AsyncStorage.getItem('medical')
        .then(result => {
          if(!result){
            console.log('no medical information to send dispatcher')
            //only send gps location
          } else {
            //console.log('retrieved medical information: ', result);
            console.log('sending medinfo to dispatcher')
            this.state.socket.send(JSON.stringify({
              type: 'emergency',
              medinfo: result
            }));
          }
        })
      }

      if(msg.type === 'paired'){ //emergency request acknowledged
        console.log('Paired with a dispatcher');
        //retrieve medical information to send dispatcher
        this.setState({
          paired: true
        });
      }

    });
  },
  cancel(){
    this.props.navigator.pop();
  },
  render(){
    return(
      <View style={styles.container}>
        {this.state.paired ?
          <View>
            <Text>Connected with a dispatcher! Help is on the way.</Text>
            <TouchableOpacity onPress={this.cancel} style={[styles.button, styles.buttonRed]}>
              <Text style={styles.buttonLabel}>Cancel request</Text>
            </TouchableOpacity>
          </View>
          :
          <View>
            <Text>Connecting you with a dispatcher...</Text>
            <TouchableOpacity onPress={this.cancel} style={[styles.button, styles.buttonRed]}>
              <Text style={styles.buttonLabel}>Cancel request</Text>
            </TouchableOpacity>
          </View>
        }
      </View>
    )
  }
})