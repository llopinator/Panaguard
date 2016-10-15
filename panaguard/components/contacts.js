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
// var Keychain = require('react-native-keychain');
const UIManager = require('NativeModules').UIManager;
var styles = require('../styles/style');

module.exports = React.createClass({
  
  //attempts to retrieve existing emergency contacts
  componentDidMount() {
      AsyncStorage.getItem('contacts')
      .then(result => {
        if(result){
          var contacts = JSON.parse(result);
          this.setState(contacts);
        } else {
          console.log('Contacts not saved');
        }
      })
      .catch(error => {
        console.log(error);
      })
    },

  getInitialState() {
    return {
      contacts: [],
      addingContact: false,
      contactName: "",
      contactPhone: "",
      contactPhones: [],
      contactEmail: "",
      saved: true
    }
  },

  /*alters state to indicate that user is adding a contact, which will prompt
  the add contact box to expand*/
  addContact() {
    this.setState({
      addingContact: !this.state.addingContact
    })
  },

  /*saves the new contact whose information the user has filled out
  in the add contact box*/
  saveContact(){
    var contact = {
      name: this.state.contactName.slice(),
      phone: this.state.contactPhone.slice(),
      email: this.state.contactEmail.slice()
    }
    this.setState({
      contacts: this.state.contacts.concat(contact),
      contactName: "",
      condPhone: "",
      condemail: "",
      addingContact: false,
      saved: false          /*indicates that user must save in order for changes
      to persist*/
    })
  },

  //update an existing contact
  updateContact(index, field, val) {
    console.log("event", val);
    var contacts = [].concat(this.state.contacts);
    contacts[index][field] = val;
    this.setState({
      contacts: contacts,
      saved: false    /*indicates that user must save in order for changes
      to persist*/
    })
    console.log(this.state.contacts);
  },

  /*if the user makes changes - adding or updating contacts - they must
  press the save button, otherwise the changes won't persist*/
  save(){
    var state = this.state;
    state.saved = true;
    AsyncStorage.setItem('contacts', JSON.stringify(state))
    .then(resp => {
      this.setState({saved: true})
    });
  },
  //delete a contact
  deleteContact(index){
    var contacts = this.state.contacts;
    contacts.splice(index, 1);
    this.setState({
      contacts: contacts,
      saved: false    /*indicates that user must save in order for changes
      to persist*/
    })
  },
  render() {

    var contacts = this.state.contacts.map((contact, index) => {
      return (
        <View key={index} style={{borderWidth: 3}}>
          <Text index={index} style={{fontWeight: '500'}}>Name</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={contact.name}
            index={index}
            onChangeText={this.updateContact.bind(this, index, 'name')}
          />
          <Text index={index} style={{fontWeight: '500'}}>Phone Number</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={contact.phone}
            index={index}
            onChangeText={this.updateContact.bind(this, index, 'phone')}
          />
          <Text index={index} style={{fontWeight: '500'}}>Email</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={contact.email}
            index={index}
            onChangeText={this.updateContact.bind(this, index, 'email')}
          />
          <TouchableOpacity onPress={this.deleteContact.bind(this, index)} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Delete Contact</Text>
          </TouchableOpacity>
        </View>
      )
    });

    return (
      <View style={{'flex': 1, 'justifyContent': 'center'}}>
        <KeyboardAwareScrollView style={{'flex': 1}} ref='scrollView' keyboardDismissMode='interactive'>
          <Text style={[styles.label, {fontSize: 20}]}>Emergency Contacts</Text>
          {contacts}
          { this.state.addingContact ?
              <View style={{borderWidth: 3}}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Name"
                  onChangeText={(contactName) => this.setState({contactName: contactName})}
                  ref='contactName'
                  // onFocus={() => this.onFocus('condName')}
                />
                <Text style={styles.label}>Phone Number</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Phone Number"
                  onChangeText={(contactPhone) => this.setState({contactPhone: contactPhone})}
                  ref='contactPhone'
                  // onFocus={() => this.onFocus('condSymptoms')}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Email"
                  onChangeText={(contactEmail) => this.setState({contactEmail: contactEmail})}
                  ref='contactEmail'
                  // onFocus={() => this.onFocus('condMed')}
                />
                <TouchableOpacity onPress={() => this.saveContact()} style={[styles.button, styles.buttonGreen]}>
                  <Text style={styles.buttonLabel}>Save Emergency Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addContact()} style={[styles.button, styles.buttonRed]}>
                  <Text style={styles.buttonLabel}>Cancel</Text>
                </TouchableOpacity>
              </View> 
            : 
              <TouchableOpacity onPress={() => this.addContact()} style={[styles.button, styles.buttonBlue]}>
                <Text style={styles.buttonLabel}>Add an Emergency Contact</Text>
              </TouchableOpacity>
          }
        </KeyboardAwareScrollView>
        { this.state.saved ? 
          <Text>Information up to date</Text>
          :
          <TouchableOpacity onPress={this.save} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Save</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
});