var fs = require ( "fs" );
var Mocha = require ( "mocha" );

var Nodoovent = require ( "../nodoovent" );

var UtilsTest = require ( "./utils-test" );
var createDeveloperAccountAndOAuth1Client = UtilsTest.createDeveloperAccountAndOAuth1Client;

var NODE_ENV_OLD = process.env.NODE_ENV;
process.env.NODE_ENV = "test";

var nodoovent = null;

if ( fs.existsSync ( "./test/localDisk.db" ) )
	fs.unlinkSync ( "./test/localDisk.db" );

Nodoovent ( function ( err, nodoo ) {
	
	nodoovent = nodoo;

	createDeveloperAccountAndOAuth1Client ( nodoovent, function ( err ) {

		global.NODE_ENV_OLD = NODE_ENV_OLD;
		global.nodoovent = nodoovent;		

		var mocha = new Mocha ( );
		mocha.ui ( "bdd" );
		mocha.reporter ( "spec" );
		mocha.globals ( [ nodoovent, NODE_ENV_OLD ] );
		mocha.files = [ "./test/app.test.js" ];

		mocha.run ( function ( err ) {
			process.exit ( );
		} );
	
	} );

} );