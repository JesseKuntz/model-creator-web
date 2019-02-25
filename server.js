var express = require('express');
var app = express();
var plotly = require('plotly')("jessekuntz", "Pyok8WctFMJyeNFNnyd9");
const bodyParser = require("body-parser");

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
  var trace = {
    x: data.x,
    y: data.y,
    z: data.z,
    mode: "lines+markers",
    marker: {
      color: "#851726",
      size: 12,
      symbol: "circle",
      opacity: 0.8
    },
    line: {
      color: "#851726",
      width: 3
    },
    type: "scatter3d"
  };

  var data = [trace];

  var layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 65
  }};

  var graphOptions = {layout: layout, filename: "simple-3d-scatter", fileopt: "overwrite"};

  plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
  });
}

