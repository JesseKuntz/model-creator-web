var express = require('express');
var app = express();
var plotly = require('plotly')("jessekuntz", "Pyok8WctFMJyeNFNnyd9");
const bodyParser = require("body-parser");

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send("This is the default route.");
});

app.post('/', function (req, res) {
  console.log(req.body);
  createGraph(req.body);
});

app.listen(3000, function() {
  console.log('Listening on port 3000');
});

function createGraph(data) {
  var trace1 = {
    x: data.x,
    y: data.y,
    z: data.z,
    mode: "markers",
    marker: {
      size: 12,
      line: {
        color: "rgba(217, 217, 217, 0.14)",
        width: 0.5
      },
      opacity: 0.8
    },
    type: "scatter3d"
  };

  var data = [trace1];

  var layout = {margin: {
      l: 0,
      r: 0,
      b: 0,
      t: 0
  }};

  var graphOptions = {layout: layout, filename: "simple-3d-scatter", fileopt: "overwrite"};

  plotly.plot(data, graphOptions, function (err, msg) {
      console.log(msg);
  });
}

