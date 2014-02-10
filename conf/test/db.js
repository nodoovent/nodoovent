/*
 *	Database Configuration for Test Unit Case
 *	
 *	Define database engine and some configurations ...
 *	This configuration are designed specially for sequelize
 */

var path = require ( "path" );

module.exports = {

	// engine to use
	connections: [ "localDisk" ],
	defaultConnection: "localDisk",

	// use a specific engine for a model (different as default)
	models: { },

	// Disk db storage
	localDisk: {
		adapter: "disk",
		filePath: path.join ( __dirname, "../test/" ) 
	},

	// Memory db storage
	memory: {
		adapter: "memory"
	},

	// available adapter list
	adapters: {
		disk: "sails-disk",
		memory: "sails-memory"
	},

	defaultAdapter: "disk"

};