import React, { PropTypes, Component } from 'react';
import ReactNative from 'react-native';
import {
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

module.exports = React.createClass({
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
      loggedIn: token && password,
      emergency: false
    }
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
    this.setState({
      emergency: !this.state.emergency
    })
  },
  render() {
    return (
      <View style={styles.container}>
        { this.state.emergency ?
          //render emergency view
          <View>
            <Text>Help is on the Way!</Text>
            <TouchableOpacity onPress={this.emergency} style={[styles.button, styles.buttonRed]}>
              <Text style={styles.buttonLabel}>Cancel request</Text>
            </TouchableOpacity>
          </View>
          :
          //render non-emergency view
          <View>
            <Text style={styles.textBig}>Panaguard</Text>
            <TouchableOpacity onPress={this.emergency} style={[styles.button, styles.buttonRed]}>
              <Text style={styles.buttonLabel}>EMERGENCY</Text>
            </TouchableOpacity>
            { this.state.loggedIn ? 
              // render logged in view
              <View>
                <Text>Welcome back!</Text>
                <TouchableOpacity onPress={this.contacts} style={[styles.button, styles.buttonGreen]}>
                  <Text style={styles.buttonLabel}>Update Emergency Contacts</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.medical} style={[styles.button, styles.buttonBlue]}>
                  <Text style={styles.buttonLabel}>Update Medical Info</Text>
                </TouchableOpacity>
              </View>
              :
              // render the login button
              <View>
                <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
                  <Text style={styles.buttonLabel}>Tap to Login</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
                  <Text style={styles.buttonLabel}>Register</Text>
                </TouchableOpacity>
              </View>
            }
          </View>
        }
      </View>

    );
  }
});