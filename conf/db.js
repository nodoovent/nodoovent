/*
 *	Database Configuration
 *	
 *	Define database engine and some configurations ...
 *	This configuration are designed specially for sequelize
 */

var path = require ( "path" );

module.exports = {

	// engine to use
	engine: "sqlite3",


	// see jugglingdb sqlite3 adaptater doc
	sqlite3: {
		database: path.join ( __dirname, "../nodoovent.sqlite" ) 
	}

};