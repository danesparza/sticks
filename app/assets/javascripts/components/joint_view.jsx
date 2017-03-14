class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    console.log("Loading main svg code");
    loadMain(this.props.joint.name, JointConstants.joints.scarfEndCut1, JointConstants.joints.scarfEndCut2, JointConstants.joints.scarfCenterCut1, JointConstants.joints.scarfCenterCut2);
  }

  _download = () => {
    generateGCode();
    this._addToRecents();
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
      <div>
        <div id="menus">
          <p>{joint.name}</p>
          <form id="menu" action="form_action.asp">
            <input type="radio" name="section" defaultValue="end" defaultChecked /> End Cut<br />
            <input type="radio" name="section" defaultValue="center" /> Center Cut<br />

            Width (in): <input type="number" name="width" defaultValue="3.5" /><br />
            Depth (in): <input type="number" name="depth" defaultValue="1.5" /><br />

            <input type="reset" /><br /><br />
          </form>
          <button onClick={svgCalculate}>Preview Cut</button>
          <button onClick={this._download}>Download G-code</button>
        </div>
        <canvas id="pathCanvas" data-paper-resize></canvas>
      </div>
    );
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
