https://docs.strapi.io/cms/configurations/middlewares


Middlewares configuration
 Different types of middlewares
In Strapi, 3 middleware concepts coexist:

Global middlewares are configured and enabled for the entire Strapi server application. These middlewares can be applied at the application level or at the API level.
The present documentation describes how to implement them.
Plugins can also add global middlewares (see Server API documentation).

Route middlewares have a more limited scope and are configured and used as middlewares at the route level. They are described in the routes documentation.

Document Service middlewares apply to the Document Service API and have their own implementation and related lifecycle hooks.

The ./config/middlewares.js file is used to define all the global middlewares that should be applied by the Strapi server.

Only the middlewares present in ./config/middlewares.js are applied. Loading middlewares happens in a specific loading order, with some naming conventions and an optional configuration for each middleware.

Strapi pre-populates the ./config/middlewares.js file with built-in, internal middlewares that all have their own configuration options.

Loading order
The ./config/middlewares.js file exports an array, where order matters and controls the execution order of the middleware stack:

JavaScript
TypeScript
./config/middlewares.js

module.exports = [
  // The array is pre-populated with internal, built-in middlewares, prefixed by `strapi::`
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  'strapi::cors',

  // custom middleware that does not require any configuration
  'global::my-custom-node-module', 

  // custom name to find a package or a path
  {
    name: 'my-custom-node-module',
    config: {
      foo: 'bar',
    },
  },

  // custom resolve to find a package or a path
  {
    resolve: '../some-dir/custom-middleware',
    config: {
      foo: 'bar',
    },
  },

  // custom configuration for internal middleware
  {
    name: 'strapi::poweredBy',
    config: {
      poweredBy: 'Some awesome company',
    },
  },

  // remaining internal & built-in middlewares
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];


 Tip
If you aren't sure where to place a middleware in the stack, add it to the end of the list.

Naming conventions
Global middlewares can be classified into different types depending on their origin, which defines the following naming conventions:

Middleware type	Origin	Naming convention
Internal	Built-in middlewares (i.e. included with Strapi), automatically loaded	strapi::middleware-name
Application-level	Loaded from the ./src/middlewares folder	global::middleware-name
API-level	Loaded from the ./src/api/[api-name]/middlewares folder	api::api-name.middleware-name
Plugin	Exported from strapi-server.js in the middlewares property of the plugin interface	plugin::plugin-name.middleware-name
External	Can be:
either node modules installed with npm 
or local middlewares (i.e. custom middlewares created locally and configured in ./config/middlewares.js.)
-

As they are directly configured and resolved from the configuration file, they have no naming convention.
Optional configuration
Middlewares can have an optional configuration with the following parameters:

Parameter	Description	Type
config	Used to define or override the middleware configuration	Object
resolve	Path to the middleware's folder (useful for external middlewares)	String
Internal middlewares configuration reference
Strapi's core includes the following internal middlewares, mostly used for performances, security and error handling:

Middleware	Added by Default	Required
body	Yes	Yes
compression	No	No
cors	Yes	Yes
errors	Yes	Yes
favicon	Yes	Yes
ip	No	No
logger	Yes	No
poweredBy	Yes	No
query	Yes	Yes
response-time	No	No
responses	Yes	Yes
public	Yes	Yes
security	Yes	Yes
session	Yes	No
body
The body middleware is based on koa-body . Tt uses the `node-formidable`  library to process files. body accepts the following options:

Option	Description	Type	Default
multipart	Parse multipart bodies	Boolean	true
patchKoa	Patch request body to Koa's ctx.request	Boolean	true
jsonLimit	The byte (if integer) limit of the JSON body	String or Integer	1mb
formLimit	The byte (if integer) limit of the form body	String or Integer	56kb
textLimit	The byte (if integer) limit of the text body	String or Integer	56kb
encoding	Sets encoding for incoming form fields	String	utf-8
formidable	Options to pass to the formidable multipart parser (see node-formidable documentation ).	Object	undefined
For a full list of available options for koa-body, check the koa-body documentation .

 Example: Custom configuration for the body middleware
compression
The compression middleware is based on koa-compress . It accepts the following options:

Option	Description	Type	Default
threshold	Minimum response size in bytes to compress	String or Integer	1kb
br	Toggle Brotli compression	Boolean	true
gzip	Toggle gzip compression	Boolean	false
deflate	Toggle deflate compression	Boolean	false
defaultEncoding	Specifies what encoders to use for requests without Accept-Encoding header	String	identity
Example: Custom configuration for the compression middleware
cors
This security middleware is about cross-origin resource sharing (CORS) and is based on @koa/cors . It accepts the following options:

Option	Type	Description	Default value
origin	Configure the Access-Control-Allow-Origin header	String or Array or Function	'*'
maxAge	Configure the Access-Control-Max-Age header, in seconds	String or Number	31536000
credentials	Configure the Access-Control-Allow-Credentials header	Boolean	true
methods	Configure the Access-Control-Allow-Methods header	Array or String	['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS']
headers	Configure the Access-Control-Allow-Headers header	Array or String	Request headers passed in Access-Control-Request-Headers
keepHeaderOnError	Add set headers to err.header if an error is thrown	Boolean	false
 Example: Custom configuration for the cors middleware
 Example: Custom configuration for the cors middleware within a function as parameter
errors
The errors middleware handles errors thrown by the code. Based on the type of error it sets the appropriate HTTP status to the response. By default, any error not supposed to be exposed to the end user will result in a 500 HTTP response.

The middleware doesn't have any configuration options.

favicon
The favicon middleware serves the favicon and is based on koa-favicon . It accepts the following options:

Option	Description	Type	Default value
path	Path to the favicon file	String	'favicon.ico'
maxAge	Cache-control max-age directive, in milliseconds	Integer	86400000
 Example: Custom configuration for the favicon middleware
ip
The ip middleware is an IP filter middleware based on koa-ip . It accepts the following options:

Option	Description	Type	Default value
whitelist	Whitelisted IPs	Array	[]
blacklist	Blacklisted IPs	Array	[]
 Tip
The whitelist and blacklist options support wildcards (e.g. whitelist: ['192.168.0.*', '127.0.0.*']) and spreads (e.g. whitelist: ['192.168.*.[3-10]']).

 Example: Custom configuration for the ip middleware
logger
The logger middleware is used to log requests.

To define a custom configuration for the logger middleware, create a dedicated configuration file (./config/logger.js). It should export an object that must be a complete or partial winstonjs  logger configuration. The object will be merged with Strapi's default logger configuration on server start.

 Example: Custom configuration for the logger middleware
poweredBy
The poweredBy middleware adds a X-Powered-By parameter to the response header. It accepts the following options:

Option	Description	Type	Default value
poweredBy	Value of the X-Powered-By header	String	'Strapi <strapi.io>'
 details Example: Custom configuration for the poweredBy middleware
query
The query middleware is a query parser based on qs . It accepts the following options:

Option	Description	Type	Default value
strictNullHandling	Distinguish between null values and empty strings (see qs documentation )	Boolean	true
arrayLimit	Maximum index limit when parsing arrays (see qs documentation )	Number	100
depth	Maximum depth of nested objects when parsing objects (see qs documentation )	Number	20
 Example: Custom configuration for the query middleware
response-time
The response-time middleware enables the X-Response-Time (in milliseconds) for the response header.

The middleware doesn't have any configuration options.

public
The public middleware is a static file serving middleware, based on koa-static . It accepts the following options:

Option	Description	Type	Default value
maxAge	Cache-control max-age directive, in milliseconds	Integer	60000
 Tip
You can customize the path of the public folder by editing the server configuration file.

Example: Custom configuration for the public middleware
security
The security middleware is based on koa-helmet . It accepts the following options:

Option	Description	Type	Default value
crossOriginEmbedderPolicy	Set the Cross-Origin-Embedder-Policy header to require-corp	Boolean	false
crossOriginOpenerPolicy	Set the Cross-Origin-Opener-Policy header	Boolean	false
crossOriginResourcePolicy	Set the Cross-Origin-Resource-Policy header	Boolean	false
originAgentCluster	Set the Origin-Agent-Cluster header	Boolean	false
contentSecurityPolicy	Set the Content-Security-Policy header	Object	-
xssFilter	Disable browsers' cross-site scripting filter by setting the X-XSS-Protection header to 0	Boolean	false
hsts	Set options for the HTTP Strict Transport Security (HSTS) policy.	Object	-
hsts.maxAge	Number of seconds HSTS is in effect	Integer	31536000
hsts.includeSubDomains	Applies HSTS to all subdomains of the host	Boolean	true
frameguard	Set X-Frame-Options header to help mitigate clickjacking attacks, set to false to disable	Boolean or Object	-
frameguard.action	Value must be either deny or sameorigin	String	sameorigin
 Tip
When using any 3rd party upload provider, generally it's required to set a custom configuration here. Please see the provider documentation for which configuration options are required.

 Note
The default directives include a market-assets.strapi.io value. This value is set for the in-app market and is safe to keep.

 Example: Custom configuration for the security middleware for using the AWS-S3 provider
JavaScript
TypeScript
./config/middlewares.js

module.exports = [
  // ...
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'yourBucketName.s3.yourRegion.amazonaws.com',
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'yourBucketName.s3.yourRegion.amazonaws.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  // ...
]

session
The session middleware allows the use of cookie-based sessions, based on koa-session . It accepts the following options:

Option	Description	Type	Default value
key	Cookie key	String	'koa.sess'
maxAge	Maximum lifetime of the cookies, in milliseconds. Using 'session' will expire the cookie when the session is closed.	Integer or 'session'	86400000
autoCommit	Automatically commit headers	Boolean	true
overwrite	Can overwrite or not	Boolean	true
httpOnly	Is httpOnly or not. Using httpOnly helps mitigate cross-site scripting (XSS) attacks.	Boolean	true
signed	Sign the cookies	Boolean	true
rolling	Force a session identifier cookie to be set on every response.	Boolean	false
renew	Renew the session when the session is nearly expired, so the user keeps being logged in.	Boolean	false
secure	Force the use of HTTPS	Boolean	true in production, false otherwise
sameSite	Restrict the cookies to a first-party or same-site context	String	null
 Example: Custom configuration for the session middleware
Tags:base configurationbody middlewareconfigurationglobal middlewaresinternal middlewaremiddlewaresmiddlewares customizationmiddleware typeroute middlewares
Contribute to this page on GitHub
Previous
Lifecycle functions

