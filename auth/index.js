var passport = require ( "passport" );

var OAuth1 = require ( "./oauth1" );

var LocalStrategy = require ( "./localstrategy" );
var OAuth1ConsumerStrategy = require ( "./oauth1consumerstrategy" );
var OAuth1TokenStrategy = require ( "./oauth1tokenstrategy" );


module.exports = function ( models ) {

	this.localstrategy = LocalStrategy.init ( models );
	this.oauth1consumerstrategy = OAuth1ConsumerStrategy.init ( models );
	this.oauth1tokenstrategy = OAuth1TokenStrategy.init ( models );

	passport.use ( LocalStrategy.name, this.localstrategy );
	passport.use ( OAuth1ConsumerStrategy.name, this.oauth1consumerstrategy );
	passport.use ( OAuth1TokenStrategy.name, this.oauth1tokenstrategy );

	this.oauth1 = new OAuth1 ( models ); 
};