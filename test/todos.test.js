var should = require ( "should" );
var supertest = require ( "supertest" );
var oauth = require ( "oauth" );
var OAuth = oauth.OAuth;

var UtilsTest = require ( "./utils-test" );
var addUserAndOAuth1AccessToken = UtilsTest.addUserAndOAuth1AccessToken;

var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;

module.exports = function ( nodoovent, url ) {

	var testPrivacyTodo = function ( data, privacy ) {
		data.should.have.property ( "privacy" );
		data.privacy.should.have.property ( "id" );
		data.privacy.should.have.property ( "name", privacy );
	}

	var testStatusTodo = function ( data, status ) {
		data.should.have.property ( "status" );
		data.status.should.have.property ( "id" );
		data.status.should.have.property ( "name", status );
	}

	var testAuthorTodo = function ( data, author ) {
		data.should.have.property ( "author" );
		data.author.should.have.property ( "id", author.id );
		data.author.should.have.property ( "login", author.login );
		data.author.should.have.property ( "firstName", author.firstName );
		data.author.should.have.property ( "lastName", author.lastName );
		data.author.should.have.property ( "email", author.email );
	}

	describe ( "Test /todos and /users/id/todos end points:", function ( ) {

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

		describe ( "request /todos endpoint without oauth1 authentication", function ( ) {

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

			before ( function ( ) {
				oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
				accesstoken = oauth1accesstoken.token;
				accesssecret = oauth1accesstoken.secret;
			} );

		} );

	} );
	
}