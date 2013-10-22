var passport = require ( "passport" );
var localstrategy = require ( "../auth/localstrategy" ).name;


var user = require ( "./user" );
var oauth1 = require ( "./oauth1" );


module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.index = function ( req, res ) {
	  res.render ( "index", { title: "Nodoovent" } );
	};

	self.loginForm = function ( req, res ) {
		res.render ( "login", { title: "Nodoovent" } );
	}

	self.login = passport.authenticate ( localstrategy,  { successReturnToOrRedirect: '/', failureRedirect: '/login' } );

	self.user = new user ( model, auth );
	self.oauth1 = new oauth1 ( model, auth );

}