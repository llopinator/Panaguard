var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
	getInitialState() {
		var ws = new WebSocket('ws://localhost:8080/');
		return {
			socket: ws,
			username: "",
			password: "",
			registerUsername: "",
			registerPassword: "",
			registering: false
		}   
	},
	componentDidMount() {
		this.state.socket.onopen = function(){
			console.log('connection has been opened');
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
			<h1 style={{textAlign:'center'}}>Welcome, Dispatcher! Please log in</h1>
			<div style={{textAlign:'center'}}>
				<input type='text' onChange={username => this.setState({username: username})} placeholder='Username'>
				</input>
				<input type='password' onChange={password => this.setState({password: password})} placeholder='Password'>
				</input>
				<button>
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

ReactDOM.render(<App />, document.getElementById('root'));
