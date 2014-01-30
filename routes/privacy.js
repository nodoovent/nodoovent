module.exports = function ( models, auth, action ) {
	var self = this;

	self.models = models;
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