class RecentPieces extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      recent_pieces: [],
    };
  }

  componentDidMount = () => {
    this._fetchRecentPieces();
  }

  _fetchRecentPieces = () => {
    const route = ApiConstants.recents.show;
    const resolve = (response) => this.setState({ recent_pieces: response });
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject);
  }

  render() {
    const { recent_pieces } = this.state;
    let recents;

    recents = recent_pieces.map((piece) => {
      return <div>{piece.id}</div>
    })

    console.log(this.state.recent_pieces);
    return (
      <div>{recents}</div>
    );
  }
}
