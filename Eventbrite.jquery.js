/*
 * Eventbrite API client (jQuery required) - https://github.com/ryanjarvinen/Eventbrite.jquery.js
 */

//Constructor
function Eventbrite() {
  var args = Array.prototype.slice.call(arguments),
    // the last argument is the callback
    callback = args.pop(),
    api_key = args[0],
    user_key = args[1];

  // private accessor
  authParams = function (params) {
    params.app_key = api_key;
    if ( user_key != '' && user_key != undefined ) {
      params.user_key = user_key;
    } else {
      params.user_key = '';
    }
    return params;
  };

  // make sure the function is called as a constructor
  if (!(this instanceof Eventbrite)) {
    return new Eventbrite(api_key, user_key, callback);
  }
  
  // call callback
  callback(this);
}

Eventbrite.prototype = {
  api_host: "https://developer.eventbrite.com/json/",
  request: function ( method, params, cb) {
    $.ajax({
      url: this.api_host + method,
      data: authParams(params),
      type: 'GET',
      dataType: 'jsonp',
      success: function (resp) {
        cb(resp.contents);
      },
      failure: function (err) {
        console.log("Error connecting to Eventbrite API");
      }
    });
  }
};
