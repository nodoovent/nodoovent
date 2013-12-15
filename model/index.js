var Schema = require ( "jugglingdb" ).Schema;
var QueryChainer = require ( "../utils" ).QueryChainer;

module.exports.init = function ( conf, callback ) {

	callback = callback || function ( ) { };

	var schema = new Schema ( conf.db.engine, conf.db[conf.db.engine] );
	var chainer = new QueryChainer ( );

	// Models for Nodoovent
	// var Comment = require ( "./comment" ) ( schema );
	// var Group = require ( "./group" ) ( schema );
	var Privacy = require ( "./privacy" ) ( schema, conf );
	var Status = require ( "./status" ) ( schema, conf );
	// var Tag = require ( "./tag" ) ( schema );
	var Todo = require ( "./todo" ) ( schema );
	// var TodosList = require ( "./todolist" ) ( schema );
	var User = require ( "./user" ) ( schema );

	// Associations for Nodoovent
	// User.hasAndBelongsToMany ( User, { as: "contacts" } );
	User.hasMany ( Todo, { as: "todos", foreignKey: "creator" } );


	// add authentication models
	schema = require ( "./oauth" ) ( schema );

	schema.autoupdate ( function ( err ) {
		if ( err ) return callback ( err );
		var countchainer = new QueryChainer ( );
		countchainer.add ( Privacy, "count", null, function ( err, count ) {
			if ( err ) return;
			if ( count == 0 ) 
				for ( var i = 0; i < conf.privacies.length; i++ ) chainer.add ( Privacy, "create", { name: conf.privacies[i], id: i + 1 } );
		} );
		countchainer.add ( Status, "count", null, function ( err, count ) {
			if ( err ) return;
			if ( count == 0 )
				for ( var i = 0; i < conf.status.length; i++ ) chainer.add ( Status, "create", { status: conf.status[i], id: i + 1 } );
		} );
		countchainer.run ( function ( errors ) {
			chainer.run ( function ( errors ) {
				callback ( errors );
			} );
		} );
	} );

	return schema;
}