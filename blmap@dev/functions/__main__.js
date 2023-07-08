const lib = require('lib')({token: process.env.STDLIB_SECRET_TOKEN});
const fs = require('fs');


let data = await lib.googlesheets.query['@0.3.0'].select({
  spreadsheetId: process.env.DBSPREADSHEET,
  range: `Locations!A:G`,
  bounds: 'FIRST_EMPTY_ROW',
  where: [{}],
  limit: {
    count: 0,
    offset: 0,
  },
});

let table = data.rows.map((d) => d.fields);
table = table.filter(e => e.Name !== "" && e.Hidden === "FALSE");


function Marker(name, type, lat, lng, combo) {
  this.name = name;
  this.type = type;
  this.lat = lat;
  this.lng = lng;
  this.combo = combo;
}

let markers = [];

table.forEach((e) =>{
  markers.push(new Marker(e.Name, e.Type, e.Latitude, e.Longitude, e.Combo))}
);

let bodyHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>Odd Jobs Map</title>

    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />


    
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
      integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
      crossorigin=""
    />
    <script
      src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
      integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
      crossorigin=""
    ></script>

    <style>
      html,
      body {
        height: 100%;
        margin: 0;
      }
      .leaflet-container {
        height: 100%;
        width: 100%;
        max-width: 100%;
        max-height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script type="text/javascript">
    let markers=${JSON.stringify(markers)}
    
    
    let corlat = -4065; //55+40;
    let corlng = -5710; //-650;
    let scale = 1.52;
    var bounds = [
      [0 + corlat, 0 + corlng],
      [8192 * scale + corlat, 8192 * scale + corlng],
    ];
    var regular = L.imageOverlay('https://i.imgur.com/FJFPUdo.jpg', bounds);
    var underground = L.imageOverlay('https://i.imgur.com/JygHGfG.jpg', bounds);
    var satelite = L.imageOverlay('https://www.bragitoff.com/wp-content/uploads/2015/11/GTAV-HD-MAP-satellite.jpg', bounds);
    var neighbourhood = L.imageOverlay('https://i2.wp.com/www.bragitoff.com/wp-content/uploads/2015/11/gtav-map-neighborhoods.jpg?ssl=1', bounds);
    
    var map = L.map('map', {
      crs: L.CRS.Simple,
      minZoom: -4,
      maxZoom:0,
      layers:[regular, underground, satelite,neighbourhood]
    });
    
    map.on('click', function (event) {
      var coords = event.latlng;
      L.popup()
        .setLatLng(coords)
        .setContent(
          '[' + Math.floor(coords.lat) + ',' + Math.floor(coords.lng) + ']'
        )
        .openOn(map);
    });
    
    var business = [];
    var misc = [];
    var illegal = [];
    var drugs = [];
    var localshop = [];
    var unknown = [];
    var crafting = [];
    var gang = [];
    var combos = new Object();
    
    var blueIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var goldIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var redIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var greenIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var orangeIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var yellowIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var violetIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-violet.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var greyIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    var blackIcon = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-black.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    
    markers.forEach((m) => {
      var proto = L.marker(L.latLng(m.lat, m.lng), {title: m.name})
      .bindPopup(
        m.name +'<br>'+
        m.type +'<br>'+
        '[ ' + Math.floor(m.lat) + ', ' + Math.floor(m.lng) + ' ]'
      );
      if(m.combo !== "") {
        if(!combos[m.combo]){
          combos[m.combo] = []
        }
        combos[m.combo].push(proto);
      }
      
      switch(m.type){
        case "Business":
          business.push(proto.setIcon(greyIcon)); 
          break;
        case "Misc":
          misc.push(proto.setIcon(blueIcon)); 
          break;
        case "Illegal":
          illegal.push(proto.setIcon(greenIcon)); 
          break;
        case "Drugs":
          drugs.push(proto.setIcon(violetIcon)); 
          break;
        case "Local Shop":
          localshop.push(proto.setIcon(yellowIcon)); 
          break;
        case "Unknown":
          unknown.push(proto.setIcon(goldIcon)); 
          break;
        case "Crafting":
          crafting.push(proto.setIcon(orangeIcon)); 
          break;
        case "Gang":
          gang.push(proto.setIcon(blackIcon)); 
          break;
        default:
          L.marker(L.latLng(m.lat, m.lng), {title: m.name})
          .addTo(map)
          .bindPopup(
            m.name +'<br>'+
            m.type +'<br>'+
            '[ ' + Math.floor(m.lat) + ', ' + Math.floor(m.lng) + ' ]'
          ); 
      }
    });
    
    var combolines = []
    for(var key in combos) {
      var value = combos[key];
    console.log(value)
      value.push(value[0])
      value = value.map(e => e._latlng);
      console.log(value);
      var polyline = L.polyline(value)
      combolines.push(polyline)
    }
    
    
    var businessLG = L.layerGroup(business );
    var miscLG = L.layerGroup(misc );
    var illegalLG = L.layerGroup(illegal );
    var drugsLG = L.layerGroup(drugs );
    var localshopLG = L.layerGroup(localshop );
    var unknownLG = L.layerGroup(unknown );
    var craftingLG = L.layerGroup(crafting );
    var gangLG = L.layerGroup(gang );
    var comboLG = L.layerGroup(combolines );
    
    var overlayMaps = {
        "Business": businessLG ,
        "Misc": miscLG ,
        "Illegal": illegalLG ,
        "Drugs": drugsLG ,
        "Local Shop": localshopLG ,
        "Unknown": unknownLG ,
        "Crafting": craftingLG ,
        "Gang": gangLG ,
        "Combos":comboLG
        
    };
    
    var baseMaps = {
      "Regular": regular,
      "Underground": underground,
      "Satelite": satelite,
      "Neighbourhood":neighbourhood
    }
    
    L.control.layers(baseMaps ,overlayMaps).addTo(map);
    map.fitBounds(bounds);
    </script>
  </body>
</html>
`;

return {
  headers: {
    'Content-Type': 'text/html',
  },
  body: bodyHtml,
};
