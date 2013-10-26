module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/user": {
			"GET": self.action.user.get,
			"PUT": self.action.user.update,
			"POST": self.action.user.create,
			"DELETE": self.action.user.delete
		},

		"/users": {
			"GET": self.action.user.list
		},

		"regexp \/user\/([0-9]+)": { // "/user/1"
			"GET": self.action.user.getById
		},

		"/user/:login": {
			"GET": self.action.user.getByLogin
		}
	}
}