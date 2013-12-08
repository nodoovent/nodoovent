module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		
		// use to manipulate the authenticate user
		"/user": {
			"GET": self.action.user.get,
			"POST": self.action.user.create,
			"PUT": self.action.user.update,
			"DELETE": self.action.user.delete		
		},

		// search on all users
		"/users": {
			"GET": self.action.user.list
		},

		// get one user
		"/users/:userid": {
			"GET": self.action.user.getById
		}

	}
}