var path = require ( "path" );
var conf = { };

// used engine
conf.dbengine = "sqlite";

// sequelize define
conf.define = { 
	charset: "utf8"
};

// sequelize conf for sqlite3
conf.sqlite = {
	database: "nodoovent",
	username: "zeitungen",
	password: "secret",
	storage: path.join ( __dirname, "../nodoovent.sqlite" )// __dirname + "/nodoovent.sqlite"
};
conf.sqlite.conf = {
	dialect: "sqlite",
	storage: conf.sqlite.storage,
	define: conf.define
};

module.exports = conf;