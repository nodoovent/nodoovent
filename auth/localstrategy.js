/*
 *	LocalStrategy
 *
 *	This strategy is used to authenticate users based on a username and password.
 */

var passport = require ( "passport" );
var LocalStrategy = require ( "passport-local" ).Strategy;


 module.exports.name = "Local";

 module.exports.init = function ( models ) {

 	var users = models.users;

 	passport.serializeUser ( function ( user, callback ) {
 		callback ( null, user.id );
 	} );

 	passport.deserializeUser ( function ( id, callback ) {
 		users.findOne ( id ).exec ( function ( err, user ) {
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
 			users.findOne ( ).where ( { login: login, password: password } ).exec ( function ( err, user ) {
 				if ( err ) return callback ( err );
 				if ( user ) return callback ( null, false );
 				callback ( null, user );
 			} );
 		}
 	);

 }