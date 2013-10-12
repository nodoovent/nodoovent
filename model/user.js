var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define ( 
		"User", 
		{
			firstName: {
				type: Sequelize.STRING // = Sequelize.STRING(255) 
			},
			lastName: {
				type: Sequelize.STRING
			},
			pseudonyme: {
				type: Sequelize.STRING,
				unique: true,
				allowNull: false
			},
			password: {
				type: Sequelize.STRING,
				allowNull: true
			},
			email: {
				type: Sequelize.STRING,
				validate: {
					isEmail: true
				}
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
						pseudonyme: this.pseudonyme,
						email: this.email
					};
				}
			}
		}
	);

}