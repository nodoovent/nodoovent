module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
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