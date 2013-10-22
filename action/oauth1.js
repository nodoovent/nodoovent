module.exports = function ( model, auth ) {
	var self = this;

	self.model = model;
	self.auth = auth;

	self.decision = function ( req, res ) {
		res.render (
			"oauth1/decision",
			{
				title: "Nodoovent",
				transactionID: req.oauth.transactionID,
				user: req.user,
				client: req.oauth.client
			}
		);
	}

	// update oauth1 decision action
	self.auth.oauth1.userAuthorization[2] = self.decision;

}