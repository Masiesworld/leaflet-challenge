 // Put API KEY
var API_KEY = "PUT YOUR API KEY HERE";


function createMap(earthquakes) {

var grayscale = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
}),

 satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-satellite",
    accessToken: API_KEY
}),

 outdoors = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors, <a href='https://creativecommons.org/licenses/by-sa/2.0/'>CC-BY-SA</a>, Imagery © <a href='https://www.mapbox.com/'>Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.outdoors",
    accessToken: API_KEY
});


var myMap = L.map("mapid", {
  center: [
    39.563445, -97.008664
  ],
  zoom: 4
});


grayscale.addTo(myMap);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", function(data) {

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  // Run the onEachFeature function once for each piece of data in the array
  function geojsonMarkerOptions(feature) {
    return {
      opacity: 0.7,
      fillOpacity: 0.5,
      fillColor: circleColor(feature.properties.mag),
      color: "black",
      radius: circleRadius(feature.properties.mag),
      stroke: true,
      weight: 0.8
    };
  }


  function circleColor(mag) {
    if (mag > 5) {
            return 'Maroon'
    } else if (mag > 4) {
            return 'Chocolate'
    } else if (mag > 3) {
            return 'orange'
    } else if (mag > 2) {
            return 'Gold'
    } else if (mag > 1) {
            return 'lightgreen'
    } else {
            return 'GreenYellow'
    }
}

  function circleRadius(mag) {
    return mag * 5;
  }

  L.geoJson(data, {
    // We turn each feature into a circleMarker on the map.
    pointToLayer: function(feature, latlng) {
      return L.circleMarker(latlng);
    },
    style: geojsonMarkerOptions,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("<h4>" + feature.properties.place +
      "</h4><hr><p>" + "<strong>Magnitude:</strong> " + feature.properties.mag + "</p>" + 
      "<p>" + "<strong>Time:</strong> " + new Date(feature.properties.time) + "</p>" + 
      "<p>" + "<strong>Depth:</strong> " + feature.geometry.coordinates[2] + "</p>"
      );
    }
  }).addTo(myMap);

  // Legend 
  var legend = L.control({
    position: "bottomright"
  });

  // Then add all the details for the legend
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");

    var grades = [0, 1, 2, 3, 4, 5];
    var colors = [
      "GreenYellow",
      "lightgreen",
      "Gold",
      "orange",
      "Chocolate",
      "Maroon"
    ];

    for (var i = 0; i < grades.length; i++) {
      div.innerHTML +=
        "<i style='background: " + colors[i] + "'></i> " +
        grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
    }
    return div;
  };


  legend.addTo(myMap);
});
}
createMap();
