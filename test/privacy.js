var should = require ( "should" );
var request = require ( "supertest" );

module.exports = function ( url ) {
	this.url = url;
	this.privacies = [ "Public", "Private" ];
	this.lprivacies = this.privacies.length;
}

module.exports.prototype.test = function ( ) {
	var url = this.url;
	var privacies = this.privacies;
	var lprivacies = this.lprivacies;

	describe ( "Test /privacies end points:", function ( ) {

		it ( "should have /privacies end point", function ( callback ) {
			var req = request ( url ).get ( "/privacies" ).send ( );
			req.end ( function ( err, res ) {
				if ( err ) return callback ( err );
				res.should.have.status ( 200 );
				res.should.be.json;
				res.body.should.be.an.instanceof ( Array );
				for ( var i = 0; i < lprivacies; i++ ) {
					res.body[i].should.have.property ( "id", i + 1 );
					res.body[i].should.have.property ( "name", privacies[i] );
				}
				callback ( );
			} );
		} );


		// test all end points /privacies/id
		var TestPrivaciesWithId = function ( i ) {
			it ( "should have /privacies/" + ( i + 1 ) + " end point (" + privacies[i] + ")", function ( callback ) {
				var req = request ( url ).get ( "/privacies/" + ( i + 1 ) ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "id", i + 1 );
					res.body.should.have.property ( "name", privacies[i] );
					callback ( );
				} );
			} );
		}

		for ( var i = 0; i < lprivacies; i++ ) new TestPrivaciesWithId ( i );

		it ( "should not have /privacies/" + ( lprivacies + 1 ) + " end point and should return 404 http code", function ( callback ) {
			var req = request ( url ).get ( "/privacies/" + ( lprivacies + 1 ) ).send ( );
			req.end ( function ( err, res ) {
				if ( err )  return callback ( err );
				res.should.have.status ( 404 );
				callback ( );
			} );
		} );

	} );

}