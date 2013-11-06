var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"OAuth1Client",
		{
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.STRING,
				allowNull: false
			},
			consumerKey: {
				type: Sequelize.STRING,
				allowNull: false,
			},
			consumerSecret: {
				type: Sequelize.STRING,
				allowNull: false,
			}
		},
		{
			freezeTableName: true,
			classMethods: { },
			instanceMethods: {
				toJSON: function ( ) {
					return {
						id: this.id,
						name: this.name,
						description: this.description,
						consumerKey: this.consumerKey,
						consumerSecret: this.consumerSecret
					};
				}
			}
		}
	)

}