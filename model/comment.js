/*
 *	Comment
 *
 *	describe a comment in a Todo.
 */


var Sequelize = require ( "Sequelize" );

module.exports = function ( sequelize ) {

	return sequelize.define (
		"Comment",
		{
			content: {
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
						comment: this.content
					};
				}
			}
		}
	);

}