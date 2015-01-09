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
	    loadAPI(ecl.onAuthorized);
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
function loadAPI(cb) {
  // var batch = gapi.client.newBatch();
  // batch.add(gapi.client.load('gmail', 'v1'));
  // batch.add(gapi.client.load('plus', 'v1'));
  // batch.then(
  //   function() {
  //     ecl.gmail = gapi.client.gmail;
  //     ecl.gplus = gapi.client.plus;
  //     cb();
  //   },
  //   function(reason) {
  //     alert('reason');
  //   }
  // );

  gapi.client.load('gmail', 'v1').then(function() {
    gapi.client.load('plus', 'v1').then(function() {
        ecl.gmail = gapi.client.gmail;
        ecl.gplus = gapi.client.plus;
        cb();
    });
  });

  // gapi.client.load('gmail', 'v1', function() {
  //   ecl.gmail = gapi.client.gmail;
  // });

  // gapi.client.load('plus', 'v1', function() {
  //   ecl.gplus = gapi.client.plus;
  // });
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