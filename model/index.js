// var Schema = require ( "jugglingdb" ).Schema;
// var QueryChainer = require ( "../utils" ).QueryChainer;

var Waterline = require ( "waterline" );
var _ = require ( "lodash" );
var QueryChainer = require ( "../utils" ).QueryChainer;

module.exports.init = function ( conf, callback ) {

	callback = callback || function ( ) { };

	var engine = conf.db.engine;
	var adapter = require ( conf.db[engine].module );
	adapter.config = _.merge ( { }, adapter.defaults );
	adapter.config = _.merge ( adapter.config, conf.db[engine].params );
	adapter.name = engine;

	var waterline = new Waterline ( );


	// var schema = new Schema ( conf.db.engine, conf.db[conf.db.engine] );
	// var chainer = new QueryChainer ( );

	// Models for Nodoovent
	// var Comment = require ( "./comment" ) ( schema );
	// var Group = require ( "./group" ) ( schema );
	require ( "./privacy" ) ( waterline, adapter, conf );
	require ( "./status" ) ( waterline, adapter, conf );
	// var Tag = require ( "./tag" ) ( schema );
	// var Todo = require ( "./todo" ) ( schema );
	// var TodosList = require ( "./todolist" ) ( schema );
	require ( "./user" ) ( waterline, adapter );
	// Associations for Nodoovent
	// User.hasAndBelongsToMany ( User, { as: "contacts" } );
	// User.hasMany ( Todo, { as: "todos", foreignKey: "creator" } );
	// Privacy.hasMany ( Todo, { as: "todos", foreignKey: "privacy" } );
	// Status.hasMany ( Todo, { as: "todos", foreignKey: "status" } );



	// add authentication models
	require ( "./oauth" ) ( waterline, adapter );

	var adapters = { };
	adapters[adapter.name] = adapter;
	waterline.initialize ( { adapters: adapters }, function ( err, collections ) {
		if ( err ) return callback ( [ err ] );

		var status = [];
		for ( var k in conf.status ) status.push ( { name: conf.status[k] } );

		var privacies = [];
		for ( var k in conf.privacies ) privacies.push ( { name: conf.privacies[k] } );

		var chainerCount = new QueryChainer ( );
		var chainerAdd = new QueryChainer ( );

		chainerCount.add ( collections.status, "count", function ( err, count ) {
			if ( err ) return;
			if ( count == conf.status.length ) return;
			chainerAdd.add ( collections.status, "findOrCreateEach", null, status, status );
		}, { name: conf.status } );

		chainerCount.add ( collections.privacies, "count", function ( err, count ) {
			if ( err ) return;
			if ( count == conf.privacies.length ) return;
			chainerAdd.add ( collections.privacies, "findOrCreateEach", null, privacies, privacies );
		}, { name: conf.privacies } );

		chainerCount.run ( function ( errors ) {
			if ( errors ) return callback ( errors );
			chainerAdd.run ( function ( errors ) {
				if ( errors ) return callback ( errors );
				callback ( null, collections );
			} );
		} );
	} );
}