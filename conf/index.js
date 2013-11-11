module.exports = function ( mode ) {
	
	var conf = { };

	if ( mode == "test" ) {
		conf.db = require ( "./test/db" );
	} else {
		conf.db = require ( "./db" );
	}

	return conf;
};