var map = L.map('map', {
  crs: L.CRS.Simple,
  minZoom: -4,
});

let corlat = -4065; //55+40;
let corlng = -5710; //-650;
let scale = 1.52;
var bounds = [
  [0 + corlat, 0 + corlng],
  [8192 * scale + corlat, 8192 * scale + corlng],
];
var image = L.imageOverlay('https://i.imgur.com/FJFPUdo.jpg', bounds).addTo(
  map
);

map.on('click', function (event) {
  var coords = event.latlng;
  L.popup()
    .setLatLng(coords)
    .setContent(
      '[' + Math.floor(coords.lat) + ',' + Math.floor(coords.lng) + ']'
    )
    .openOn(map);
});



markers.forEach((m) => {
  L.marker(L.latLng(m.lat, m.lng), {title: m.name})
    .addTo(map)
    .bindPopup(
      m.name + ' \n[' + Math.floor(m.lat) + ',' + Math.floor(m.lng) + ']'
    );
});



map.fitBounds(bounds);
