var Player = function (options) {
	this.options = options || {};
	this.id = this.options["playerId"];
	this.name = this.options["name"] || "No Name";
	this.scrollerObject = this.options["scrollerObject"];
	this.playerNameHolder = this.scrollerObject.scroller.find("[data-role='player-name']");
	this.playerScoreHolder = this.scrollerObject.scroller.find("[data-role='player-score']");

	this.init();
};

Player.prototype.init = function() {
	this.setInitValues();
	this.addPlayerNameToScroller();
	this.addScore();
	this.setInitObservers();
};

Player.prototype.setInitObservers = function() {
	this.playerNameHolder.on("touchend", this.handlePlayerProfile.bind(this));
};

Player.prototype.setInitValues = function() {
	this.score = 0;
};

Player.prototype.addScore = function() {
	this.score = this.score + this.scrollerObject.getCurrentValue();
	this.addPlayerScoreToScroller();
};

Player.prototype.addPlayerScoreToScroller = function() {
	this.playerScoreHolder.html(this.score);
}

Player.prototype.addPlayerNameToScroller = function() {
	this.playerNameHolder.html(this.name);
};

Player.prototype.removePlayer = function() {
	this.scrollerObject.removeScroller();
};

Player.prototype.handlePlayerProfile = function(evt) {
	evt.preventDefault();
	$(document).trigger("mrau:showplayerprofile", [this.id]);
};
