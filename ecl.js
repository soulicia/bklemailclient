(function(exports){

var ecl = {
	clientId: '',
	apiKey: '',

	// Callback when unauthorized.
	onUnauthorized: null,

	// Callback when authorized.
	onAuthorized: null,
};

// To call on client api load.
ecl.onLoad = function() {
  gapi.client.setApiKey(ecl.apiKey);

  // Check auth
  window.setTimeout(function() {
	  gapi.auth.authorize({client_id: ecl.clientId, scope: scopes, immediate: true}, handleAuthResult);
  },1);
}

function handleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
  	if (ecl.onAuthorized) {
  		ecl.onAuthorized();
	    makeApiCall();
  	}
    // authorizeButton.style.visibility = 'hidden';
  } else {
  	if (ecl.onUnauthorized) {
  		ecl.onUnauthorized();
  	}
    // authorizeButton.style.visibility = '';
    // authorizeButton.onclick = requestAuthorization;
  }
}

function defaultHandleAuthResult(authResult) {
  var authorizeButton = document.getElementById('authorize-button');
  if (authResult && !authResult.error) {
    authorizeButton.style.visibility = 'hidden';
    makeApiCall();
  } else {
    authorizeButton.style.visibility = '';
    authorizeButton.onclick = requestAuthorization;
  }
}

function requestAuthorization(event) {
  gapi.auth.authorize({client_id: ecl.clientId, scope: scopes, immediate: false}, handleAuthResult);
  return false;
}

// Load the API and make an API call.  Display the results on the screen.
function makeApiCall() {
  gapi.client.load('plus', 'v1', function() {
    var request = gapi.client.plus.people.get({
      'userId': 'me'
    });
    request.execute(function(resp) {
      var heading = document.createElement('h4');
      var image = document.createElement('img');
      image.src = resp.image.url;
      heading.appendChild(image);
      heading.appendChild(document.createTextNode(resp.displayName));

      document.getElementById('content').appendChild(heading);
    });
  });
}

exports.ecl = ecl;

})(window);