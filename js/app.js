var initialLocations = [
	{
		"name": "Winter Park Elementary School",
		"address": "204 N MacMillan Ave, Wilmington, NC 28403",
		"latLng": "",
		"category": "School",
		"tags": ['education','school'],
		"link": "http://nhcs.net"
	},
	{
		"name": "Hugh MacRae Park",
		"address": "1799 S College Rd, Wilmington, NC 28403",
		"latLng": "",
		"category": "Park",
		"tags": ['recreation','park','playground','baseball','tennis'],
		"link": "http://nhcgov.com"
	},
	{
		"name": "Harris Teeter",
		"address": "822 S College Rd, Wilmington, NC 28403",
		"latLng": "",
		"category": "Groceries",
		"tags": ['groceries','food','market'],
		"link": "http://locations.harristeeter.com"
	},
	{
		"name": "University of North Carolina Wilmington",
		"address": "603 S College Rd, Wilmington, NC 28403",
		"latLng": "",
		"category": "categoryTest",
		"tags": ['education','university','studies'],
		"link": "http://uncw.edu"
	},
	{
		"name": "Venture Church",
		"address": "2024 Independence Blvd, Wilmington, NC 28403",
		"latLng": "",
		"category": "Church",
		"tags": ['church','service','worship'],
		"link": "http://jointheventure.com"
	}
];

/* Dertermine lat and lng based on the address of the location with google's geocode function */
var geocode = function() {

	initialLocations.forEach(function(location) {

		var addressUrl = location.address.replace(' ', '+'),
			googleapiKey = 'AIzaSyA2FFND0yTl6LbApiZxjut09JyBxcBe_Jo',
			geocodeUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + addressUrl + '&key=' + googleapiKey;
		
		// Send request to google's geocode api
		$.getJSON(geocodeUrl, function(data) {
			
			if (data.status == 'OK') {
				// Set new value to location's latLng element
				location.latLng = data.results[0].geometry.location;
			} else {
				// Alert in case the geocode convertion failed 
				alert("Geocode was not successful for the following reason: " + status);
			};
		});
	});
};

geocode();

/* Add a marker on the map */
var addMarker = function(data) {

	// Create marker
	var marker = new google.maps.Marker({
      	position: data.latLng,
      	map: map,
      	title: data.name,
      	animation: google.maps.Animation.DROP
    });

	// Create infowindow and its content corresponding to marker clicked on
	var streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=150x100&location=' + data.address + '',
		contentStr = '<div>' +
		'<h3>' + data.name + '</h3>' +
		'<p>' + data.address + '<br>' +
		'Website : <a href="' + data.link + '">' + data.link + '</a></p>' + 
		'<img src="' + streetviewUrl + '" alt="streetview image" class="img-thumbnail img-responsive center-block">' +
		'</div>';

	var infowindow = new google.maps.InfoWindow({
		content: contentStr
	});

	// Open/Close infowindow on click
    marker.addListener('click', function() {
	    if (currentInfowindow != null) {
	    	currentInfowindow.close();	
	    };

	    infowindow.open(map, marker);
	    currentInfowindow = infowindow;
	});

    marker.metadata = {tags: data.tags};

	return marker;
};

var ViewModel = function() {

	var self = this;

	this.markerList = ko.observableArray([]);

	// Create and add a marker in the markers array for each location
	initialLocations.forEach(function(location) {
		self.markerList.push(addMarker(location));
	});

	// Input updated as the user writes
	this.searchStr = ko.observable('');

	// Look for the markers matching the searchStr
	this.currentMarkers = ko.computed(function() {
		var markers = this.markerList(),
			str = this.searchStr().toLowerCase(),
			matchingMarkers = [],
			match;

		// Iterate over all the markers to search for matching titles and/or tags
		markers.forEach(function(marker) {
			
			match = false;
			marker.setVisible(true);

			if (str == '' || marker.title.toLowerCase().search(str) != -1) {
				match = true;
			} else {
				marker.metadata.tags.forEach(function(tag) {
					if (tag.toLowerCase().search(str) != -1) {
						match = true;
					}
				})
			};

			if (match) {
				matchingMarkers.push(marker);
			} else {
				marker.setVisible(false);
			}
		})

		return matchingMarkers;
	}, this);
};

var map;
var currentInfowindow = null;

/* Initialize map. This function is called once the google map API is fully loaded */
var initMap = function() {

	var mapParams = {
			center: {lat : 34.2057255, lng: -77.8900102},
    		zoom: 13
		};
	map = new google.maps.Map(document.getElementById('map'), mapParams),

	// Initialize the ViewModel only when the map is fully loaded and idle
	google.maps.event.addListenerOnce(map,'idle', function(e) {
	   ko.applyBindings(new ViewModel());
	});
};

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});