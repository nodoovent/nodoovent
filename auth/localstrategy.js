/*
 *	LocalStrategy
 *
 *	This strategy is used to authenticate users based on a username and password.
 */

var passport = require ( "passport" );
var LocalStrategy = require ( "passport-local" ).Strategy;


 module.exports.name = "Local";

 module.exports.init = function ( model ) {

 	var User = model.User;

 	passport.serializeUser ( function ( user, callback ) {
 		callback ( null, user.id );
 	} );

 	passport.deserializeUser ( function ( id, callback ) {
 		var query = User.find ( { where: { id: id } } );
 		query.error ( function ( err ) { callback ( err ); } );
		query.success ( function ( user ) {
			if ( !user ) return callback ( null, false );
			callback ( null, user );	
		} );
 	} );

 	return new LocalStrategy (
	 	{
	 		usernameField: "login",
	 		passwordField: "password"
	 	},
 		function ( login, password, callback ) {
	 		var query = User.find ( { where: { login: login, password: password } } );
	 		query.error ( function ( err ) { callback ( err ); } );
	 		query.success ( function ( user ) {
	 			if ( !user ) return callback ( null, false );
	 			callback ( null, user );
	 		} );
 		}
 	);

 }