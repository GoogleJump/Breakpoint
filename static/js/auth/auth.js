function signinCallback(authResult) {
    if (authResult['status']['signed_in']) {
        console.log('authresult:');
        console.log(authResult);
        // Update the app to reflect a signed in user
        // Hide the sign-in button now that the user is authorized, for example:
        //document.getElementById('signinButton').setAttribute('style', 'display: none');
        $('#map-overlay').hide();
        //window.location.replace('http://stackoverflow.com');
        // note - it doesn't matter that people can see this API key
        API_KEY = 'AIzaSyASx0hpPKM8ENDxXJXN_KwmqxiYkUtZte0';
        var username = makeRequest('https://www.googleapis.com/plus/v1/people/me?key=' + API_KEY);
        console.log('username retrieved: ' + username);
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

function makeRequest(url, auth) {
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
    httpRequest.onreadystatechange = alertContents;
    httpRequest.open('GET', url);
    if (typeof auth != 'undefined') {
        httpRequest.setRequestHeader(auth);
    }

    httpRequest.send();
    return httpRequest.responseText;
}
googleOAuth();
