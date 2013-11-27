/*
 *	User
 *
 *
 */
 
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

	return User;

}