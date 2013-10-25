module.exports = function ( app, routes ) {

	/*
	 *	routes = {
	 *		"/": {
	 *			"GET": action.index
	 *		}
	 *	}
	 */

	 var regexp = "regexp ";
	 var lregexp = regexp.length;

	for ( var route in routes ) {
		var _route = routes[route];
		for ( var method in _route ) {
			var action = _route[method];
			var r = route;
			if ( route.substring ( 0, lregexp) == regexp )
				r = new RegExp ( route.substring ( lregexp ) );
			switch ( method ) {
				case "POST":
					app.post ( r, action );
					break;
				case "PUT":
					app.put ( r, action );
					break;
				case "DELETE":
					app.delete ( r, action );
					break;
				case "GET":
				default:
					app.get ( r, action );
					break;
			}
		}
	}

}