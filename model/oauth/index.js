module.exports = function ( sequelize, model ) {

	// model for auth
	var DevelopperAccount = require ( "./developperaccount" ) ( sequelize );
	var OAuth1AccessToken = require ( "./oauth1accesstoken" ) ( sequelize );
	var OAuth1Client = require ( "./oauth1client" ) ( sequelize );
	var OAuth1RequestToken = require ( "./oauth1requesttoken" ) ( sequelize );
	var Permission = require ( "./permission" ) ( sequelize );

	// association
	DevelopperAccount.hasMany ( OAuth1Client );
	OAuth1Client.hasMany ( OAuth1RequestToken );
	OAuth1Client.hasMany ( OAuth1AccessToken );
	OAuth1AccessToken.hasMany ( Permission );
	model.User.hasMany ( OAuth1RequestToken );
	model.User.hasMany ( OAuth1AccessToken );



	// sync
	DevelopperAccount.sync ( );
	OAuth1AccessToken.sync ( );
	OAuth1Client.sync ( );
	OAuth1RequestToken.sync ( );
	Permission.sync ( );

	model.oauth = { DevelopperAccount: DevelopperAccount, OAuth1AccessToken: OAuth1AccessToken, OAuth1Client: OAuth1Client,
					OAuth1RequestToken: OAuth1RequestToken, Permission: Permission };

	return model;

}