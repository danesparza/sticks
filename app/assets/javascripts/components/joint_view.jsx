class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
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
      </div>
    );
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
