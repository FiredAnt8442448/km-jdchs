var map = L.map('map');

// Calculate the aspect ratio of the image
var aspectRatio = 1 / 1;

// Define the geographical bounds of the image
// Adjust these values to match the aspect ratio of your image
var latDifference = 40.773941 - 40.712216;
var lonDifference = latDifference * aspectRatio;
var imageBounds = [[40.712216, -74.22655], [40.712216 + latDifference, -74.22655 + lonDifference]];

// Add the image overlay
L.imageOverlay('statemap.jpeg', imageBounds, {id: 'mapImage'}).addTo(map);

// Set the view to match the bounds of the image
map.fitBounds(imageBounds);

// Decrease the zoom level by 0.5
map.flyTo(map.getCenter(), map.getZoom() + 0.75);

// Add Geoman controls with some options to the map
map.pm.addControls({
    position: 'topleft',
    drawCircleMarker: false,
    rotateMode: false,
});

// Create a feature group to store the drawn items
var drawnItems = new L.FeatureGroup().addTo(map);

// Create a variable to store whether a polygon is being selected
var selectingPolygon = false;

// Add an event listener for when a new shape is created
map.on('pm:create', function(e) {
    drawnItems.addLayer(e.layer);
});

// Function to save the data
function saveData() {
    var data = drawnItems.toGeoJSON();
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data));
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "drawnItems.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadData(event) {
    var file = event.target.files[0];
    if (!file) {
        console.log("No file selected");
        return;
    }
    var reader = new FileReader();
    reader.onload = function(e) {
        var contents = e.target.result;
        console.log("File contents:", contents);
        var geojson;
        try {
            geojson = JSON.parse(contents);
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return;
        }
        // Clear the drawnItems feature group
        drawnItems.clearLayers();
        // Add the loaded GeoJSON data to the drawnItems feature group
        L.geoJSON(geojson, {
            onEachFeature: function (feature, layer) {
                console.log("Feature:", feature);
                console.log("Layer:", layer);
                drawnItems.addLayer(layer);
                // Add an event listener to the layer
                layer.on('click', function() {
                    if (selectingPolygon) {
                        // Show a prompt and set the divId property of the feature to the entered value
                        feature.properties.divId = prompt('Enter the id of the div:');
                        // Reset selectingPolygon
                        selectingPolygon = false;
                    }
                });
                layer.on('click', function() {
                    // Get the divId property of the feature
                    var divId = feature.properties.divId;
                    console.log("Div id:", divId);  // Log the div id to the console

                    // Get the div with the corresponding id
                    var div = document.getElementById(divId);
                    console.log("Div:", div);  // Log the div to the console

                    // Use the divId to open the corresponding div
                    if (div) {
                        div.style.display = 'block';
                    } else {
                        console.error("No div found with id:", divId);
                    }
                });
            }
        });
    };
    reader.onerror = function() {
        console.error("Error reading file:", reader.error);
    };
    reader.readAsText(file);

    // Reset the value of the file input element
    event.target.value = '';
}

function clearData() {
    drawnItems.clearLayers();
}

// Add a new method to the map.pm.Toolbar object
map.pm.Toolbar.createCustomControl = function(options) {
    var Control = L.Control.extend({
        options: {
            position: 'topleft',
            block: options.block,
            className: options.className,
            title: options.title,
            actions: options.actions,
        },
        onAdd: function () {
            this._container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            this.buttonsContainer = L.DomUtil.create('div', 'leaflet-buttons-container', this._container);
            this._createButton(this.options.title, this.options.className, this.buttonsContainer, this.options.actions);
            return this._container;
        },
        _createButton: function (html, className, container, fn) {
            var link = L.DomUtil.create('a', className, container);
            link.innerHTML = html;
            link.href = '#';
            link.title = html;
            L.DomEvent.on(link, 'click', L.DomEvent.stop)
                .on(link, 'click', fn, this)
                .on(link, 'click', this._refocusOnMap, this);
            return link;
        },
    });
    var control = new Control();
    control.addTo(map);
};

// Create a hidden file input element
var loadInput = document.createElement('input');
loadInput.type = 'file';
loadInput.id = 'loadInput';
loadInput.style.display = 'none';
document.body.appendChild(loadInput);

// Add an event listener to the file input element
loadInput.addEventListener('change', loadData);

// Create a custom control to specify the div for the next clicked polygon
map.pm.Toolbar.createCustomControl({
    block: 'custom',
    title: '',
    className: 'specify-div-button',
    actions: function() {
        // Set selectingPolygon to true
        selectingPolygon = true;
    }
});

// Create the Load Data control
map.pm.Toolbar.createCustomControl({
    block: 'custom',
    title: '',
    className: 'load-data-button',
    actions: function() {
        document.getElementById('loadInput').click();
    }
});

// Create the Save Data control
map.pm.Toolbar.createCustomControl({
    block: 'custom',
    title: '',
    className: 'save-data-button',
    actions: function() {
        saveData();
    }
});

// Create the Clear Data control
map.pm.Toolbar.createCustomControl({
    block: 'custom',
    title: '',
    className: 'clear-data-button',
    actions: function() {
        clearData();
    }
});

function hideDiv() {
    var div = this.closest('div');
    if (div) {
        div.style.display = 'none';
    }
}