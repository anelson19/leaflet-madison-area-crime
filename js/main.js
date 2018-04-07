//Leaflet Examples: https://maptimeboston.github.io/leaflet-intro/
//Andy Woodruff Examples: https://bl.ocks.org/awoodruff
//Leaflet cluster map + choropleth example: http://bl.ocks.org/awoodruff/5de3553bb1f1b0c5f90d
//Leaflet overlay using geojson: https://jsfiddle.net/qkvo7hav/7/
//								 https://jsfiddle.net/qkvo7hav/6/
//Search multiple layers: http://labs.easyblog.it/maps/leaflet-search/examples/multiple-layers.html
				
		
var osmLink = '<a href="http://openstreetmap.org">OpenStreetMap</a>',
			thunLink = '<a href="http://thunderforest.com/">Thunderforest</a>';
		
		var osmUrl = 'https://www.mapbox.com/studio/styles/anelson19/cjdf6cyr309ei2rrq42jjstha/edit/',
			osmAttrib = '&copy; ' + osmLink + ' Contributors',
			positronUrl = 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
			thunAttrib = '&copy; '+osmLink+' Contributors & '+thunLink;

		var lightMap = L.tileLayer(osmUrl, {attribution: osmAttrib}),
			positronMap = L.tileLayer(positronUrl, {attribution: thunAttrib});

var map = L.map('map', {
	center: [43.0740, -89.37],
	layers: [lightMap],
	zoom: 11,
	zoomControl: false
})
.setView([43.0740, -89.37], 11);
var zoomHome = L.Control.zoomHome();
zoomHome.addTo(map);

var baseLayers = {
			"Mapbox Light": lightMap,
			"Carto Positron": positronMap
		};

// load a tile layer
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
	maxZoom: 18,
	attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
		'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		'Imagery © <a href="http://mapbox.com">Mapbox</a>',
	id: 'mapbox.light'
}).addTo(map);


var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Madison Area, WI Crime</h4>' +  (props ?
        '<b>' + 'District ' + props.ALD_DIST + '</b><br />' + props.OBJECTID + ''
        : 'Hover over a district, town or village');
};

info.update_t = function (props) {
    this._div.innerHTML = '<h4>Madison Area, WI Crime</h4>' +  (props ?
        '<b>' + props.MCD_NAME + '</b><br />' + 'Crime Index (2016): ' + '<b>' + props.CRIME_IDX + '</b>' + ''
        : 'Hover over a district, town or village');
};

info.addTo(map);

function getColor(d) {
    return d > 320  ? '#006837' :
           d > 240  ? '#31a354' :
           d > 160   ? '#78c679' :
           d > 80   ? '#c2e699' :
           d > 0   ? '#ffffcc' :
                      '#f7f7f7';
}

function highlightFeature(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.8
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	info.update(layer.feature.properties);
	//info.update_t(layer.feature.properties);
}

function highlightFeature_t(e) {
	var layer = e.target;

	layer.setStyle({
		weight: 3,
		color: '#666',
		dashArray: '',
		fillOpacity: 0.8
	});

	if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
		layer.bringToFront();
	}

	//info.update(layer.feature.properties);
	info.update_t(layer.feature.properties);
}

var geojson, townMA;

function resetHighlight(e) {
	geojson.resetStyle(e.target);
	info.update();
	info.update_t();
}

var townMA;

function resetHighlight_t(e) {
	townMA.resetStyle(e.target);
	info.update();
	info.update_t();
}

function zoomToFeature(e) {
	map.fitBounds(e.target.getBounds());
}

function onEachFeature(feature, layer) {
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		click: zoomToFeature
	});
}

$.getJSON("data/Aldermanic_Districts.geojson",function(districtData){
geojson = L.geoJson( districtData, {
  style: function(feature){
	var fillColor,
		district = feature.properties.ALD_DIST;
	if ( district > 80 ) fillColor = "#006837";
	else if ( district > 40 ) fillColor = "#31a354";
	else if ( district > 20 ) fillColor = "#78c679";
	else if ( district > 10 ) fillColor = "#c2e699";
	else if ( district > 0 ) fillColor = "#ffffcc";
	else fillColor = "#f7f7f7";  // no data
	return { color: "#999", weight: 1, fillColor: fillColor, fillOpacity: .6 };
  },
  onEachFeature: function( feature, layer ){
	//layer.bindPopup( "<strong>Aldermanic District: " + feature.properties.ALD_DIST + "</strong><br/>" + feature.properties.ALD_DIST)
	layer.on({
		mouseover: highlightFeature,
		mouseout: resetHighlight,
		//click: zoomToFeature
	});
  }
});
map.addLayer(geojson);
	//search(geojson, 'ALD_DIST');
});


$.getJSON("data/towns_villages_near_madison.geojson",function(townData){
townMA = L.geoJson( townData, {
  style: function(feature){
	var fillColor,
		town = feature.properties.CRIME_IDX;
	if ( town > 320 ) fillColor = "#006837";
	else if ( town > 240 ) fillColor = "#31a354";
	else if ( town > 160 ) fillColor = "#78c679";
	else if ( town > 80 ) fillColor = "#c2e699";
	else if ( town > 0 ) fillColor = "#ffffcc";
	else fillColor = "#f7f7f7";  // no data
	return { color: "#999", weight: 2, fillColor: fillColor, fillOpacity: .6 };
  },
  onEachFeature: function( feature, layer ){
	layer.bindPopup( "<strong>" + feature.properties.MCD_NAME.toUpperCase() + "</strong><br/>" + feature.properties.CRIME_IDX)
	    //event listeners to open popup on hover
	layer.on({
		mouseover: highlightFeature_t,
		mouseout: resetHighlight_t,
		//click: zoomToFeature
	});
  }
  
}).addTo(map);
	search(townMA, 'MCD_NAME');
});


$.getJSON("data/2013_cl.geojson",function(crimeData){
	var pinIcon = L.icon({
	  iconUrl: 'data/map-marker.png',
	  iconSize: [35,35]
	});
	var myStyle = { radius: 10, fillOpacity: 1, stroke: false, weight: 1, opacity: 1, fill: true, clickable: true };
	var crimes = L.geoJson(crimeData,{
	  pointToLayer: function(feature,latlng){
		var marker = L.marker(latlng,{icon: pinIcon});
		marker.bindPopup('<strong>' + feature.properties.Name.toUpperCase() + '</strong>' + '<br/>' + feature.properties.PopupInfo);
		return marker;
	  }
	});
	
	var clusters = L.markerClusterGroup();
	clusters.addLayer(crimes);
	map.addLayer(clusters);
	
	/* var overlaysObj = { 'All points': clusters.addTo(map) }
	L.control.layers({collapsed: false}, overlaysObj).addTo(map); */


$.getJSON("data/Police_Stations.geojson",function(psData){
    var blueIcon = L.icon({
      iconUrl: 'data/blue.png',
      iconSize: [30,30]
    });
    var polStations = L.geoJson(psData,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng,{icon: blueIcon});
        marker.bindPopup('<strong>'+feature.properties.LONG_NAME.toUpperCase() + '</strong>' + '<br/>' + feature.properties.ADDRESS);
        return marker;
      }
    });
	
    var psClust = L.markerClusterGroup();
    psClust.addLayer(polStations);
    map.addLayer(psClust);
	
	var overlaysAll = { 'All Crime Locations': clusters.addTo(map), 'Police Stations': psClust.addTo(map)}
	L.control.layers(baseLayers, overlaysAll, {position: 'topleft'}).addTo(map);

});
});

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 80, 160, 240, 320],
		labels = [],
		from, to;

	for (var i = 0; i < grades.length; i++) {
		from = grades[i];
		to = grades[i + 1];

		labels.push(
			'<i style="background:' + getColor(from + 1) + '"></i> ' +
			from + (to ? '&ndash;' + to : '+'));
	}

	div.innerHTML = labels.join('<br>');
	return div;
};

legend.addTo(map);

function search(dataName, propName){
	var controlSearch = new L.Control.Search({
		position:'topleft',		
		layer: dataName,
		propertyName: propName,
		initial: false,
		zoom: 12,
		marker: false
	});

	map.addControl( controlSearch );
}





