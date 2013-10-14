/*
 *	TodoList
 *
 *	List of todos ...
 */


var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"TodoList",
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
						todolist: this.name
					};
				}
			}
		}
	);

}