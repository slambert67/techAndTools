/**
 * clients & servers communicate with individual messages as opposed to streams
 * request sent to server which provides response
 * proxies may lie between client and server (caching, filtering, authentication, logging etc)
 * http is stateless but not sessionless (http cookies)
 * common features controllable with http:
 *  - Cache
 *  - Relaxing origin constraint
 *  - Authentication
 *  - Proxy and tunneling
 *  - Sessions
 * 
 * Request:
 *  - START LINE
 *      - HTTP method
 *          - verb like GET or POST
 *          - or noun like OPTIONS or HEAD
 *      - PATH of resource to fetch
 *      - PROTOCOL version
 * - HEADERS
 *      - optional HEADERS that convey additional information for server
 *          - General headers apply to message as a whole
 *          - Request headers modify request
 *          - Entity headers apply to body of request
 * - BODY
 *      - BODY for some methods like POST
 * 
 * Response:
 *  - STATUS LINE
 *      - PROTOCOL version
 *      - STATUS code
 *      - STATUS message
 *  - HEADERS
  *      - optional HEADERS that convey additional information from server
 *          - General headers apply to message as a whole
 *          - Request headers modify request
 *          - Entity headers apply to body of request
 *  - BODY containing resource
 * 
 * APIs based on HTTP:
 *  - XMLHttpRequest
 * 
 * HTTP verbs
 *  - GET
 *      - server data never modified
 *      - idempotent
 *  - PUT
 *      - requests that enclosed entity be stored under supplied Request-URI
 *      - URI -> identifies enclosed entity
 *      - idempotent
 *  - POST
 *      - URI ->    identifies resource that will handle enclosed entity
 *      - request that server accept enclosed entity as new subordinate of URI
 *  - DELETE
 * 
 * EXAMPLES
 * ========
 * Collection                                   GET                                 PUT                     POST                                DELETE
 * eg. https://api.example.com/resources/       List the URIs and perhaps           Replace the entire      Create a new entry in the           Delete the entire collection.
 *                                              other details of the collection's   collection with         collection. The new entry's URI 
 *                                              members.                            another collection.     is assigned automatically and is 
 *                                                                                                          usually returned by the operation
 * 
 * Element
 * https://api.example.com/resources/item17     Retrieve a representation of the    Replace the addressed   Not generally used. Treat the       Delete the addressed member of 
 *                                              addressed member of the             member of the           addressed member as a collection    the collection.
 *                                              collection, expressed in an         collection,or if it     in its own right and create a new 
 *                                              appropriateInternet media type.     does not exist,         entry within it.
 *                                                                                  create it.
 */