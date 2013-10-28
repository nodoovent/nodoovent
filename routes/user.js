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

		"/contact": {
			"POST": self.action.user.addContact
		},

		"/contact/:id": {
			"DELETE": self.action.user.deleteContact,
			"GET": self.action.user.getContact
		},

		"/contacts": {
			"GET": self.action.user.contactList
		}

	}
}