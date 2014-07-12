module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {

		// search todos for one user
		"/user/:userid/todos": {
			"GET": { action: self.action.todo.userList, isAuthenticated: true }
		},

		"/todos": {
			"POST": { action: self.action.todo.create, isAuthenticated: true },	// add a todo for the authenticate user
			"GET": { action: self.action.todo.list, isAuthenticated: true } 		// search in all todos
		},

		// use to manipulate todos (if authenticate user if is authorized)
		"/todos/:id": {
			"GET": { action: self.action.todo.getById, isAuthenticated: true },
			"DELETE": { action: self.action.todo.delete, isAuthenticated: true },
			"PUT": { action: self.action.todo.update, isAuthenticated: true },
		}

	}
}