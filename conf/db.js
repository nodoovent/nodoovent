/*
 *	Database Configuration
 *	
 *	Define database engine and some configurations ...
 *	This configuration are designed specially for sequelize
 */

var path = require ( "path" );

module.exports = {

	// engine to use
	engine: "disk",

	// Disk db storage
	disk: {
		module: "sails-disk",
		params: {
			filePath: path.join ( __dirname, "../nodoovent.db.json" ) 
		}
	}

};