class JointView extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      width: 3.5,
      depth: 1.5,
      section: 'end',
      cut1Depth: null,
      cut2Depth: null,
      cutRect1: null,
      cutRect2: null,
      cut1: null,
      cut1Align: "",
      cut1Round: [],
      cut2: null,
      cut2Align: "",
      cut2Round: [],
      cut1Paths: null,
      cut2Paths: null,
    };
  }

  componentDidMount = () => {
    let callback = this._svgCalculate;

    this._fetchJSON(callback);
  }

  _capitalize = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
  }

  _fetchJSON = (callback) => {
    const route = JointConstants.joints.combined;
    const resolve = (response) => {
      this.setState({
        piece1Cut1: response.p1c1,
        piece1Cut2: response.p1c2,
        piece2Cut1: response.p2c1,
        piece2Cut2: response.p2c2,
      })
      this._installPaper();
      if (callback) { callback(); }
    }
    const reject = (response) => console.log(response);

    Requester.get(route, resolve, reject);
  }

  _download = () => {
    this._generateGCode();
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

    view.onResize = () => {
      this._refreshView();
      view.draw();
    }
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

  _handleRadioChange = (e) => {
    this.setState({
      section: $(e.target).attr("value"),
    }, this._svgCalculate);
  }

  _handleChange = (e) => {
    this.setState({
      [$(e.target).attr("name")] : $(e.target).val(),
    }, this._svgCalculate);
  }

  render() {
    const { joint, pieces } = this.props;
    let { width, depth } = this.state;

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

        <Blueprint.Core.RadioGroup
            label="Joint Type"
            onChange={this._handleRadioChange}
            selectedValue={this.state.section}>
            <Blueprint.Core.Radio label="End" name="end" value="end" />
            <Blueprint.Core.Radio label="Center" name="center" value="center" />
        </Blueprint.Core.RadioGroup>

        <label htmlFor="" className="pt-label">
          Width
          <span className="pt-text-muted"> (in)</span>
          <input className="pt-input" name="width"
            type="text" defaultValue={width}
            onChange={this._handleChange} />
        </label>

        <label htmlFor="" className="pt-label">
          Depth
          <span className="pt-text-muted"> (in)</span>
          <input className="pt-input" name="depth"
            type="text" defaultValue={depth}
            onChange={this._handleChange} />
        </label>

        <button className="pt-button pt-intent-primary"
          onClick={this._download} type="button" pt-icon-download>
          Download G-code
        </button>

        <canvas id="pathCanvas" data-paper-resize></canvas>

      </div>
    );
  }

  _svgCalculate = () => {
    let {
      width,
      depth,
      section,
      cut1Depth,
      cut2Depth,
      cutRect1,
      cutRect2,
      cut1,
      cut1Align,
      cut1Round,
      cut2,
      cut2Align,
      cut2Round,
      pseudoView1,
      pseudoView2,
      piece1Cut1,
      piece1Cut2,
      piece2Cut1,
      piece2Cut2,
    } = this.state;

    project.clear(); // Remove everything and re-calculate
    let scaledWidth = width * 50;
    cut1Depth = depth * 1 / 3; // 1/3rd of the way down
    cut2Depth = depth * 2 / 3; // 2/3rd of the way down

    let viewSize = new Size(scaledWidth, scaledWidth);
    let pseudoView1Center = new Point(
      pseudoView1.topCenter.x - scaledWidth / 2,
      pseudoView1.leftCenter.y - scaledWidth / 2);

    cutRect1 = Path.Rectangle(pseudoView1Center, scaledWidth);
    cutRect1.strokeColor = 'red';

    let pseudoView2Center = new Point(
      pseudoView2.topCenter.x - scaledWidth / 2,
      pseudoView2.leftCenter.y - scaledWidth / 2);

    cutRect2 = Path.Rectangle(pseudoView2Center, scaledWidth);
    cutRect2.strokeColor = 'red';

    if (section == "end") {
      // TODO: Change these for different joints
      // We must keep the cuts at their size relative to actual width (for accurate offsetting when path is calculated).
      cut1 = new Path();
      for (var i = 0; i < piece1Cut1.points.length; i ++) {
        cut1.add(
          new Point(width * piece1Cut1.points[i][0],
          width * piece1Cut1.points[i][1])
        );
      }

      cut1Align = piece1Cut1.align;
      cut1Round = piece1Cut1.rounded;

      cut2 = new Path();
      for (var i = 0; i < piece1Cut2.points.length; i++) {
        cut2.add(
          new Point(width * piece1Cut2.points[i][0],
          width * piece1Cut2.points[i][1])
        );
      }

      cut2Align = piece1Cut2.align;
      cut2Round = piece1Cut2.rounded;
    } else if (section == "center") {
      // TODO: Change these for different joints
      cut1 = new Path();
      for (var i = 0; i < piece2Cut1.points.length; i++) {
        cut1.add(
          new Point(width * piece2Cut1.points[i][0],
          width * piece2Cut1.points[i][1])
        );
      }

      cut1Align = piece2Cut1.align;
      cut1Round = piece2Cut1.rounded;

      cut2 = new Path();
      for (var i = 0; i < piece2Cut2.points.length; i++) {
        cut2.add(
          new Point(width * piece2Cut2.points[i][0],
          width * piece2Cut2.points[i][1])
        );
      }

      cut2Align = piece2Cut2.align;
      cut2Round = piece2Cut2.rounded;
    }

    roundCorners(cut1, bit, cut1Round);
    roundCorners(cut2, bit, cut2Round);

    // Loop over all cuts (and cutRects)
    // cut1Paths = cut1;
    // cut2Paths = cut2;
    let cut1Paths = generateCutPath(cut1, cutRect1, cut1Align);
    let cut2Paths = generateCutPath(cut2, cutRect2, cut2Align);

    var cut1Visible = cut1Paths.clone(); // Generate these to show users
    var cut2Visible = cut2Paths.clone();

    cut1Paths.visible = false;
    cut2Paths.visible = false;
    cut1Visible.strokeColor = 'blue';
    cut1Visible.fillColor = 'aqua';
    cut2Visible.strokeColor = 'blue';
    cut2Visible.fillColor = 'aqua';

    cut1Visible.fitBounds(cutRect1.bounds);
    cut2Visible.fitBounds(cutRect2.bounds);

    if (cut1Align) {
      align(cut1Visible, cutRect1, cut1Align);
    }
    if (cut2Align) {
      align(cut2Visible, cutRect2, cut2Align);
    }

    this.setState({
      width,
      depth,
      section,
      cut1Depth,
      cut2Depth,
      cutRect1,
      cutRect2,
      cut1,
      cut1Align,
      cut1Round,
      cut2,
      cut2Align,
      cut2Round,
      pseudoView1,
      pseudoView2,
      piece1Cut1,
      piece1Cut2,
      piece2Cut1,
      piece2Cut2,
      cut1Paths,
      cut2Paths,
    }, () => {
      view.draw();
    })

    function roundCorners(path,radius,roundedCorners) {
      var segments = path.segments.slice(0);
      path.removeSegments();

      for(var i = 0, l = segments.length; i < l; i++) {
        if (roundedCorners.indexOf(i) != -1) {
          var curPoint = segments[i].point;
          var nextPoint = segments[i + 1 == l ? 0 : i + 1].point;
          var prevPoint = segments[i - 1 < 0 ? segments.length - 1 : i - 1].point;
          var nextDelta = curPoint.subtract(nextPoint);
          var prevDelta = curPoint.subtract(prevPoint);

          nextDelta.length = radius;
          prevDelta.length = radius;

          path.add(
            new paper.Segment(
              curPoint.subtract(prevDelta),
              null,
              prevDelta.divide(2)
            )
          );

          path.add(
            new paper.Segment(
              curPoint.subtract(nextDelta),
              nextDelta.divide(2),
              null
            )
          );
        } else {
          path.add(segments[i])
        }
      }
      path.closed = true;
      return path;
    }

    function generateCutPath(cut, cutBound, align){
      // TODO: Make this take in the cut and the bounding rectangle (or save those somewhere globally)
      var paths = toClipperPoints(cut);
      // Our bit is 1/8th in, so our minimum offset is is 1/16th, or .0625 in.
      // We also add another 10x because our widths are stored to 1 decimal.
      var scale = 100000;

      var svgpath = "";
      svgpath += '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="' + width + '" height="' + width + '"> <path d="';

      ClipperLib.JS.ScaleUpPaths(paths, scale);
      var co = new ClipperLib.ClipperOffset(2, 0.25);
      co.AddPaths(paths, ClipperLib.JoinType.jtRound, ClipperLib.EndType.etClosedPolygon);
      var offsetted_paths = new ClipperLib.Paths();

      var deltas = [0];
      for(var i = 1; i < width / offset; i += 2) { // First one is offset by radius, and all subsequent are by diameter.
        deltas.push(-offset / 2 * i);
      }

      for(i = 0; i < deltas.length; i++) {
        co.Execute(offsetted_paths, deltas[i] * scale);
        if(offsetted_paths.length == 0){ // offsetted_paths set to an empty array
          break;
        }
        svgpath += toSVGString(offsetted_paths, scale);
      }

      svgpath += '"/> </svg>';

      // TODO: Seperate the generated one from the actual (so we can generate g-code)
      generated = project.importSVG(svgpath);

      return generated;
    }
  }

  _generateGCode = () => {
    const {
      cut1Paths,
      cut2Paths,
      cut1Depth,
      cut2Depth,
    } = this.state;

    // Generate the actual gcode from the cuts, put into this string.
    gCodeText = [];

    // G-Code Preamble stuff
    gCodeText.push("(PREAMBLE)\n");
    gCodeText.push(setWCS);
    gCodeText.push(setUnits);
    gCodeText.push(setAbs);

    // Getting ready to move
    gCodeText.push("(SETUP)\n");
    gCodeText.push(zUp);
    gCodeText.push(home);
    gCodeText.push(spindleOn);

    // Time to mill!
    gCodeText.push("(MILLING)\n");
    gCodeText.push.apply(gCodeText, discretizeToGCode(cut1Paths, 0, cut1Depth));
    gCodeText.push.apply(gCodeText, discretizeToGCode(cut2Paths, cut1Depth, cut2Depth));

    gCodeText.push("(FINISHING)\n");
    gCodeText.push(zUp);
    gCodeText.push(home);
    gCodeText.push(spindleOff);

    // Download the file.
    var fileName = "file.txt"
    var element = document.createElement('a');
    element.setAttribute('id', 'downloadGCode');
    element.setAttribute('download', fileName); // Make it work in Chrome... but fail elsewhere.
    element.style.display = 'none';
    properties = {type: 'plain/text'}; // Specify the file's mime-type.
    try {
      // Specify the filename using the File constructor, but ...
      file = new File(gCodeText, fileName, properties);
    } catch (e) {
      // ... fall back to the Blob constructor if that isn't supported.
      file = new Blob(gCodeText, properties);
    }
    url = URL.createObjectURL(file);

    document.body.appendChild(element);
    document.getElementById('downloadGCode').href = url;
    element.click();
    document.body.removeChild(element);
  }
}

JointView.propTypes = {
  joint: React.PropTypes.object.isRequired,
}
