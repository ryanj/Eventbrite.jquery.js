# An Eventbrite API client library. (requires jQuery)
--------------------------------------
written by @ryanjarvinen

# Usage Examples #


The following parameters can be used to initialize the Eventbrite API client:

* `api_key`: (REQUIRED) Eventbrite users can request an API key on the following page: http://www.eventbrite.com/api/key/
* `user_key`: (OPTIONAL) Omitting this parameter will limit access to public data.  Providing a user_key is only needed when updating/accessing private information.  Each user can find their `user_key` on this page: http://www.eventbrite.com/userkeyapi 
* `callback`: for interacting with the API

### Initialize the client:

    Eventbrite('api_key', 'user_key', function(eb_client){ //eb_client interaction goes here... });

Within the callback, the client can be used to call any of the methods described in the [Eventbrite API Docs](http://developer.eventbrite.com/doc/):

### [ event_search ]( http://developer.eventbrite.com/doc/events/event_search/ )

    // parameters to pass to the API
    var params = {'city': "San Francisco", 'region':'CA'};
    // make a client request, provide another callback to handle the response data
    eb_client.event_search( params, function( response ){
        console.log( response );
    });

### [ event_get ]( http://developer.eventbrite.com/doc/events/event_get/ )

    eb_client.event_get( {'id': 123456789 }, function( response ){
        // render the event as a ticket widget:
        var ticket_widget_html = eb_client.widget.ticket( response.event ); 

        // or, render it as a countdown widget:
        var countdown_widget_html = eb_client.widget.countdown( response.event ); 

        console.log( countdown_widget_html + ticket_widget_html );
    });

### [ event_list_attendees ]( http://developer.eventbrite.com/doc/events/event_list_attendees/ )

    eb_client.event_list_attendees ( {'id': 123456789 }, function( response ){
        console.log(response);
    });

### [user_list_events]( http://developer.eventbrite.com/doc/users/user_list_events/ )

    eb_client.user_list_events ( {}, function( response ){
        console.log( response );
    });

####  WARNING: user_keys provide privileged access to a user's private data.  Keep it secret.  Keep it safe.
*__Eventbrite does not recommend storing authentication tokens in client side source.__*

See the included [index.html](https://github.com/ryanjarvinen/Eventbrite.jquery.js/blob/master/index.html) file for a more detailed implementation example.

# Resources #

* <a href="http://creativecommons.org/licenses/by/3.0/">License Info</a>
* <a href="http://developer.eventbrite.com/doc/">API Documentation</a>
* <a href="http://developer.eventbrite.com/doc/getting-started/">API Getting-Started Guide</a>
* <a href="http://developer.eventbrite.com/terms/">Eventbrite API terms and usage limitations</a>
* <a href="http://developer.eventbrite.com/news/branding/">Eventbrite Branding Guidelines</a>

