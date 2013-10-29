module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {

		"/user/:userid/todos": {
			"GET": self.action.todo.userList
		},

		"/todo": {
			"POST": self.action.todo.create
		},

		"/todo/:id": {
			"GET": self.action.todo.getById,
			"DELETE": self.action.todo.delete,
			"PUT": self.action.todo.update
		},

		"/todos": {
			"GET": self.action.todo.list
		},

		"/todo/:id/tags": {
			"GET": self.action.todo.getTags
		}

	}
}