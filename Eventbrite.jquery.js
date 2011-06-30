/*
 * Eventbrite API client (jQuery required) - https://github.com/ryanjarvinen/Eventbrite.jquery.js
 */

//Constructor
var Eventbrite = function () {
  var args = Array.prototype.slice.call(arguments),
    // the last argument is the callback
    callback = args.pop();
  this.api_key = args[0];
  this.user_key = args[1];

  // make sure the function is called as a constructor
  if (!(this instanceof Eventbrite)) {
    return new Eventbrite(api_key, user_key, callback);
  }
  
  // call callback
  callback(this);
}

Eventbrite.prototype = {
  api_host: "https://developer.eventbrite.com/json/",
  api_methods: ['discount_new', 'discount_update', 'event_copy', 'event_get', 'event_list_attendees', 'event_list_discounts', 'event_new', 'event_search', 'event_update', 'organizer_list_events', 'organizer_new', 'organizer_update', 'organizer_get', 'payment_update', 'ticket_new', 'ticket_update', 'user_get', 'user_list_events', 'user_list_organizers', 'user_list_tickets', 'user_list_venues', 'user_new', 'user_update', 'venue_new', 'venue_get', 'venue_update'],
  request: function ( method, params, cb ) {
    params.app_key = this.api_key;
    if (!( this.user_key === undefined || "function" === typeof this.user_key )) {
      params.user_key = this.user_key;
    }
    
    $.ajax({
      url: this.api_host + method,
      data: params,
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

(function(){
  var len = Eventbrite.prototype.api_methods.length;
  function addMethod ( method ) { 
    Eventbrite.prototype[method] = function( params, callback) {
      this.request( method, params, callback );
    }   
  }

  for ( var i = 0; i < len ; i += 1 ){
    addMethod( Eventbrite.prototype.api_methods[i] );
  }
}());
