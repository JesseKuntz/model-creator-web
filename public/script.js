var exportBtn = $('#exportBtn');
var exportType = $('#exportMethodSelect');
var fileExt = "";
var points = {};
var data = null;

// Throw the points into the on-screen text box
$.get("/points", function(d) {
  $("#points").text(JSON.stringify(d))
});

// Setting up three.js and the exporter
var colladaExporter = new THREE.ColladaExporter();
var plyExporter = new THREE.PLYExporter();
var gltfExporter = new THREE.GLTFExporter();
var material = new THREE.MeshBasicMaterial( { color: 0xffffff } );

exportBtn.click(() => {
  if (exportType.val() !== "Select an export method") {
    // Parse the points from the on-screen text box
    var points = JSON.parse($("#points").text());

    // This is where all the points go!
    var plotShape = new THREE.Shape();

    for (let i = 0; i < points.x.length; i++) {
      if (i == 0) plotShape.moveTo(points.x[i], points.y[i]);
      else {
        plotShape.lineTo(points.x[i], points.y[i]);
        plotShape.moveTo(points.x[i], points.y[i]);
      }
    }

    var geometry = new THREE.ShapeGeometry(plotShape);

    // Use this to attempt to get a point cloud, not the single face
    // console.log(geometry)
    // geometry.faces = [geometry.faces[0], geometry.faces[1]];

    var mesh = new THREE.Mesh( geometry, material ) ;

    if (exportType.val() === "Collada (.dae)") { data = colladaExporter.parse(mesh); fileExt = ".dae"; }
    else if (exportType.val() === "PLY (.ply)") { data = plyExporter.parse(mesh); fileExt = ".ply"; }
    else if (exportType.val() === "GLTF (.gltf)") { data = gltfExporter.parse(mesh); fileExt = ".gltf"; }
    else data = null;

    // Use this to figure out what is going on with PLY and GLTF
    // console.log(data);

    // Force download code from https://davidwalsh.name/javascript-download
    // Create an invisible A element
    const a = document.createElement("a");
    a.style.display = "none";
    document.body.appendChild(a);

    // Set the HREF to a Blob representation of the data to be downloaded
    a.href = window.URL.createObjectURL(
      new Blob([data.data], { type: 'plain/text' })
    );

    // Use download attribute to set set desired file name
    let name = $("#fileNameInput").val();
    if (name !== "") {
      a.setAttribute("download", `${$("#fileNameInput").val()}${fileExt}`);
    } else {
      a.setAttribute("download", `model${fileExt}`);
    }

    // Trigger the download by simulating click
    a.click();

    // Cleanup
    window.URL.revokeObjectURL(a.href);
    document.body.removeChild(a);
  }
});