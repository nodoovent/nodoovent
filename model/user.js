/*
 *	User
 *
 *
 */

var validateEmail = require ( "../utils" ).validateEmail;
 
module.exports = function ( schema ) {

	var User = schema.define ( 
		"User",
		{
			firstName: { type: String },
			lastName: { type: String },
			login: { type: String },
			password: { type: String },
			email: { type: String },
			createdAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	User.validatesPresenceOf ( "login", "password", "email" );
	User.validatesUniquenessOf ( "email", { message: "email is not unique" } );
	User.validatesUniquenessOf ( "login", { message: "login is not unique" } );

	var validateUserEmail = function ( callbackerr ) {
		if ( !validateEmail ( this.email ) ) return callbackerr ( );
	};

	User.validate ( "email", validateUserEmail, { message: "email not valid" } );

	User.prototype.toJSON = function ( ) {
		return {
			id: this.id,
			firstName: this.firstName,
			lastName: this.lastName,
			login: this.login,
			email: this.email,
			createdAt: this.createdAt
		}
	}

	return User;

}