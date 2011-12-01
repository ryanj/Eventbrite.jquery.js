# Javascript Eventbrite API Client - OAuth2.0 examples  
---------------------------------------------------------
## Requirements: ##
* <b>Configure your API key's redirect_uri</b> - 
Eventbrite API keys, and key settings are available at http://www.eventbrite.com/api/key/.  Set your key's "redirect_uri" to point to the URL on your site where you expect a user to complete their OAuth2 authorization workflow (or, any public URL on your site where our login widget is available).

## Simple implementation example: ##
Get OAuth2.0 done in two easy steps!  Check below for a more advanced implementation example that shows how to integrate with your existing storage and templating systems.

### 1. Download and Install Eventbrite's Javascript (jQuery) API client ###
Download Eventbrite's latest Javascript API client and add it to your app's source code: 
https://raw.github.com/ryanjarvinen/Eventbrite.jquery.js/master/Eventbrite.jquery.js

    <script type='text/javascript' src="https://raw.github.com/ryanjarvinen/Eventbrite.jquery.js/master/Eventbrite.jquery.js"> </script>

The above example links directly to the latest version available on GitHub.  To ensure your site's reliability, we recommend that you download a specific release of this client, and bundle it with your site's source code.  Linking to your own hosted copy of this file should prevent any new API client changes or GitHub.com outages from unexpectedly interrupting the services offered on your site.

### 2. Generate the Eventbrite LoginWidget HTML ###
Add your [API_key](http://www.eventbrite.com/api/key) to make this widget example work:

    <script type="text/javascript">
      $('document').ready(function(){
        // Your API_Key's redirect_uri must be configured correctly at: http://eventbrite.com/api/key
        // Set your API_Key on the line below:
        Eventbrite.prototype.widget.login({'app_key': 'YOUR_API_KEY'}, function(widget_html){
          // Place the resulting Eventbrite login widget code somewhere on your page.
          // This example places the content into an element marked with class="eb_login_box"
          $('.eb_login_box').html(widget_html);
        });
      });
    </script>

A simple OAuth2 example script is bundled with our API Client library:
https://github.com/ryanjarvinen/Eventbrite.jquery.js/blob/master/oauth2-example.html

A live demo example is also available: http://eventbrite.github.com/oauth2-example.html

## Advanced implementation example: ##
Interested in integrating with your application's existing authentication, storage, or templating systems?  This example goes into additional detail, demonstrating how to set that up.

### 1. Download and install Eventbrite's Javascript (jQuery) API client ###
Download Eventbrite's latest Javascript API client and add it to your app's source code: 
https://raw.github.com/ryanjarvinen/Eventbrite.jquery.js/master/Eventbrite.jquery.js

    <script type='text/javascript' src="https://raw.github.com/ryanjarvinen/Eventbrite.jquery.js/master/Eventbrite.jquery.js"> </script>

The above example links directly to the latest version available on GitHub.  To ensure your site's reliability, we recommend that you download a specific release of this client, and bundle it with your site's source code.  Linking to your own hosted copy of this file should prevent any new API client changes or GitHub.com outages from unexpectedly interrupting the services offered on your site.

### 2. Define your own data-management callbacks (optional) ###
By default, the login widget will attempt to use localStorage to save the given user's access_token in the client browser.  Please be careful to keep each user's access_token stored securely, ensuring that it is not visible to other users of your site.
If you would like to replace the default storage solution, you will need to define a few optional data-management callbacks for the widget to use.  Here is an outline of how that might work:

Define a callback for looking up the current user's `access_token`:

    var get_access_token = function(){
        return localStorage['eb_access_token'];
    };

Define a callback for saving a user's `access_token`s for later:

    var save_access_token = function( access_token ){
        localStorage['eb_access_token'] = access_token;
    };

Define a callback for removing the current user's `access_token` when needed:

    var delete_access_token = function( access_token ){
        localStorage['eb_access_token'] = undefined;
    };

Now that these callbacks are defined, you will be able to supply them as optional arguments in step 5.

### 3. Supply a custom widget template, or use your existing templating solution (optional).
This widget includes an example HTML template that will be used by default.  See the `loginHTML` function for more information on how to build your own templating callback function.  This callback can then be supplied as an optional `renderer` parameter in step 5.

If you are working with an existing templating system, and you would prefer an object containing raw strings instead of pre-generated HTML, try setting the optional `renderer` parameter to 'disabled'.  See the expected response output from the login widget for more information about which strings are made available.  Some strings (such as the user's email address) are only available when a user is logged in.

### 4. Define a custom logout callback (optional)
The login widget's default behaviour will attempt to delete a user's access_token when the widget's "logout" link is clicked.  If you prefer to save the user's `access_token` for subsequent sessions, and trigger your existing authentication system's logout functionality instead, you can define a custom callback to handle this behaviour:

    var custom_logout = function( ){
        // implementation-specific logout support:
        document.location = '/bye';
    };

### 5. Generate the Eventbrite Login Widget ###
Add your authentication tokens and other optional parameters to make this example work:

    Eventbrite.prototype.widget.login({'app_key': 'YOUR_API_KEY'           // required
                                      ,'get_token': get_access_token       // optional
                                      ,'save_token': save_access_token     // optional
                                      ,'delete_token': delete_access_token // optional
                                      ,'renderer': 'disabled'              // optional
                                      ,'logout_link': 'custom_logout();'   // optional
                                      }, function (strings){               // required
        // This widget has been optionally configured with 'renderer' = 'disabled'
        // If you commonly use mustache templates, then you might end up with a callback that look like this:
        // define your own template:
        if( strings['user_name'] !== undefined ) {
            var custom_widget_template = "Welcome back, {{user_name}}\n <a href='#' onclick='{{logout_link}}'>logout?</a>";
        }else{
            var custom_widget_template = "<a href='{{oauth_link}}'>Connect to Eventbrite</a>";
        }
        
        // use mustache to render the HTML:
        var custom_widget_html = Mustache.to_html(custom_widget_template, strings);

        // place the resulting HTML somewhere on your page
        //  This example attempts to place the content in an element with id="somewhere"
        $('#somewhere').html( custom_widget_html );
    });

For more detail on our available OAuth2.0 integration functions - see the docs below, or [reach out to the Eventbrite team with questions](http://developer.eventbrite.com/contact-us/)

## API Client methods for working with OAuth2.0 ##
See Eventbrite's [API Docs](http://developer.eventbrite.com/doc) for more information about available API Client methods.

### Eventbrite.prototype.widget.login() ###
The widget.login method is the quickest way to acheive OAuth2.0 integration with Eventbrite. It includes a lot of great defaults, and the ability to customize when needed.  By default, HTML5 localStorage will be used to save your user's access_token.

#### Function overview: ####
> <b>Eventbrite.prototype.widget.login</b>( options, callback )

#### Parameters: ####
* `options` - (Required) An object containing the following:
    * `app_key` - (Required) A string containing your API key - sign up here: http://www.eventbrite.com/api/key/
    * `access_token` - (Optional) If you already have an access_token, you can set it here.  The widget will attempt to auto-detect this value by checking the content in `window.location.hash`.
    * `logout_link` - (Optional) A string containing the function name that should trigger a "logout" action.  By default, the widget is configured to delete a user's access_token whenever the widget's optional logout link is clicked.  This should work on any page where the widget is available.  See our "Advanced implementation" example for information on how to incorporate this into your existing authentication scheme. Setting this parameter to 'disabled' should hide the "logout" link in our default widget template.
    * `error_message` - (Optional) A string containing an OAuth2.0 error response from Eventbrite.  By default, the widget is configured to auto-detect this information by reading from `window.location.search`.  If you wish to disable error_message auto-detection, set this value to "disabled".
    * `get_token` - (Optional) A callback describing how to retrieve the current user's OAuth2.0 access_token from your site's data store.  The widget will automatically use localStorage by default. You can disable this functionality by setting this value to 'disabled'.
    * `save_token` - (Optional) A callback describing how to save the current user's OAuth2.0 access_token in your site's data store.  The widget will automatically use localStorage by default. If you prefer another storage system, supply your own callback. Or, set this value to 'disabled' to turn it off.
    * `delete_token` - (Optional) A callback describing how to remove the current user's OAuth2.0 access_token from your site's data store.  The widget will automatically use localStorage by default. You can disable this functionality by setting this value to 'disabled'.
    * `renderer` - (Optional) A callback describing how to render the widget data as HTML.  If you have your own templating system that you would like to use, you can pass the resulting HTML into your template as a string, or set this value to "disabled" to signal that you would like the response to include an array of strings instead of HTML.  For more information on how to write your own render callback, see the widgetHTML function below.  By default, the widgetHTML function will be used to generate HTML for you.
* `callback` - (Required) A callback function that places the widget content into your page.

### Eventbrite.prototype.widget.loginHTML() ###
This is the default function for rendering your OAuth2-related strings in HTML.  If you do not like the default HTML, you are welcome to implement your own renderer function based on this method signiture.  See the `renderer` parameter on `Eventbrite::loginWidget` for more information.

#### Function overview: ####
> string <b>Eventbrite.prototype.widget.loginHTML</b>( strings )

#### Parameters: ####
* `strings` - (Required) An object of strings to render:
    * `oauth_link` - (Required) A URL for kicking off the OAuth2.0 workflow. See `Eventbrite.prototype.utils.oauthLink(api_key)` for more information about this value.
    * `logout_link` - (Required) A string containing the code that should be added to the Logout button's onclick attribute.
    * `user_name` - (Optional) A string indicating the current user's name.
    * `user_email` - (Optional) A string indicating the current user's email address.
    * `login_error` - (Optional) A string containing an OAuth2.0 error message.

#### Response: ####
This function returns the widget's HTML as a string.

### Eventbrite.prototype.utils.login() ###
This function handles all of the logic around access_token retrieval, and it carries out related data-management tasks by taking advantage of any callback functions that you provide.  If you want to your own authentication, storage, and templating tools, then this lower-level function is an alternative to our `widget.login` feature.  It makes less assumptions about your system configuration and does not attempt to auto-detect any input values.

#### Function overview: ####
> <b>Eventbrite.prototype.utils.login</b>( options, callback ) 

#### Parameters: ####
* `options` - (Required) An array containing the following:
    * `app_key` - (Required) A string containing your API key - sign up here: http://www.eventbrite.com/api/key/
    * `access_token` - (Optional) A string containing the user's access_token can be supplied here.  We will attempt to automatically store this token for later use, by taking advantage of the supplied `save_token` callback.
    * `error_message` - (Optional) A string containing an OAuth2.0-related error message.
    * `get_token` - (Optional) A callback describing how to retrieve the current user's OAuth2.0 access_token from your site's data store.
    * `save_token` - (Optional) A callback describing how to save the current user's OAuth2.0 access_token in your site's data store.
    * `delete_token` - (Optional) A callback describing how to remove the current user's OAuth2.0 access_token from your site's data store.
* `callback` - (Required) A callback function allowing you to process an object containing several strings that are extracted from Eventbrite's API response.  These strings are outlined below -

#### Callback Strings: ####
The following strings may be available as attributes on the object that is provided in your callback function:

* `access_token` - if available, this string will contain the current user's access_token
* `user_name` - if available, this string will contain the current user's name
* `user_email` - if available, this string will contain the current user's email address.
* `login_error` - if available, this string will contain a login_error from the API.

# Resources: #
* <a href="http://eventbrite.github.com/">Eventbrite on GitHub</a>
* <a href="http://developer.eventbrite.com/doc/">API Documentation</a>
* <a href="http://developer.eventbrite.com/doc/getting-started/">API Getting-Started Guide</a>
* <a href="http://developer.eventbrite.com/terms/">Eventbrite API terms and usage limitations</a>
* <a href="http://developer.eventbrite.com/news/branding/">Eventbrite Branding Guidelines</a>
