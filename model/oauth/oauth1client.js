var Schema = require ( "jugglingdb" ).Schema;

module.exports = function ( schema ) {

	var OAuth1Client = schema.define (
		"OAuth1Client",
		{
			name: { type: String },
			description: { type: Schema.Text },
			consumerKey: { type: String },
			consumerSecret: { type: String },
			createdAt: { type: Date, default: function ( ) { return new Date; } }
		}
	);

	OAuth1Client.validatesPresenceOf ( "name", "consumerKey", "consumerSecret" );

	return OAuth1Client;

}