class Dimensions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 3.5,
      depth: 1.5,
      section: 'end',
    };
  }

  _capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _handleRadioChange = (e) => {
    this.setState({
      section: $(e.target).attr("value"),
    }, this._svgCalculate);
  }

  _subtractInput = (name) => {
    let val = this.state[name];

    this.setState({ [name]: val - 0.5, })
  }

  _addInput = (name) => {
    let val = this.state[name];

    this.setState({ [name]: val + 0.5, })
  }

  _renderInputs = (name) => {
    const defaultVal = this.state[name];

    return (
      <div className="pt-form-group pt-large pt-inline">
        <label htmlFor={`input-${name}`} className="pt-label">
          {this._capitalize(name)}
          <span className="pt-text-muted"> (in)</span>
        </label>
        <div className="pt-form-content pt-large">
          <button className="pt-button pt-large pt-icon-minus pt-intent-primary"
            onClick={this._subtractInput.bind(this, name)}></button>
          <div className="pt-input-group pt-large">
            <input className="pt-input pt-fill" name="width" id={`input-${name}`}
              type="text" value={defaultVal} onChange={this._handleChange} />
          </div>
          <button className="pt-button pt-large pt-icon-plus pt-intent-primary"
            onClick={this._addInput.bind(this, name)}></button>
        </div>
      </div>
    )
  }

  _handleChange = (e) => {
    this.setState({
      [$(e.target).attr("name")] : $(e.target).val(),
    }, this._svgCalculate);
  }

  _download = () => {

  }

  render() {
    return (
      <div>
        <h3 className="type-title">Joint Type</h3>
        <Blueprint.Core.RadioGroup
            label=""
            className="pt-large"
            onChange={this._handleRadioChange}
            selectedValue={this.state.section}>
            <Blueprint.Core.Radio className="pt-large" label="End"
              name="end" value="end" />
            <Blueprint.Core.Radio className="pt-large" label="Center"
              name="center" value="center" />
        </Blueprint.Core.RadioGroup>

        <h3 className="dimen-title">Dimensions</h3>
        {this._renderInputs("width")}
        {this._renderInputs("depth")}

        <button className="pt-button pt-intent-primary pt-large pt-fill pt-icon-download"
          onClick={this._download} type="button">
          Download G-code
        </button>
      </div>
    );
  }
}
