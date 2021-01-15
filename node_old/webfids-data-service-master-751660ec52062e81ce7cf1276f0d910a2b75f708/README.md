A seed project for strawman services which collect information from one or more underlying data-api(s) and provides a single endpoint to access the collated/merged resources.

## Defined endpoints

All Endpoints accept
* application/json
* application/x-www-form-urlencoded
* multipart/form-data

See code of each endpoint for processing details

The version numbers refer to the Microservice version the call was added.  The version in () is the minimum version of the API that supports the underlying call.

|Verb|URL|AIMS API|APEX API|BRS API|
|:----:|:----|:----|:----|:----|
|GET|/healthcheck|0.0.1 (N/A)|0.0.1 (N/A)|0.0.1 (N/A)|
|GET|/underlyingApisHealthcheck|0.0.1 (0.0.3)|0.0.1 (0.0.3)|0.0.1 (NS)|
|GET|/resilientUnderlyingApisHealthcheck|0.0.1 (0.0.3)|0.0.1 (0.0.3)|0.0.1 (NS)|

NS = Not Supported

## Dependencies

See package.json
