class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount = () => {
    console.log("Loading main svg code");
    loadMain(this.props.joint.name, JointConstants.joints.scarfEndCut1, JointConstants.joints.scarfEndCut2, JointConstants.joints.scarfCenterCut1, JointConstants.joints.scarfCenterCut2);
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
        <canvas id="pathCanvas" data-paper-resize></canvas>
      </div>
    );
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
