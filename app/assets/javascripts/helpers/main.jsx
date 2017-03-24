paper.loadCustomLibraries = () => {
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
