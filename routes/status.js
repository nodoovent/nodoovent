module.exports = function ( models, auth, action ) {
	var self = this;

	self.models = models;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/status": {
			"GET": self.action.status.list
		},

		"/status/:id": {
			"GET": self.action.status.getbyId
		}
	}
}