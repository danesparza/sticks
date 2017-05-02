class Command extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      wsConnected: false,
    };
  }

  componentDidMount = () => {
    console.log(this.props)
    // WEB SOCKET
    ws = new WebSocket("ws://localhost:8888/ws");

    ws.onopen = () => {
      this.setState({ wsConnected: true, });
      console.log("Connected!")
    }.bind(this);

    ws.onclose = () => {
      this.setState({ wsConnected: false, });
      console.log("Disconnected!");
    }.bind(this);

    ws.onmessage = this.receiveMessage;
  }

  sendCommand = (command) => {
    console.log(command)

    ws.send("g91");
    ws.send(command);
    ws.send("g90");
  }

  receiveMessage = (evt) => {
    let box = document.querySelector(".messages");
    let newMessage = document.createElement('p');

    newMessage.textContent = "Server: " + evt.data;
    box.prepend(newMessage);
  }

  render() {
    let connectedState;
    const { wsConnected } = this.state;

    if (wsConnected) {
      connectedState = "Connected!";
    } else {
      connectedState = "Not connected.";
    }

    return (
      <div>
        <div className={`connected-msg connected-${wsConnected}`}>
          { connectedState }
        </div>
        <div className="btn-container">
          <button className="pt-button pt-large"
            onClick={this.sendCommand.bind(this, "g0 y10")}>
              <span className="pt-icon-large pt-icon-arrow-up"></span>
          </button>
          <br/>

          <button className="pt-button pt-large"
            onClick={this.sendCommand.bind(this, "g0 x-10")}>
            <span className="pt-icon-large pt-icon-arrow-left"></span>
          </button>
          <button className="pt-button pt-large"
            onClick={this.sendCommand.bind(this, "$h")}>
            <span className="pt-icon-large pt-icon-home"></span>
          </button>
          <button className="pt-button pt-large"
            onClick={this.sendCommand.bind(this, "g0 x10")}>
              <span className="pt-icon-large pt-icon-arrow-right"></span>
          </button>
          <br/>

          <button className="pt-button pt-large"
            onClick={this.sendCommand.bind(this, "g0 y-10")}>
              <span className="pt-icon-large pt-icon-arrow-down"></span>
          </button>
        </div>

        <h5>Responses</h5>
        <div className="messages"></div>
      </div>
    );
  }
}
