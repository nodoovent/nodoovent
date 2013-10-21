var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"DevelopperAccount",
		{
			firstName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			lastName: {
				type: Sequelize.STRING,
				allowNull: false
			},
			organization: {
				type: Sequelize.STRING
			},
			email: {
				type: Sequelize.STRING,
				unique: true,
				validate: {
					isEmail: true
				}
			},
			password: {
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
						firstName: this.firstName,
						lastName: this.lastName,
						organization: this.organization,
						email: this.email
					};
				}
			}
		}
	)

}