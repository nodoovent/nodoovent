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

	var status = nodoovent.conf.status;
	var lstatus = status.length;

	describe ( "Test /status end points:", function ( ) {

		describe ( "GET end points", function ( ) {
			it ( "should have GET /status end point", function ( callback ) {
				var req = supertest ( url, "GET", "/status" ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.be.an.instanceof ( Array );
					for ( var i = 0; i < lstatus; i++ ) {
						res.body[i].should.have.property ( "id", i+1 );
						res.body[i].should.have.property ( "name", status[i] );
						res.body[i].should.not.have.property ( "createdAt" );
						res.body[i].should.not.have.property ( "updatedAt" );
					}
					callback ( );
				} );
			} );

			// test all end points /status/id
			var TestStatusWithId = function ( i ) {
				it ( "should have GET /status/" + ( i + 1 ) + " end point (" + status[i] + ")", function ( callback ) {
					req = supertest ( url, "GET", "/status/" + ( i + 1 )  ).send ( );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 200 );
						res.should.be.json;
						res.body.should.have.property ( "id", i + 1 );
						res.body.should.have.property ( "name", status[i] );
						res.body.should.not.have.property ( "createdAt" );
						res.body.should.not.have.property ( "updatedAt" );
						callback ( );
					} );
				} );
			}

			for ( var i = 0; i < lstatus; i++ ) new TestStatusWithId ( i );

			it ( "should not have GET /status/" +  ( lstatus + 1 ) + " end point and should return HTTP 404", function ( callback ) {
				req = supertest ( url, "GET", "/status/" + ( lstatus + 1 ) ).send ( );
				supertest404 ( req, callback );
			} );

		} );

		describe ( "POST, PUT and DELETE endpoints", function ( ) {

			it ( "POST /status", function ( callback ) {
				req = supertest ( url, "POST", "/status" );
				supertest405 ( req, callback );
			} );

			it ( "POST /status/1", function ( callback ) {
				req = supertest ( url, "POST", "/status/1" );
				supertest405 ( req, callback );
			} );

			it ( "PUT /status", function ( callback ) {
				req = supertest ( url, "PUT", "/status" );
				supertest405 ( req, callback );
			} );

			it ( "PUT /status/1", function ( callback ) {
				req = supertest ( url, "PUT", "/status/1" );
				supertest405 ( req, callback );
			} );

			it ( "DELETE /status", function ( callback ) {
				req = supertest ( url, "DELETE", "/status" );
				supertest405 ( req, callback );
			} );

			it ( "DELETE /status/1", function ( callback ) {
				req = supertest ( url, "DELETE", "/status/1" );
				supertest405 ( req, callback );
			} );

		} );

	} );

}