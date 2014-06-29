var should = require ( "should" );
var shouldHTTP = require ( "should-http" );
var supertest = require ( "supertest" );
var oauth = require ( "oauth" );
var OAuth = oauth.OAuth;

var UtilsTest = require ( "./utils-test" );
var addUserAndOAuth1AccessToken = UtilsTest.addUserAndOAuth1AccessToken;

var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;
var QueryChainer = Utils.QueryChainer;

module.exports = function ( nodoovent, url ) {

	var testPrivacyTodo = function ( data, privacy ) {
		data.should.have.property ( "privacy" );
		data.privacy.should.have.property ( "id" );
		if ( arguments.length > 1 ) data.privacy.should.have.property ( "name", privacy );
		else data.privacy.should.have.property ( "name" );
	}

	var testStatusTodo = function ( data, status ) {
		data.should.have.property ( "status" );
		data.status.should.have.property ( "id" );
		if ( arguments.length > 1 ) data.status.should.have.property ( "name", status );
		else data.status.should.have.property ( "name" );
	}

	var testAuthorTodo = function ( data, author ) {
		data.should.have.property ( "author" );
		if ( arguments.length > 1 ) {
			data.author.should.have.property ( "id", author.id );
			data.author.should.have.property ( "login", author.login );
			data.author.should.have.property ( "firstName", author.firstName );
			data.author.should.have.property ( "lastName", author.lastName );
			data.author.should.have.property ( "email", author.email );
		} else {
			data.author.should.have.property ( "id" );
			data.author.should.have.property ( "login" );
			data.author.should.have.property ( "firstName" );
			data.author.should.have.property ( "lastName" );
			data.author.should.have.property ( "email" );
		}
	}

	describe ( "Test /todos, /user/:userid/todos and /todos/:id end points:", function ( ) {

		var peterpan = null;
		var oauth1client = null;
		var oauth1accesstoken = null;

		before ( function ( callback ) {
			var user = { firstName: "Peter", lastName: "Pan", login: "peterpan", email: "peter.pan@neverland.com", password: "lostboys" };
			addUserAndOAuth1AccessToken ( nodoovent, user, function ( err, user, client, accessToken ) {
				if ( err ) return callback ( err );
				peterpan = user;
				oauth1client = client;
				oauth1accesstoken = accessToken;
				callback ( );
			} );
		} );

		describe ( "/todos", function ( ) {

			describe ( "Request /todos endpoint without oauth1 authentication", function ( ) {

				it ( "POST /todos return 401", function ( callback ) {
					var date = new Date ( new Date ( ).getTime ( ) + 120000 );
					var dueAt = DateHelper.date2string ( date );
					var todo = { name: "Find Lost Boys", description: "Find new mates for my Lost Boys", dueAt: dueAt };
					var req = supertest ( url ).post ( "/todos" ).send ( todo );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

				it ( "GET /todos return 401", function ( callback ) {
					var req = supertest ( url ).get ( "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

				it ( "PUT /todos return 404", function ( callback ) {
					var req = supertest ( url ).put ( "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "DELETE /todos return 404", function ( callback ) {
					var req = supertest ( url ).del ( "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

			} );

			describe ( "POST /todos with oauth1 authentication", function ( ) {

				var oauth = null;
				var accesstoken = "";
				var accesssecret = "";

				before ( function ( ) {
					oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
					accesstoken = oauth1accesstoken.token;
					accesssecret = oauth1accesstoken.secret;
				} );

				it ( "should create a new todo", function ( callback ) {
					var date = new Date ( new Date ( ).getTime ( ) + 120000 );
					var dueAt = DateHelper.date2string ( date );
					var todo = { name: "Find Lost Boys", description: "Find new mates for my Lost Boys", dueAt: dueAt };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", todo.description );
						data.should.have.property ( "dueAt", todo.dueAt );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Private" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should create todo with same name", function ( callback ) {
					var date = new Date ( new Date ( ).getTime ( ) + 12035269 );
					var dueAt = DateHelper.date2string ( date );
					var todo = { name: "Find Lost Boys", description: "A Todo with a name already existed", dueAt: dueAt };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", todo.description );
						data.should.have.property ( "dueAt", todo.dueAt );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Private" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should create todo without due date", function ( callback ) {
					var todo = { name: "Find Lost Boys", description: "A Todo with a name already existed" };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", todo.description );
						data.should.have.property ( "dueAt", null );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Private" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should create todo without description", function ( callback ) {
					var todo = { name: "Find Lost Boys" };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", null );
						data.should.have.property ( "dueAt", null );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Private" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should create private todo", function ( callback ) {
					var todo = { name: "Private todo", description: "a testing private todo", privacy: 2 };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", todo.description );
						data.should.have.property ( "dueAt", null );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Private" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should create public todo", function ( callback ) {
					var todo = { name: "Public todo", description: "a testing public todo", privacy: 1 };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 201 );
						res.should.be.json;
						data.should.have.property ( "id" );
						data.should.have.property ( "name", todo.name );
						data.should.have.property ( "description", todo.description );
						data.should.have.property ( "dueAt", null );
						data.should.have.property ( "createdAt" );
						data.should.have.property ( "updatedAt" );
						testPrivacyTodo ( data, "Public" );
						testStatusTodo ( data, "Created" );
						testAuthorTodo ( data, peterpan );
						callback ( );
					} );
				} );

				it ( "should not create todo without name", function ( callback ) {
					var date = new Date ( new Date ( ).getTime ( ) + 12035269 );
					var dueAt = DateHelper.date2string ( date );
					var todo = { description: "A Todo with a name already existed", dueAt: dueAt };
					oauth.post ( url + "/todos", accesstoken, accesssecret, todo, null, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						data = JSON.parse ( data );
						res.should.have.status ( 200 );
						res.should.be.json;
						data.should.have.property ( "result", "error" );
						data.should.have.property ( "error" );
						callback ( );
					} );
				} );

			} );

			describe ( "GET /todos with oauth1 authentication", function ( ) {

				var oauth = null;
				var accesstoken = "";
				var accesssecret = "";
				var alltodos = null;
				var cpttodos = 0;

				before ( function ( callback ) {
					// prepare oauth client
					oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
					accesstoken = oauth1accesstoken.token;
					accesssecret = oauth1accesstoken.secret;

					// create new user to populate todos with him
					var user = { firstName: "James", lastName: "Hook", login: "captainhook", email: "captain.hook@jollyroger.com", password: "tictac" };
					var models = nodoovent.models;
					models.users.create ( user, function ( err, user ) {
						if ( err ) return callback ( new Error ( err ) );
						var todos = [
							{ name: "Catch Peter Pan", description: null, dueAt: null, status: 1, privacy: 1, author: user.id },
							{ name: "Escape to the crocodile", description: null, dueAt: null, status: 1, privacy: 2, author: user.id }
						];
						models.todos.create ( todos, function ( err, todos ) {
							if ( err ) return callback ( new Error ( err ) );
							// get all todos and count todos user peter pan can see ...
							models.todos.find ( ).exec ( function ( err, todos ) {
								if ( err ) return callback ( new Error ( err ) );
								alltodos = todos;
								for ( var i in todos ) {
									if ( todos[i].author == peterpan.id ) cpttodos++;
									else if ( todos[i].privacy == 2 ) cpttodos++;
								}
								callback ( );
							} );
						} );
					} );			
				} );

				it ( "should have todos list", function ( callback ) {
					oauth.get ( url + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						res.should.have.status ( 200 );
						res.should.be.json;
						data = JSON.parse ( data );
						data.should.be.an.Array;
						data.length.should.be.equal ( cpttodos );
						for ( var i in data ) {
							data[i].should.have.property ( "id" );
							data[i].should.have.property ( "name" );
							data[i].should.have.property ( "description" );
							data[i].should.have.property ( "dueAt" );
							data[i].should.have.property ( "createdAt" );
							data[i].should.have.property ( "updatedAt" );
							testPrivacyTodo ( data[i] );
							testStatusTodo ( data[i] );
							testAuthorTodo ( data[i] );
							if ( data[i].author.id != peterpan.id ) data[i].privacy.id.should.be.equal ( 1 );
						}
						callback ( );
					} )
				} );

			} );

			describe ( "PUT and DELETE /todos with oauth1 authentication", function ( ) {

				var oauth = null;
				var accesstoken = "";
				var accesssecret = "";

				before ( function ( ) {
					oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
					accesstoken = oauth1accesstoken.token;
					accesssecret = oauth1accesstoken.secret;
				} );

				it ( "DELETE /todos return 404", function ( callback ) {
					oauth.delete ( url + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "PUT /todos return 404", function ( callback ) {
					oauth.put ( url + "/todos", accesstoken, accesssecret, null, null, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

			} );

		} );

		describe ( "/user/:id/todos", function ( ) {

			describe ( "request /user/:id/todos endpoint without oauth1 authentication", function ( ) {

				it ( "POST /user/:id/todos return 404", function ( callback ) {
					var req = supertest ( url ).post ( "/user/" + peterpan.id + "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "GET /user/:id/todos return 401", function ( callback ) {
					var req = supertest ( url ).get ( "/user/" + peterpan.id + "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

				it ( "PUT /user/:id/todos return 404", function ( callback ) {
					var req = supertest ( url ).put ( "/user/" + peterpan.id + "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "DELETE /user/:id/todos return 404", function ( callback ) {
					var req = supertest ( url ).del ( "/user/" + peterpan.id + "/todos" );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

			} );

			describe ( "POST, PUT and DELETE /user/:id/todos endpoint with oauth1 authentication", function ( ) {

				var oauth = null;
				var accesstoken = "";
				var accesssecret = "";

				before ( function ( ) {
					oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
					accesstoken = oauth1accesstoken.token;
					accesssecret = oauth1accesstoken.secret;
				} );

				it ( "DELETE /todos return 404", function ( callback ) {
					oauth.delete ( url + "/user/" + peterpan.id + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "PUT /todos return 404", function ( callback ) {
					oauth.put ( url + "/user/" + peterpan.id + "/todos", accesstoken, accesssecret, null, null, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "POST /todos return 404", function ( callback ) {
					oauth.post ( url + "/user/" + peterpan.id + "/todos", accesstoken, accesssecret, null, null, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

			} );

			describe ( "GET /user/:id/todos end point with oauth1 authentication", function ( ) {

				var tinkerbell = null;
				var tinkerbellPublicTodos = [ ];
				var peterpanTodos = [ ];
				var nobodyId = 1;

				var oauth = null;
				var accesstoken = "";
				var accesssecret = "";

				before ( function ( callback ) {
					// init oauth1 client
					oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
					accesstoken = oauth1accesstoken.token;
					accesssecret = oauth1accesstoken.secret;

					// create new user and populate todos ...
					var user = { firstName: "Tinker", lastName: "Bell", login: "tinkerbell", email: "tinkerbell@neverland.com", password: "fairy" };
					var models = nodoovent.models;
					models.users.create ( user, function ( err, user ) {
						if ( err ) return callback ( new Error ( err ) );
						tinkerbell = user;
						var todos = [
							{ name: "cook fairy powder", description: null, dueAt: null, status: 1, privacy: 1, author: user.id },
							{ name: "help peter pan", description: null, dueAt: null, status: 1, privacy: 2, author: user.id },
							{ name: "fly in the sky", description: null, dueAt: null, status: 1, privacy: 1, author: user.id }
						];

						models.todos.create ( todos, function ( err, todos ) {
							if ( err ) return callback ( new Error ( err ) );

							// get Public todos for tinkerbell and todos for peterpan
							var chainer = new QueryChainer ( );

							chainer.add ( models.todos, "find", function ( err, todos ) {
								if ( err ) return callback ( new Error ( err ) );
								tinkerbellPublicTodos = todos;
							}, { author: tinkerbell.id, privacy: 1 } );

							chainer.add ( models.todos, "find", function ( err, todos ) {
								if ( err ) return callback ( new Error ( err ) );
								peterpanTodos = todos;
							}, { author: peterpan.id } );

							chainer.add ( models.users, "find", function ( err, users ) {
								if ( err ) return callback ( new Error ( err ) );
								for ( var i in users ) {
									if ( users[i].id == nobodyId )
										nobodyId = users[i].id + 1;
								}
							} );

							chainer.run ( function ( errors ) {
								if ( errors ) return callback ( new Error ( errors ) );
								callback ( );
							} );
						} );

					} );
				} );

				it ( "with user id authenticated", function ( callback ) {
					oauth.get ( url + "/user/" + peterpan.id + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						res.should.have.status ( 200 );
						res.should.be.json;
						data = JSON.parse ( data );
						data.should.be.an.Array;
						data.length.should.be.equal ( peterpanTodos.length );
						for ( var i in data ) {
							data[i].should.have.property ( "id" );
							data[i].should.have.property ( "name" );
							data[i].should.have.property ( "description" );
							data[i].should.have.property ( "dueAt" );
							data[i].should.have.property ( "createdAt" );
							data[i].should.have.property ( "updatedAt" );
							testPrivacyTodo ( data[i] );
							testStatusTodo ( data[i] );
							testAuthorTodo ( data[i], peterpan );
						}
						callback ( );
					} );
				} );

				it ( "with user id different that the current authenticated id", function ( callback ) {
					oauth.get ( url + "/user/" + tinkerbell.id + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
						res.should.have.status ( 200 );
						res.should.be.json;
						data = JSON.parse ( data );
						data.should.be.an.Array;
						data.length.should.be.equal ( tinkerbellPublicTodos.length );
						for ( var i in data ) {
							data[i].should.have.property ( "id" );
							data[i].should.have.property ( "name" );
							data[i].should.have.property ( "description" );
							data[i].should.have.property ( "dueAt" );
							data[i].should.have.property ( "createdAt" );
							data[i].should.have.property ( "updatedAt" );
							testPrivacyTodo ( data[i], "Public" );
							testStatusTodo ( data[i] );
							testAuthorTodo ( data[i], tinkerbell );
						}
						callback ( );
					} );
				} );

				it ( "with not existed user id get 404 HTTP status", function ( callback ) {
					oauth.get ( url + "/user/" + nobodyId + "/todos", accesstoken, accesssecret, function ( err, data, res ) {
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

			} );

		} );

		describe ( "/todos/:id", function ( ) {

			var todoId = null;

			before ( function ( callback ) {
				nodoovent.models.todos.find ( ).limit ( 1 ).exec ( function ( err, todo ) {
					if ( err ) return callback ( new Error ( err ) );
					todoId = todo.id;
					callback ( );
				} );
			} );

			describe ( "request /todos/:id endpoint without oauth1 authentication", function ( ) {

				it ( "POST /user/:id/todos return 404", function ( callback ) {
					var req = supertest ( url ).post ( "/todos/" + todoId );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 404 );
						callback ( );
					} );
				} );

				it ( "GET /todos/:id return 401", function ( callback ) {
					var req = supertest ( url ).get ( "/todos/" + todoId );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

				it ( "PUT /todos/:id return 401", function ( callback ) {
					var req = supertest ( url ).put ( "/todos/" +todoId );
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

				it ( "DELETE /todos/:id return 401", function ( callback ) {
					var req = supertest ( url ).del ( "/todos/" + todoId);
					req.end ( function ( err, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

			} );

		} );

	} );
	
}