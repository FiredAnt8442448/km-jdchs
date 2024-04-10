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

var popup = L.popup();
function onMapClick(e) {
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
}
map.on('click', onMapClick);

// Set the view to match the bounds of the image
map.fitBounds(imageBounds);

// Decrease the zoom level by 0.5
map.flyTo(map.getCenter(), map.getZoom() + 0.75);

var polygon = L.polygon([
    [40.7545, -74.222],
    [40.7545, -74.226],
    [40.758, -74.226],
    [40.758, -74.222]
]).addTo(map);

polygon.bindPopup("I am a polygon.");