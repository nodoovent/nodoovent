var _ = require ( "Sequelize" ).Utils._; // (get lodash module)

var oauth1 = require ( "./oauth1" );
var user = require ( "./user" );


module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.acion = action;

	self.routes = {
		"/": {
			"GET": action.index
		},

		"/login": {
			"GET": action.loginForm,
			"POST": action.login
		}
	}

	self.oauth1 = new oauth1 ( model, auth, action );
	self.user = new user ( model, auth, action );

	_.extend ( self.routes, self.oauth1.routes ); 
	_.extend ( self.routes, self.user.routes );

}