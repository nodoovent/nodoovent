module.exports = function ( model, auth, action ) {
	var self = this;

	self.model = model;
	self.auth = auth;
	self.action = action;

	self.root = "/oauth1";

	self.routes = {
		"/requestToken": {
			"GET": self.auth.oauth1.requestToken
		} 
	}


	for ( var route in self.routes ) {
		var newroute = self.root + route;
		self.routes[newroute] = self.routes[route];
		delete self.routes[route];
	}
}