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
			// get paticipant todos
			var query = req.user.getTodoes ( );
			query.success ( function ( todos ) {
				var _todos = todos;
				// get author todos
				var query = self.model.Todo.findAll ( { where: { UserId: req.user.id } } );
				query.success ( function ( todos ) {
					_todos.push ( todos );
					res.send ( _todos );
				} );
			} );
		}
	];

}