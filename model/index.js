var Schema = require ( "jugglingdb" ).Schema;

module.exports.init = function ( conf, callback ) {

	callback = callback || function ( ) { };

	var schema = new Schema ( conf.engine, conf[conf.engine] );

	// Models for Nodoovent
	// var Comment = require ( "./comment" ) ( schema );
	// var Group = require ( "./group" ) ( schema );
	// var Privacy = require ( "./privacy" ) ( schema );
	// var Status = require ( "./status" ) ( schema );
	// var Tag = require ( "./tag" ) ( schema );
	// var Todo = require ( "./todo" ) ( schema );
	// var TodosList = require ( "./todolist" ) ( schema );
	var User = require ( "./user" ) ( schema );




	schema.autoupdate ( function ( err ) {
		callback ( err );
	} );

	return schema;
}