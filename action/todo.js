var passport = require ( "passport" );
var QueryChainer = require ( "Sequelize" ).Utils.QueryChainer;

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.create = [	// add a todo to the authenticate user
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var todo = {
				name: req.param ( "name" ),
				description: req.param ( "description" ),
				dueDate: req.param ( "dueDate" ),
				UserId: req.user.id,
				PrivacyId: req.param ( "privacy" ) ? req.param ( "privacy" ) : 2, // default private privacy
				StatuId: 1 // add status created
			};
			// create the todo
			var query = self.model.Todo.create ( todo );
			query.success ( function ( todo ) {  
				// add authenticate user as participant
				var query = req.user.addTodo ( todo );
				query.success ( function ( todo ) { res.send ( todo ); } );
			} );
		}
	];

	self.userList = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			// get the user
			var query = self.model.User.find ( req.param ( "userid" ) );
			query.success ( function ( user ) {
				// get the author todos
				var query = user.getTodoes ( );
				query.success ( function ( todos ) { res.send ( todos ); } );
			} );
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.Todo.find ( req.param ( "id" ) );
			query.success ( function ( todo ) {
				if ( todo.PrivacyId == 2 ) res.send ( { result: "error", error: "You're not authorize to read this todo" } );
				else res.send ( todo );
			} );
		}
	];

	self.delete = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var todoid = req.param ( "id" );
			var query = self.model.Todo.find ( todoid );
			query.success ( function ( todo ) {
				if ( todo.UserId == req.user.id ) {
					var query = todo.destroy ( );
					query.success ( function ( ) { res.send ( { result: "ok" } ); } );
					query.error ( function ( err ) { res.send ( { result: "error", error: err } ); } );
				} else res.send ( { result: "error", error: "You're not authorize to delete this todo" } );
			} );
		}
	];

	self.update = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var todoid = req.param ( "id" );
			var query = self.model.Todo.find ( todoid );
			query.success ( function ( todo ) {
				if ( todo.UserId == req.user.id ) {
					if ( req.param ( "name" ) ) todo.name = req.param ( "name" );
					if ( req.param ( "description" ) ) todo.description = req.param ( "description" );
					if ( req.param ( "dueDate" ) ) todo.dueDate = req.param ( "dueDate" );
					if ( req.param ( "status" ) ) todo.StatuId = req.param ( "status" );
					if ( req.param ( "privacy" ) ) todo.PrivacyId = req.param ( "privacy" );
					var query = todo.save ( );
					query.success ( function ( todo ) { res.send ( todo ); } );
				} else res.send ( { result: "error", error: "You're not authorize to update this todo" } );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.Todo.findAll ( );
			query.success ( function ( todos ) {
				res.send ( todos );
			} );
		}
	];

	self.getTags = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var query = self.model.Todo.find ( req.param ( "id" ) );
			query.success ( function ( todo ) {
				var query = todo.getTags ( );
				query.success ( function ( tags ) {
					_tags = [ ];
					for ( var i in tags ) _tags.push ( tags[i].dataValues.tag );
					res.send ( _tags );
				} );
			} );
		}
	];

}