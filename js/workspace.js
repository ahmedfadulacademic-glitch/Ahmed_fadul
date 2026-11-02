// My Workspace: the services, the tools used and how each one is done.
// kind: i = instrument, s = software, b = built by me
const WS = [
{g:"Land surveying", items:[
 {id:"levelling", t:"Levelling and reduced levels", does:"Find the heights of points and the height differences between them, and correct the result for closing error.",
  tools:[["Level instrument","i"],["Levelling staff","i"]],
  how:["Set up the level roughly midway between the two staff positions and level it.","Read the backsight and the foresight on the staff and book them in the level book.","Reduce the levels (rise and fall, or height of collimation) and check the arithmetic.","Compute the misclosure against the known benchmark and compare it with the allowable error.","Distribute the misclosure over the stations and calculate the adjusted reduced levels."]},
 {id:"profiles", t:"Grid, longitudinal and cross-section levelling", does:"Heights across an area (grid), along an alignment (longitudinal) and across it (cross-sections).",
  tools:[["Level instrument","i"],["Levelling staff","i"]],
  how:["Set out the grid or the alignment and mark the stations.","Take staff readings at every grid point, station and cross-section point.","Reduce the levels and adjust the closing error.","Plot the profile or sections, or use the grid heights for contours and design levels."]},
 {id:"totalstation", t:"Topographic survey with a total station", does:"Measure distances and angles to get the coordinates of ground features.",
  tools:[["Total station","i"],["Prism","i"]],
  how:["Set up over a control point, level the instrument and enter the coordinates.","Orient it on a second known point.","Measure the points with feature codes.","Check by re-measuring a known point.","Download the data, process it and plot the survey."]},
 {id:"setting-out", t:"Setting out with a total station", does:"Mark designed points on the ground from their coordinates.",
  tools:[["Total station","i"],["Prism","i"]],
  how:["Load the design coordinates into the instrument.","Set up and orient on the control points.","Stake out each point guided by the instrument and mark it.","Check by measuring distances between the marked points."]},
 {id:"gnss", t:"GPS/GNSS survey and setting out", does:"Get the coordinates of points, and set out designed points, with GPS/GNSS receivers.",
  tools:[["GPS/GNSS receiver","i"]],
  how:["Plan the job and choose the control points.","Set up on known control and check the position first.","Observe the points, or navigate to the designed points and mark them.","Export the coordinates and check their quality."]},
 {id:"curves", t:"Coordinates of horizontal and vertical curves", does:"Compute coordinates (and levels) of points along a road or channel curve.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"]],
  how:["Collect the curve elements: radius, deflection angle and the start point.","Generate points along the curve at the chosen interval and read their X and Y.","For a vertical curve, compute the levels along the grade lines.","Export the table for setting out or for use in GIS."]}
]},
{g:"GIS", items:[
 {id:"georef", t:"Digitizing and georeferencing", does:"Turn scanned maps and images into correctly placed, usable GIS layers.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"]],
  how:["Load the image and pick control points with known coordinates.","Apply the transformation and check the RMS error.","Digitize the features into layers.","Fill in the attributes and check against the source."]},
 {id:"terrain", t:"Terrain analysis", does:"Understand the ground surface from a digital elevation model.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"]],
  how:["Prepare the DEM: clip it and set the coordinate system.","Derive slope, aspect and contours.","Classify the results into useful ranges.","Produce the map."]},
 {id:"proximity", t:"Proximity analysis", does:"Measure how close places are to roads, rivers, services or any other feature.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"]],
  how:["Prepare the features of interest.","Run buffers or Euclidean distance.","Classify the distance into zones.","Use the result in a map or in a suitability analysis."]},
 {id:"suitability", t:"Site suitability analysis", does:"Find the best locations for a project by weighing several criteria together.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"],["Python","s"]],
  how:["Define the criteria for the project.","Prepare the layers on one grid and reclassify each to a common scale.","Weight the criteria with AHP.","Combine them with a weighted overlay and classify the result.","Check the result and report the areas of each class."]},
 {id:"network", t:"Network analysis", does:"Routes, service areas and closest facilities on a road network.",
  tools:[["ArcGIS Pro","s"],["QGIS","s"]],
  how:["Prepare the road network.","Set the cost: distance or travel time.","Run the route, service-area or closest-facility analysis.","Check the output and map it."]}
]},
{g:"Photogrammetry", items:[
 {id:"flight-plan", t:"Aerial flight planning", lvl:"Foundations", does:"The basic planning of a photogrammetric flight: flight path, coverage and number of photos.",
  tools:[],
  how:["Define the area to cover and the ground resolution needed.","Work out the flight height from the camera focal length and pixel size.","Set the forward and side overlap.","Compute the photo footprint, the spacing between flight lines and the number of strips.","Calculate the photos per strip and the total number of photos."]}
]},
{g:"Tools I built", items:[
 {id:"suitability-tool", t:"Site suitability automation (Python)", does:"Runs the suitability workflow automatically: scoring, AHP weights, weighted overlay, map and area statistics.",
  tools:[["Python","b"],["NumPy","s"],["SciPy","s"],["rasterio","s"],["GeoPandas","s"]],
  how:["Put all the layers on one grid and clip them to the study area.","Score every criterion from 1 to 5 with the class table.","Apply the AHP weights and combine the layers.","Round to classes, clean the result and compute the areas.","I check every result myself before it goes to a client."]}
]}
];

const KIND = {i:"Instrument", s:"Software", b:"Built by me"};
function renderWorkspace(){
  const el = document.getElementById("ws-list");
  el.innerHTML = WS.map(g => '<h3 class="wsh">' + g.g + '</h3>' + g.items.map(it =>
    '<details class="ws" id="ws-' + it.id + '"><summary><span class="wt">' + it.t + '</span>' +
    (it.lvl ? '<span class="wl">' + it.lvl + '</span>' : '') + '</summary><div class="wb"><p class="wd">' + it.does + '</p>' +
    (it.tools.length ? '<div class="wtools">' + it.tools.map(x => '<span class="tg ' + x[1] + '" title="' + KIND[x[1]] + '">' + x[0] + '</span>').join('') + '</div>' : '') +
    '<h4>How I do it</h4><ol>' + it.how.map(s => '<li>' + s + '</li>').join('') + '</ol>' +
    '<button class="btn req" type="button" data-s="' + it.id + '">Request this</button></div></details>').join('')).join('');
  el.querySelectorAll(".req").forEach(b => b.addEventListener("click", () => { window.wsPick = b.dataset.s; location.hash = "requests"; }));
}
renderWorkspace();
