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

  _filterByJointType = () => {
    const { joints } = this.state;

    if (!joints) {
      console.log("No joints have been loaded!");
      return null;
    }

    let e2e = [], e2m = [], m2m = [];

    joints.forEach((item) => {
      switch (item.type) {
        case "end_to_end":
          e2e.push(item);
          break;
        case "end_to_middle":
          e2m.push(item);
          break;
        case "middle_to_middle":
          m2m.push(item);
          break;
      }
    })

    return { e2e: e2e, e2m: e2m, m2m: m2m };
  }

  render() {
    const { e2e, e2m, m2m } = this._filterByJointType();

    let allPieces = [e2e, e2m, m2m].map((i) => {
      return i.map((item, index) => {
        const route = RouteConstants.joints.show(item.id);
        return (
          <div key={index}>
            <h3><a href={route}>{item.name}</a></h3>
            <p>{item.description}</p>
          </div>
        )
      })
    })

    return (
      <div>
        <h1>Recent Pieces</h1>
        <RecentPieces />

        <h1>End To End</h1>
        { allPieces[0] }

        <h1>End To Middle</h1>
        { allPieces[1] }

        <h1>Middle To Middle</h1>
        { allPieces[2] }
      </div>
    );
  }
}
