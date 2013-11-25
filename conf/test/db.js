/*
 *	Database Configuration for Test Unit Case
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
		database: ":memory:" 
	}

};