import myPackage.User

class BootStrap {

    def init = { servletContext ->
        def user
        user = new User(forename:"Steve", surname:"Lambert");
        user.save();
        user = new User(forename:"Julie", surname:"Lambert");
        user.save();
        user = new User(forename:"Andy", surname:"Lambert");
        user.save();
    }
    def destroy = {
    }
}
