class Home extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      joints: [],
    };
  }

  componentDidMount() {
    this._fetchAllJoints();
    this._fetchRecentPieces();
  }

  _fetchAllJoints = () => {
    const route = ApiConstants.joints.home;
    const resolve = (response) => this.setState({ joints: response });
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject);
  }

  _fetchRecentPieces = () => {
    const route = ApiConstants.recents.show;
    const resolve = (response) => this.setState({ recent_pieces: response });
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
    const { recent_pieces } = this.state;

    let recents = <Panel items={recent_pieces}/>;
    let e2ePanel = <Panel items={e2e} />;
    let e2mPanel = <Panel items={e2m} />;
    let m2mPanel = <Panel items={m2m} />;

    return (
      <div className="home-view">
        <Blueprint.Core.Tabs2 id="home">
          <Blueprint.Core.Tab2 id="rec" title="Recents" panel={recents} />
          <Blueprint.Core.Tab2 id="e2e" title="End to End" panel={e2ePanel} />
          <Blueprint.Core.Tab2 id="e2m" title="End to Middle" panel={e2mPanel} />
          <Blueprint.Core.Tab2 id="m2m" title="Middle to Middle" panel={m2mPanel} />
        </Blueprint.Core.Tabs2>
      </div>
    );
  }
}
