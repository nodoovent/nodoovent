module.exports = function ( schema ) {

	var DevelopperAccount = schema.define ( 
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

	DevelopperAccount.validatesPresenceOf ( "password", "email" );
	DevelopperAccount.validatesUniquenessOf ( "email", { message: "email is not unique" } );

	return DevelopperAccount;

}