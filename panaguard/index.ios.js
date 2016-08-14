/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

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
var styles = require('./styles/style');
var Login = require('./components/login');
var Register = require('./components/register');
var Medical = require('./components/medical');
var Contacts = require('./components/contacts');
var Emergency = require('./components/emergency');
var DeviceUUID = require('react-native-device-uuid');

// 1
// This is the root view
var panaguard = React.createClass({
  render() {
    return (
      <NavigatorIOS
        initialRoute={{
          component: Landing,
          title: "Landing"
        }}
        style={{flex: 1}}
      />
    );
  }
});

var Landing = React.createClass({
  getInitialState(){
    var token = false;
    var password = false; 
    //debugger;
    Keychain
      .getGenericPassword()
      .then((credentials) => {
        token = credentials.username;
        password = credentials.password;
      })
      .catch((err) => {
        console.log('Could not load credentials. ' + err);
      });
      console.log('t: ', token, ' pwd: ', password);
    return {
      loggedIn: token && password
    }
  },
  componentDidMount(){
    AsyncStorage.getItem('user')
    .then(result => {
      console.log('result: ', result);
      if(!result){
        console.log('true');
        return DeviceUUID.getUUID()
        .then(uuid => {
          console.log('uuid: ', uuid);
          return fetch('http://localhost:3000/auth/newuser', {
            method: 'POST',
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              uuid: uuid,
            })
          })
        })
        .then(response => response.json())
        .then(responseJSON => {
          console.log('resJSON: ', responseJSON);
          return AsyncStorage.setItem('user', responseJSON.token);
        })
      }
    })
    .catch((err) => {
      if(err){
        Alert.alert(
          err.message
        );
      }
    });
  },
  press() {
    this.props.navigator.push({
      component: Login,
      title: "Login",
      passProps: {
        onLogin: () => 
          this.setState({
            loggedIn: true
          })
      }
    })
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register",
      passProps: {
        onLogin: () => 
          this.setState({
            loggedIn: true
          })
      }
    });
  },
  medical(){
    this.props.navigator.push({
      component: Medical,
      title: "Medical Information"
    });
  },
  contacts(){
    this.props.navigator.push({
      component: Contacts,
      title: "Emergency Contacts"
    })
  },
  emergency(){
    this.props.navigator.push({
      component: Emergency,
      title: "Emergency"
    })
  },
  render() {
    return (
      <View style={styles.container}>
        <View>
          <Text style={styles.textBig}>Panaguard</Text>
          <TouchableOpacity onPress={this.emergency} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>EMERGENCY</Text>
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={this.contacts} style={[styles.button, styles.buttonGreen]}>
              <Text style={styles.buttonLabel}>Update Emergency Contacts</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.medical} style={[styles.button, styles.buttonBlue]}>
              <Text style={styles.buttonLabel}>Update Medical Info</Text>
            </TouchableOpacity>
          </View> 
        </View>                
      </View>
    );
  }
});

AppRegistry.registerComponent('panaguard', () => panaguard );