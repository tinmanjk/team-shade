//var Kinvey = require('kinvey-html5-sdk');

var app = {

  events: {
    // Signup
    '#signup-form submit': 'signup',

    // Login
    '#login-form submit': 'login',
    '#login-with-mic click': 'loginWithMIC',

    // Logout
    '#logout-button click': 'logout',
  },

  login: function(event, username, password) {
    // Prevent the form from being submitted
    event.preventDefault();
    // Remove the login-error
    $('#login-error').hide(0);

    // Login to Kinvey
    Kinvey.User.login(username, password)
      .then(function(response) {

        //console.log(response);
        var authToken = response.data._kmd.authtoken;
        sessionStorage.setItem('authToken', authToken);

        var currentUser = response.data.username;
        sessionStorage.setItem('currentUser', currentUser);

        location.replace('#/home');
        console.log("User is logged!!!");
        $('#logout-button').removeClass('hidden');
        $('#login-button').addClass('hidden');

        //$('#logout-button').addClass('hidden');
      })
      .catch(function(error) {
        $('#login-error').html('<p>' + error.message + '</p>').show(0);
      });
    },
    
    kinveyFindEvents: function() {
    // return all event from the base        
    var allData = Kinvey.DataStore.collection('events');

      return allData.find();

    },

    kinveyFindEventsByCategory: function(category) {
    // return all event from the base        
    var allData = Kinvey.DataStore.collection('events');
    var query = new Kinvey.Query();

    query.equalTo('category', `${category}`);
    
    return allData.find(query); 
    },

};

// Bind events
function bindEvents() {
  return new Promise(function(resolve) {
    var elementEventKeys = Object.keys(app.events);
    elementEventKeys.forEach(function(elementEventKey) {
      var element = elementEventKey.split(' ')[0];
      var event = elementEventKey.split(' ')[1];
      $(element).on(event, app[app.events[elementEventKey]]);
    });
    resolve();
  });
}

// Initialize Kinvey
Kinvey.initialize({
  appKey: 'kid_HyCEcB5k-',
  appSecret: 'a9a7f4cb0a984e7880268561903a1360'
})
  .then(function(activeUser) {
    if (!activeUser) {
      location.replace('#/home');
    } else {
     return bindEvents();
    }
  })
  .then(function() {
    $(document).trigger('app.ready');
  })
  .catch(function(error) {
    alert(error.message);
    console.log(error);
  });

export { app }