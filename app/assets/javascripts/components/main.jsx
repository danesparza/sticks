var canvas = null;
var psuedoView1;
var psuedoView2;

// Specifically for this joint (E2M, 2 cuts)
// These should be set by the relevant data/svgs
var piece1Cut1;
var piece1Cut2;
var piece2Cut1;
var piece2Cut2;

var cut1;
var cut1Align = "";
var cut1Round = [];
var cut2;
var cut2Align = "";
var cut2Round = [];
var cutRect1;
var cutRect2;
var cut1Depth;
var cut2Depth;
var width;

/*
Constants for pathing & g-code generation
Recommended feeds & speeds from https://othermachine.co/support/materials/wood/
Everything currently in inches or inches/minute
*/
// NEED TO CHANGE THESE TO REFLECT CHANGES IN G-CODE (mm vs inches)
var bit = 0.1250; // Our bit is 1/8th inch
var offset = 0.58579 * bit; // We offset for the 90 degree angles ((2 - sqrt(2))x)
var cutFeed = 24; // feed rate
var plungeFeed = 1.5;
var plunge = 1.6; // plunge rate
var spindle = 12000; // RPM
var passDepth = 0.010; // Maximum pass depth
var zHeight = 0.5; // Height above actual 0 (to change cuts)
var discStep = 0.005; // Discretization step of 5 mil

// These should not change, so we define them here
var setWCS = "G55 (set work coordinate system)\n"
var setUnits = "G20 (set unit to inches)\n"; // G21 if we switch to mm
var setAbs = "G90 (set to absolute distance mode)\n";

// G-code we'll use often
var zUp = "G0 Z" + zHeight + "\n"; // Full speed!
var home = "G28 X Y\n";
var spindleOn = "M3 S" + spindle + " (spindle on)\n";
var spindleOff = "M5 (spindle off)";

paper.loadCustomLibraries = function(){
  console.log("Loading custom libraries!");
  paper.Path.Join = {
      square: ClipperLib.JoinType.jtSquare,
      round: ClipperLib.JoinType.jtRound,
      miter: ClipperLib.JoinType.jtMiter
    }
    paper.Path.Alignment = {
      interior: -1,
      centered: 0,
      exterior: 1
    }
  paper.Path.prototype.expand = function(o) {
      // SETUP
      var endType = ClipperLib.EndType.etClosedPolygon;
      var joinType = paper.Path.Join[o.joinType];
      var deltas = [ paper.Path.Alignment[o.strokeAlignment] * (o.strokeOffset/2.0)];
      var paths = toClipperPoints(this, 1);
      ClipperLib.JS.ScaleUpPaths(paths, scale=1000);
      // CLIPPER ENGINE
      var co = new ClipperLib.ClipperOffset(); // constructor
      var offsetted_paths = new ClipperLib.Paths(); // empty solution
      _.each(deltas, function(d){
          co.Clear();
          co.AddPaths(paths, joinType, endType);
          co.MiterLimit = 2;
          co.ArcTolerance = 0.25;
          co.Execute(offsetted_paths, d * scale);
      });
      var segs = [];
      for (i = 0; i < offsetted_paths.length; i++) {
          for (j = 0; j < offsetted_paths[i].length; j++){
              var p = new paper.Point(offsetted_paths[i][j].X, offsetted_paths[i][j].Y );
              p = p.divide(scale);
              segs.push(p);
          }
      }
      var clipperStrokePath = new paper.Path({
          segments: segs,
          closed: true
      });
      clipperStrokePath.set(o);
      return clipperStrokePath;
  }
}

/* Map path's perimeter points into jsclipper format
[[{X:30,Y:30},{X:130,Y:30},{X:130,Y:130},{X:30,Y:130}]]*/
function toClipperPoints(path, offset=1) {
  // for (var i = 0; i < path.segments.length; i++) {
  //   points.push({X: path.segments[i].point.x, Y: path.segments[i].point.y});
  // }

  var points = []; // Should be origin
  points.push({X: path.firstCurve.point1.x, Y: path.firstCurve.point1.y});
  for(var curveNum = 0; curveNum < path.curves.length; curveNum++){
    curve = path.curves[curveNum];
    if(curve.isStraight()){
      pt = curve.point2;
      points.push({X: pt.x, Y: pt.y});
    } else {
      for(offset = discStep; offset <= curve.length; offset += discStep){
        pt = curve.getLocationAt(offset).point;
        points.push({X: pt.x, Y: pt.y});
      }
    }
  }
  return [points]; // compound paths
}

function toSVGString(paths, scale) {
  var i, j, result = "";

  if (!scale) scale = 1;
  for(i = 0; i < paths.length; i++) {
    for(j = 0; j < paths[i].length; j++){
      if (!j) result += "M";
      else result += "L";
      result += (paths[i][j].X / scale) + ", " + (paths[i][j].Y / scale);
    }
    result += "Z";
  }
  if (result=="") result = "M0,0";

  return result;
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

function align(object, key, side) {
  // TODO: Add code for aligning top, bottom, center, etc.
  if (side === "L") {
    object.position = new Point(key.bounds.x + object.bounds.width / 2, key.bounds.y + object.bounds.height / 2);
  } else if (side === "R") {
    object.position = new Point(key.bounds.x + key.bounds.width - object.bounds.width / 2, key.bounds.y + object.bounds.height / 2);
  } else {
    console.error('Invalid Side Value');
  }
}

// Rounds the corners of a path in Paper.js
// -- Translated from PaperScript to plain JavaScript. Originally by Alex Blackwood.
// -- http://stackoverflow.com/questions/25936566/paper-js-achieving-smoother-edges-with-closed-paths
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

function discretizeToGCode(cutPaths, fromDepth, toDepth) {
  pathsGCode = []
  for(z = -fromDepth; z > -toDepth - passDepth; z -= passDepth){ // Just in case.
    if (z < -toDepth){ // Floor it
      z = -toDepth;
    }

    // Skip the first path because it's the outsidemost one.
    for(pathNum = 1; pathNum < cutPaths.children[0].children.length; pathNum++){
      // The curves are stored in an Array in a CompoundPath in the first element of the Paths we got from Clipper.
      path = cutPaths.children[0].children[pathNum];
      startingPt = path.getLocationAt(0).point;
      gCodeText.push("G0 X" + startingPt.x + " Y" + startingPt.y + "\n"); // Go to starting point
      gCodeText.push("G1 F" + plungeFeed + " Z" + z + "\n"); // Plunge
      gCodeText.push("F" + cutFeed + "\n");

      for(curveNum = 0; curveNum < path.curves.length; curveNum++){
        curve = path.curves[curveNum];
        if(curve.isStraight()){
          pt1 = curve.point1;
          gCodeText.push("G1 X" + Math.round(pt1.x * 1000) / 1000 + " Y" + Math.round(pt1.y * 1000) / 1000 + "\n");
          pt2 = curve.point2;
          gCodeText.push("G1 X" + Math.round(pt2.x * 1000) / 1000 + " Y" + Math.round(pt2.y * 1000) / 1000 + "\n");
        } else {
          for(offset = 0; offset <= curve.length; offset += discStep){
            pt = curve.getLocationAt(offset).point;
            gCodeText.push("G1 X" + Math.round(pt.x * 1000) / 1000 + " Y" + Math.round(pt.y * 1000) / 1000 + "\n");
          }
        }
      }
      gCodeText.push(zUp); // Deplunge
    }
  }
  return pathsGCode;
}

function svgCalculate(){
  project.clear(); // Remove everything and re-calculate
  width = params.width;
  scaledWidth = width * 50;
  depth = params.depth;
  cut1Depth = depth * 1 / 3; // 1/3rd of the way down
  cut2Depth = depth * 2 / 3; // 2/3rd of the way down
  section = params.cut;

  viewSize = new Size(scaledWidth, scaledWidth);
  psuedoView1Center = new Point(pseudoView1.topCenter.x - scaledWidth / 2, pseudoView1.leftCenter.y - scaledWidth / 2); // Center of pseudoview
  cutRect1 = Path.Rectangle(psuedoView1Center, scaledWidth);
  cutRect1.strokeColor = 'red';
  psuedoView2Center = new Point(pseudoView2.topCenter.x - scaledWidth / 2, pseudoView2.leftCenter.y - scaledWidth / 2);
  cutRect2 = Path.Rectangle(psuedoView2Center, scaledWidth);
  cutRect2.strokeColor = 'red';

  if(section == "end"){
    // TODO: Change these for different joints
    // We must keep the cuts at their size relative to actual width (for accurate offsetting when path is calculated).
    cut1 = new Path();
    for (var i = 0; i < piece1Cut1.points.length; i++) {
      cut1.add(new Point(width * piece1Cut1.points[i][0], width * piece1Cut1.points[i][1]));
    }
    cut1Align = piece1Cut1.align;
    cut1Round = piece1Cut1.rounded;

    cut2 = new Path();
    for (var i = 0; i < piece1Cut2.points.length; i++) {
      cut2.add(new Point(width * piece1Cut2.points[i][0], width * piece1Cut2.points[i][1]));
    }
    cut2Align = piece1Cut2.align;
    cut2Round = piece1Cut2.rounded;
  } else if (section == "center"){
    // TODO: Change these for different joints
    cut1 = new Path();
    for (var i = 0; i < piece2Cut1.points.length; i++) {
      cut1.add(new Point(width * piece2Cut1.points[i][0], width * piece2Cut1.points[i][1]));
    }
    cut1Align = piece2Cut1.align;
    cut1Round = piece2Cut1.rounded;

    cut2 = new Path();
    for (var i = 0; i < piece2Cut2.points.length; i++) {
      cut2.add(new Point(width * piece2Cut2.points[i][0], width * piece2Cut2.points[i][1]));
    }
    cut2Align = piece2Cut2.align;
    cut2Round = piece2Cut2.rounded;
  }

  roundCorners(cut1, bit, cut1Round);
  roundCorners(cut2, bit, cut2Round);

  // Loop over all cuts (and cutRects)
  // cut1Paths = cut1;
  // cut2Paths = cut2;
  cut1Paths = generateCutPath(cut1, cutRect1, cut1Align);
  cut2Paths = generateCutPath(cut2, cutRect2, cut2Align);

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

  if(cut1Align){
    align(cut1Visible, cutRect1, cut1Align);
  }
  if(cut2Align){
    align(cut2Visible, cutRect2, cut2Align);
  }

  view.draw();
}

function generateGCode(){
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

function refreshView(){ //For setting up and resizing.
  // TODO: Make it so that the number of cuts dictates the number of "views"
  // TODO: Make it move everything around
  var rectSize = new Size(view.bounds.width, view.bounds.height / 2);
  pseudoView1.size = rectSize;
  pseudoView1.topLeft = new Point(0, 0);
  pseudoView2.size = rectSize;
  pseudoView2.topLeft = pseudoView1.bottomLeft;
}

// var params;
loadMain = function(jointname, p1c1, p1c2, p2c1, p2c2) {
  $.getJSON(p1c1, function(json) {
    piece1Cut1 = json;
  });
  $.getJSON(p1c2, function(json) {
    piece1Cut2 = json;
  });
  $.getJSON(p2c1, function(json) {
    piece2Cut1 = json;
  });
  $.getJSON(p2c2, function(json) {
    piece2Cut2 = json;
  });

  paper.install(window);

  // Initialize dat.gui
  var gui = new dat.GUI();
  params = {
    width: 3.5,
    depth: 1.5,
    cut: "end",
    preview: svgCalculate,
    download: generateGCode,
  }
  var name = gui.addFolder(jointname);
  name.add(params, 'width', 0, 5).step(0.5);
  name.add(params, 'depth', 0, 5).step(0.5);
  name.add(params, 'cut').options(["end", "center"]); // Should load from joint settings
  name.add(params, 'preview');
  name.add(params, 'download');
  name.open();

  paper.setup('pathCanvas');
  paper.loadCustomLibraries();

  // TODO: Make it so that the number of cuts dictates the number of "views"
  pseudoView1 = new Rectangle();
  pseudoView2 = new Rectangle();
  refreshView();

  view.onResize = function(event) {
    refreshView();
    view.draw();
  }
  view.draw();
}
