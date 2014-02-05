/*
 *	LocalStrategy
 *
 *	This strategy is used to authenticate users based on a username and password.
 */

var passport = require ( "passport" );
var PassportLocal = require ( "passport-local" );
var LocalStrategy = PassportLocal.Strategy;

 module.exports.name = "Local";

 module.exports.init = function ( models ) {

 	var Users = models.users;

 	passport.serializeUser ( function ( user, callback ) {
 		callback ( null, user.id );
 	} );

 	passport.deserializeUser ( function ( id, callback ) {
 		Users.findOne ( id ).exec ( function ( err, user ) {
 			if ( err ) return callback ( err );
 			if ( !user ) return callback ( "User not found" );
 			callback ( null, user );
 		} );
 	} );

 	return new LocalStrategy (
	 	{
	 		usernameField: "login",
	 		passwordField: "password"
	 	},
 		function ( login, password, callback ) {
 			Users.findOne ( ).where ( { login: login, password: password } ).exec ( function ( err, user ) {
 				if ( err ) return callback ( err );
 				if ( user ) return callback ( null, false );
 				callback ( null, user );
 			} );
 		}
 	);

 }