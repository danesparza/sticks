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
        <h1>{joint.name}</h1>
        <h2>Pieces:</h2>
        {showPieces}
        <div id="menus">
          <h1>Sticks Very Good</h1>
          <p>Joint: 包み蟻掛け仕口</p>
          <form id="menu" action="form_action.asp">
            <input type="radio" name="section" value="end" checked /> End Cut<br />
            <input type="radio" name="section" value="center" /> Center Cut<br />

            Width (in): <input type="number" name="width" value="3.5" /><br />
            Depth (in): <input type="number" name="depth" value="1.5" /><br />

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
