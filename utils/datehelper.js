module.exports = ( function ( ) {

	var pad = function ( number ) {
		if ( number < 10 )return '0' + number;
	    return number;
	}

	var createRegExp = function ( ) {
		return /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})\.(\d{3})Z/g;
	}

	var checkNodooventStringDate = function ( str ) {
		var regdate = createRegExp ( );
		return regdate.test ( str );
	}

	var nodooventDate2String = function ( date ) {
		if ( typeof date == "undefined" || date == null ) return null;
		return date.getUTCFullYear ( ) + '-' + pad ( date.getUTCMonth ( ) + 1 ) + '-' + pad ( date.getUTCDate ( ) )
			+ 'T' + pad ( date.getUTCHours ( ) ) + ':' + pad ( date.getUTCMinutes ( ) ) + ':' + pad ( date.getUTCSeconds ( ) )
			+ '.' + ( date.getUTCMilliseconds ( ) / 1000 ).toFixed ( 3 ).slice ( 2, 5 ) + 'Z';
	}

	var nodooventString2Date = function ( str ) {
		if ( !checkNodooventStringDate ( str ) ) return "";
		
		var regdate = createRegExp ( );
		var m = regdate.exec ( str );

		var year = parseInt ( m[1], 10 );
		var month = parseInt ( m[2], 10 ) - 1;
		var day = parseInt ( m[3], 10 );
		var hours = parseInt ( m[4], 10 );
		var minutes = parseInt ( m[5], 10 );
		var seconds = parseInt ( m[6], 10 );
		var milli = parseInt ( m[7], 10 );

		var date = new Date ( );
		date.setUTCFullYear ( year, month, day );
		date.setUTCHours ( hours, minutes, seconds, milli );

		return date;
	}

	return {
		isValidStringDate: checkNodooventStringDate,
		date2string: nodooventDate2String,
		string2date: nodooventString2Date
	};

} ) ( );