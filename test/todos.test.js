var should = require ( "should" );
var supertest = require ( "supertest" );
var oauth = require ( "oauth" );
var OAuth = oauth.OAuth;

var UtilsTest = require ( "./utils-test" );
var addUserAndOAuth1AccessToken = UtilsTest.addUserAndOAuth1AccessToken;

var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;

module.exports = function ( nodoovent, url ) {

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
					console.log(data);
					if ( err ) return callback ( new Error ( "[" + err.statusCode + "] " + err.data ) );
					data = JSON.parse ( data );
					data.should.have.property ( "name", todo.name );
					data.should.have.property ( "description", todo.description );
					data.should.have.property ( "dueAt", todo.dueAt );
					data.should.have.property ( "createdAt", todo.createdAt );
					data.should.have.property ( "modifiedAt", todo.modifiedAt );
					callback ( );
				} );
			} );

		} );

	} );
	
}