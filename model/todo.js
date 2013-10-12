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
			due_date: {
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
						due_date: this.date
					};
				}
			}
		}
	);

}