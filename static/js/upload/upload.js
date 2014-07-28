function success(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;
    console.log('Your current position is:');
    console.log('Latitude : ' + latitude);
    console.log('Longitude: ' + longitude);
    console.log('Accurate to ' + accuracy + ' meters.');
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

var error = function(err) {
    console.log('ERROR(' + err.code + '): ' + err.message);
};

function getLocation() {
    console.log("finding location!");
    navigator.geolocation.getCurrentPosition(success, error, options);
}
