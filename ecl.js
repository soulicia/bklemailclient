(function(window){

var ecl = {
	clientId: '',
	apiKey: '',
  scopes: '',
  gmail: null,
  gplus: null,

	// Callback when unauthorized.
	onUnauthorized: null,

	// Callback when authorized.
	onAuthorized: null,
};

function handleAuthResult(authResult) {
  if (authResult && !authResult.error) {
  	if (ecl.onAuthorized) {
  		ecl.onAuthorized();
	    makeApiCall();
  	}
  } else {
    console.log('auth error:', authResult.error);
  	if (ecl.onUnauthorized) {
      ecl.gmail = null;
      ecl.gplus = null;
  		ecl.onUnauthorized();
  	}
  }
}

ecl.requestAuthorization = function(event) {
  gapi.auth.authorize({client_id: ecl.clientId, scope: ecl.scopes, immediate: false}, handleAuthResult);
  return false;
}

// Load the API.
function makeApiCall() {
  gapi.client.load('gmail', 'v1', function() {
    // var gmail = gapi.client.gmail;
    ecl.gmail = gapi.client.gmail;
    // var req = gmail.users.getProfile({'userId': 'me'});
    // req.execute(function(resp) {
    //     console.log('getProfile resp:', resp);
    // });
  });

  // gapi.client.load('plus', 'v1', function() {
  //   ecl.gplus = gapi.client.plus;
  // });
}

ecl.gmail = function(cb) {
  gapi.client.load('gmail', 'v1', function() {
    cb(gapi.client.gmail);
    // var gmail = gapi.client.gmail;
    // ecl.gmail = gapi.client.gmail;
    // var req = gmail.users.getProfile({'userId': 'me'});
    // req.execute(function(resp) {
    //     console.log('getProfile resp:', resp);
    // });
  });
}

// To call on client api load.
ecl.onLoad = function() {
  gapi.client.setApiKey(ecl.apiKey);

  // Check auth
  window.setTimeout(function() {
    gapi.auth.authorize({client_id: ecl.clientId, scope: ecl.scopes, immediate: true}, handleAuthResult);
  },1);
}

/**
 * Send Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function sendMessage(userId, email, callback) {
  var base64EncodedEmail = btoa(email);
  var request = ecl.gmail.users.messages.send({
    'userId': userId,
    'resource': {
      'raw': base64EncodedEmail
    }
  });
  request.execute(callback);
}

window.ecl = ecl;

})(window);