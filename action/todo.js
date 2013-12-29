var passport = require ( "passport" );

var oauth1tokenstrategy = require ( "../auth/oauth1tokenstrategy" ).name;


module.exports = function ( schema, auth ) {
	var self = this;

	self.schema = schema;
	self.auth = auth;

	var Todo = schema.models.Todo;

	self.create = [	// add a todo to the authenticate user
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var todo = {
				name: req.param ( "name" ),
				description: req.param ( "description" ),
				dueAt: req.param ( "dueDate" ),
				creator: req.user.id,
				privacy: req.param ( "privacy" ) ? req.param ( "privacy" ) : 2, // add conf.privacies Private id ???
				status: 1 // add conf.status Created id ???
			};
			// create the todo
			Todo.create ( todo, function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.status ( 201 ).send ( todo );
			} );
		}
	];

	self.userList = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			var userid = req.param ( "userid" );
			var where = { user: userid };
			if ( userid != req.user.id )
				where.privacy = 1; // add conf.privacies Public id ???
			Todo.all ( { where: where }, function ( err, todos ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( todos );
			} );
		}
	];

	self.getById = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			Todo.find ( req.param ( "id" ), function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.privacy == 2 && todo.user != req.user.id ) return res.status. ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
				res.send ( todo );
			} );
		}
	];

	self.delete = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			Todo.find ( req.param ( "id" ), function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.user != req.user.id ) return res.status. ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
				todo.destroy ( function ( err ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.send ( { result: "ok" } );
				} );
			} );
		}
	];

	self.update = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {
			Todo.find ( req.param ( "id" ), function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( !todo ) return res.status ( 404 ).send ( );
				if ( todo.user != req.user.id ) return res.status. ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );

				if ( req.param ( "name" ) ) todo.name = req.param ( "name" );
				if ( req.param ( "description" ) ) todo.description = req.param ( "description" );
				if ( req.param ( "dueDate" ) ) todo.dueDate = req.param ( "dueDate" );
				if ( req.param ( "status" ) ) todo.status = req.param ( "status" );
				if ( req.param ( "privacy" ) ) todo.privacy = req.param ( "privacy" );
				todo.updatedAt = new Date ( );

				todo.save ( function ( err, todo ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.send ( todo );
				} );
			} );
		}
	];

	self.list = [
		passport.authenticate ( oauth1tokenstrategy, { session: false } ),
		function ( req, res ) {

		}
	];

}