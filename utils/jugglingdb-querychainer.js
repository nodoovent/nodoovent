/*
 *	QueryChainer for jugglingdb orm
 */

module.exports = ( function ( ) {

	var QueryChainer = function ( ) {
		var self = this;
		self.operations = [ ];
		self.finished = 0;
		self.terminated = false;
		self.running = false;
		self.total = 0;
		self.errors = [ ];
	}

	QueryChainer.prototype.add = function ( klass, method, args, callback ) {
		if ( arguments.length < 2 ) return this;
		this.operations.push ( { klass: klass, method: method, args: args, callback: callback } );
		this.total++;
		return this;
	}

	QueryChainer.prototype.run = function ( callback ) {
		var self = this;
		self.terminated = 0;
		self.running = true;
		if ( self.operations.length == 0 ) return callback ( null );
		for ( var i = 0; i < self.operations.length; i++ ) {
			var operation = self.operations[i];
			try {
				var cb = ( function ( innercb ) {
					return function ( err, res ) {
						if ( innercb ) innercb ( err, res );
						self.terminated++;
						if ( err ) {
							if ( err instanceof Array ) for ( var e in err ) self.errors.push ( err[e] );
							else self.errors.push ( err );
						}
						if ( self.terminated == self.total ) {
							self.running = false;
							self.terminated = true;
							callback ( !self.errors.length ? null : self.errors )
						}
					} 
				} ) ( operation.callback );
				operation.klass[operation.method] ( operation.args, cb );
			} catch ( err ) {
				self.operations.splice ( i, 1 );
				i--;
				self.total--;
			}
		}
	}

	return QueryChainer;

} ) ( );