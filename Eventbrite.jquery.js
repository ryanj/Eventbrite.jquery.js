/*
 * Eventbrite API client (jQuery required) - https://github.com/ryanjarvinen/Eventbrite.jquery.js
 */

//Constructor
var Eventbrite = function () {
  "use strict";
  var auth_tokens = {},
    args = Array.prototype.slice.call(arguments),
    // the last argument is the callback
    callback = args.pop();
  
  if(typeof args[0] === 'object'){
    auth_tokens = args[0];
  }else if(typeof args[0] === 'function' || args[0] === undefined ){
    auth_tokens.access_token = Eventbrite.prototype.data.getAccessToken();
  }else{
    auth_tokens.app_key = args[0];
    if(typeof args[1] !== 'function'){
      if(typeof args[2] !== 'function'){
       auth_tokens.user = args[1];
       auth_tokens.password = args[1];
      }else{
       auth_tokens.user_key = args[1];
      }
    }
  }

  // make sure the function is called as a constructor
  if (!(this instanceof Eventbrite)) {
    return new Eventbrite(auth_tokens, callback);
  }
  this.auth_tokens = auth_tokens;

  // call callback
  callback(this);
};

Eventbrite.prototype = {
  'api_host': "https://developer.eventbrite.com/json/",
  'api_methods': ['discount_new', 'discount_update', 'event_copy', 'event_get', 'event_list_attendees', 'event_list_discounts', 'event_new', 'event_search', 'event_update', 'organizer_list_events', 'organizer_new', 'organizer_update', 'organizer_get', 'payment_update', 'ticket_new', 'ticket_update', 'user_get', 'user_list_events', 'user_list_organizers', 'user_list_tickets', 'user_list_venues', 'user_new', 'user_update', 'venue_new', 'venue_get', 'venue_update'],
  'request': function ( method, params, cb ) {
    var auth_headers = {};
    if(typeof params === 'function'){ cb = params; params = {};}
    else if( params === undefined){ params = {}; }
    if( this.auth_tokens.access_token === undefined ){
      if(this.auth_tokens.app_key){ params.app_key = this.auth_tokens.app_key;}
      if(this.auth_tokens.user_key){ params.user_key = this.auth_tokens.user_key;}
      if(this.auth_tokens.user){ params.user = this.auth_tokens.user;}
      if(this.auth_tokens.password){ params.password = this.auth_tokens.password;}
    }else{
      auth_headers = {'Authorization': 'Bearer ' + this.auth_tokens.access_token};
      params.access_token = this.auth_tokens.access_token;
    }
    
    $.ajax({
      url: this.api_host + method,
      data: params,
      type: 'GET',
      dataType: 'jsonp',
      headers: auth_headers,
      beforeSend: function(xhrObj){
        xhrObj.setRequestHeader("Content-Type","application/json");
        xhrObj.setRequestHeader("Accept","application/json");
        if(params.access_token !== undefined){
          xhrObj.setRequestHeader("Authorization","Bearer "+params.access_token);
        }
      },
      success: function (resp) {
        if(resp.contents !== undefined){
          cb(resp.contents);
        }else{
          cb(resp);
        }
      },
      failure: function (err) {
        console.log("Error connecting to Eventbrite API");
      }
    });
  },

  // various API client utility functions
  'utils': {
    'eventList': function( evnts, callback, options){
      var html = ['<div class="eb_event_list">'];
      if( evnts.events !== undefined ){
        var len = evnts.events.length;
        for( var i = 0; i < len; i++ ){
          if(evnts.events[i].event !== undefined ){
            html.push( callback( evnts.events[i].event, options ));

          }
        }
      }else{
        html.push('No events are available at this time.');
      }
      html.push('</div>');
      return html.join('\n');
    },
    'eventListRow': function( evnt ){
      var not_iso_8601 = /\d\d-\d\d-\d\d \d\d:\d\d:\d\d/;
      var date_string = not_iso_8601.test( evnt.start_date ) ? evnt.start_date.replace(' ', 'T') : evnt.start_date;
      var start_date = new Date( Date.parse( date_string ));
      var venue_name = 'Online'; //default location name
      var time_string = Eventbrite.prototype.utils.formatTime( start_date );
      var html = '';
      date_string = start_date.toDateString();
      if( evnt.venue !== undefined && evnt.venue.name !== undefined && evnt.venue.name !== ''){ 
          venue_name = evnt.venue.name;
      }

      html = "<div class='eb_event_list_item' id='evnt_div_" + evnt.id + "'>" + 
             "<span class='eb_event_list_title'><a href='" + evnt.url + "'>" + evnt.title + "</a></span>" +
             "<span class='eb_event_list_date'>" + date_string + "</span><span class='eb_event_list_time'>" + time_string + "</span>" +
             "<span class='eb_event_list_location'>" + venue_name + "</span></div>";
      return html;
    },
    'formatTime': function( time ){
      var time_string = '';
      var minutes = time.getMinutes();
      var hours = time.getHours();
      var ampm = 'am';
      if( minutes < 10 ){
        minutes = '0' + minutes;
      }
      if( hours === 0 ){
        hours = 12;
      } else if ( hours >= 12 ){
        ampm = 'pm';
        if( hours !== 12){
          hours = hours - 12;
        }
      }
      return time_string += hours + ':' + minutes + ampm;
    },
    'login': function( options, cb ) {
      var response = {};
      if( options.error_message !== undefined ){
        if( options.error_message === 'access_denied' ){
          response.login_error = "Account access denied.";
        }else if( options.error_message !== 'disabled' ){
          response.login_error = options.error_message;
        }
      }
      // auto lookup of access_token from data-store
      if( options.access_token === undefined ){
        if( typeof options.get_token == 'function' ){
          options.access_token = options.get_token();
        }else if( options.get_token !== 'disabled' ){
          options.access_token = Eventbrite.prototype.data.getAccessToken();
        }
      }
      try{
        // Example using an access_token to initialize the API client:
        Eventbrite({'access_token': options.access_token}, function(eb){
          var resp = eb.user_get(function(resp){
            if( resp !== undefined && resp.user !== undefined){
              response.user_email = resp.user.email;
              response.user_name = resp.user.first_name + ' ' + resp.user.last_name;          
            }
            return cb(response);
          });
        });
      }catch(error){
        // This token may no longer be valid
        response.login_error = error;
        if( typeof options.delete_token === 'function' ){
          options.delete_token( options.access_token );
        }else if( options.delete_token !== 'disabled' ){
          Eventbrite.prototype.data.deleteAccessToken( options.access_token );
        }
        return cb(response);
      }
    },
    'logoutLink': function( ) {
      return Eventbrite.prototype.utils.logout;
    },
    'logout': function( app_key ) {
      // delete token and do other cleanup work
      Eventbrite.prototype.data.deleteAccessToken();
      Eventbrite.prototype.widget.login({'app_key': app_key }, function(widget_html){
        $('.eb_login_widget').replaceWith(widget_html);
      });
    },
    'oauthLink': function( key ) {
      return 'https://www.eventbrite.com/oauth/authorize?response_type=token&client_id=' + key;
    },
    'isLoggedIn': function() {
      var token = Eventbrite.prototype.data.getAccessToken();
      var isLogged = ( token !== undefined && token !== 'undefined' );
      return isLogged;
    }
  },
  'data': {
    'getAccessToken': function ( ){
      return localStorage.eb_access_token;
    },
    'saveAccessToken': function ( token ){
      localStorage.eb_access_token = token;
    },
    'deleteAccessToken': function ( token ){
      localStorage.eb_access_token = undefined;
    }
  },
  'widget': {
    'login': function( options, cb ){
      // automatically grab the access_token from the request fragment?
      if( window.location.hash.indexOf("token_type=Bearer") !== -1 &&  
          window.location.hash.indexOf("access_token=") !== -1 &&
          options.access_token === undefined ){  

        // if we have a new access_token: add it to "options", and save it
        if( window.location.hash.slice( window.location.hash.indexOf("access_token=") + 13 ).indexOf("&") !== -1){
          //partial fragment slice
          access_token = window.location.hash.slice( 
            window.location.hash.indexOf("access_token=") + 13,
            window.location.hash.indexOf("access_token=") + 13 + window.location.hash.slice( window.location.hash.indexOf("access_token=") + 13 ).indexOf("&") 
          );
        }else{
          //the rest of the string contains the access_token value
          access_token = window.location.hash.slice( window.location.hash.indexOf("access_token=") + 13 );
        }
        if( access_token !== -1 && access_token !== '' && options.save_token !== 'disabled'){
          if(typeof options.save_token == 'function'){
            options.save_token( access_token );
          }else{
            Eventbrite.prototype.data.saveAccessToken( access_token );
          }
          options.access_token = access_token;
          window.location.hash = '#';
        }
      }

      // automatically grab the access_token from storage?
      if( options.access_token === undefined && options.get_token !== 'disabled'){
        if(typeof options.get_token == 'function'){
          options.access_token = options.get_token();
        }else{
          options.access_token = Eventbrite.prototype.data.getAccessToken();
        }
      }
        
      // automatically grab errors from the querystring?
      if( options.error_message !== undefined && options.error_message == "disabled"){
        delete(options.error_message);
      }else if( options.error_message !== 'disabled' && window.location.search.indexOf("error=") !== -1 ){
        if( window.location.search.slice( window.location.search.indexOf("error=") + 6 ).indexOf("&") !== -1){
          options.error_message = window.location.search.slice( 
            window.location.search.indexOf("error=") + 6,
            window.location.search.indexOf("error=") + 6 + window.location.search.slice( window.location.search.indexOf("error=") + 6 ).indexOf("&") 
          );
        }else{
          options.error_message = window.location.search.slice( window.location.search.indexOf("error=") + 6 );
        }
      }

      //  Check to see if we have a valid user account
      //  and Proccess any data-related work:
      Eventbrite.prototype.utils.login( options, function(response){
        //  package up the data for our view / template:
        var login_params = {};
        if(options.logout_link !== 'disabled'){
          login_params.logout_link = options.logout_link;
        }
        login_params.oauth_link = options.oauth_link;
        if( login_params.oauth_link === undefined ){
          login_params.oauth_link = Eventbrite.prototype.utils.oauthLink(options.app_key);
        }
        if( login_params.logout_link === undefined ){
          login_params.logout_link = "Eventbrite.prototype.utils.logout('" + options.app_key + "');";
        }
        if( response !== undefined && typeof response == 'object'){
          if( response.user_email !== undefined ){
            login_params.user_name = response.user_name,
            login_params.user_email = response.user_email;
          }
          if( response.login_error !== undefined ){
            login_params.login_error = response.login_error;
          }
        }
          
        // view related work:
        //  render your "template"
        if( typeof options.renderer == 'function' ){
          return cb(options.renderer( login_params ));
        }else if(options.renderer == 'disabled' ){
          //return the raw data for use with an external template
          return cb(login_params);
        }else{
          //use our default renderer:
          return cb(Eventbrite.prototype.widget.loginHTML( login_params ));  
        }
      });
    },
    'loginHTML': function( strings ) {
      // Replace this example with something that works with your Application's templating engine
      html = ["<div class='eb_login_widget'>"];
      html.push("<style type='text/css'>.eb_login_btn{width:162px;height:24px;display:block;text-indent: -99999px;background: url('http://evbdn.eventbrite.com/s3-s3/static/images/developer/oauth2/oauth-connect-btns.png') top;}\n.eb_login_btn:hover{background-position: 0px 24px;} .eb_logout{text-align:right;}</style>");
      if( strings.user_name   !== undefined &&
          strings.user_email  !== undefined && 
          strings.logout_link !== undefined ){
        html.push("<div><p><b>Welcome Back!</b></p>");
        html.push("<p>You are logged in as:<br/>"+ strings.user_name + "<br/><i>(" + strings.user_email + ")</i></p>");
        if(strings.logout_link !== 'disabled'){
        html.push("<p class='eb_logout'><a class='button' href='#' onclick=\"" + strings.logout_link + "\">Logout</a></p>");
        }
        html.push("</div>");
      }else if( strings.oauth_link !== undefined ){
        if(strings.login_error !== undefined){
          html.push("<p class='error'>" + strings.login_error + "</p>");
        }
        html.push("<p><a class='eb_login_btn' target='_top' href='" + strings.oauth_link + "'>Connect to Eventbrite</a></p>");
      }else{
        html.push("<div><b>Eventbrite widgetHTML template example fail :(</b></div>");
      }  
      html.push("</div>");
      return html.join("\n");
    },
    'ticket': function( evnt ) {
      return '<div style="width:100%; text-align:left;"><iframe  src="http://www.eventbrite.com/tickets-external?eid=' + evnt.id + '&ref=etckt" frameborder="0" height="192" width="100%" vspace="0" hspace="0" marginheight="5" marginwidth="5" scrolling="auto" allowtransparency="true"></iframe><div style="font-family:Helvetica, Arial; font-size:10px; padding:5px 0 5px; margin:2px; width:100%; text-align:left;"><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/r/etckt">Online Ticketing</a><span style="color:#ddd;"> for </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/event/' + evnt.id + '?ref=etckt">' + evnt.title + '</a><span style="color:#ddd;"> powered by </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com?ref=etckt">Eventbrite</a></div></div>';
    },
    'registration': function( evnt ) {
      return '<div style="width:100%; text-align:left;"><iframe  src="http://www.eventbrite.com/event/' + evnt.id + '?ref=eweb" frameborder="0" height="1000" width="100%" vspace="0" hspace="0" marginheight="5" marginwidth="5" scrolling="auto" allowtransparency="true"></iframe><div style="font-family:Helvetica, Arial; font-size:10px; padding:5px 0 5px; margin:2px; width:100%; text-align:left;"><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/r/eweb">Online Ticketing</a><span style="color:#ddd;"> for </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/event/' + evnt.id + '?ref=eweb">' + evnt.title + '</a><span style="color:#ddd;"> powered by </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com?ref=eweb">Eventbrite</a></div></div>';
    },
    'calendar': function ( evnt ) {
      return '<div style="width:195px; text-align:center;"><iframe  src="http://www.eventbrite.com/calendar-widget?eid=' + evnt.id + '" frameborder="0" height="382" width="195" marginheight="0" marginwidth="0" scrolling="no" allowtransparency="true"></iframe><div style="font-family:Helvetica, Arial; font-size:10px; padding:5px 0 5px; margin:2px; width:195px; text-align:center;"><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/r/ecal">Online event registration</a><span style="color:#ddd;"> powered by </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com?ref=ecal">Eventbrite</a></div></div>';
    }, 
    'countdown': function ( evnt ) {
      return '<div style="width:195px; text-align:center;"><iframe  src="http://www.eventbrite.com/countdown-widget?eid=' + evnt.id + '" frameborder="0" height="479" width="195" marginheight="0" marginwidth="0" scrolling="no" allowtransparency="true"></iframe><div style="font-family:Helvetica, Arial; font-size:10px; padding:5px 0 5px; margin:2px; width:195px; text-align:center;"><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/r/ecount">Online event registration</a><span style="color:#ddd;"> for </span><a style="color:#ddd; text-decoration:none;" target="_blank" href="http://www.eventbrite.com/event/' + evnt.id + '?ref=ecount">' + evnt.title + '</a></div></div>';
    }, 
    'button': function ( evnt ) {
      return '<a href="http://www.eventbrite.com/event/' + evnt.id + '?ref=ebtn" target="_blank"><img border="0" src="http://www.eventbrite.com/custombutton?eid=' + evnt.id + '" alt="Register for ' + evnt.title + ' on Eventbrite" /></a>';
    }, 
    'link': function ( evnt, text, color ) {
      return '<a href="http://www.eventbrite.com/event/' + evnt.id + '?ref=elink" target="_blank" style="color:' + ( color || "#000000" ) + ';">' + ( text || evnt.title ) + '</a>';
    } 
  }
};

(function(){
  var len = Eventbrite.prototype.api_methods.length;
  function addMethod ( method ) { 
    Eventbrite.prototype[method] = function( params, callback) {
      this.request( method, params, callback );
    };   
  }
  for ( var i = 0; i < len ; i += 1 ){
    addMethod( Eventbrite.prototype.api_methods[i] );
  }
}());


// including the following progressive enhancement for ISO 8601 dates - Thanks Colin Snover!
/**
 * Date.parse with progressive enhancement for ISO 8601 <https://github.com/csnover/js-iso8601>
 * © 2011 Colin Snover <http://zetafleet.com>
 * Released under MIT license.
 */
(function (Date, undefined) {
  var origParse = Date.parse, numericKeys = [ 1, 4, 5, 6, 7, 10, 11 ];
  Date.parse = function (date) {
    var timestamp, struct, minutesOffset = 0;
    // ES5 §15.9.4.2 states that the string should attempt to be parsed as a Date Time String Format string
    // before falling back to any implementation-specific date parsing, so that’s what we do, even if native
    // implementations could be faster
    //              1 YYYY                2 MM       3 DD           4 HH    5 mm       6 ss        7 msec        8 Z 9 ±    10 tzHH    11 tzmm
    if ((struct = /^(\d{4}|[+\-]\d{6})(?:-(\d{2})(?:-(\d{2}))?)?(?:T(\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{3}))?)?(?:(Z)|([+\-])(\d{2})(?::(\d{2}))?)?)?$/.exec(date))) {
      // avoid NaN timestamps caused by “undefined” values being passed to Date.UTC
      for (var i = 0, k; (k = numericKeys[i]); ++i) {
        struct[k] = +struct[k] || 0;
      }
      // allow undefined days and months
      struct[2] = (+struct[2] || 1) - 1;
      struct[3] = +struct[3] || 1;
      if (struct[8] !== 'Z' && struct[9] !== undefined) {
        minutesOffset = struct[10] * 60 + struct[11];
        if (struct[9] === '+') {
          minutesOffset = 0 - minutesOffset;
        }
      }
      timestamp = Date.UTC(struct[1], struct[2], struct[3], struct[4], struct[5] + minutesOffset, struct[6], struct[7]);
    } else {
      timestamp = origParse ? origParse(date) : NaN;
    }
    return timestamp;
  };
}(Date));
