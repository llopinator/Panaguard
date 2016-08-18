var React = require('react');
var ReactDOM = require('react-dom');
import { Router, Route, browserHistory } from 'react-router';

var App = React.createClass({
	getInitialState() {
		return {
			username: "",
			password: "",
			registerUsername: "",
			registerPassword: "",
			registering: false
		}   
	},
	login(){
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
			.then(response => response.json())
			.then(responseJson => {
				if(responseJson.success){
					localStorage.setItem('dispatchToken', responseJson.token)
					browserHistory.push('/dashboard')
				} else {
					alert('error: ', responseJson.error);
				}
			})
			.catch(err => {
				if(err){
					console.error(err);
					alert('err: ', err);
				}
			})
		}
	},
	register(){
		if(this.state.registerUsername.length !== 0 &&
			this.state.registerPassword.length !== 0) {
			fetch('http://localhost:3000/auth/register', {
				method: 'POST',
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: this.state.registerUsername,
					password: this.state.registerPassword,
				})
			})
			.then(response => response.json())
			.then(responseJson => {
				if(responseJson.success){
					alert('Registration successful');
				} else {
					alert('error: ', responseJson.error);
				}
			})
			.catch(err => {
				if(err){
					alert('err: ', err);
				}
			})	

		}
	},
	render() { //chatroom component
	return (
		<div style={{display: 'block'}}>
			<h1 style={{textAlign:'center'}}>Panaguard</h1>
			<div style={{textAlign:'center'}}>
				<input type='text' onChange={e => this.setState({username: e.target.value})} placeholder='Username'>
				</input>
				<input type='password' onChange={e => this.setState({password: e.target.value})} placeholder='Password'>
				</input>
				<button onClick={this.login}>
					Log in
				</button>
			</div>
			{this.state.registering ?
			<div style={{textAlign:'center'}}>
				<button onClick={()=> this.setState({registering: !this.state.registering})}>
					Hide register form
				</button>
				<input type='text' onChange={e => this.setState({registerUsername: e.target.value})} placeholder='Username'>
				</input>
				<input type='password' onChange={e => this.setState({registerPassword: e.target.value})} placeholder='Password'>
				</input>
				<button onClick={this.register}>
					Register
				</button>
			</div>
			:
			<div style={{textAlign:'center'}}>
				<button onClick={()=> this.setState({registering: !this.state.registering})}>
					Click here to register
				</button>
			</div>
			}
		</div>
		);
	}
});

var Dashboard = React.createClass({
	emergencyNav(){
		browserHistory.push('/emergencyNavigator');
	},
	logout(){
		localStorage.removeItem('dispatchToken');
		browserHistory.push('/');
	},
	render(){
		return (
			<div style={{textAlign: 'center'}}>
				Dashboard
				<button onClick={this.emergencyNav}>
					Begin listening for emergencies
				</button>
				<button onClick={this.logout}>
					Logout
				</button>
			</div>
		)
	}
});

var emergencyNavigator = React.createClass({
	getInitialState() {
		var ws = new WebSocket('ws://localhost:8080/');
		return {
			socket: ws,
			connected: false,
			emergency: false,
			canceled: false,
			typeOfEmergency: ""
		}   
	},
	componentDidMount() {
		this.state.socket.onopen = function(){
			//console.log('connection has been opened');
			this.state.socket.send(JSON.stringify({
				type: 'auth',
				token: localStorage.getItem('dispatchToken'),
				op: true
			}));
		}.bind(this);

		this.state.socket.onmessage = (event) => {
			var msg = JSON.parse(event.data);

			if(msg.type === 'ack'){
				console.log('Dispatcher has been connected - awaiting emergencies');
				this.setState({
					connected: true
				})
			}

			if(msg.type === 'paired'){
				msg.emergency.medinfo = JSON.parse(msg.emergency.medinfo)
				msg.emergency.position = JSON.parse(msg.emergency.position);
				this.setState({
					emergency: msg.emergency
				})
			}

			if(msg.type === 'canceled'){
				alert('User canceled emergency');
				this.setState({
					canceled: true
				})
			}

			if(msg.type === 'updatePosition' && this.state.emergency){
				var emergency = Object.assign({}, this.state.emergency);
				emergency.position = msg.position;
				this.setState({
					emergency: emergency
				})
			}

			if(msg.type === 'identifyEmergency'){
				this.setState({
					typeOfEmergency: msg.emergency
				});
			}

		};
	},
	resolved(event, done){
		console.log("event", event)
		console.log("done", done)
		this.state.socket.send(JSON.stringify({
			type: 'resolved',
			done: done
		}));

		this.setState({
			emergency: false
		})
		if(done){
			browserHistory.goBack();
		}
	},
	canceled(){
		this.state.socket.send(JSON.stringify({
			type: 'canceled'
		}));

		this.setState({
			emergency: false,
			canceled: false
		})
	},
	endConnection(){
		this.state.socket.send(JSON.stringify({
			type: 'endConnection'
		}));
		browserHistory.goBack();
	},
	render(){

		console.log("state upon render", this.state);
		if(this.state.emergency){
			//console.log('POSITION ', this.state.emergency.position);
			var conditions = this.state.emergency.medinfo.conditions.map(function(condition, index){
				return (
					<div key={index}>
						<h2>{condition.name}</h2>
						<h3>Symptoms: {condition.symptoms}</h3>
						<h3>Medication: {condition.medication}</h3>
						<h3>Notes: {condition.notes}</h3>
					</div>
				)
			});
		}

		return (
			<div>
			{ this.state.emergency ?
				<div>
					{this.state.canceled ?
						<div>
							<button onClick={this.canceled}>Emergency canceled - reenter queue</button>
							<button onClick={this.endConnection}>Stop listening for emergencies</button>
						</div>
						:
						<div>
							<button onClick={this.resolved}>Resolve emergency</button>
							<button onClick={(event) => this.resolved(event, true)}>Resolve emergency and stop listening for emergencies</button>
						</div>
					}
					<h1 style={{textAlign: 'center'}}>{this.state.typeOfEmergency ? this.state.typeOfEmergency : 'Waiting for user to identify emergency...'}</h1>
					<h3>Latitude: {this.state.emergency.position.coords.latitude}</h3>
					<h3>Longitude: {this.state.emergency.position.coords.longitude}</h3>
					<h3>Altitude: {this.state.emergency.position.coords.altitude}</h3>
					<h3>Accuracy: {this.state.emergency.position.coords.accuracy} meters</h3>
					<h3>Altitude accuracy: {this.state.emergency.position.coords.altitudeAccuracy} meters</h3>
					<h3>Direction of travel: {this.state.emergency.position.coords.heading} degrees</h3>
					<h3>Speed of travel: {this.state.emergency.position.coords.speed}</h3>
					<h3>Phone number: {this.state.emergency.medinfo.phone}</h3>
					<h1>Medical Information</h1>
					<h3>Name: {this.state.emergency.medinfo.firstName} {this.state.emergency.medinfo.lastName}</h3>
					<h3>Weight: {this.state.emergency.medinfo.weight}</h3>
					<h3>Height: {this.state.emergency.medinfo.height}</h3>
					<h3>Date of birth: {this.state.emergency.medinfo.date}</h3>
					<h3>Notes for dispatcher: {this.state.emergency.medinfo.notes}</h3>
					<h1>Medical Conditions</h1>
					{conditions}
				</div>
				:
				<div>
					{this.state.connected ?
						<div style={{textAlign: 'center'}}>
							Awaiting emergencies - be ready.
							<button onClick={this.endConnection}>
								Stop listening for emergencies
							</button>
						</div>
						:
						<div style={{textAlign: 'center'}}>
							Connecting to the emergency channel...
						</div>
					}
				</div>
			}
			</div>
		)
	}
});

function requireAuth(nextState, replace){
	if(!localStorage.getItem('dispatchToken')){
		replace({
			pathname: '/'
		})
	}
}

ReactDOM.render(
	<Router history={browserHistory}>
		<Route path="/" component={App}/>
		<Route path="/dashboard" component={Dashboard} onEnter={requireAuth}/>
		<Route path="/emergencyNavigator" component={emergencyNavigator} onEnter={requireAuth}/>
	</Router>, 
  document.getElementById('root'));
