var passport = require ( "passport" );

var OAuth1 = require ( "./oauth1" );

var LocalStrategy = require ( "./localstrategy" );
var OAuth1ConsumerStrategy = require ( "./oauth1consumerstrategy" );
var OAuth1TokenStrategy = require ( "./oauth1tokenstrategy" );


module.exports = function ( model ) {
	var self = this;

	self.localstrategy = LocalStrategy.init ( model );
	self.oauth1consumerstrategy = OAuth1ConsumerStrategy.init ( model );
	self.oauth1tokenstrategy = OAuth1TokenStrategy.init ( model );

	passport.use ( LocalStrategy.name, self.localstrategy );
	passport.use ( OAuth1ConsumerStrategy.name, self.oauth1consumerstrategy );
	passport.use ( OAuth1TokenStrategy.name, self.oauth1tokenstrategy );

	self.oauth1 = new OAuth1 ( model ); 
};