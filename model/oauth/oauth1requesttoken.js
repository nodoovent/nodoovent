var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"OAuth1RequestToken",
		{
			requestToken: {
				type: Sequelize.STRING,
				allowNull: false
			},
			requestSecret: {
				type: Sequelize.STRING,
				allowNull: false
			},
			callbackUrl: {
				type: Sequelize.STRING,
				allowNull: false
			},
			timeout: {
				type: Sequelize.DATE
			},
			verifier: {
				type: Sequelize.STRING
			},
			approved: {
				type: Sequelize.BOOLEAN,
				allowNull: false,
				defaultValue: false
			}
		},
		{
			freezeTableName: true,
			classMethods: { },
			instanceMethods: {
				toJSON: function ( ) {
					var client = this.getOAuht1Client ( );
					var user = this.getUser ( );
					return {
						id: this.id,
						requestToken: this.requestToken,
						requestSecret: this.requestSecret,
						callbackUrl: this.callbackUrl,
						timestamp: this.timestamp,
						verifier: this.verifier,
						approved: this.approved,
						client: client.id,
						user: user.id
					};
				}
			}
		}
	)

}