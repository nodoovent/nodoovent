/**
 *	Waterline QueryChainer
 *
 */

 var _ = require ( "lodash" );

 module.exports = function ( ) {

 	var QueryChainer = function ( ) {
 		this.total = 0;
 		this.count = 0;
 		this.nbrun = 0;
 		this.operations = [ ];
 		this.errors = [ ];
 		this.running = false;
 	};

 	QueryChainer.prototype.add = function ( obj, method /*string*/, cb /*, method args */ ) {
 		this.nbrun = 0;
 		this.total++;
 		this.operations.push ( { obj: obj, method: method, cb: cb, args: arguments } );
 	}

 	QueryChainer.prototype.run = function ( callback ) {
 		this.nbrun++;
 		if ( this.total == 0 ) return callback ( null ); 
 		this.running = true;
 		this.count = 0;
 		var self = this;
 		_.forEach ( this.operations, function ( op ) {
 			var cb = ( function ( op ) {
 				return function ( err, res ) {
 					if ( op.cb ) op.cb ( err, res );
 					self.count++;
 					if ( err )
 						self.errors.push ( { caller: op.obj, method: op.method, args: op.args, err: err } );
 					if ( self.count == self.total ) {
 						self.running = false;
 						callback ( !self.errors.length ? null : self.errors );
 					}
 				}
 			} ) ( op );
 			var args = [ ];
 			for ( var i = 3; i < op.args.length; i++ ) args.push ( op.args[i] );
 			args.push ( cb );
 			op.args = args;
 			op.obj[op.method].apply ( op.obj, op.args );
 		} );
 	}

 	return QueryChainer;

 } ( );