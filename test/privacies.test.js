var should = require ( "should" );
var shouldHTTP = require ( "should-http" );

var UtilsTest = require ( "./utils-test" );
var supertest = UtilsTest.supertest;
var supertest405 = UtilsTest.supertest405;
var supertest404 = UtilsTest.supertest404;

/*
 *	Status tests uses current Nodoovent configuration (see conf folder)
 */
module.exports = function ( nodoovent, url ) {

	var privacies = nodoovent.conf.privacies;
	var lprivacies = privacies.length;

	describe ( "Test /privacies end points:", function ( ) {

		describe ( "GET end points", function ( ) {

			it ( "should have /privacies end point", function ( callback ) {
				var req = supertest ( url, "GET", "/privacies" ).send ( );
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
					var req = supertest ( url, "GET", "/privacies/"  + ( i + 1 ) ).send ( );
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
				var req = supertest ( url, "GET", "/privacies/"  + ( lprivacies + 1 ) ).send ( );
				supertest404 ( req, callback );
			} );

		} );

		describe ( "POST, PUT and DELETE endpoints", function ( ) {

			it ( "POST /privacies", function ( callback ) {
				req = supertest ( url, "POST", "/privacies" );
				supertest405 ( req, callback );
			} );

			it ( "POST /privacies/1", function ( callback ) {
				req = supertest ( url, "POST", "/privacies/1" );
				supertest405 ( req, callback );
			} );

			it ( "PUT /privacies", function ( callback ) {
				req = supertest ( url, "PUT", "/privacies" );
				supertest405 ( req, callback );
			} );

			it ( "PUT /privacies/1", function ( callback ) {
				req = supertest ( url, "PUT", "/privacies/1" );
				supertest405 ( req, callback );
			} );

			it ( "DELETE /privacies", function ( callback ) {
				req = supertest ( url, "DELETE", "/privacies" );
				supertest405 ( req, callback );
			} );

			it ( "DELETE /privacies/1", function ( callback ) {
				req = supertest ( url, "DELETE", "/privacies/1" );
				supertest405 ( req, callback );
			} );

		} );

	} );

}