var passport = require ( "passport" );
var localstrategy = require ( "../auth/localstrategy" ).name;

var privacy = require ( "./privacy" );
var status = require ( "./status" );
// var todo = require ( "./todo" );
// var tag = require ( "./tag" );
var user = require ( "./user" );
var oauth1 = require ( "./oauth1" );


module.exports = function ( models, auth ) {
	var self = this;

	self.models = models;
	self.auth = auth;

	self.index = function ( req, res ) {
	  res.render ( "index", { title: "Nodoovent" } );
	};

	self.loginForm = function ( req, res ) {
		res.render ( "login", { title: "Nodoovent" } );
	}

	self.login = passport.authenticate ( localstrategy,  { successReturnToOrRedirect: '/', failureRedirect: '/login' } );

	self.privacy = new privacy ( self.models, self.auth );
	self.status = new status ( self.models, self.auth );
	// self.tag = new tag ( self.models, self.auth );
	// self.todo = new todo ( self.models, self.auth );
	self.user = new user ( self.models, self.auth );
	self.oauth1 = new oauth1 ( self.models, self.auth );

}