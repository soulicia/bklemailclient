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

/**
 * Send Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function sendMessage(userId, msg, attachment) {
  var params = {
    'userId': userId,
    'resource': {},
  };
  var request;

  if (attachment) {
    var contypeEnd = attachment.data.indexOf(";");
    var dataStart = attachment.data.indexOf(",");
    var contype = attachment.data.slice(5,contypeEnd);
    var trtype = attachment.data.slice(contypeEnd+1,dataStart);
    var prefix = 'Content-Type: '+contype+'; name="'+attachment.name+'"\n';
    prefix += 'Content-Disposition: attachment; filename="'+attachment.name+'"\n';
    prefix += 'Content-Length: '+attachment.size+'\n';
    prefix += 'Content-Transfer-Encoding: '+trtype+'\n\n';
    console.log('PREFIX', prefix);
    console.log('SIZE', attachment.size);

    params.resource.raw = btoa(msg+"\n"+prefix) + attachment.data.slice(dataStart);
    params.uploadType = 'media';
    // request = ecl.gmail.users.messages.send(params);
    request = gapi.client.request({
      path: 'https://www.googleapis.com/upload/gmail/v1/users/me/messages/send?uploadType=media',
      method: 'POST',
      params: params,
      headers: {
        'Content-Type': 'message/rfc822',
      },
    });
  } else {
    request = ecl.gmail.users.messages.send(params);
    params.resource.raw = btoa(msg);
  }

  // var request = ecl.gmail.users.messages.send({
  //   'userId': userId,
  //   'resource': {
  //     'raw': params.resource.raw
  //   }
  // });
  // request.execute(callback);
  return request;
}

ecl.requestAuthorization = function(event) {
  gapi.auth.authorize({client_id: ecl.clientId, scope: ecl.scopes, immediate: false}, handleAuthResult);
  return false;
};

// To call on client api load.
ecl.onLoad = function() {
  gapi.client.setApiKey(ecl.apiKey);

  // Check auth
  window.setTimeout(function() {
    gapi.auth.authorize({client_id: ecl.clientId, scope: ecl.scopes, immediate: true}, handleAuthResult);
  },1);
};

ecl.send = function(to, subject, message, attachment) {
  var msg = 'From: me\nTo: '+to.join()+'\nSubject: '+subject+'\n\n'+message+'\n';
  return sendMessage("me", msg, attachment);
};



window.ecl = ecl;

})(window);