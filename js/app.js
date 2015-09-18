var locations = [
	{
		"name": "Walmart",
		"address": "8035 Market St, Wilmington, NC",
		"category": "categoryTest",
		"tags": "[]",
		"link": "linkTest"
	},
	{
		"name": "Wrightsville Beach",
		"address": "23 E Salisbury St, Wrightsville Beach, NC",
		"category": "categoryTest",
		"tags": "[]",
		"link": "linkTest"
	}
];

/* Add a marker on the map */
var addMarker = function(data, timeout) {

	/* Set timeout for markers not to drop at the same time */
	window.setTimeout(function() {

		/* Dertermine lat and lng based on the address of the location with google's geocode function */
		geocoder.geocode( { 'address': data.address}, function(results, status) {

			// Check status of request and create marker if OK 
	      	if (status == google.maps.GeocoderStatus.OK) {
				var marker = new google.maps.Marker({
			      	position: results[0].geometry.location,
			      	map: map,
			      	title: data.name,
			      	animation: google.maps.Animation.DROP
			    });
			    return marker;
			} else {
				// Alert in case the geocode convertion failed 
				alert("Geocode was not successful for the following reason: " + status);
			};
		});
	}, timeout);
};

var ViewModel = function() {

	var self = this;

	this.markers = [];

	// Create and add a marker in the markers array for each location
	var i = 0;
	locations.forEach(function(location) {
		self.markers.push(addMarker(location, i*2000));
		i++;
	});
};

var map;
var geocoder;

/* Initialize map. This function is called once the google map API is fully loaded */
var initMap = function() {
	var mapParams = {
			center: {lat : 34.2257255, lng: -77.9447102},
    		zoom: 10
		};
	map = new google.maps.Map(document.getElementById('map'), mapParams),
	geocoder = new google.maps.Geocoder();

	// Initialize the ViewModel
	ko.applyBindings(new ViewModel());
};

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});