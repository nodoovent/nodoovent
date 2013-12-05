module.exports = function ( schema ) {

	var User = schema.models.User;

	// model for auth
	var DeveloperAccount = require ( "./developeraccount" ) ( schema );
	var OAuth1AccessToken = require ( "./oauth1accesstoken" ) ( schema );
	var OAuth1Client = require ( "./oauth1client" ) ( schema );
	var OAuth1RequestToken = require ( "./oauth1requesttoken" ) ( schema );
	var Permission = require ( "./permission" ) ( schema );

	// association
	DeveloperAccount.hasMany ( OAuth1Client, { as: "clients", foreignKey: "developerAccount" } );
	OAuth1Client.hasMany ( OAuth1RequestToken, { as: "resquestTokens", foreignKey: "client" } );
	OAuth1Client.hasMany ( OAuth1AccessToken, { as: "accessTokens", foreignKey: "client" } );
	// OAuth1Client.belongsTo ( DevelopperAccount, { as: "developperAccount", foreignKey: "developperAccount" } );
	User.hasMany ( OAuth1RequestToken, { as: "requestTokens", foreignKey: "user" } );
	User.hasMany ( OAuth1AccessToken, { as: "accessTokens", foreignKey: "user" } );
	OAuth1AccessToken.hasAndBelongsToMany ( Permission, { as: "permissions" } );
	// OAuth1AccessToken.belongsTo ( OAuth1Client, { as: "client", foreignKey: "client" } );
	// OAuth1AccessToken.belongsTo ( User, { as: "user", foreignKey: "user" } );
	// OAuth1RequestToken.belongsTo ( OAuth1Client, { as: "client", foreignKey: "client" } );
	// OAuth1RequestToken.belongsTo ( User, { as: "user", foreignKey: "user" } );

	return schema;
}