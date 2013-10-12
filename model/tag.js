var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Tag",
		{
			tag: {
				type: Sequelize.STRING,
				primaryKey: true
			}
		},
		{
			freezeTableName: true,
			classMethods: { },
			instanceMethods: {
				toJSON: function ( ) {
					return this.tag;
				}
			}
		}
	);

}