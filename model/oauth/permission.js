var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Permission",
		{
			name: {
				type: Sequelize.STRING,
				allowNull: false
			},
			ressourceUnlock: {
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
						name: this.name,
						ressourceUnlock: this.ressourceUnlock
					};
				}
			}
		}
	)

}