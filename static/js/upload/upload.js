function startRecording(lat, lng) {
    // triggered on location callback results
    console.log("received lat " + lat + ", long " + lng);
    initAudio();
}

var success = function(position) {
    var latitude  = position.coords.latitude;
    var longitude = position.coords.longitude;
    var accuracy = position.coords.accuracy;
    //console.log('Your current position is:');
    //console.log('Latitude : ' + latitude);
    //console.log('Longitude: ' + longitude);
    //console.log('Accurate to ' + accuracy + ' meters.');
    startRecording(latitude, longitude);
}

var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
}

var error = function(err) {
    console.log('ERROR(' + err.code + '): ' + err.message);
};

function invadePrivacy() {
    navigator.geolocation.getCurrentPosition(success, error, options);
}
