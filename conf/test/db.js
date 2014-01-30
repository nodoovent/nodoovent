/*
 *	Database Configuration for Test Unit Case
 *	
 *	Define database engine and some configurations ...
 *	This configuration are designed specially for sequelize
 */

var path = require ( "path" );

module.exports = {

	// engine to use
	engine: "memory",

	// Disk db storage
	disk: {
		module: "sails-disk",
		params: {
			filePath: path.join ( __dirname, "../nodoovent.test.db.json" ) 
		}
	},

	// Memory db storage
	memory: {
		module: "sails-memory",
		params: { }
	}

};