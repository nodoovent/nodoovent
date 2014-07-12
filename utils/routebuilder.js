module.exports = function ( nodoovent ) {

	var app = nodoovent.app;
	var routes = nodoovent.routes.routes;

	/*
	 *	routes = {
	 *		"/": {
	 *			"GET": action.index,
	 *			"POST": { action: action.index, isAuthenticated: true }
	 *		}
	 *	}
	 */

	 var regexp = "regexp ";
	 var lregexp = regexp.length;

	for ( var route in routes ) {

		var r = route;
			if ( route.substring ( 0, lregexp ) == regexp )
				r = new RegExp ( route.substring ( lregexp ) );

		var methods = { "PUT": { }, "POST": { }, "DELETE": { }, "GET": { } };

		for ( var method in routes[route] ) {

			var action = routes[route][method];
			var isAuthenticated = false;

			if ( typeof action == "object" ) {
				isAuthenticated = action.isAuthenticated ? true : false;
				if ( typeof action.action != "undefined" && action.action != null )
					action = action.action;
			}

			var act = [ ];
			if ( isAuthenticated ) {
				if ( typeof nodoovent.actions.checkAuth == "array" )
					for ( var i in nodoovent.actions.checkAuth )
						act.push ( nodoovent.actions.checkAuth[i] );
				else act.push ( nodoovent.actions.checkAuth );
			}
			if ( typeof action == "array" )
				for ( var i in action )
					act.push ( action[i] );
			else act.push ( action );
			action = act;

			delete methods[method];

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

		// Add Method not allowed action
		for ( var method in methods ) {
			switch ( method ) {
				case "POST":
					app.post ( r, nodoovent.actions.methodNotAllowed );
					break;
				case "PUT":
					app.put ( r, nodoovent.actions.methodNotAllowed );
					break;
				case "DELETE":
					app.delete ( r, nodoovent.actions.methodNotAllowed );
					break;
				case "GET":
				default:
					app.get ( r, nodoovent.actions.methodNotAllowed );
					break;
			}
		}

	}

}