var exportBtn = $('#exportBtn');
var exportType = $('#exportMethodSelect');
var fileExt = "";
var points = {};
var data = null;

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
    var points = JSON.parse($("#points").text());
    // This is where all the points go!
    var heartShape = new THREE.Shape();

    var x = 0; y = 0;

    for (let i = 0; i < points.x.length; i++) {
      if (i == 0) heartShape.moveTo(points.x[i], points.y[i]);
      else {
        heartShape.lineTo(points.x[i], points.y[i]);
        heartShape.moveTo(points.x[i], points.y[i]);
      }
    }

    var geometry = new THREE.ShapeGeometry(heartShape);

    // console.log(geometry)
    // geometry.faces = [geometry.faces[0], geometry.faces[1]];


    var mesh = new THREE.Mesh( geometry, material ) ;

    if (exportType.val() === "Collada (.dae)") { data = colladaExporter.parse(mesh); fileExt = ".dae"; }
    else if (exportType.val() === "PLY (.ply)") { data = plyExporter.parse(mesh); fileExt = ".ply"; }
    else if (exportType.val() === "GLTF (.gltf)") { data = gltfExporter.parse(mesh); fileExt = ".gltf"; }
    else data = null;

    console.log(data);

    // Force download code found from https://davidwalsh.name/javascript-download
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