var should = require ( "should" );
var request = require ( "supertest" );
var OAuth = require ( "oauth" ).OAuth;
var uid = require ( "../utils" ).uid;

module.exports = function ( url ) {
	this.url = url;
	this.nodoovent = null;

	this.addUserAndOAuth1AccessToken = function ( user, callback ) {
		var models = this.nodoovent.schema.models;
		// create a test user and add an oauth1 access token
		models.User.create ( user, function ( err, user ) {
			if ( err ) return callback ( err )
			models.OAuth1Client.find ( 1, function ( err, client ) {
				if ( err ) return callback ( err );
				if ( !client ) return callback ( "No Client found" );
				var token = { token: uid ( 16 ), secret: uid ( 32 ), client: client.id, user: user.id };
				models.OAuth1AccessToken.create ( token, function ( err, token ) {
					if ( err ) return callback ( err );
					callback ( null, user, client, token );
				} );
			} );
		} );
	}
	
}

module.exports.prototype.test = function ( ) {
	var self = this;
	var url = self.url;

	describe ( "Test /user end points:", function ( ) {

		var sherlock = null;
		var oauth1accesstoken = null;
		var oauth1client = null;

		before ( function ( callback ) {
			var user = { firstName: "Sherlock", lastName: "Holmes", login: "sherlock", email: "sherlock.holmes@backerstreet.com", password: "adler" };
			self.addUserAndOAuth1AccessToken ( user, function ( err, user, client, accessToken ) {
				if ( err ) return callback ( err );
				sherlock = user;
				oauth1client = client;
				oauth1accesstoken = accessToken;
				callback ( );
			} );
		} );

		describe ( "POST /user end point", function ( ) {

			it ( "should have POST /user end point and create a new user", function ( callback ) {
				var user = { firstName: "John", lastName: "Doe", login: "jdoe", email: "john.doe@gmail.com", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( user );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "id", 2 );
					res.body.should.have.property ( "firstName", user.firstName );
					res.body.should.have.property ( "lastName", user.lastName );
					res.body.should.have.property ( "login", user.login );
					res.body.should.have.property ( "email", user.email );
					callback ( );
				} );
			} );

			it ( "should not add user with existing login", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: sherlock.login, email: "jack.doe@gmail.com", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user with an empty login", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "", email: "jack.doe@gmail.com", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user without a password", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "jackdoe", email: "jack.doe@gmail.com" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user with an empty password", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "jackdoe", email: "jack.doe@gmail.com", password: "" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user without a valid address mail", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "jackdoe", email: "jackgmailcom", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user with an empty address mail", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "jackdoe", email: "", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

			it ( "should not add user without an address mail", function ( callback ) {
				var jackDoe = { firstName: "Jack", lastName: "Doe", login: "jackdoe", password: "doe" };
				var req = request ( url ).post ( "/user" ).send ( jackDoe );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 200 );
					res.should.be.json;
					res.body.should.have.property ( "result", "error" );
					res.body.should.have.property ( "error" );
					callback ( );
				} );
			} );

		} );

		describe ( "GET, UPDATE and DELETE /user need an authentication", function ( ) {

			it ( "should have GET /user return 401 http code", function ( callback ) {
				var req = request ( url ).get ( "/user" ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 401 );
					callback ( );
				} );
			} );

			it ( "should have UPDATE /user return 401 http code", function ( callback ) {
				var req = request ( url ).put ( "/user" ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 401 );
					callback ( );
				} );
			} );

			it ( "should have DELETE /user return 401 http code", function ( callback ) {
				var req = request ( url ).del ( "/user" ).send ( );
				req.end ( function ( err, res ) {
					if ( err ) return callback ( err );
					res.should.have.status ( 401 );
					callback ( );
				} );
			} );

		} );

		describe ( "GET, UPDATE and DELETE /user end point with oauth1 authentication", function ( ) {		

			var oauth = null;
			var accesstoken = "";
			var accesssecret = "";

			before ( function ( ) {
				oauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  oauth1client.consumerKey, oauth1client.consumerSecret, "1.0", "", "HMAC-SHA1" );
				accesstoken = oauth1accesstoken.token;
				accesssecret = oauth1accesstoken.secret;
			} );

			describe ( "GET /user with oauth1 authentication", function ( ) {

				it ( "should have GET /user end point return authenticate user infos", function ( callback ) {
					oauth.get ( url + "/user", accesstoken, accesssecret, function ( err, data, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 200 );
						res.should.be.json;
						data = JSON.parse ( data );
						data.should.have.property ( "id", sherlock.id );
						data.should.have.property ( "login", sherlock.login );
						data.should.have.property ( "firstName", sherlock.firstName );
						data.should.have.property ( "lastName", sherlock.lastName );
						data.should.have.property ( "email", sherlock.email );
						data.should.not.have.property ( "password" );
						callback ( );
					} );
				} );

			} );

			describe ( "PUT /user with oauth1 authentication", function ( ) {

				describe ( "[should works]", function ( ) {

					afterEach ( function ( callback ) {
						self.nodoovent.schema.models.User.find ( sherlock.id, function ( err, user ) {
							if ( err ) return callback ( err );
							if ( !user ) return callback ( "No user foud" );
							sherlock = user;
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName", function ( callback ) {
						var user = { firstName: "John" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's lastName", function ( callback ) {
						var user = { lastName: "Watson" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's email", function ( callback ) {
						var user = { email: "john.watson@backerstreet.com" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's password", function ( callback ) {
						var user = { password: "mary" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName and lastName", function ( callback ) {
						var user = { firstName: "Sherlock", lastName: "Holmes" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName and email", function ( callback ) {
						var user = { firstName: "Mycroft", email: "mycroft.holmes@servicesecret.uk" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName and password", function ( callback ) {
						var user = { firstName: "Sherlock", password: "adler" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's lastName and email", function ( callback ) {
						var user = { lastName: "Moriarty", email: "sherlock.holmes@bakerstreet.com" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's lastName and password", function ( callback ) {
						var user = { lastName: "Holmes", password: "irene" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's email and password", function ( callback ) {
						var user = { email: "sherlock.holmes@21bbakerstreet.com", password: "elementary" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", sherlock.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName, lastName and email", function ( callback ) {
						var user = { email: "irene.adler@21bbakerstreet.com", firstName: "Irene", lastName: "Adler" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName, lastName and password", function ( callback ) {
						var user = { password: "johny", firstName: "Mary", lastName: "Morstan" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", sherlock.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's email, lastName and password", function ( callback ) {
						var user = { password: "watsy", email: "mary.watson@backerstreet.com", lastName: "Watson" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", sherlock.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

					it ( "should have PUT /user end point and update the user's firstName, lastName, email and password", function ( callback ) {
						var user = { password: "irene", email: "sherlock@21bbakerstreet.com", lastName: "Holmes", firstName: "Sherlock" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							res.should.be.json;
							data = JSON.parse ( data );
							data.should.have.property ( "id", sherlock.id );
							data.should.have.property ( "login", sherlock.login );
							data.should.have.property ( "firstName", user.firstName );
							data.should.have.property ( "lastName", user.lastName );
							data.should.have.property ( "email", user.email );
							callback ( );
						} );
					} );

				} );

				describe ( "[should not works]", function ( ) {

					it ( "should not update user with an empty password", function ( callback ) {
						var user = { password: "" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							data = JSON.parse ( data );
							data.should.have.property ( "result", "error" );
							data.should.have.property ( "error" );
							callback ( );
						} );
					} );

					it ( "should not update user with an empty address mail", function ( callback ) {
						var user = { email: "" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							data = JSON.parse ( data );
							data.should.have.property ( "result", "error" );
							data.should.have.property ( "error" );
							callback ( );
						} );
					} );

					it ( "should not update user with a not valid address mail", function ( callback ) {
						var user = { email: "sdfshqh5654rfq6z4gqfg5" };
						oauth.put ( url + "/user", accesstoken, accesssecret, user, null, function ( err, data, res ) {
							if ( err ) return callback ( err );
							res.should.have.status ( 200 );
							data = JSON.parse ( data );
							data.should.have.property ( "result", "error" );
							data.should.have.property ( "error" );
							callback ( );
						} );
					} );

				} );			

			} );

			describe ( "DELETE /user with an oauth1 authentication", function ( ) {
				
				var delusr = null;
				var delaccesstoken = null;
				var delaccesssecret = null;
				var deloauth = null;

				before ( function ( callback ) {
					var user = { firstName: "Alain", lastName: "Bashung", login: "bleupetrole", email: "alain.bashung@musicgenius.com", password: "gaby" };
					self.addUserAndOAuth1AccessToken ( user, function ( err, user, client, accessToken ) {
						if ( err ) return callback ( err );
						delusr = user;
						delaccesstoken = accessToken.token;
						delaccesssecret = accessToken.secret;
						deloauth = new OAuth ( url + "/oauth1/requestToken", url + "/oauth1/accessToken",  client.consumerKey, client.consumerSecret, "1.0", "", "HMAC-SHA1" );
						callback ( );
					} );
				} );

				it ( "should DELETE /user with an oauth1 authentication and delete the current user authenticate", function ( callback ) {
					deloauth.delete ( url + "/user", delaccesstoken, delaccesssecret, function ( err, data, res ) {
						if ( err ) return callback ( err );
						res.should.have.status ( 200 );
						res.should.be.json;
						data = JSON.parse ( data );
						data.should.have.property ( "result", "ok" );
						callback ( );
					} );
				} );

				it ( "should the user is delete and /GET user with oauth1 authentication return 401 http code", function ( callback ) {
					deloauth.get ( url + "/user", delaccesstoken, delaccesssecret, function ( err, data, res ) {
						res.should.have.status ( 401 );
						callback ( );
					} );
				} );

			} );

		} );

	} );

}