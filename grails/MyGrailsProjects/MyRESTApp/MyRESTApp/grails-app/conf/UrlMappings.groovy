class UrlMappings {

	static mappings = {
        "/users"(controller: "user") {
            action = [ GET: "list", POST: "save" ]
        }
        "/users/$id"(controller: "user") {
            action = [ GET: "show", PUT: "update", DELETE: "delete"]
        }

		"/"(view:"/index")
		"500"(view:'/error')
	}
}
