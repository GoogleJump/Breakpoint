function startRecording(lat, lng) {
    // triggered on location callback results
    console.log("received lat " + lat + ", long " + lng);
    initAudio();
    // toggleRecording(e) where e is (or at least, was) an image
    //<div id="controls">
    //<img id="record" src="img/mic128.png" onclick="toggleRecording(this);">
    //<a id="save" href="#"><img src="img/save.svg"></a>
    //</div>
    // see if you can do a running calculation for the things below... if not,
    // process the file.
    // we also have the option of doing this server side, although that's suboptimal.
}

// Calculates weighted average of frequencies, 'spectral centroid'
function centroids(data, granularity) {
    // granularity == tradeoff between quality and data size
    // if upload sizes are an issue we'll go for lower quality

}

// Calculates list of volumes, to control radius
function volumes(data, granularity) {
    // granularity == tradeoff between quality and data size
    // if upload sizes are an issue we'll go for lower quality
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
