//PHASED OUT - users no longer have to log in

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
  getInitialState() {
    return {
      username: "",
      password: ""
    }
  },
  register() {
    this.props.navigator.push({
      component: Register,
      title: "Register",
      status: "",
      passProps: {
        onLogin: () => 
          this.props.onLogin()
      }
    });
  },
  press() {
    if(this.state.username.length !== 0 &&
       this.state.password.length !== 0) {
      fetch('http://localhost:3000/auth/authenticate', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          username: this.state.username,
          password: this.state.password,
        })
      })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log('RESP b4 keychain: ', responseJson);
        return Keychain
          .setGenericPassword(responseJson.token, "pwd");
        })
      .then(() => {
        console.log('popped');
        this.props.onLogin();
        return this.props.navigator.pop();
      })
      .catch((err) => {
        if(err){
          Alert.alert(
            err.message
          );
        }
        console.log(err.stack);
      });
    } else {
      Alert.alert(
        'Please enter a non-empty username and password'
      );
    }
  },
  render() {
    return (
      <View style={styles.container}>
      <Text style={styles.label}>Username</Text>
      <TextInput
        style={{height: 40, textAlign: 'center'}}
        placeholder="Enter your username"
        onChangeText={(text) => this.setState({username: text})}
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={{height: 40, textAlign: 'center'}}
        placeholder="Enter your password"
        onChangeText={(text) => this.setState({password: text})}
        secureTextEntry={true}
      />
      <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonRed]}>
        <Text style={styles.buttonLabel}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonRed]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Forgot Password</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.buttonBlue]} onPress={this.register}>
          <Text style={styles.buttonLabel}>Register</Text>
      </TouchableOpacity> 
      </View>
    );
  }
});