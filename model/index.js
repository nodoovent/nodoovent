var Sequelize = require ( "Sequelize" );


module.exports.init = function ( conf, callback ) {

	var dbengine = conf[conf.dbengine];
	var sequelize = new Sequelize ( dbengine.database, dbengine.username, dbengine.password, dbengine.conf );

	// Models for nodoovent
	var Comment = require ( "./comment" ) ( sequelize );
	var Group = require ( "./group" ) ( sequelize );
	var Privacy = require ( "./privacy" ) ( sequelize );
	var Status = require ( "./status" ) ( sequelize );
	var Tag = require ( "./tag" ) ( sequelize );
	var Todo = require ( "./todo" ) ( sequelize );
	var TodosList = require ( "./todolist" ) ( sequelize );
	var User = require ( "./user" ) ( sequelize );

	// Associations for nodoovent
	User.hasMany ( User, { as: "contact", foreignKey: "userId", joinTableName: "Contacts" } );
	User.hasMany ( Group );
	User.hasMany ( Todo );
	User.hasMany ( Comment ); 

	Todo.hasMany ( User );
	Todo.hasMany ( Tag );
	Todo.hasMany ( Comment );
	Todo.belongsTo ( User );

	Tag.hasMany ( Todo );

	Comment.belongsTo ( Todo, { as: "Todos" } );

	Status.hasMany ( Todo );

	Group.hasMany ( User );
	Group.hasMany ( Todo );
	Group.belongsTo ( User, { as: "administrator" } );

	Privacy.hasOne ( Todo, { as: "privacy" } );

	TodosList.belongsTo ( User, {as: "Creator" } );

	// Sync nodoovent model with database
	var chainer = new Sequelize.Utils.QueryChainer;
	chainer.add ( Comment.sync ( ) );
	chainer.add ( Group.sync ( ) );
	chainer.add ( Privacy.sync ( ) );
	chainer.add ( Status.sync ( ) );
	chainer.add ( Tag.sync ( ) );
	chainer.add ( Todo.sync ( ) );
	chainer.add ( TodosList.sync ( ) );
	chainer.add ( User.sync ( ) );

	var model = { Comment: Comment, Group: Group, Privacy: Privacy, Status: Status,
					Tag: Tag, Todo: Todo, TodosList: TodosList, User: User };


	// Models for oauth
	model = require ( "./oauth" ) ( sequelize, model, chainer );

	model.sequelize = sequelize;

	var syncDb = function ( err ) {
		if ( err ) return callback ( err );
		// insert default Status and Privacies values
		var chainer = new Sequelize.Utils.QueryChainer;
		model.Status.count ( ).success ( function ( count ) {
			if ( count == 0 ) {
				var status = [  "Created", "In Progress", "Done", "Canceled", "In Development", "Rejected" ];
				for ( var i in status )
					chainer.add ( Status.create ( { name: status[i] } ) );
			}
			model.Privacy.count ( ).success ( function ( count ) {
				if ( count == 0 ) {
					var privacies = [ "Public", "Private" ];
					for ( var i in privacies )
						chainer.add ( Privacy.create ( { name: privacies[i] } ) );
				}
				chainer.run ( ).success ( function ( ) { callback ( ); } ).error ( function ( err ) { callback ( err ); } );
			} );
		} );
	};

	chainer.run ( ).success ( function ( ) { syncDb ( ); } ).error ( function ( err ) { syncDb ( err ); } ); 

	return model;
}