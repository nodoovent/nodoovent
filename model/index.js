var Sequelize = require ( "Sequelize" );
var conf = require ( "../conf" ).db;


module.exports.init = function ( ) {

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

	Todo.hasMany ( User, { as: "participants" } );
	Todo.hasMany ( Tag, { as: "tags" } );
	Todo.hasMany ( Comment, { as: "Comments" } );
	Todo.belongsTo ( Status, { as: "currentStatus" } );
	Todo.belongsTo ( User, { as: "creator" } );

	Tag.hasMany ( Todo );

	Comment.belongsTo ( Todo, { as: "Todos" } );

	Status.hasMany ( Todo );

	Group.hasMany ( User );
	Group.hasMany ( Todo );
	Group.hasOne ( Todo, { as: "group" } );
	Group.belongsTo ( User, { as: "administrator" } );

	Privacy.hasOne ( Todo, { as: "privacy" } );

	TodosList.belongsTo ( User, {as: "Creator" } );

	// Sync nodoovent model with database
	Comment.sync ( );
	Group.sync ( );
	Privacy.sync ( );
	Status.sync ( );
	Tag.sync ( );
	Todo.sync ( );
	TodosList.sync ( );
	User.sync ( );

	var model = { Comment: Comment, Group: Group, Privacy: Privacy, Status: Status,
					Tag: Tag, Todo: Todo, TodosList: TodosList, User: User };


	// Models for oauth
	model = require ( "./oauth" ) ( sequelize, model );

	model.sequelize = sequelize;

	return model;
}