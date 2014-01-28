var passport = require ( "passport" );
var localstrategy = require ( "../auth/localstrategy" ).name;

// var privacy = require ( "./privacy" );
// var status = require ( "./status" );
// var todo = require ( "./todo" );
// var tag = require ( "./tag" );
// var user = require ( "./user" );
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

	// self.privacy = new privacy ( self.model, self.auth );
	// self.status = new status ( self.model, self.auth );
	// self.tag = new tag ( self.model, self.auth );
	// self.todo = new todo ( self.model, self.auth );
	// self.user = new user ( self.model, self.auth );
	self.oauth1 = new oauth1 ( self.model, self.auth );

}