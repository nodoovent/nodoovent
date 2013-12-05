module.exports = function ( schema ) {

	var DeveloperAccount = schema.define ( 
		"DevelopperAccount",
		{
			firstName: { type: String },
			lastName: { type: String },
			organizationName: { type: String },
			email: { type: String },
			password: { type: String },
			createdAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	DeveloperAccount.validatesPresenceOf ( "password", "email" );
	DeveloperAccount.validatesUniquenessOf ( "email", { message: "email is not unique" } );

	return DeveloperAccount;

}