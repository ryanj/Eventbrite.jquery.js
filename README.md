# An Eventbrite API clinet library. (requires jQuery)
--------------------------------------
written by @ryanjarvinen

- <a href="http://creativecommons.org/licenses/by/3.0/">license info</a>
- <a href="http://developer.eventbrite.com/doc/">API Documentation</a>
- <a href="http://developer.eventbrite.com/doc/getting-started/">API Getting-Started Guide</a>
- <a href="http://developer.eventbrite.com/terms/">Eventbrite API terms and usage limitations</a>
- <a href="http://developer.eventbrite.com/news/branding/">branding guidelines</a>




# Usage Example

Eventbrite users can request an API key on the following page:
    http://www.eventbrite.com/api/key/ (REQUIRED)

Each user can find their user_key on this page: 
    http://www.eventbrite.com/userkeyapi (OPTIONAL, only needed to update/access private data)

####  WARNING: user_keys provide priveledged access to a user's private data.  Keep it secret.  Keep it safe.
Eventbrite does not recommend storing authentication tokens in client side source.  See the included [index.html](https://github.com/ryanjarvinen/Eventbrite.jquery.js/blob/master/index.html) file for a more detailed implementation example.

          // Eventbrite Client interaction example
          //  This function accepts the following arguments: 
          //    api_key: http://www.eventbrite.com/api/key/
          //    user_key or '': providing an empty string will limit access to public data only
          //    callback: for interacting with the API
          Eventbrite('api_key', 'user_key', function(eb_client){
            // parameters to pass to the API
            search_params = {'city': "San Francisco", 'region':'CA'};
            // make a client request, provide a callback that will handle the response data
            //  This function accepts the following args:
            //    api_method: see the API docs for available request methods
            //    request_params: a map of request parameters
            //    callback: a function to process the response data
            eb_client.request("event_search", search_params, function(response){

              console.log(response);
              // Use jQuery to display the response data to the user
              $.each(response.events, function(i,eb_event){
                if( eb_event['event']){
                  $('#target').append('<p><a href="' + eb_event['event'].url + '">' + eb_event['event'].title + '</a></p>');
                }
              });
      
            });
          });

