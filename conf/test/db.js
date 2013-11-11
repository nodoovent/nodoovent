/*
 *	Database Configuration for Test Unit Case
 *	
 *	Define database engine and some configurations ...
 *	This configuration are designed specially for sequelize
 */

var path = require ( "path" );
var conf = { };

// used engine
conf.dbengine = "sqlite";

// sequelize define
conf.define = { 
	charset: "utf8"
};

// sequelize verbose
conf.logging = false;

// sequelize conf for sqlite3
conf.sqlite = {
	database: "nodoovent",
	username: "zeitungen",
	password: "secret",
	storage: ":memory:" //path.join ( __dirname, "../../test/test.sqlite" )
};
conf.sqlite.conf = {
	dialect: "sqlite",
	storage: conf.sqlite.storage,
	define: conf.define,
	logging: conf.logging
};

module.exports = conf;