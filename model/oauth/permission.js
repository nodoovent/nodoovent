module.exports = function ( schema ) {

	var Permission = schema.define (
		"Permission",
		{
			name: { type: String },
			ressourceUnlock: { type: String }
		}
	);

	Permission.validatesPresenceOf ( "name", "ressourceUnlock" );

	return Permission;

}