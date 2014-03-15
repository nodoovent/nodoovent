var http = require ( "http" );
var should = require ( "should" );

module.exports = function ( nodoovent, httpserver ) {

	describe ( "Start test Nodoovent API server:", function ( ) {

		it ( "should get Nodoovent instance", function ( ) {
			nodoovent.should.have.property ( "app" );
			nodoovent.should.have.property ( "conf" );
			nodoovent.should.have.property ( "models" );
			nodoovent.should.have.property ( "auth" );
			nodoovent.should.have.property ( "actions" );
			nodoovent.should.have.property ( "routes" );
		} );

		it ( "should start server", function ( callback ) {
			var app = nodoovent.app;
			httpserver = http.createServer ( app ).listen ( app.get ( "port" ), function ( err ) {
	  			if ( err ) return callback ( err );
	  			callback ( );
			} );
		} );

	} );

}