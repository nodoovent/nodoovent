module.exports = {

	uid: require ( "./uid" ),
	QueryChainer: require ( "./jugglingdb-querychainer" ),

	validateEmail: function ( mail ) {
		return new RegExp('^[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*@[a-z0-9]+([_|\.|-]{1}[a-z0-9]+)*[\.]{1}[a-z]{2,6}$', 'i').test ( mail );
	}

}