var Player = function (options) {
	this.options = options || {};
	this.container = $("#" + this.options['playerId']);
	this.scroller = this.options['scroller'];

	this.init();
};

Player.prototype.init = function() {
	this.setInitObservers();
	this.setInitValues();
};

Player.prototype.setInitObservers = function() {
};

Player.prototype.setInitValues = function() {
	this.score = 0;
};

Player.prototype.addScore = function() {
	this.score = this.score + this.scroller.getCurrentValue();
};
