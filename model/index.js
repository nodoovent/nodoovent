// var Schema = require ( "jugglingdb" ).Schema;
// var QueryChainer = require ( "../utils" ).QueryChainer;

var Waterline = require ( "waterline" );
var _ = require ( "lodash" );

var Utils = require ( "../utils/" );
var QueryChainer = Utils.QueryChainer;

var Privacy = require ( "./privacy" );
var Status = require ( "./status" );
var Todo = require ( "./todo" );
var User = require ( "./User" );
var OAuth = require ( "./oauth/" );

module.exports.init = function ( conf, callback ) {

	callback = callback || function ( ) { };

	var defaultAdapter = conf.db.defaultAdapter;
	var adapters = { "default": require ( conf.db.adapters[defaultAdapter] ) };
	for ( var adapter in conf.db.adapters )
		adapters[adapter] = require ( conf.db.adapters[adapter] );

	var conn = conf.db.connections;
	var connections = { };
	for ( var i in conf.db.connections )
		connections[conn[i]] = conf.db[conn[i]];

	var waterline = new Waterline ( );


	// var schema = new Schema ( conf.db.engine, conf.db[conf.db.engine] );
	// var chainer = new QueryChainer ( );

	// Models for Nodoovent
	// var Comment = require ( "./comment" ) ( schema );
	// var Group = require ( "./group" ) ( schema );
	Privacy ( waterline, adapter, conf );
	Status ( waterline, adapter, conf );
	// var Tag = require ( "./tag" ) ( schema );
	Todo ( waterline, adapter, conf );
	// var TodosList = require ( "./todolist" ) ( schema );
	User ( waterline, adapter, conf );



	// add authentication models
	OAuth ( waterline, adapter, conf );

	var options = { adapters: adapters, connections: connections };
	waterline.initialize ( options, function ( err, models ) {
		if ( err ) return callback ( [ err ] );

		var collections = models.collections;

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
				callback ( null, collections, models.connections );
			} );
		} );
	} );
}