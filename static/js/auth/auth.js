// global variables are bad yeah
var ROOT_URL = 'http://127.0.0.1:9999/'
var username = "";
function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        // hide it right away because yeah
        $('#map-overlay').hide();
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        //document.getElementById('signinButton').setAttribute('style', 'display: none');
        //in case we need to do a javascript redirect
        //window.location.replace('http://stackoverflow.com');

        // note - it doesn't matter that people can see this API key
        var API_KEY = 'AIzaSyBMtQNnKdssKEIXsXBunXbwsDr7rnjrVh4';
        var token = 'Bearer ' + authResult['access_token'];
        var receivedCallback = function() {
            var userInfo = JSON.parse(this.responseText);
            username = userInfo.emails[0].value;
            var success = function() {
                // do login stuff
                var json = JSON.parse(this.responseText);
                if (json['success']) {
                    // TODO successful oauth login stuff here
                    console.log('it worked!');
                    console.log(username);
                    //addUserOverlay(username);
                } else {
                    // how can oauth login fail? idt it can
                }
            }
            makeRequest(ROOT_URL + 'userlogin?user=' + username, 'nope', success);
        };
        var reqURL = 'https://www.googleapis.com/plus/v1/people/me?key=' + API_KEY;
        makeRequest(reqURL, token, receivedCallback);
    } else if (logged_in) {
        $('#map-overlay').hide();
        // TODO successful nonoauth login stuff here
    } else { // Update the app to reflect a signed out user
        // Possible error values:
        //   'user_signed_out' - User is signed-out
        //   'access_denied' - User denied access to your app
        //   'immediate_failed' - Could not automatically log in the user
        console.log('Sign-in state: ' + authResult['error']);
    }
}

function googleOAuth() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/client:plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
}    

function makeRequest(url, auth, callback) {
    if (window.XMLHttpRequest) { // Mozilla, Safari, ...
        httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) { // IE
        try {
            httpRequest = new ActiveXObject('Msxml2.XMLHTTP');
        } 
        catch (e) {
            try {
                httpRequest = new ActiveXObject('Microsoft.XMLHTTP');
            } 
            catch (e) {}
        }
    }
    if (!httpRequest) {
        alert('Giving up :( Cannot create an XMLHTTP instance');
        return false;
    }
    httpRequest.open('GET', url);
    httpRequest.onload = callback;
    if (typeof auth != 'undefined' && auth != 'nope') {
        httpRequest.setRequestHeader("Authorization", auth);
    }
    httpRequest.send();
}

googleOAuth();
