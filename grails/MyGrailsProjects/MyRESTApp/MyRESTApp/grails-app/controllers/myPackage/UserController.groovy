package myPackage

import grails.converters.JSON

class UserController {

    def list() {

        /*
        mapped to GET
        safe method
        guaranteed not to make any changes - server data never modified
        idempotent : Achieve same result no matter how many times request is repeated
         */
        def users = User.findAll();

        render users as JSON;
    }

    def save() {

        // enter JSON in payload of google restful api app
        def theRequest = getRequest();
        def theJSON = theRequest.JSON;
        def theParams = getParams();
        def theResponse = getResponse();
        println("save");
        render([result:"OK"]) as JSON;
    }

    def show() {

        // mapped to GET
        def user = User.get(params.id);
        if (user) {
            render user as JSON;
        } else {
            response.sendError(404); // response object injected like params, request etc
        }
    }

    def update() {
        println("update");
    }

    def delete() {

        /*
        mapped to DELETE
        idempotent : Achieve same result no matter how many times request is repeated
         */
        println("delete");
        def user = User.get(params.id);
        user.delete();
        println("deleted");
        return user as JSON;
    }

}
