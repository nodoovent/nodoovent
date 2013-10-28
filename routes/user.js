module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/user": {
			"GET": self.action.user.get,
			"POST": self.action.user.create,
			"PUT": self.action.user.update,
			"DELETE": self.action.user.delete		
		},

		"/users": {
			"GET": self.action.user.list
		},

		"/user/:userid": {
			"GET": self.action.user.getById
		},

		"/contacts": {
			"GET": self.action.user.contactList,
			"POST": self.action.user.addContact
		}
	}
}