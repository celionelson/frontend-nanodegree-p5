var initialLocations = [
	{
		"name": "Winter Park Elementary School",
		"address": "204 N MacMillan Ave, Wilmington, NC 28403",
		"category": "School",
		"tags": "['education','school']",
		"link": "http://nhcs.net"
	},
	{
		"name": "Hugh MacRae Park",
		"address": "1799 S College Rd, Wilmington, NC 28403",
		"category": "Park",
		"tags": "['recreation','park','playground','baseball','tennis']",
		"link": "http://nhcgov.com"
	},
	{
		"name": "Harris Teeter",
		"address": "822 S College Rd, Wilmington, NC 28403",
		"category": "Groceries",
		"tags": "['groceries','food','market']",
		"link": "http://locations.harristeeter.com"
	},
	{
		"name": "University of North Carolina Wilmington",
		"address": "603 S College Rd, Wilmington, NC 28403",
		"category": "categoryTest",
		"tags": "['education','university','studies']",
		"link": "http://uncw.edu"
	},
	{
		"name": "Venture Church",
		"address": "2024 Independence Blvd, Wilmington, NC 28403",
		"category": "Church",
		"tags": "['church','service','worship']",
		"link": "http://jointheventure.com"
	}
];

/* Add a marker on the map */
var addMarker = function(data, timeout) {

	var marker;

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

				// Create infowindow and its content corresponding to marker clicked on
				var formatted_address = results[0].formatted_address,
					streetviewUrl = 'https://maps.googleapis.com/maps/api/streetview?size=150x100&location=' + formatted_address + '',
					contentStr = '<div>' +
					'<h3>' + data.name + '</h3>' +
					'<p>' + formatted_address + '<br>' +
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

			    marker.metadata = {name: data.name, tags: data.tags};
			    console.log('marker inside geocode = '+marker)
			    return marker;

			} else {
				// Alert in case the geocode convertion failed 
				alert("Geocode was not successful for the following reason: " + status);
			};
		});
		
	}, timeout);
	
	console.log('Marker before return = '+marker)
};

var search = function(str,markers) {
	var matchingMarkers = [],
		push = false;

	for (marker in markers) {
		console.log(markers);
		if (marker.metadata.name.search(str) != -1) {
			push = true;
		} else {
			for (tag in marker.metadata.tags) {
				if (tag.seach(str) != -1) {
					push = true;
				}
			}
		};

		if (push) {
			matchingMarkers.push(marker);
			push = false;
		};
	};

	return matchingMarkers;
};

var ViewModel = function() {

	var self = this;

	this.markerList = [];

	// Create and add a marker in the markers array for each location
	var i = 0;
	initialLocations.forEach(function(location) {
		self.markerList.push(addMarker(location, i*200));
		i++;
	});

	this.searchStr = ko.observable();

	console.log('Marker list = ' +this.markerList);
	this.currentLocations = ko.observableArray(search(self.searchStr, self.markerList));

};

var map;
var geocoder;
var currentInfowindow = null;

/* Initialize map. This function is called once the google map API is fully loaded */
var initMap = function() {
	var mapParams = {
			center: {lat : 34.2057255, lng: -77.8900102},
    		zoom: 13
		};
	map = new google.maps.Map(document.getElementById('map'), mapParams),
	geocoder = new google.maps.Geocoder();

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