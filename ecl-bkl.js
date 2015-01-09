(function() {


ecl.clientId = '979256935714-ebk0o87kbnlqq4qvfgk76ho744nnfaon.apps.googleusercontent.com';
ecl.apiKey = 'AIzaSyDTltDk5Zwzfl8rtDjhf-zBY-qI68dpdxo';
ecl.scopes = 'https://mail.google.com/';

function eclOnLoad() {
  ecl.onLoad();
}

ecl.onUnauthorized = function() {
  console.log('gapi unauthorized');
  // $('.unauthorized').show();
};

ecl.onAuthorized = function() {
  console.log('gapi authorized');
  // $('.authorized').show();
  loadUserProfile();
  loadMailTargets();
};

$( "#mail" ).submit(function(event) {
  event.preventDefault();
  handleSend();
  return false;
});

ecl.onAuthorized();



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
  renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', FIXTURE.userProfile);
  // var template = $('#tmplMyEmailAddress').html();
  // Mustache.parse(template);   // optional, speeds up future uses
  // var rendered = Mustache.render(template, FIXTURE.userProfile);
  // $('#myEmailAddress').html(rendered);

  // var req = ecl.gmail.users.getProfile({'userId': 'me'});
  // req.then(
  //   function(resp) {
  //     // body...
  //   },
  //   function(reason) {
  //     // body...
  //   }
  // );
}

function loadMailTargets() {
  renderTemplate('#tmplMailTargets', '#mailTargets', FIXTURE.mailTargets);
  // body...
}

})();