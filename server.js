var express = require('express');
var app = express();
var plotly = require('plotly')("jessekuntz", "Pyok8WctFMJyeNFNnyd9");
const bodyParser = require('body-parser');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log(req.body);
  createGraph(req.body);
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

function createGraph(data) {
  var points = {x: [], y: [], z: []};
  var traces = [];

  while(data.x.length > 1) {
    let xSplice = data.x.splice(0, data.x.indexOf(0, 1));
    let ySplice = data.y.splice(0, data.y.indexOf(0, 1));
    let zSplice = data.z.splice(0, data.z.indexOf(0, 1));
    points.x.push(xSplice);
    points.y.push(ySplice);
    points.z.push(Array(xSplice.length).fill(0));
    // points.z.push(zSplice);
  }

  console.log(points)

  // Get rid of the zeros on all but the first trace
  for (let i = 1; i < points.x.length; i++) {
    points.x[i].splice(0, 1);
    points.y[i].splice(0, 1);
    points.z[i].splice(0, 1);
  }

  console.log(points)

  for (let i = 0; i < points.x.length; i++) {
    let color = '#'+Math.random().toString(16).substr(-6);
    traces.push(
      {
        x: points.x[i],
        y: points.y[i],
        z: points.z[i],
        mode: "lines+markers",
        marker: {
          color: color,
          size: 12,
          symbol: "circle",
          opacity: 0.8
        },
        line: {
          color: color,
          width: 3
        },
        type: "scatter3d"
      }
    )
  }

  var layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 65
  }};

  var graphOptions = {layout: layout, filename: "simple-3d-scatter", fileopt: "overwrite"};

  plotly.plot(traces, graphOptions, function (err, msg) {
      console.log(msg);
  });
}