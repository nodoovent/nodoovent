var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {
	return sequelize.define (
		"Privacy",
		{
			name: {
				type: Sequelize.ENUM,
				values: [ "Private", "Public", "With my groups mate" ]
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

/*
	"With my groups mate" 
	-> for all groups mate 
		or add level option choose some groups
*/