module.exports = function ( mode ) {
	
	var conf = { };

	if ( mode == "test" ) {
		conf.db = require ( "./test/db" );
	} else {
		conf.db = require ( "./db" );
	}

	conf.privacies = [ "Public", "Private" ];
	conf.status = [ "Created", "In Progress", "Done", "Canceled", "In Development", "Rejected" ];

	return conf;
};