var locations = [
	{
		"name": "nameTest1",
		"address": {lat: -34.397, lng: 150.644},
		"category": "categoryTest",
		"tags": "[]",
		"link": "linkTest"
	},
	{
		"name": "nameTest2",
		"address": {lat: -34.497, lng: 150},
		"category": "categoryTest",
		"tags": "[]",
		"link": "linkTest"
	}
];

var addMarker = function(data, timeout) {
	window.setTimeout(function() {
		var marker = new google.maps.Marker({
	      position: data.address,
	      map: map,
	      animation: google.maps.Animation.DROP
	    })
	    return marker;
	}, timeout);
};

var ViewModel = function() {

	var self = this;

	this.markers = [];

	for (var i = 0; i < locations.length; i++) {
		self.markers.push(addMarker(locations[i], i*700));
	};
};

var map;

var initMap = function() {
	var mapParams = {
			center: {lat: -34.397, lng: 150.644},
    		zoom: 8
		};
	map = new google.maps.Map(document.getElementById('map'), mapParams);

	ko.applyBindings(new ViewModel());
};

$(document).ready(function() {
  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });
});