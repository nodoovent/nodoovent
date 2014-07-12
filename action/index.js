var passport = require ( "passport" );

var LocalStrategy = require ( "../auth/localstrategy" );
var localstrategy = LocalStrategy.name;

var OAuth1TokenStrategy = require ( "../auth/oauth1tokenstrategy" );
var oauth1TokenStrategy = OAuth1TokenStrategy.name;

var Privacy = require ( "./privacy" );
var Status = require ( "./status" );
var Todo = require ( "./todo" );
// var tag = require ( "./tag" );
var User = require ( "./user" );
var OAuth1 = require ( "./oauth1" );

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

	// "system" actions ...
	self.checkAuth = [ passport.authenticate ( oauth1TokenStrategy, { session: false } ) ];
	
	self.methodNotAllowed = function ( req, res ) {
		return res.status ( 405 ).send ( );
	}

	self.login = passport.authenticate ( localstrategy,  { successReturnToOrRedirect: '/', failureRedirect: '/login' } );

	self.privacy = new Privacy ( self.models, self.auth );
	self.status = new Status ( self.models, self.auth );
	// self.tag = new tag ( self.models, self.auth );
	self.todo = new Todo ( self.models, self.auth );
	self.user = new User ( self.models, self.auth );
	self.oauth1 = new OAuth1 ( self.models, self.auth );

}