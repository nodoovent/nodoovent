/*
 *	Tag
 *
 *	Tags for todos
 */

var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Tag",
		{
			tag: {
				type: Sequelize.STRING,
				unique: true
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