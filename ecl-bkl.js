(function() {


ecl.clientId = '979256935714-ebk0o87kbnlqq4qvfgk76ho744nnfaon.apps.googleusercontent.com';
ecl.scopes = 'https://mail.google.com/ https://www.googleapis.com/auth/plus.me';
ecl.apiKey = 'AIzaSyDTltDk5Zwzfl8rtDjhf-zBY-qI68dpdxo';

var authorized = false;

// CHANGE THIS !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// ecl.apiKey = 'AIzaSyDL78hg8anke_-0176qkyE3tNllNuhGME4';

function noop() {}

ecl.onUnauthorized = function() {
  console.log('gapi unauthorized');
  authorized = false;
  $('.authorized').hide();
  $('.unauthorized').show();
  var authBtn = document.getElementById('authBtn');
  authBtn.onclick = ecl.requestAuthorization;
};

ecl.onAuthorized = function() {
  // console.log('gapi authorized', ecl);
  authorized = true;
  $('.unauthorized').hide();
  $('.authorized').show();
  var authBtn = document.getElementById('authBtn');
  authBtn.onclick = noop;
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

  // var mymail = 'From: me\nTo: '+to.join()+'\nSubject: '+subject+'\n\n'+message+'\n';
  // console.log(mymail);
  if (to.length === 0) {
    showAlert("Pesan tidak lengkap", "Tentukan minimal satu tujuan!");
    return
  }


  var subject = $('#subject').val();
  var message = $('#message').val();

  if (subject === "" && message === "") {
    showAlert("Pesan tidak lengkap", "Tuliskan isi pesan!");
    return
  }

  var attachment = document.getElementById('attachment');
  if (attachment.files[0]) {
    var fr = new FileReader();
    fr.onload = function(e) {
      console.log('ATTACH:', e.target.result);
      var req = ecl.send(to, subject, message, {data: e.target.result, name: attachment.files[0].name, size: attachment.files[0].size});
      req.then(
        function(resp) {
          $('#sendSuccess').modal('show');
        },
        function(reason) {
          alert(reason.result.error.message);
          console.log('SEND ERROR', reason);
        });
    };
    fr.readAsDataURL(attachment.files[0]);
    return;
  }

  clearAlert();


  var req = ecl.send(to, subject, message);
  req.then(
    function(resp) {
      $('#sendSuccess').modal('show');
    },
    function(reason) {
      // alert(reason);
      console.log('SEND ERROR', reason);
    }
  );


  // var mymail = "From: me\nTo: frm.adiputra@gmail.com,faycool.befreesource@gmail.com\nSubject: Coba\n\nHanya isinya.\n";
  // ecl.sendMessage('me', mymail, function(resp) { console.info(resp) });
}

function showAlert(title, message) {
  renderTemplate('#tmplAlert', '#alerts', {title: title, message: message});
}

function clearAlert() {
  $('#alerts').html("");
}

function renderTemplate(tmpl, targ, data) {
  var template = $(tmpl).html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data);
  $(targ).html(rendered);
}

function renderAppendTemplate(tmpl, targ, data) {
  var template = $(tmpl).html();
  Mustache.parse(template);   // optional, speeds up future uses
  var rendered = Mustache.render(template, data);
  $(targ).append(rendered);
}

function loadUserProfile() {

  ecl.gmail.users.getProfile({'userId': 'me'}).then(
    function(resp) {
      // console.log('profile', resp.result);
      var profile = resp.result;

      ecl.gplus.people.get({'userId': 'me'}).then(
        function(resp) {
          // console.log('getPeople resp:', resp);
          var plus = resp.result;
          var data = {image: plus.image.url, displayName: plus.displayName, emailAddress: profile.emailAddress};
          renderTemplate('#tmplUserPanel', '#userPanel', data);
          renderTemplate('#tmplUserMenu', '#userMenu', data);
          renderTemplate('#tmplUserDropdown', '#userDropdown', data);
        },
        function(reason) {
          alert(reason.result.error.message);
        }
      );
      // renderTemplate('#tmplMyEmailAddress', '#myEmailAddress', resp.result);
    },
    function(reason) {
      alert(reason.result.error.message);
    }
  );


}

function loadMailTargets() {
  // renderTemplate('#tmplMailTargets', '#mailTargets', FIXTURE.mailTargets);
  renderTemplate('#tmplMailTargets', '#mailTargets', ECLDATA.mailTargets);
}

})();