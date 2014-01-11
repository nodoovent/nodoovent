module.exports = function ( schema ) {

	var OAuth1AccessToken = schema.define (
		"OAuth1AccessToken",
		{
			token: { type: String },
			secret: { type: String },
			createdAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	OAuth1AccessToken.validatesPresenceOf ( "token", "secret" );

	return OAuth1AccessToken;

}