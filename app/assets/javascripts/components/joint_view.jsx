class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    console.log("Loading main svg code");
    loadMain();
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
          <button onClick={generateGCode}>Download G-code</button>
        </div>
        <canvas id="pathCanvas" data-paper-resize></canvas>
      </div>
    );
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
