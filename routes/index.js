var _ = require ( "Sequelize" ).Utils._; // (get lodash module)

var privacy = require ( "./privacy" );
var status = require ( "./status" );
var todo = require ( "./todo" );
var user = require ( "./user" );
var oauth1 = require ( "./oauth1" );


module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.routes = {
		"/": {
			"GET": action.index
		},

		"/login": {
			"GET": action.loginForm,
			"POST": action.login
		}
	}

	self.privacy = new privacy ( self.model, self.auth, self.action );
	self.status = new status ( self.model, self.auth, self.action );
	self.todo = new todo ( self.model, self.auth, self.action );
	self.user = new user ( self.model, self.auth, self.action );
	self.oauth1 = new oauth1 ( self.model, self.auth, self.action );

	_.extend ( self.routes, self.privacy.routes );
	_.extend ( self.routes, self.status.routes );
	_.extend ( self.routes, self.user.routes );
	_.extend ( self.routes, self.oauth1.routes ); 

}