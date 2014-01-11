module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {

		// search todos for one user
		"/user/:userid/todos": {
			"GET": self.action.todo.userList
		},

		"/todos": {
			"POST": self.action.todo.create,	// add a todo for the authenticate user
			"GET": self.action.todo.list 		// search in all todos
		},

		// use to manipulate todos (if authenticate user if is authorized)
		"/todos/:id": {
			"GET": self.action.todo.getById,
			"DELETE": self.action.todo.delete,
			"PUT": self.action.todo.update
		}

	}
}