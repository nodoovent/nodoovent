var _ = require ( "lodash" );

var privacy = require ( "./privacy" );
var status = require ( "./status" );
// var tag = require ( "./tag" );
// var todo = require ( "./todo" );
var user = require ( "./user" );
var oauth1 = require ( "./oauth1" );


module.exports = function ( models, auth, action ) {
	var self = this;

	self.modes = models;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/": {
			"GET": self.action.index
		},

		"/login": {
			"GET": self.action.loginForm,
			"POST": self.action.login
		}
	}

	self.privacy = new privacy ( self.models, self.auth, self.action );
	self.status = new status ( self.models, self.auth, self.action );
	// self.tag = new tag ( self.models, self.auth, self.action );
	// self.todo = new todo ( self.models, self.auth, self.action );
	self.user = new user ( self.models, self.auth, self.action );
	self.oauth1 = new oauth1 ( self.models, self.auth, self.action );

	_.extend ( self.routes, self.privacy.routes );
	_.extend ( self.routes, self.status.routes );
	// _.extend ( self.routes, self.tag.routes );
	// _.extend ( self.routes, self.todo.routes );
	_.extend ( self.routes, self.user.routes );
	_.extend ( self.routes, self.oauth1.routes ); 

}