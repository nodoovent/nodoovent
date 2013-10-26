module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {

		"/user/todo": {
			"POST": self.action.todo.create
		}

	}
}