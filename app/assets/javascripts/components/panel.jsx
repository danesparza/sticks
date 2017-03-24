class Panel extends React.Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  _renderItems = () => {
    return this.props.items.map((item, index) => {
      return <PanelItem item={item} key={index} />;
    })
  }

  render() {
    const { items } = this.props;
    let joints = items ? this._renderItems() : '';

    return (
      <div className="panel">
        {joints}
      </div>
    );
  }
}

class PanelItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const { key, item } = this.props;
    const route = RouteConstants.joints.show(item.id);

    return (
      <div className="panel-item" key={key}>
        <a href={route}>
          <div className="panel-item-img">
            <video autoPlay loop src="https://video.twimg.com/tweet_video/CzXmIiYUoAEWF6I.mp4" alt="" className=""></video>
          </div>
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </a>
      </div>
    );
  }
}
