var ClientPermission = require ( "./clientpermission" );
var DeveloperAccount = require ( "./developeraccount" );
var OAuth1AccessToken = require ( "./oauth1accesstoken" );
var OAuth1Client = require ( "./oauth1client" );
var OAuth1RequestToken = require ( "./oauth1requesttoken" );

module.exports = function ( waterline, adapter, conf ) {

	ClientPermission ( waterline, adapter, conf );
	DeveloperAccount ( waterline, adapter, conf );
	OAuth1AccessToken ( waterline, adapter, conf );
	OAuth1Client ( waterline, adapter, conf );
	OAuth1RequestToken ( waterline, adapter, conf );

}