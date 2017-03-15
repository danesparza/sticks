class Panel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  _renderItems = () => {
    return this.props.items.map((item, index) => {
      const route = RouteConstants.joints.show(item.id);
      return (
        <div key={index}>
          <h3><a href={route}>{item.name}</a></h3>
          <p>{item.description}</p>
        </div>
      )
    })
  }

  render() {
    const { items } = this.props;
    let joints = items ? this._renderItems() : '';

    return (
      <div>
        {joints}
      </div>
    );
  }
}
