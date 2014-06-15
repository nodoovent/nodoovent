var should = require ( "should" );
var shouldHTTP = require ( "should-http" );
var supertest = require ( "supertest" );

/*
 *	Status tests uses current Nodoovent configuration (see conf folder)
 */
module.exports = function ( nodoovent, url ) {

	var status = nodoovent.conf.status;
	var lstatus = status.length;

	describe ( "Test /status end points:", function ( ) {

		var supertest404 = function ( req, callback ) {
			req.end ( function ( err, res ) {
				if ( err ) return callback ( err );
				res.should.have.status ( 404 );
				callback ( )
			} );
		}

		describe ( "GET end points", function ( ) {
			it ( "should have GET /status end point", function ( callback ) {
				var req = supertest ( url ).get ( "/status" ).send ( );
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
					req = supertest ( url ).get ( "/status/" + ( i + 1 )  ).send ( );
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
				req = supertest ( url ).get ( "/status/" + ( lstatus + 1 ) ).send ( );
				supertest404 ( req, callback );
			} );

		} );

		describe ( "POST, PUT and DELETE endpoints", function ( ) {

			it ( "POST /status", function ( callback ) {
				req = supertest ( url ).post ( "/status" );
				supertest404 ( req, callback );
			} );

			it ( "POST /status/1", function ( callback ) {
				req = supertest ( url ).post ( "/status/1" );
				supertest404 ( req, callback );
			} );

			it ( "PUT /status", function ( callback ) {
				req = supertest ( url ).put ( "/status" );
				supertest404 ( req, callback );
			} );

			it ( "PUT /status/1", function ( callback ) {
				req = supertest ( url ).put ( "/status/1" );
				supertest404 ( req, callback );
			} );

			it ( "DELETE /status", function ( callback ) {
				req = supertest ( url ).del ( "/status" );
				supertest404 ( req, callback );
			} );

			it ( "DELETE /status/1", function ( callback ) {
				req = supertest ( url ).del ( "/status/1" );
				supertest404 ( req, callback );
			} );

		} );

	} );

}