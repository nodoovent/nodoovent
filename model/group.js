/*
 *	Group
 *
 *	a group gathers many users around todos common.
 *	It allows users to propose new todo to other group members.
 *	An administrator can delete the group, accept new user inside and ban user.
 */

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