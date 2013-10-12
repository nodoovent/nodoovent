var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define ( 
		"Groups",
		{
			name: {
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
						group: this.name
					};
				}
			}
		}
	);

}