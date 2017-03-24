class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    this._fetchJSON();
  }

  _fetchJSON = () => {
    const route = JointConstants.joints.combined;
    const resolve = (response) => {
      this.setState({
        piece1cut1: response.p1c1,
        piece1cut2: response.p1c2,
        piece2cut1: response.p2c1,
        piece2cut2: response.p2c2,
      })
      this._installPaper();
    }
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject);
  }

  _download = () => {
    generateGCode();
    this._addToRecents();
  }

  _installPaper = () => {
    paper.install(window);
    paper.setup('pathCanvas');
    paper.loadCustomLibraries();

    this.setState({
      pseudoView1: new Rectangle(),
      pseudoView2: new Rectangle(),
    }, () => {
      this._refreshView();
    })
  }

  _refreshView = () => {
    let pseudoView1 = this.state.pseudoView1;
    let pseudoView2 = this.state.pseudoView2;

    var rectSize = new Size(view.bounds.width / 2, view.bounds.height);
    pseudoView1.size = rectSize;
    pseudoView1.topLeft = new Point(0, 0);
    pseudoView2.size = rectSize;
    pseudoView2.topLeft = pseudoView1.topRight;

    this.setState({ pseudoView1, pseudoView2 })
  }

  _addToRecents = () => {
    const { pieces } = this.props;

    const route = ApiConstants.recents.add(pieces[0].id);
    console.log(pieces[0].id)
    const resolve = (response) => console.log('success');
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject)
  }

  render() {
    const { joint, pieces } = this.props;
    let showPieces;

    if (this.props.pieces) {
      showPieces = pieces.map((item, index) => {
        return <div key={index}>
          <h3>Piece {index + 1}: {item.name}</h3>
        </div>
      })
    }

    return (
      <div className="joint-view">
        <nav className="pt-navbar pt-dark joint-view-nav">
          <div className="pt-navbar-group back-btn">
            <a href="/" className="pt-button pt-minimal">back</a>
          </div>
          <div className="pt-navbar-group joint-title">{joint.name}</div>
        </nav>



        <div id="menus">
          <form id="menu" action="form_action.asp">
            <input type="radio" name="section"
              defaultValue="end" defaultChecked /> End Cut<br />
            <input type="radio" name="section"
              defaultValue="center" /> Center Cut<br />

            Width (in): <input type="number" name="width" defaultValue="3.5" /><br />
            Depth (in): <input type="number" name="depth" defaultValue="1.5" /><br />

            <input type="reset" /><br /><br />
          </form>
          <button className="pt-button" onClick={svgCalculate}>Preview Cut</button>
          <button className="pt-button" onClick={this._download}>Download G-code</button>
        </div>
        <canvas id="pathCanvas" data-paper-resize></canvas>
      </div>
    );
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
