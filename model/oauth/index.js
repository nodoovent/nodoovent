module.exports = function ( sequelize, model, chainer ) {

	// model for auth
	var DevelopperAccount = require ( "./developperaccount" ) ( sequelize );
	var OAuth1AccessToken = require ( "./oauth1accesstoken" ) ( sequelize );
	var OAuth1Client = require ( "./oauth1client" ) ( sequelize );
	var OAuth1RequestToken = require ( "./oauth1requesttoken" ) ( sequelize );
	var Permission = require ( "./permission" ) ( sequelize );

	// association
	var constraint = { onDelete: "cascade", onUpdate: "cascade" };
	DevelopperAccount.hasMany ( OAuth1Client, constraint );
	OAuth1Client.hasMany ( OAuth1RequestToken, constraint );
	OAuth1Client.hasMany ( OAuth1AccessToken, constraint );
	OAuth1AccessToken.hasMany ( Permission, constraint );
	model.User.hasMany ( OAuth1RequestToken, constraint );
	model.User.hasMany ( OAuth1AccessToken, constraint );



	// sync
	chainer.run ( DevelopperAccount.sync ( ) );
	chainer.run ( OAuth1AccessToken.sync ( ) );
	chainer.run ( OAuth1Client.sync ( ) );
	chainer.run ( OAuth1RequestToken.sync ( ) );
	chainer.run ( Permission.sync ( ) );

	model.oauth = { DevelopperAccount: DevelopperAccount, OAuth1AccessToken: OAuth1AccessToken, OAuth1Client: OAuth1Client,
					OAuth1RequestToken: OAuth1RequestToken, Permission: Permission };

	return model;

}