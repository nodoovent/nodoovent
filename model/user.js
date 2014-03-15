/*
 *	User
 *
 *
 */
 
var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

module.exports = function ( waterline, adapter, conf ) {

	var identity = "users";

	var connection = conf.db.defaultConnection;
	if ( _.has ( conf.models, identity ) )
		connection = conf.models[identity];

	var User = Waterline.Collection.extend ( {
		identity: identity,
		connection: connection,
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
			authoredTodos: { collection: "todos", via: "author" },

			// associations oauth
			oauth1RequestTokens: { collection: "oauth1requesttokens", via: "user" },
			oauth1AccessTokens: { collection: "oauth1accesstokens", via: "user" },

			// instance methods
			fullName: function ( ) {
				return this.firstName + " " + this.lastName;
			},

			toJSON: function ( ) {
				delete this.password;
				delete this.authoredTodos;
				delete this.oauth1AccessTokens;
				delete this.oauth1RequestTokens;
				return this;
			}
		}
	} );

	waterline.loadCollection ( User );

	return User;
}