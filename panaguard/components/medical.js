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

module.exports = React.createClass({
  componentDidMount() {
    AsyncStorage.getItem('medical')
    .then(result => {
      if(result){
        var medical = JSON.parse(result);
        console.log('medical :', medical);
        medical.date = new Date(medical.date);
        medical.timeZoneOffsetInHours = this.props.timeZoneOffsetInHours;
        this.setState(medical);
      } else {
        console.log('Medical information not saved on disk');
      }
    })
    .catch(error => {
      console.log(error);
    })
  },
  getDefaultProps() {
    var date = new Date();
    AsyncStorage.getItem('medical')
    .then(result => {
      if(result){
        var medical = JSON.parse(result);
        date = Date(medical.date)
      }
    })
    return {
      date: date,
      timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60
    };
  },
  getInitialState(){

    return {
      firstName: "",
      lastName: "",
      date: this.props.date,
      timeZoneOffsetInHours: this.props.timeZoneOffsetInHours,
      animationType: 'slide',
      transparent: true, //or that rgb
      dateVisible: false,
      weight: 0,
      height: 0,
      notes: "",
      // allergies: "",
      conditions: [],
      condName: "",
      condSymptoms: "",
      condMed: "",
      condNotes: "",
      saved: true,
      addingCond: false
    }
  },
  onDateChange(date) {
    this.setState({date: date, saved: false});
  },
  setModalVisible(modal, visible) {
    var newState = {};
    newState[modal] = visible;
    console.log(newState);
    this.setState(newState);
  },
  addCond() {
    this.setState({
      addingCond: !this.state.addingCond
    })
  },
  saveCond(){
    var condition = {
      name: this.state.condName.slice(),
      symptoms: this.state.condSymptoms.slice(),
      medication: this.state.condMed.slice(),
      notes: this.state.condNotes.slice()
    }
    this.setState({
      conditions: this.state.conditions.concat(condition),
      condName: "",
      condSymptoms: "",
      condMed: "",
      condNotes: "",
      addingCond: false,
    })
  },

  updateCond(index, field, val) {
    console.log("event", val);
    var conditions = [].concat(this.state.conditions);
    conditions[index][field] = val;
    this.setState({
      conditions: conditions,
      saved: false
    })
  },
  save(){
    var state = this.state;
    state.saved = true;
    AsyncStorage.setItem('medical', JSON.stringify(state))
    .then(resp => {
      this.setState({saved: true})
    });
  },
  deleteCondition(index){
    var conditions = this.state.conditions;
    conditions.splice(index, 1);
    this.setState({
      conditions: conditions,
      saved: false
    })
  },
 //fsdfdsafdsa
  // onFocus(ref) {
  //   const handle = ReactNative.findNodeHandle(this.refs[ref]);
  //   UIManager.measureLayoutRelativeToParent(
  //     handle, 
  //     (e) => {console.error(e)}, 
  //     (x, y, w, h) => {
  //       console.log('offset', x, y, w, h);
  //       this.refs.scrollView
  //       .scrollTo({
  //         y: y - 100,
  //         animated: true
  //       })
  //     });
  // },

  render() {

    var modalBackgroundStyle = {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    };

    var conditions = this.state.conditions.map((condition, index) => {
      return (
        <View key={index} style={{borderWidth: 3}}>
          <Text index={index} style={{fontWeight: '500'}}>Name of Condition</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={condition.name}
            index={index}
            onChangeText={this.updateCond.bind(this, index, 'name')}
          />
          <Text index={index} style={{fontWeight: '500'}}>Symptoms</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={condition.symptoms}
            index={index}
            onChangeText={this.updateCond.bind(this, index, 'symptoms')}
          />
          <Text index={index} style={{fontWeight: '500'}}>Medication(s) and Dosage</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={condition.medication}
            index={index}
            onChangeText={this.updateCond.bind(this, index, 'medication')}
          />
          <Text index={index} style={{fontWeight: '500'}}>Notes</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            defaultValue={condition.notes}
            index={index}
            onChangeText={this.updateCond.bind(this, index, 'notes')}
          />
          <TouchableOpacity onPress={this.deleteCondition.bind(this, index)} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Delete Medical Condition</Text>
          </TouchableOpacity>
        </View>
      )
    });

    return (
      <View style={{'flex': 1, 'justifyContent': 'center'}}>
        <KeyboardAwareScrollView style={{'flex': 1}} ref='scrollView' keyboardDismissMode='interactive'>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            placeholder="First name"
            onChangeText={(text) => this.setState({firstName: text, saved: false})}
            ref='firstName'
            defaultValue={this.state.firstName}
            // onFocus={() => this.onFocus('firstName')}
          />
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            placeholder="Last name"
            onChangeText={(text) => this.setState({lastName: text, saved: false})}
            ref='lastName'
            defaultValue={this.state.lastName}
            // onFocus={() => this.onFocus('lastName')}
          />
          <Text style={styles.label}>Date of Birth</Text>
          <Modal
            animationType={this.state.animationType}
            transparent={this.state.transparent}
            visible={this.state.dateVisible}
            onRequestClose={() => {this.setModalVisible('dateVisible', false)}}
            >
            <View style={[{flex: 1, justifyContent: 'center'}, modalBackgroundStyle]}>
              <DatePickerIOS
                date={this.state.date}
                mode="date"
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateChange}
                style={{'backgroundColor': 'rgba(0, 0, 0, 0.03)'}}
              />
              <TouchableOpacity onPress={() => this.setModalVisible('dateVisible', false)}
                                style={[styles.button, styles.buttonBlue]}>
                <Text style={styles.buttonLabel}>Save</Text>
              </TouchableOpacity>
            </View>
          </Modal>
          <TouchableOpacity onPress={() => this.setModalVisible('dateVisible', true)}>
             <Text> Press for DoB</Text>
          </TouchableOpacity>
          <Text style={styles.label}>Weight (lbs)</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            placeholder="Weight"
            keyboardType="numeric"
            returnKeyType={'done'}
            onChangeText={(weight) => this.setState({weight: weight, saved: false})}
            ref='weight'
            defaultValue={(this.state.weight).toString()}
            // onFocus={() => this.onFocus('weight')}
          />
          <Text style={styles.label}>Height (inches)</Text>
          <TextInput
            style={{height: 40, textAlign: 'center'}}
            placeholder="Height"
            keyboardType="numeric"
            returnKeyType={'done'}
            onChangeText={(height) => this.setState({height: height, saved: false})}
            ref='height'
            defaultValue={(this.state.height).toString()}
            // onFocus={() => this.onFocus('height')}
          />
          <Text style={styles.label}>Notes for the Dispatcher</Text>
          <TextInput
            style={{height: 60, textAlign: 'center'}}
            placeholder="Notes"
            onChangeText={(notes) => this.setState({notes: notes, saved: false})}
            ref='notes'
            defaultValue={this.state.notes}
            // onFocus={() => this.onFocus('notes')}
          />
          <Text style={[styles.label, {fontSize: 20}]}>Medical Conditions</Text>
          {conditions}
          { this.state.addingCond ?
              <View style={{borderWidth: 3}}>
                <Text style={styles.label}>Name of Condition</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Name of condition"
                  onChangeText={(condName) => this.setState({condName: condName, saved: false})}
                  ref='condName'
                  // onFocus={() => this.onFocus('condName')}
                />
                <Text style={styles.label}>Symptoms</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Symptoms"
                  onChangeText={(condSymptoms) => this.setState({condSymptoms: condSymptoms, saved: false})}
                  ref='condSymptoms'
                  // onFocus={() => this.onFocus('condSymptoms')}
                />
                <Text style={styles.label}>Medication(s) and Dosage</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Medication(s) and Dosage"
                  onChangeText={(condMed) => this.setState({condMed: condMed, saved: false})}
                  ref='condMed'
                  // onFocus={() => this.onFocus('condMed')}
                />
                <Text style={styles.label}>Notes</Text>
                <TextInput
                  style={{height: 40, textAlign: 'center'}}
                  placeholder="Notes"
                  onChangeText={(condNotes) => this.setState({condNotes: condNotes, saved: false})}
                  ref='condNotes'
                  // onFocus={() => this.onFocus('condNotes')}
                />
                <TouchableOpacity onPress={() => this.saveCond()} style={[styles.button, styles.buttonGreen]}>
                  <Text style={styles.buttonLabel}>Save Medical Condition</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.addCond()} style={[styles.button, styles.buttonRed]}>
                  <Text style={styles.buttonLabel}>Cancel</Text>
                </TouchableOpacity>
              </View> 
            : 
              <TouchableOpacity onPress={() => this.addCond()} style={[styles.button, styles.buttonBlue]}>
                <Text style={styles.buttonLabel}>Add Medical Condition</Text>
              </TouchableOpacity>
          }
        </KeyboardAwareScrollView>
        {this.state.saved ?
          <Text>Informaton up to date</Text>
          :
          <TouchableOpacity onPress={this.save} style={[styles.button, styles.buttonRed]}>
            <Text style={styles.buttonLabel}>Save</Text>
          </TouchableOpacity>
        }
      </View>
    )
  }
})