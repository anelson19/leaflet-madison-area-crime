//Leaflet Examples: https://maptimeboston.github.io/leaflet-intro/
//Andy Woodruff Examples: https://bl.ocks.org/awoodruff
//Leaflet cluster map + choropleth example: http://bl.ocks.org/awoodruff/5de3553bb1f1b0c5f90d
//Leaflet overlay using geojson: https://jsfiddle.net/qkvo7hav/7/
//								 https://jsfiddle.net/qkvo7hav/6/
//Search multiple layers: http://labs.easyblog.it/maps/leaflet-search/examples/multiple-layers.html
//Leaflet Dropdown: https://gis.stackexchange.com/questions/131157/adding-drop-down-menu-on-leaflet-map-instead-of-l-control
//Bootstrap dropdown: https://www.w3schools.com/bootstrap/bootstrap_dropdowns.asp
//font awesome: https://fontawesome.com/icons?d=gallery
//Filter Buttons: http://bl.ocks.org/zross/47760925fcb1643b4225
//JQuery Dropdown examplehttp://esri.github.io/bootstrap-map-js/demo/jquery/maps.html#
//https://gis.stackexchange.com/questions/129891/javascript-arcgis-dropdown-menu-with-layers?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
//https://www.youtube.com/watch?v=PnUWcPQnZw4

$(document).ready(function(){
  $('.dropdown-submenu a.month').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
  $('.dropdown-submenu a.time').on("click", function(e){
    $(this).next('ul').toggle();
    e.stopPropagation();
    e.preventDefault();
  });
});
				
		
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
        '<b>' + 'District ' + props.Districts + '</b><br />' + 'Number of crimes committed: ' + '<b>' + props.crimes17 + '</b>' + ''
        : 'Hover over a district, city or village');
};

info.update_t = function (props) {
    this._div.innerHTML = '<h4>Madison Area, WI Crime</h4>' +  (props ?
        '<b>' + props.MCD_NAME + '</b><br />' + 'Crime Index (2016): ' + '<b>' + props.CRIME_IDX + '</b>' + ''
        : 'Hover over a district, city or village');
};

info.addTo(map);

function getColor(d) {
    return d > 80  ? '#08519c' :
           d > 60  ? '#3182bd' :
           d > 40   ? '#6baed6' :
           d > 20   ? '#bdd7e7' :
           d > 0   ? '#eff3ff' :
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

$.getJSON("data/Aldermanic_Districts3.geojson",function(districtData){
geojson = L.geoJson( districtData, {
  style: function(feature){
	var fillColor,
		district = feature.properties.crimes17;
	if ( district > 80 ) fillColor = "#08519c";
	else if ( district > 60 ) fillColor = "#3182bd";
	else if ( district > 40 ) fillColor = "#6baed6";
	else if ( district > 20 ) fillColor = "#bdd7e7";
	else if ( district > 0 ) fillColor = "#eff3ff";
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



$.getJSON("data/towns_villages_near_madison.geojson",function(townData){
townMA = L.geoJson( townData, {
  style: function(feature){
	var fillColor,
		town = feature.properties.CRIME_IDX;
	if ( town > 320 ) fillColor = "#08519c";
	else if ( town > 240 ) fillColor = "#3182bd";
	else if ( town > 160 ) fillColor = "#6baed6";
	else if ( town > 80 ) fillColor = "#bdd7e7";
	else if ( town > 0 ) fillColor = "#eff3ff";
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
});


$.getJSON("data/convertcsv-(3).json",function(crimeData){
	var crimeIcon = L.AwesomeMarkers.icon({
        prefix: 'fa', //font awesome rather than bootstrap
        markerColor: 'red', // see colors above
        icon: 'exclamation-circle' //http://fortawesome.github.io/Font-Awesome/icons/
    });
	var myStyle = { radius: 10, fillOpacity: 1, stroke: false, weight: 1, opacity: 1, fill: true, clickable: true };
	/* var crimes = L.geoJson(crimeData,{
	  pointToLayer: function(feature,latlng){
		var marker = L.marker(latlng,{icon: crimeIcon});
		marker.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' 
		+ 'Location Type: ' + feature.properties.poi_type);
		return marker;
	  }
	}); */
	var crimes = L.geoJson(crimeData);
	
	
        var districtNone = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "None";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtOne = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "1";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtTwo = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "2";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtThree = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "3";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtFour = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "4";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtFive = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "5";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtSix = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "6";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtSeven = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "7";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtEight = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "8";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtNine = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "9";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtTen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "10";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtEleven = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "11";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtTwelve = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "12";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtThirteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "13";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtFourteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "14";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtFifteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "15";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtSixteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "16";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtSeventeen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "17";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtEighteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "18";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>'  + 'Incident ID: '+ feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtNineteen = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "19";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var districtTwenty = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.A_District == "20";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
					icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		// ------------------------- END OF DISTRICTS ---------------------------- //
		// ------------------------- START OF INCIDENTS -------------------------- //
		var battery = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.IncdntType == "Battery";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var damagedProperty = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.IncdntType == "Damaged Property";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		
		// ------------------------- END OF INCIDENTS ---------------------------- //
		// ------------------------- START OF ARRESTED -------------------------- //
		var yesArrest = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.Arrest == "Yes";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		var noArrest = L.geoJson(crimeData, {
            filter: function(feature, layer) {
                return feature.properties.Arrest == "No";
            },
            pointToLayer: function(feature, latlng) {
                return L.marker(latlng, {
                    icon: crimeIcon
                }).on('mouseover', function() {
                    this.bindPopup('<strong>' + feature.properties.name.toUpperCase() + '</strong>' + '<br/>' + 'Incident ID: ' + feature.properties.IncidentID + '<br/>' + 'District: ' + feature.properties.A_District + '<br/>' + 'Case Number: ' + feature.properties.CaseNum + '<br/>' + 'Date: ' + feature.properties.Date + '<br/>' + 'Time: ' + feature.properties.Time + '<br/>' + 'Incident Type: ' + feature.properties.IncdntType);
                });
            }
        });
		
		var clusters = L.markerClusterGroup();
			clusters.addLayer(districtNone)
			clusters.addLayer(districtOne)
			clusters.addLayer(districtTwo)
			clusters.addLayer(districtThree)
			clusters.addLayer(districtFour)
			clusters.addLayer(districtFive)
			clusters.addLayer(districtSix)
			clusters.addLayer(districtSeven)
			clusters.addLayer(districtEight)
			clusters.addLayer(districtNine)
			clusters.addLayer(districtTen)
			clusters.addLayer(districtEleven)
			clusters.addLayer(districtTwelve)
			clusters.addLayer(districtThirteen)
			clusters.addLayer(districtFourteen)
			clusters.addLayer(districtFifteen)
			clusters.addLayer(districtSixteen)
			clusters.addLayer(districtSeventeen)
			clusters.addLayer(districtEighteen)
			clusters.addLayer(districtNineteen)
			clusters.addLayer(districtTwenty)
		
		$("#districtList li").click(function(e) {
			switch (e.target.text) {
			  case "Show All Crimes":
				clusters.addLayer(districtNone)
				clusters.addLayer(districtOne)
				clusters.addLayer(districtTwo)
				clusters.addLayer(districtThree)
				clusters.addLayer(districtFour)
				clusters.addLayer(districtFive)
				clusters.addLayer(districtSix)
				clusters.addLayer(districtSeven)
				clusters.addLayer(districtEight)
				clusters.addLayer(districtNine)
				clusters.addLayer(districtTen)
				clusters.addLayer(districtEleven)
				clusters.addLayer(districtTwelve)
				clusters.addLayer(districtThirteen)
				clusters.addLayer(districtFourteen)
				clusters.addLayer(districtFifteen)
				clusters.addLayer(districtSixteen)
				clusters.addLayer(districtSeventeen)
				clusters.addLayer(districtEighteen)
				clusters.addLayer(districtNineteen)
				clusters.addLayer(districtTwenty)
				
				clusters.removeLayer(yesArrest)
				clusters.removeLayer(noArrest)
				break;
				case "Remove All Crimes":
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				
				clusters.removeLayer(yesArrest)
				clusters.removeLayer(noArrest)
				break;
			  case "Not in District":
				clusters.addLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 1":
				clusters.addLayer(districtOne)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 2":
				clusters.addLayer(districtTwo)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 3":
				clusters.addLayer(districtThree)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 4":
				clusters.addLayer(districtFour)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 5":
				clusters.addLayer(districtFive)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 6":
				clusters.addLayer(districtSix)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 7":
				clusters.addLayer(districtSeven)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 8":
			    clusters.addLayer(districtEight)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 9":
			    clusters.addLayer(districtNine)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 10":
			    clusters.addLayer(districtTen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 11":
			    clusters.addLayer(districtEleven)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 12":
			    clusters.addLayer(districtTwelve)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 13":
			    clusters.addLayer(districtThirteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 14":
				clusters.addLayer(districtFourteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 15":
				clusters.addLayer(districtFifteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 16":
				clusters.addLayer(districtSixteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 17":
				clusters.addLayer(districtSeventeen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 18":
				clusters.addLayer(districtEighteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 19":
				clusters.addLayer(districtNineteen)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "District 20":
				clusters.addLayer(districtTwenty)
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				break;
			}
			if ($(".navbar-collapse.in").length > 0) {
			  $(".navbar-toggle").click();
			}
		  });
		  
		  $("#incidentList li").click(function(e) {
			switch (e.target.text) {
			  case "Show All Incidents":
				clusters.addLayer(battery)
				clusters.addLayer(damagedProperty)
				
				clusters.removeLayer(yesArrest)
				clusters.removeLayer(noArrest)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "Remove All Incidents":
				clusters.removeLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				clusters.removeLayer(yesArrest)
				clusters.removeLayer(noArrest)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "Accidents":
				
				break;
			  case "Attempted Homicide":
				
				break;
			  case "Battery":
				clusters.addLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				
				break;
			  case "Damaged Property":
				clusters.addLayer(damagedProperty)
				clusters.removeLayer(battery)
				
				
				break;
			  case "Disturbance":
				
				break;
			  case "Drug Investigation":
				
				break;
			  case "Fraud":
				
				break;
			  case "Intoxicated Driver":
				
				break;
			  case "Murder/Homicide":
			    
				break;
			  case "Non-Residential/Residential Burglary":
			    
				break;
			  case "Robbery":
			    
				break;
			  case "Sexual Assault":
			    
				break;
			  case "Traffic Incident":
			    
				break;
			  case "Weapons Violation":
			    
				break;
			}
			if ($(".navbar-collapse.in").length > 0) {
			  $(".navbar-toggle").click();
			}
		  });
		  
		  $("#arrestedList li").click(function(e) {
			switch (e.target.text) {
			  case "Show All Crimes":
				clusters.addLayer(yesArrest)
				clusters.addLayer(noArrest)
				
				clusters.removeLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "Remove All Crimes":
				clusters.removeLayer(yesArrest)
				clusters.removeLayer(noArrest)
				
				clusters.removeLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "Yes":
				clusters.addLayer(yesArrest)
				clusters.removeLayer(noArrest)
				
				clusters.removeLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			  case "No":
				clusters.addLayer(noArrest)
				clusters.removeLayer(yesArrest)
				
				clusters.removeLayer(battery)
				clusters.removeLayer(damagedProperty)
				
				clusters.removeLayer(districtNone)
				clusters.removeLayer(districtOne)
				clusters.removeLayer(districtTwo)
				clusters.removeLayer(districtThree)
				clusters.removeLayer(districtFour)
				clusters.removeLayer(districtFive)
				clusters.removeLayer(districtSix)
				clusters.removeLayer(districtSeven)
				clusters.removeLayer(districtEight)
				clusters.removeLayer(districtNine)
				clusters.removeLayer(districtTen)
				clusters.removeLayer(districtEleven)
				clusters.removeLayer(districtTwelve)
				clusters.removeLayer(districtThirteen)
				clusters.removeLayer(districtFourteen)
				clusters.removeLayer(districtFifteen)
				clusters.removeLayer(districtSixteen)
				clusters.removeLayer(districtSeventeen)
				clusters.removeLayer(districtEighteen)
				clusters.removeLayer(districtNineteen)
				clusters.removeLayer(districtTwenty)
				break;
			}
			if ($(".navbar-collapse.in").length > 0) {
			  $(".navbar-toggle").click();
			}
		  });
	  
		map.addLayer(clusters);
		

	
	/* var overlaysObj = { 'All points': clusters.addTo(map) }
	L.control.layers({collapsed: false}, overlaysObj).addTo(map); */
$.getJSON("data/Police_Stations.geojson",function(psData){
    var policeIcon = L.AwesomeMarkers.icon({
        prefix: 'fa', //font awesome rather than bootstrap
        markerColor: 'blue', // see colors above
        icon: 'star' //http://fortawesome.github.io/Font-Awesome/icons/
    });
    var polStations = L.geoJson(psData,{
      pointToLayer: function(feature,latlng){
        var marker = L.marker(latlng,{icon: policeIcon});
        marker.bindPopup('<strong>'+feature.properties.LONG_NAME.toUpperCase() + '</strong>' + '<br/>' + feature.properties.ADDRESS
		+ '<br/>' + 'Location Type: ' + feature.properties.poi_type);
        return marker;
      }
    });
	
    var psClust = L.markerClusterGroup();
    psClust.addLayer(polStations);
    map.addLayer(psClust);
	
	var overlaysAll = {'Police Stations': psClust.addTo(map)}
	L.control.layers(baseLayers, overlaysAll, {position: 'topleft'}).addTo(map);

});
});


var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

	var div = L.DomUtil.create('div', 'info legend'),
		grades = [0, 20, 40, 60, 80],
		labels = ['<strong> Number of Crimes </strong>'],
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
		marker: false,
		buildTip: function(text, val) {
			var type = val.layer.feature.properties.poi_type;
			return '<a href="#" class="'+type+'">'+text+'<b>'+type+'</b></a>';
		}
	});

	map.addControl( controlSearch );
}





