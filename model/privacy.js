/*
 *	Privacy
 *
 *	privacy of a todo. Public or Private.
 */

var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {
	return sequelize.define (
		"Privacy",
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
						name: this.name
					};
				}
			}
		}
	);
}