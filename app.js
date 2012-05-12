﻿/*
 * Require the node modules. 
 *  HTTP is a native nodejs module.
 *  mysql is installed from Node Package Manager (npm),
 * already present in node_modules folder.
 */
var appConf = require ( './lib/config.js' ) ( './conf.json' )
  , router = require ( './lib/router.js' )
  , handler = require ( './lib/handler.js' )
  , server = require ( './lib/server.js' ) ( router, handler );

server.listen ( appConf.api.port, appConf.api.address );

console.log ( 'Server running at http://' + appConf.api.address + ':' + appConf.api.port );
