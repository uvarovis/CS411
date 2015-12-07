var UsersDAO = require('../users').UsersDAO;
var request = require("request");
	
function ContentHandler(db) {
	"use strict";

	var users = new UsersDAO(db);

	this.displayHomePage = function(req, res, next) {
		"use strict";

		if (req.logged_in == true) {
			return res.render("home", {
				email: req.email
			});
		}
		else {
			return res.render("promo");
		}
	}

	this.displaySettingsPage = function(req, res, next) {
		"use strict";

		if (req.logged_in == true) {
			return res.render("settings");
		}
		else {
			return res.redirect("/");
		}
	}

	this.displayMyLocationsPage = function(req, res, next) {
		"use strict";

		if (req.logged_in == true) {
			return res.render("my_locations");
		}
		else {
			return res.redirect("/");
		}
	}

	this.handleSaveSettings  = function(req, res, next) {
		"use strict";

		if (req.logged_in == true) {
			var cell_phone = req.body.cell_phone;
			//console.log(cell_phone);
			users.setCellPhone(req.email, cell_phone, function() {
				return res.render("settings");
			});
		}
		else {
			return res.redirect("/");
		}
	}

	this.displayWeatherInSearchedLocation = function(req, res, next) {
		"use strict";

		var userLocation = req.body.location_search_term;
		console.log(userLocation);

		getLocationData(userLocation, function(mylocdata) {
			var latitude  = mylocdata.results[0].geometry.location.lat;
			var longitude = mylocdata.results[0].geometry.location.lng;
		  	var fullAddr  = mylocdata.results[0].formatted_address;
		  	console.log(fullAddr);
		  	console.log(latitude);
		    console.log(longitude);
		  	
		  	getWeatherData(latitude, longitude, function(weather) {
		  		var currentTemp    = weather.currently.temperature;
		  		return res.render("weather_in_location", {
					temperature : currentTemp
				});
		  	
		    });
		});
	} 
}

// NEED TO CHECK FOR INCORRECT LOCATION INPUT
function getLocationData(inputAddress, callback) {
	var geocodingApiKey = "AIzaSyAEokMIw4n0LyczRhF3Qrmo-_HZCnHFdKM";
	var baseUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	var geocodingUrl = baseUrl + inputAddress + "&key=" + geocodingApiKey;
	//console.log(geocodingUrl)
	
	request(geocodingUrl, function(error, response, body) {
	  if (!error && response.statusCode == 200) {

	    if (callback) callback(JSON.parse(body));
	  }
	});
}

function getWeatherData(latitude, longtitude, callback) {
	var forecastApiKey = "97b429b5400c7110f209ae571437be6b";
	var baseUrl = "https://api.forecast.io/forecast/";
	var forecastUrl = baseUrl + forecastApiKey + "/" + latitude + "," + longtitude;
	//console.log(forecastUrl)
	
	request(forecastUrl, function(error, response, body) {
	  if (!error && response.statusCode == 200) {

	    if (callback) callback(JSON.parse(body));
	  }
	});
}

module.exports = ContentHandler;