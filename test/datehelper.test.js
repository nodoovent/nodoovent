var should = require ( "should" );

var Utils = require ( "../utils/" );
var DateHelper = Utils.DateHelper;

describe ( "[Test DateHelper utils functions]", function ( ) {

	var year = 2014;
	var month = 2;
	var day = 15;
	var h = 12;
	var m = 32;
	var s = 40;
	var milli = 96;

	var date = new Date ( );
	date.setUTCFullYear ( year, month, day );
	date.setUTCHours ( h, m, s, milli );

	var strmonth = month < 10 ? '0' + ( month + 1 ) : month + 1;
	var strmilli = milli < 100 ? '0' + milli : milli < 10 ? "00" + milli : milli;

	var str = year + '-' + strmonth + '-' + day + 'T' + h + ':' + m + ':' + s + '.' + strmilli + 'Z';
	var strFalse = "14/03/15T12h32m40s96ms";

	it ( "Test DateHelper.date2string", function ( ) {
		var res = DateHelper.date2string ( date );
		res.should.be.a.String;
		res.should.be.equal ( str );
	} );

	it ( "Test DateHelper.isValidStringDate", function ( ) {
		var res = DateHelper.isValidStringDate ( str );
		res.should.be.true;

		res = DateHelper.isValidStringDate ( strFalse );
		res.should.be.false;
	} );

	it ( "Test DateHelper.string2date", function ( ) {
		var res = DateHelper.string2date ( str );
		res.should.be.instanceOf ( Date );
		res.getTime ( ).should.be.equal ( date.getTime ( ) );
	} );

	it ( "Test DateHelper.string2date with null date", function ( ) {
		var res = DateHelper.string2date ( null );
		should ( res ).not.be.ok; // test null with shouldjs
	} );

} );