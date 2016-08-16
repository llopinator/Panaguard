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
					Begin shift
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
			connected: false
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
		};
	},
	dashboard(){
		browserHistory.goBack();
	},
	render(){
		return (
			<div>
				{this.state.connected ?
					<div style={{textAlign: 'center'}}>
						Awaiting emergencies - be ready.
						<button onClick={this.dashboard}>
							End shift
						</button>
					</div>
					:
					<div style={{textAlign: 'center'}}>
						Connecting to the emergency channel...
						<button onClick={this.dashboard}>
							End shift
						</button>
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
