(function() {


ecl.clientId = '979256935714-ebk0o87kbnlqq4qvfgk76ho744nnfaon.apps.googleusercontent.com';
ecl.apiKey = 'AIzaSyDTltDk5Zwzfl8rtDjhf-zBY-qI68dpdxo';
ecl.scopes = 'https://mail.google.com/ https://www.googleapis.com/auth/plus.me';

ecl.onUnauthorized = function() {
  console.log('gapi unauthorized');
  // $('.unauthorized').show();
};

ecl.onAuthorized = function() {
  // console.log('gapi authorized', ecl);
  // $('.authorized').show();
  loadUserProfile();
  loadMailTargets();
};

$( "#mail" ).submit(function(event) {
  event.preventDefault();
  handleSend();
  return false;
});

// ecl.onAuthorized();



function handleSend() {
  var to = [];

  $('#targets input:checked').each(function() {
    to.push($(this).data('emailaddress'));
  });

  var subject = $('#subject').val();
  var message = $('#message').val();

  var mymail = 'From: me\nTo: '+to.join()+'\nSubject: '+subject+'\n\n'+message+'\n';
  console.log(mymail);


  // var mymail = "From: me\nTo: frm.adiputra@gmail.com,faycool.befreesource@gmail.com\nSubject: Coba\n\nHanya isinya.\n";
  // ecl.sendMessage('me', mymail, function(resp) { console.info(resp) });
}

function renderTemplate(tmpl, targ, data) {
  var template = $(tmpl).html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data);
  $(targ).html(rendered);
}

function loadUserProfile() {
  // renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', FIXTURE.userProfile);
  // ecl.gmail(function(g) {
  //   var req = g.users.getProfile({'userId': 'me'});
  //   req.then(
  //     function(resp) {
  //       console.log('getProfile resp:', resp);
  //       renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', resp.result);
  //     },
  //     function(reason) {
  //       alert(reason);
  //     }
  //   );
  // });

  var req = ecl.gmail.users.getProfile({'userId': 'me'});
  req.then(
    function(resp) {
      renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', resp.result);
    },
    function(reason) {
      alert(reason);
    }
  );

  req = ecl.gplus.people.get({'userId': 'me'});
  req.then(
    function(resp) {
      console.log('getPeople resp:', resp);
      // renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', resp.result);
    },
    function(reason) {
      alert(reason);
    }
  );
}

function loadMailTargets() {
  renderTemplate('#tmplMailTargets', '#mailTargets', FIXTURE.mailTargets);
  // body...
}

})();