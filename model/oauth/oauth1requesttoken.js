module.exports = function ( schema ) {

	var OAuth1RequestToken = schema.define (
		"OAuth1RequestToken",
		{
			token: { type: String },
			secret: { type: String },
			callbackUrl: { type: String },
			timeout: { type: Date },
			verifier: { type: String },
			approved: { type: Boolean, default: false },
			createdAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	OAuth1RequestToken.validatesPresenceOf ( "token", "secret", "callbackUrl" );

	return OAuth1RequestToken;

}