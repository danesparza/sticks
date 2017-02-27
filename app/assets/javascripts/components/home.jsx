class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      joints: [],
    };
  }

  componentDidMount() {
    this._fetchAllJoints();
  }

  _fetchAllJoints = () => {
    const route = ApiConstants.joints.home;
    const resolve = (response) => this.setState({ joints: response });
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject);
  }

  render() {
    let joints;

    if (this.state.joints) {
      joints = this.state.joints.map((item, index) => {
        const route = RouteConstants.joints.show(item.id);

        return <div key={index}>
          <h3><a href={route}>{item.name}</a></h3>
          <p>{item.description}</p>
        </div>
      })
    } else {
      joints = "loading...";
    }

    return (
      <div>
        Hello there. This is the home react component :)
        <div>{joints}</div>
      </div>
    );
  }
}
