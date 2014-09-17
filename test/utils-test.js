var uid = require ( "../utils" ).uid;
var supertest = require ( "supertest" );

module.exports.supertest = function ( host, method, url ) {
	var req = supertest ( host );
	switch ( method ) {
		case "POST": req = req.post ( url ); break;
		case "PUT": req = req.put ( url ); break;
		case "DELETE": req = req.del ( url ); break;
		case "GET":
		default: req = req.get ( url ); break;
	}
	return req.set ( "Content-Type", "application/json" );
}

module.exports.supertest405 = function ( req, callback ) {
	req.end ( function ( err, res ) {
		if ( err ) return callback ( err );
		res.should.have.status ( 405 );
		callback ( )
	} );
}

module.exports.supertest404 = function ( req, callback ) {
	req.end ( function ( err, res ) {
		if ( err ) return callback ( err );
		res.should.have.status ( 404 );
		callback ( )
	} );
}

module.exports.supertest401 = function ( req, callback ) {
	req.end ( function ( err, res ) {
		if ( err ) return callback ( err );
		res.should.have.status ( 401 );
		callback ( )
	} );
}

module.exports.createDeveloperAccountAndOAuth1Client = function ( nodoovent, callback ) {
	var models = nodoovent.models;
	var account = { organizationName: "Nodoovent", password: "nodoovent", email: "nodoovent@nodoovent.com" };
	var client = { name: "Nodoovent", description: "Nodoovent official client", consumerKey: "nodoovent", consumerSecret: "nodoovent" };
	models.developeraccounts.create ( account, function ( err, account ) {
		if ( err ) return callback ( err );
		client.developeraccount = account.id;
		models.oauth1clients.create ( client, function ( err, client ) {
			if ( err ) return callback ( err );
			callback ( null );
		} );
	} );
}


module.exports.addUserAndOAuth1AccessToken = function ( nodoovent, user, callback ) {

	var models = nodoovent.models;
	// create a test user and add an oauth1 access token
	models.users.create ( user, function ( err, user ) {
		if ( err ) return callback ( err )
		models.oauth1clients.findOne ( 1 ).exec ( function ( err, client ) {
			if ( err ) return callback ( err );
			if ( !client ) return callback ( "No Client found" );
			var token = { token: uid ( 16 ), secret: uid ( 32 ), oauth1Client: client.id, user: user.id };
			models.oauth1accesstokens.create ( token, function ( err, token ) {
				if ( err ) return callback ( err );
				callback ( null, user, client, token );
			} );
		} );
	} );

}

