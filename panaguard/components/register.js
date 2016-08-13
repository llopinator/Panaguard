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
  press() {
    if(this.state.username.length !== 0 &&
       this.state.password.length !== 0) {
      fetch('http://localhost:3000/auth/register', {
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
        if(responseJson.success){
          return this.props.navigator.replace({
                  component: Login,
                  title: "Login",
                  passProps: {
                    onLogin: () => 
                      this.props.onLogin()
                  }
            });
        } else {
          Alert.alert(
            responseJson.error
          );
        }
      })
      .catch((err) => {
        if(err){
          Alert.alert(
            err.message
          );
        }
      });
    } else if (this.state.username.length &&
               this.state.password.length < 8) {
        Alert.alert(
          'Password must be at least 8 characters long'
        );
    } else {
      Alert.alert(
        'Please enter a non-empty username and password'
      );
    }
  },
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.textBig}>Register</Text>
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your username"
          onChangeText={(text) => this.setState({username: text})}
        />
        <TextInput
          style={{height: 40, textAlign: 'center'}}
          placeholder="Enter your password"
          onChangeText={(text) => this.setState({password: text})}
          secureTextEntry={true}
        />
        <TouchableOpacity onPress={this.press} style={[styles.button, styles.buttonGreen]}>
          <Text style={styles.buttonLabel}>Register</Text>
        </TouchableOpacity>
      </View>
    );
  }
});