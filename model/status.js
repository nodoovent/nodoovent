/*
 *	Status
 *
 *	the current status of a todo (for example: "In progress").
 */


var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Status",
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
						status: this.name 
					};
				}
			}
		}
	);

} 