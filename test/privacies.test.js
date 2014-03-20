var should = require ( "should" );
var supertest = require ( "supertest" );

/*
 *	Status tests uses current Nodoovent configuration (see conf folder)
 */
module.exports = function ( nodoovent, url ) {

	var privacies = nodoovent.conf.privacies;
	var lprivacies = privacies.length;

	describe ( "Test /privacies end points:", function ( ) {

		var supertest404 = function ( req, callback ) {
			req.end ( function ( err, res ) {
				if ( err ) return callback ( err );
				res.should.have.status ( 404 );
				callback ( )
			} );
		}

		describe ( "GET end points", function ( ) {

			it ( "should have /privacies end point", function ( callback ) {
				var req = supertest ( url ).get ( "/privacies" ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.be.an.instanceof ( Array );
					for ( var i = 0; i < lprivacies; i++ ) {
						res.body[i].should.have.property ( "id", i + 1 );
						res.body[i].should.have.property ( "name", privacies[i] );
						res.body[i].should.not.have.property ( "createdAt" );
						res.body[i].should.not.have.property ( "updatedAt" );
					}
					callback ( );
				} );
			} );


			// test all end points /privacies/id
			var TestPrivaciesWithId = function ( i ) {
				it ( "should have /privacies/" + ( i + 1 ) + " end point (" + privacies[i] + ")", function ( callback ) {
					var req = supertest ( url ).get ( "/privacies/" + ( i + 1 ) ).send ( );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 200 );
						res.should.be.json;
						res.body.should.have.property ( "id", i + 1 );
						res.body.should.have.property ( "name", privacies[i] );
						res.body.should.not.have.property ( "createdAt" );
						res.body.should.not.have.property ( "updatedAt" );
						callback ( );
					} );
				} );
			}

			for ( var i = 0; i < lprivacies; i++ ) new TestPrivaciesWithId ( i );

			it ( "should not have /privacies/" + ( lprivacies + 1 ) + " end point and should return 404 http code", function ( callback ) {
				var req = supertest ( url ).get ( "/privacies/" + ( lprivacies + 1 ) ).send ( );
				req.end ( function ( err, res ) {
					if ( err )  return callback ( err );
					res.should.have.status ( 404 );
					callback ( );
				} );
			} );

		} );

		describe ( "POST, PUT and DELETE endpoints", function ( ) {

			it ( "POST /privacies", function ( callback ) {
				req = supertest ( url ).post ( "/privacies" );
				supertest404 ( req, callback );
			} );

			it ( "POST /privacies/1", function ( callback ) {
				req = supertest ( url ).post ( "/privacies/1" );
				supertest404 ( req, callback );
			} );

			it ( "PUT /privacies", function ( callback ) {
				req = supertest ( url ).put ( "/privacies" );
				supertest404 ( req, callback );
			} );

			it ( "PUT /privacies/1", function ( callback ) {
				req = supertest ( url ).put ( "/privacies/1" );
				supertest404 ( req, callback );
			} );

			it ( "DELETE /privacies", function ( callback ) {
				req = supertest ( url ).del ( "/privacies" );
				supertest404 ( req, callback );
			} );

			it ( "DELETE /privacies/1", function ( callback ) {
				req = supertest ( url ).del ( "/privacies/1" );
				supertest404 ( req, callback );
			} );

		} );

	} );

}