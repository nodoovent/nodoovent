module.exports = function ( waterline, adapter ) {

	require ( "./clientpermission" ) ( waterline, adapter );
	require ( "./developeraccount" ) ( waterline, adapter );
	require ( "./oauth1accesstoken" ) ( waterline, adapter );
	require ( "./oauth1client" ) ( waterline, adapter );
	require ( "./oauth1requesttoken" ) ( waterline, adapter );

}