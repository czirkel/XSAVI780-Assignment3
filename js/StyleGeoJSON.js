// This script demonstrates some simple things one can do with leaflet.js


var map = L.map('map').setView([40.71,-73.93], 11);

// set a tile layer to be CartoDB tiles 
var CartoDBTiles = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',{
  attribution: 'Map Data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors, Map Tiles &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
});

// add these tiles to our map
map.addLayer(CartoDBTiles);


// create global variables we can use for layer controls
var pedestrianCountGeoJSON;
var subwayLinesGeoJSON;
var neighborhoodsGeoJSON;


// use jQuery get geoJSON to grab geoJson layer, parse it, then plot it on the map using the plotDataset function
// let's add the subway lines
$.getJSON( "geojson/MTA_subway_lines.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var subwayLines = data;

console.log(subwayLines);

    // style for subway lines
    var subwayStyle = {
        "color": "#666666",
        "weight": 2,
        "opacity": 0.80
    };

    // function that binds popup data to subway lines
    var subwayClick = function (feature, layer) {
        //console.log(feature.properties);
        // let's bind some feature properties to a pop up
        layer.bindPopup(feature.properties.Line);
    }

    // using L.geojson add subway lines to map
    subwayLinesGeoJSON = L.geoJson(subwayLines, {
        style: subwayStyle,
        onEachFeature: subwayClick
    }).addTo(map);

});


// let's add pawn shops data
$.getJSON( "geojson/WiFi_Hotspots.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var wifiCount = data;

    // pawn shop dots
    var wifiCountPointToLayer = function (feature, latlng){
        var wifiCountMarker = L.circle(latlng, 200, {
            stroke: false,
            fillColor: '#ff9966',
            fillOpacity: 1
        });
        
        return wifiCountMarker;  
    }

    var wifiCountClick = function (feature, layer) {
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Borough:</strong> " + feature.properties.boro + "<br /><strong>City:</strong> " + feature.properties.city + "<br />Address:</strong>" + feature.properties.location + "<br />Name:</strong>" + feature.properties.name + "<br />Type:</strong>" +feature.properties.type);
    }

    wifiCountGeoJSON = L.geoJson(wifiCount, {
        pointToLayer: wifiCountPointToLayer,
        onEachFeature: wifiCountClick
    }).addTo(map);


});


// let's add neighborhood data
$.getJSON( "geojson/NYC_neighborhood_data.geojson", function( data ) {
    // ensure jQuery has pulled all data out of the geojson file
    var neighborhoods = data;

    //console.log(neighborhoods);

    // neighborhood choropleth map
    // let's use % in poverty to color the neighborhood map
    var povertyStyle = function (feature){
        console.log(feature.properties);
        var value = feature.properties.PovertyPer;
        var fillColor = null;
        if(value >= 0 && value <=0.1){
            fillColor = "#ccccff";
        }
        if(value >0.1 && value <=0.15){
            fillColor = "#9999ff";
        }
        if(value >0.15 && value<=0.2){
            fillColor = "#6666ff";
        }
        if(value > 0.2 && value <=0.3){
            fillColor = "#3333ff";
        }
        if(value > 0.3 && value <=0.4) { 
            fillColor = "#0000ff";
        }
        if(value > 0.4) { 
            fillColor = "#0000cc";
        }

        var style = {
            weight: 1,
            opacity: .1,
            color: 'white',
            fillOpacity: 0.75,
            fillColor: fillColor
        };

        return style;
    }

    var povertyClick = function (feature, layer) {
        var percent = feature.properties.PovertyPer * 100;
        percent = percent.toFixed(0);
        // let's bind some feature properties to a pop up
        layer.bindPopup("<strong>Neighborhood:</strong> " + feature.properties.NYC_NEIG + "<br /><strong>Percent in Poverty: </strong>" + percent + "%");
    }

    neighborhoodsGeoJSON = L.geoJson(neighborhoods, {
        style: povertyStyle,
        onEachFeature: povertyClick
    }).addTo(map);


    // create layer controls
    createLayerControls(); 

});


function createLayerControls(){

    // add in layer controls
    var baseMaps = {
        "CartoDB": CartoDBTiles,
    };

    var overlayMaps = {
        "Wi-Fi Locations": wifiCountGeoJSON,
        "Subway Lines": subwayLinesGeoJSON,
        "Povery Map": neighborhoodsGeoJSON
    };

    // add control
    L.control.layers(baseMaps, overlayMaps).addTo(map);

}







