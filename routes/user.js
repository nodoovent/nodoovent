module.exports = function ( models, auth, action ) {
	var self = this;

	self.models = models;
	self.auth = auth;
	self.action = action;

	self.routes = {
		
		// use to manipulate the authenticate user
		"/user": {
			"GET": { action: self.action.user.get, isAuthenticated: true },
			"POST": self.action.user.create,
			"PUT": { action: self.action.user.update, isAuthenticated: true },
			"DELETE": { action: self.action.user.delete, isAuthenticated: true },		
		},

		// search on all users
		"/users": {
			"GET": { action: self.action.user.list, isAuthenticated: true },
		},

		// get one user
		"/users/:userid": {
			"GET": { action: self.action.user.getById, isAuthenticated: true },
		}

	}
}