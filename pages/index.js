import { Component } from 'react';
import io from 'socket.io-client';
import fetch from 'isomorphic-fetch';

class HomePage extends Component {
  // fetch old messages data from the server
  static async getInitialProps({ req }) {
    const response = await fetch(
      'https://next-socket-io-fvayxtyjtu.now.sh/messages'
    );
    const messages = await response.json();
    return { messages };
  }

  static defaultProps = {
    messages: []
  };

  // init state with the prefetched messages
  state = {
    field: '',
    messages: this.props.messages
  };

  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('https://next-socket-io-fvayxtyjtu.now.sh');
    this.socket.on('message', this.handleMessage);
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off('message', this.handleMessage);
    this.socket.close();
  }

  // add messages from server to the state
  handleMessage = message => {
    console.log('message', message);

    this.setState(state => ({ messages: state.messages.concat(message) }));
  };

  handleChange = event => {
    this.setState({ field: event.target.value });
  };

  // send messages to server and add them to the state
  handleSubmit = event => {
    event.preventDefault();

    // create message object
    const message = {
      id: new Date().getTime(),
      value: this.state.field
    };

    // send object to WS server
    this.socket.emit('message', message);

    // add it to state and clean current input value
    this.setState(state => ({
      field: '',
      messages: state.messages.concat(message)
    }));
  };

  render() {
    return (
      <main>
        <div>
          <ul>
            {this.state.messages.map(message => (
              <li key={message.id}>{message.value}</li>
            ))}
          </ul>
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="Hello world!"
              value={this.state.field}
            />
            <button>Send</button>
          </form>
        </div>
      </main>
    );
  }
}

export default HomePage;
