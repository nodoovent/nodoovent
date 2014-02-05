/*
 *	User
 *
 *
 */
 
var Waterline = require ( "waterline" );
 
module.exports = function ( waterline, adapter ) {

	var User = Waterline.Collection.extend ( {
		adapter: adapter.name,
		tableName: "users", // not use maj for table name - waterline bug
		attributes: {
			firstName: { type: "string" },
			lastName: { type: "string" },
			login: {
				type: "string",
				required: true,
				maxLength: 20,
				unique: true
			},
			password: {
				type: "string",
				required: true,
				minLength: 5
			},
			email: {
				type: "email",
				required: true,
				unique: true
			},
			// associations
			oauth1RequestTokens: { collection: "oauth1requesttokens" },
			oauth1AccessTokens: { collection: "oauth1accesstokens" },

			// instance methods
			fullName: function ( ) {
				return this.firstName + " " + this.lastName;
			},

			toJSON: function ( ) {
				delete this.password;
				return this;
			}
		}
	} );

	waterline.loadCollection ( User );

	return User;
}