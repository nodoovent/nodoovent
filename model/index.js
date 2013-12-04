var Schema = require ( "jugglingdb" ).Schema;
var QueryChainer = require ( "../utils" ).QueryChainer;

module.exports.init = function ( conf, callback ) {

	callback = callback || function ( ) { };

	var schema = new Schema ( conf.db.engine, conf.db[conf.db.engine] );
	var chainer = new QueryChainer ( );

	// Models for Nodoovent
	// var Comment = require ( "./comment" ) ( schema );
	// var Group = require ( "./group" ) ( schema );
	// var Status = require ( "./status" ) ( schema );
	var Privacy = require ( "./privacy" ) ( schema, conf );
	// var Tag = require ( "./tag" ) ( schema );
	// var Todo = require ( "./todo" ) ( schema );
	// var TodosList = require ( "./todolist" ) ( schema );
	var User = require ( "./user" ) ( schema );

	// Associations for Nodoovent
	// User.hasAndBelongsToMany ( User, { as: "contacts" } );


	// add authentication models
	schema = require ( "./oauth" ) ( schema );


	for ( var i = 0; i < conf.privacies.length; i++ ) chainer.add ( Privacy, "create", { name: conf.privacies[i], id: i + 1 } );
	schema.autoupdate ( function ( err ) {
		if ( err ) return callback ( err );
		chainer.run ( function ( errors ) {
			callback ( errors );
		} );
	} );

	return schema;
}