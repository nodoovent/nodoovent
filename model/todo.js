/*
 *	Todo
 *
 *	An action to do ....
 */


var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {
	
	return sequelize.define (
		"Todo",
		{
			name: { 
				type: Sequelize.STRING,
				allowNull: false
			},
			description: {
				type: Sequelize.STRING
			},
			dueDate: {
				type: Sequelize.DATE 
				/* we can use this instead :
				type: Sequelize.STRING,
				validate: {
					isDate: true
				}
				*/
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
						dueDate: this.dueDate,
						createdAt: this.createdAt,
						updatedAt: this.updatedAt,
						author: this.UserId,
						status: this.StatuId,
						privacy: this.PrivacyId
					};
				}
			}
		}
	);

}