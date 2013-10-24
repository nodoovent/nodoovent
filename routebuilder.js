module.exports = function ( app, routes ) {

	/*
	 *	routes = {
	 *		"/": {
	 *			"GET": action.index
	 *		}
	 *	}
	 */

	 var regexp = "regexp ";

	for ( var route in routes ) {
		var _route = routes[route];
		for ( var method in _route ) {
			var action = _route[method];
			if ( route.substring ( 0, regexp.length ) == regexp )
				route = new RegExp ( route.substring ( regexp.length ) );
			switch ( method ) {
				case "POST":
					app.post ( route, action );
					break;
				case "PUT":
					app.put ( route, action );
					break;
				case "DELETE":
					app.delete ( route, action );
					break;
				case "GET":
				default:
					app.get ( route, action );
					break;
			}
		}
	}

}