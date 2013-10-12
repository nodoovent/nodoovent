var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Status",
		{
			name: {
				type: Sequelize.ENUM,
				values: [ "Terminate", "Open", "In Progress", "Refused" ]
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