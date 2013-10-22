var crypto = require ( "crypto" );


var getRandomInt = function ( min, max ) {
	return Math.floor ( Math.random ( ) * ( max - min + 1 ) ) + min;
}

module.exports = function ( len ) {

	var buf = "";
	var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charslen = chars.length;

	for ( var i = 0; i < len; i++ ) {
		var charindex = getRandomInt ( 0, charslen - 1);
		buf += chars[charindex];
	}

	return buf;
}