var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"OAuth1AccessToken",
		{
			accessToken: {
				type: Sequelize.STRING,
				allowNull: false
			},
			accessSecret: {
				type: Sequelize.STRING,
				allowNull: false
			}
		},
		{
			freezeTableName: true,
			classMethods: { },
			instanceMethods: {
				toJSON: function ( ) {
					return {
						id: this.id,
						accessToken: this.accessToken,
						accessSecret: this.accessSecret
					};
				}
			}
		}
	)

}