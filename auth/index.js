var passport = require ( "passport" );

var OAuth1 = require ( "./oauth1" );
var LocalStrategy = require ( "./localstrategy" );
var OAuth1ConsumerStrategy = require ( "./oauth1consumerstrategy" );
var OAuth1TokenStrategy = require ( "./oauth1tokenstrategy" );


module.exports = function ( models ) {

	var localStrategy = LocalStrategy.init ( models );
	var oauth1ConsumerStrategy = OAuth1ConsumerStrategy.init ( models );
	var oauth1TokenStrategy = OAuth1TokenStrategy.init ( models );

	passport.use ( LocalStrategy.name, localStrategy );
	passport.use ( OAuth1ConsumerStrategy.name, oauth1ConsumerStrategy );
	passport.use ( OAuth1TokenStrategy.name, oauth1TokenStrategy );

	this.oauth1 = new OAuth1 ( models ); 
};