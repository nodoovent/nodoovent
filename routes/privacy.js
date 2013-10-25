module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/privacies": {
			"GET": self.action.privacy.list
		},

		"regexp \/privacy\/([0-9]+)": {
			"GET": self.action.privacy.getbyId
		}
	}
	
}