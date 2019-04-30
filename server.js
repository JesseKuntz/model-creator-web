var express = require('express');
var app = express();
var plotly = require('plotly')(process.env.plotlyUsername, process.env.plotlyKey);
const bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');
require('dotenv').config();

var graphFile = path.join(__dirname, 'public/graphData.json');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/', function (req, res) {
  console.log(req.body);

  // Deep clone
  let points = JSON.parse(JSON.stringify(req.body));

  // Take all of the 0's out
  for (let i = 1; i < points.x.length; i++) {
    if (points.x[i] === 0) {
      points.x.splice(i, 1);
      points.y.splice(i, 1);
      points.z.splice(i, 1);
    }
  }

  // Write the manipulated data to 'graphFile'
  writePointsToFile(points);

  // Create the Plotly graph (with the original data)
  createGraph(req.body);
});

app.get('/points', (req, res) => {
    res.sendFile(graphFile);
});

app.listen(process.env.PORT, function() {
  console.log('Listening on port: ' + process.env.PORT);
});

function writePointsToFile(data) {
  fs.writeFileSync(graphFile, JSON.stringify(data));
}

async function createGraph(data) {
  var points = {x: [], y: [], z: []};
  var traces = [];

  // Break up the points into different traces
  while (data.x.length > 1) {
    let xSplice = data.x.splice(0, data.x.indexOf(0, 1));
    let ySplice = data.y.splice(0, data.y.indexOf(0, 1));
    let zSplice = data.z.splice(0, data.z.indexOf(0, 1));
    points.x.push(xSplice);
    points.y.push(ySplice);
    points.z.push(Array(xSplice.length).fill(0));
    // points.z.push(zSplice);
  }

  // Get rid of the zeros on all but the first trace
  for (let i = 1; i < points.x.length; i++) {
    points.x[i].splice(0, 1);
    points.y[i].splice(0, 1);
    points.z[i].splice(0, 1);
  }

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