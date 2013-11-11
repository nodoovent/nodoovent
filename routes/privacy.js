module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/privacies": {
			"GET": self.action.privacy.list
		},

		"/privacies/:id": {
			"GET": self.action.privacy.getbyId
		}
	}
	
}