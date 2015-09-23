var initialLocations = [
	{
		"name": "Winter Park Elementary School",
		"address": "204 N MacMillan Ave, Wilmington, NC 28403",
		"latLng": "",
		"category": "Education",
		"tags": ['education','school'],
		"link": "http://nhcs.net"
	},
	{
		"name": "Hugh MacRae Park",
		"address": "1799 S College Rd, Wilmington, NC 28403",
		"latLng": "",
		"category": "Parks and sports",
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
		"category": "Education",
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
	},
	{
		"name": "Wild Wing Cafe",
		"address": "1331 Military Cutoff Rd, Wilmington, NC 28405",
		"latLng": "",
		"category": "Fast Food",
		"tags": ['fast food','restaurant','food'],
		"link": "http://wildwingcafe.com"
	},
	{
		"name": "Wilmington International Airport",
		"address": "1740 Airport Blvd, Suite 12, Wilmington, NC 28405",
		"latLng": "",
		"category": "Airport",
		"tags": ['airport','plane','flight','travel'],
		"link": "http://www.flyilm.com/"
	}
];

var markerCategories = [
	{
		"category": "Coffee",
		"icon": {
			normal: "images/cat-1.png",
			selected: "images/cat-1s.png"
		}
	},
	{
		"category": "Groceries",
		"icon": {
			normal: "images/cat-2.png",
			selected: "images/cat-2s.png"
		}
	},
	{
		"category": "Airport",
		"icon": {
			normal: "images/cat-3.png",
			selected: "images/cat-3s.png"
		}
	},
	{
		"category": "Nightlife",
		"icon": {
			normal: "images/cat-4.png",
			selected: "images/cat-4s.png"
		}
	},
	{
		"category": "Transportation",
		"icon": {
			normal: "images/cat-5.png",
			selected: "images/cat-5s.png"
		}
	},
	{
		"category": "Fast Food",
		"icon": {
			normal: "images/cat-6.png",
			selected: "images/cat-6s.png"
		}
	},
	{
		"category": "Church",
		"icon": {
			normal: "images/cat-7.png",
			selected: "images/cat-7s.png"
		}
	},
	{
		"category": "Education",
		"icon": {
			normal: "images/cat-8.png",
			selected: "images/cat-8s.png"
		}
	},
	{
		"category": "Parks and sports",
		"icon": {
			normal: "images/cat-9.png",
			selected: "images/cat-9s.png"
		}
	},
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
var addMarker = function(data, icon) {

	// Create marker
	var marker = new google.maps.Marker({
      	position: data.latLng,
      	map: map,
      	title: data.name,
      	animation: google.maps.Animation.DROP,
      	icon: icon.normal
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

	// Close current marker when infowindow is closed by user
	infowindow.addListener('closeclick', function() {
		closeCurrentMarker();
	});

	// Store tags, infowindow and icon in marker's metadata
	marker.metadata = {tags: data.tags, icon: icon, infowindow: infowindow};

	// Open marker on click
    marker.addListener('click', function() {
    	openMarker(marker);
	});

	return marker;
};

/* Open infowindow and change icon on selected marker */
var openMarker = function(marker) {
	// Close everything related to the current marker
	closeCurrentMarker();

	// Open the new marker's infowindow
    marker.metadata.infowindow.open(map, marker);

    // Set new marker's icon to selected state
    marker.setIcon(marker.metadata.icon.selected);
    
	// Set the new marker as current marker
    currentMarker = marker;
};

var closeCurrentMarker = function() {
	if (currentMarker != null) {
    	currentMarker.metadata.infowindow.close();
    	currentMarker.setIcon(currentMarker.metadata.icon.normal);	
    };
}

var ViewModel = function() {

	var self = this;

	this.markerList = ko.observableArray([]);

	// Create and add a marker in the markers array for each location
	initialLocations.forEach(function(location) {
		var icon;

		markerCategories.forEach(function(markerCategory) {
			if (location.category == markerCategory.category) {
				icon = markerCategory.icon;
			}
		})

		self.markerList.push(addMarker(location, icon));
	});

	// Input updated as the user writes
	this.searchStr = ko.observable('');

	// Look for the markers matching the searchStr
	this.currentMarkers = ko.computed(function() {
		var markers = this.markerList(),
			str = this.searchStr().toLowerCase(),
			matchingMarkers = [],
			match;

		// Close marker currently open
		closeCurrentMarker();

		// Expand dropdown menu
		if (str != '') {
			$("#dropdown-menu").attr("aria-expanded", true);
			$("#dropdown-list").addClass("open");
		};

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

	// Function triggered by the form's submit button
	this.showResults = function() {
		// Collapse navbar
		$("#mobile-button").click();

		// Retrieve the first of the current markers matching the search
		var marker = self.currentMarkers()[0];

		// Center the map on this marker
		map.setCenter(marker.position);

		// Open this marker
		openMarker(marker);
	};

	// Function triggered by click on items in dropdown key locations
	selectMarker = function() {
		
		// Collapse navbar
		$("#mobile-button").click();

		var marker = this;

		// Open this marker
		openMarker(marker);
	}
};

var map;
var currentMarker = null;

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