var React = require('react');
var ReactDOM = require('react-dom');

var App = React.createClass({
  getInitialState: function() {
    return {
      socket: io()
    }   
  },
  componentDidMount: function() {

    // WebSockets Receiving Event Handlers
    console.log("Component mounted");
    this.state.socket.on('connect', function() {
      console.log('connected');
    }.bind(this));


    this.state.socket.on('errorMessage', function(message) {
      prompt('Error: ' + message);
    }.bind(this));
  },
  render: function() { //chatroom component
    return (
      <h2>
        Awaiting an emergency...
      </h2>
    );
  }
});

ReactDOM.render(<App />, document.getElementById('root'));
