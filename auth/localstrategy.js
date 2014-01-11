/*
 *	LocalStrategy
 *
 *	This strategy is used to authenticate users based on a username and password.
 */

var passport = require ( "passport" );
var LocalStrategy = require ( "passport-local" ).Strategy;


 module.exports.name = "Local";

 module.exports.init = function ( schema ) {

 	var User = schema.models.User;

 	passport.serializeUser ( function ( user, callback ) {
 		callback ( null, user.id );
 	} );

 	passport.deserializeUser ( function ( id, callback ) {
 		User.find ( id, function ( err, user ) {
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
 			User.all ( { where: { login: login, password: password } }, function ( err, users ) {
 				if ( err ) return callback ( err );
 				if ( users.length > 1 ) callback ( "Many users have the same login and password, it's weird !" );
 				if ( users.length == 0 ) callback ( "No user match" );
 				callback ( null, users[0] );
 			} );
 		}
 	);

 }