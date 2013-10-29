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
				query.success ( function ( todo ) { 
					// if no tag respond else add tags to todo
					if ( !req.param ( "tags" ) ) res.send ( todo ); 
					else {
						var chainer = new QueryChainer;
						var ptags = req.param ( "tags" );
						for ( var i in ptags )
							chainer.add ( self.model.Tag.create ( { tag: ptags[i] } ) );
						var f = function ( ) {
							todo.tags = ptags;
							var query = self.model.Tag.findAll ( { where: { tag: ptags } } );
							query.success ( function ( tags ) {
								var query = todo.setTags ( tags );
								query.success ( function ( tags ) { res.send ( todo ); } );
							} );
						};
						chainer.run ( ).error ( f ).success ( f );
					}
				} );
			} );
		}
	];

	self.userList = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var sql = "SELECT t.id, t.name, t.description, t.dueDate, t.createdAt, t.updatedAt, t.UserId 'author', "
					+ "t.StatuId 'status', t.PrivacyId 'privacy', tag.tag "
					+ "FROM todo t "
					+ "LEFT JOIN tagtodo tt ON tt.TodoId = t.id "
					+ "LEFT JOIN tag ON tag.id = tt.TagId "
					+ "WHERE t.UserId = :userid "
					+ "OR t.id IN ( SELECT TodoId FROM TodoUser WHERE UserId = :userid )";
			var query = self.model.sequelize.query ( sql, null, { raw: true }, { userid: req.param ( "userid" ) } );
			query.success ( function ( todos ) {
				// adjust object return : delete repetitive elements, join tags of repetitive elements into one arra
				var l = todos.length;
				for ( var i = 0; i < l; i++ ) {
					var todo = todos[i];
					if ( i == 0 ) {
						if ( todo.tag )
							todo.tags = [ todo.tag ];
						delete todo.tag;
					} else if ( todo.id != todos[i-1].id ) { // if element is the first occurence trans tag on an array contain the tag
						todo.tags = [ todo.tag ];
						delete todo.tag;
					} else { // else add tag into the tags array of the first occurence and delete the element
						todos[i-1].tags.push ( todo.tag );
						todos.splice ( i, 1 );
						l = todos.length;
						i--;
					}
				}
				res.send ( todos );
			} );
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var todoid = req.param ( "id" );
			var sql = "SELECT t.id, t.name, t.description, t.dueDate, t.createdAt, t.updatedAt, t.UserId 'author', "
					+ "t.StatuId 'status', t.PrivacyId 'privacy', tag.tag "
					+ "FROM todo t "
					+ "LEFT JOIN tagtodo tt ON tt.TodoId = t.id "
					+ "LEFT JOIN tag ON tag.id = tt.TagId "
					+ "WHERE t.id = :todoid ";
			var query = self.model.sequelize.query ( sql, null, { raw: true }, { todoid: todoid } );
			query.success ( function ( todos ) {
				if ( todos.length > 0 ) {
					var todo = todos[0];
					if ( todo.tag ) {
						todo.tags = [ todo.tag ];
						for ( var i = 1; i < todos.length; i++ )
							todo.tags.push ( todos[i].tag );
					}
					delete todo.tag;
					res.send ( todo );
				} else res.send ( { result: "error", error: "Todo " + todoid + " not exist" } );
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
					query.success ( function ( todo ) {
						var query = todo.getTags ( );
						query.success ( function ( tags ) {
							var _todo = todo.toJSON ( );
							if ( tags.length > 0 ) {
								_todo.tags = [ ];
								for ( var i in tags ) _todo.tags.push ( tags[i].dataValues.tag );
							}
							res.send ( _todo );
						} );
					} );
				} else res.send ( { result: "error", error: "You're not authorize to update this todo" } );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var sql = "SELECT t.id, t.name, t.description, t.dueDate, t.createdAt, t.updatedAt, t.UserId 'author', "
					+ "t.StatuId 'status', t.PrivacyId 'privacy', tag.tag "
					+ "FROM todo t "
					+ "LEFT JOIN tagtodo tt ON tt.TodoId = t.id "
					+ "LEFT JOIN tag ON tag.id = tt.TagId "
					+ "WHERE ( t.UserId <> :userid AND t.PrivacyId in ( SELECT id FROM Privacy WHERE name = 'Public' ) ) "
					+ "OR t.UserId = :userid";
			var query = self.model.sequelize.query ( sql, null, { raw: true }, { userid: req.user.id } );
			query.success ( function ( todos ) {
				// adjust object return : delete repetitive elements, join tags of repetitive elements into one arra
				var l = todos.length;
				for ( var i = 0; i < l; i++ ) {
					var todo = todos[i];
					if ( i == 0 ) {
						if ( todo.tag )
							todo.tags = [ todo.tag ];
						delete todo.tag;
					} else if ( todo.id != todos[i-1].id ) { // if element is the first occurence trans tag on an array contain the tag
						todo.tags = [ todo.tag ];
						delete todo.tag;
					} else { // else add tag into the tags array of the first occurence and delete the element
						todos[i-1].tags.push ( todo.tag );
						todos.splice ( i, 1 );
						l = todos.length;
						i--;
					}
				}
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