var should = require ( "should" );
var supertest = require ( "supertest" );

/*
 *	Status tests uses current Nodoovent configuration (see conf folder)
 */
module.exports = function ( nodoovent, url ) {

	var status = nodoovent.conf.status;
	var lstatus = status.length;

	describe ( "Test /status end points:", function ( ) {

		it ( "should have /status end point", function ( callback ) {
			var req = supertest ( url ).get ( "/status" ).send ( );
			req.end ( function ( err, res ) {
				if ( err ) return callback ( err );
				res.should.have.status ( 200 );
				res.should.be.json;
				res.body.should.be.an.instanceof ( Array );
				for ( var i = 0; i < lstatus; i++ ) {
					res.body[i].should.have.property ( "id", i+1 );
					res.body[i].should.have.property ( "name", status[i] );
				}
				callback ( );
			} );
		} );

		// test all end points /status/id
		var TestStatusWithId = function ( i ) {
			it ( "should have /status/" + ( i + 1 ) + " end point (" + status[i] + ")", function ( callback ) {
				req = supertest ( url ).get ( "/status/" + ( i + 1 )  ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "id", i + 1 );
					res.body.should.have.property ( "name", status[i] );
					callback ( );
				} );
			} );
		}

		for ( var i = 0; i < lstatus; i++ ) new TestStatusWithId ( i );

		it ( "should not have /status/" +  ( lstatus + 1 ) + " end point and should return 404 http code", function ( callback ) {
			req = supertest ( url ).get ( "/status/" + ( lstatus + 1 ) ).send ( );
			req.end ( function ( err, res ) {
				if ( err ) return callback ( err );
				res.should.have.status ( 404 );
				callback ( );
			} );
		} );

	} );

}