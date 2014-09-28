var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;

module.exports = function ( models, auth ) {
	var self = this;

	self.models = models;
	self.auth = auth;

	var Todos = models.todos;
	var Users = models.users;

	self.create = function ( req, res ) { // add a todo to the authenticate user
		var dueAt = req.param ( "dueAt" );
		if ( dueAt === "" ) dueAt = null;
		var privacy = req.param ( "privacy" );
		var todo = {
			name: req.param ( "name" ),
			description: req.param ( "description" ),
			dueAt: dueAt,
			author: req.user.id,
			privacy: ( privacy || privacy == 1 || privacy == 2 ) ? privacy : 2,
			status: 1 // add conf.status Created id ???
		};
		// create the todo
		Todos.create ( todo, function ( err, todo ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			Todos.findOne ( todo.id ).populate ( "privacy" ).populate ( "status" ).populate ( "author" ).exec ( function ( err, todo ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.status ( 201 ).send ( todo );
			} );
		} );
	};

	self.userList = function ( req, res ) {
		// get user
		var userid = req.param ( "userid" );
		Users.findOne ( userid ).exec ( function ( err, user ) {
			if ( err ) return res.status ( 500 ).send ( { result: "error", error: err } );
			if ( !user ) return res.status ( 404 ).send ( );
			// get todos list
			var where = { author: userid };
			if ( userid != req.user.id )
				where.privacy = 1; // add conf.privacies Public id ???
			Todos.find ( ).where ( where ).populate ( "privacy" ).populate ( "status" ).populate ( "author" ).exec ( function ( err, todos ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( todos );
			} );
		} );
	};

	self.getById = function ( req, res ) {
		Todos.findOne ( req.param ( "id" ) ).populate ( "privacy" ).populate ( "status" ).populate ( "author" ).exec ( function ( err, todo ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			if ( !todo ) return res.status ( 404 ).send ( );
			if ( todo.privacy.id == 2 && todo.author.id != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
			res.send ( todo );
		} );
	};

	self.delete = function ( req, res ) {
		Todos.findOne ( req.param ( "id" ) ).exec ( function ( err, todo ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			if ( !todo ) return res.status ( 404 ).send ( );
			if ( todo.author != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );
			todo.destroy ( function ( err ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				res.send ( { result: "ok" } );
			} );
		} );
	};

	self.update = function ( req, res ) {
		Todos.findOne ( req.param ( "id" ) ).exec ( function ( err, todo ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			if ( !todo ) return res.status ( 404 ).send ( );
			if ( todo.author != req.user.id ) return res.status ( 403 ).send ( { result: "error", error: "You're not authorize to read this todo" } );

			// do not have id to update
			delete todo.id;
			if ( req.param ( "name" ) ) todo.name = req.param ( "name" );
			if ( req.param ( "description" ) ) todo.description = req.param ( "description" );
			if ( req.param ( "dueAt" ) ) todo.dueAt = req.param ( "dueAt" );
			if ( req.param ( "status" ) ) todo.status = req.param ( "status" );
			if ( req.param ( "privacy" ) ) todo.privacy = req.param ( "privacy" );

			Todos.update ( { id: req.param ( "id" ) }, todo, function ( err, todos ) {
				if ( err ) return res.send ( { result: "error", error: err } );
				if ( todos.length != 1 ) return res.senf ( { result: "error", error: "Todo id " + req.param ( "id" ) + " not exist." } );
				var todo = todos[0];
				Todos.findOne ( todos[0].id ).populate ( "privacy" ).populate ( "status" ).populate ( "author" ).exec ( function ( err, todo ) {
					if ( err ) return res.send ( { result: "error", error: err } );
					res.send ( todo );
				} );
			} );
		} );
	};

	self.list = function ( req, res ) {
		Todos.find ( ).where ( { or: [ { privacy: 1 }, { author: req.user.id } ] } ).populate ( "privacy" )
		.populate ( "status" ).populate ( "author" ).exec ( function ( err, todos ) {
			if ( err ) return res.send ( { result: "error", error: err } );
			res.send ( todos );
		} );
	}

}