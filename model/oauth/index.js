var ClientPermission = require ( "./clientpermission" );
var DeveloperAccount = require ( "./developeraccount" );
var OAuth1AccessToken = require ( "./oauth1accesstoken" );
var OAuth1Client = require ( "./oauth1client" );
var OAuth1RequestToken = require ( "./oauth1requesttoken" );

module.exports = function ( waterline, adapter ) {

	ClientPermission ( waterline, adapter );
	DeveloperAccount ( waterline, adapter );
	OAuth1AccessToken ( waterline, adapter );
	OAuth1Client ( waterline, adapter );
	OAuth1RequestToken ( waterline, adapter );

}