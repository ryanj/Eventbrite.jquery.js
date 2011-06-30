# An Eventbrite API client library. (requires jQuery)
--------------------------------------
written by @ryanjarvinen

- <a href="http://creativecommons.org/licenses/by/3.0/">license info</a>
- <a href="http://developer.eventbrite.com/doc/">API Documentation</a>
- <a href="http://developer.eventbrite.com/doc/getting-started/">API Getting-Started Guide</a>
- <a href="http://developer.eventbrite.com/terms/">Eventbrite API terms and usage limitations</a>
- <a href="http://developer.eventbrite.com/news/branding/">branding guidelines</a>

# Usage Example

Eventbrite users can request an API key on the following page (REQUIRED): http://www.eventbrite.com/api/key/ 

Each user can find their user_key on this page (OPTIONAL, only needed to update/access private data): http://www.eventbrite.com/userkeyapi 

####  WARNING: user_keys provide privileged access to a user's private data.  Keep it secret.  Keep it safe.
Eventbrite does not recommend storing authentication tokens in client side source.  See the included [index.html](https://github.com/ryanjarvinen/Eventbrite.jquery.js/blob/master/index.html) file for a more detailed implementation example.

First, initialize the API client:
- `api_key`: http://www.eventbrite.com/api/key/
- `user_key`: omitting this parameter will limit access to public data only
- `callback`: for interacting with the API

    Eventbrite('api_key', 'user_key', function(eb_client){ ... });

Within the callback, you can interact with the API:

    // parameters to pass to the API
    var params = {'city': "San Francisco", 'region':'CA'};
    // make a client request, provide another callback to handle the response data
    eb_client.event_search( params, function(response){
        console.log(response);
    });
