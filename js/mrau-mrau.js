var MrauMrau = function (options) {
	this.options = options || {};
	this.container = $("#" + this.options['containerId']);
	this.scrollerTemplate = this.container.find("[data-role='scroller-template']");
	this.addNewPlayerButton = $("[data-role='add-new-player']");
	this.addNewRoundButton = $("[data-role='add-new-round']");
	this.noOfPlayers = this.options['noOfPlayers'];
	this.itemHeight = this.options['itemHeight'];
	this.scrollerValues = this.options['values'];
	
	this.init();
};

MrauMrau.prototype.init = function() {
	this.setInitValues();
	for (var i = 1; i <= this.noOfPlayers; i++) {
		this.addPlayer(i);
	}
	this.setInitObservers();
};

MrauMrau.prototype.setInitValues = function() {
	this.noOfRounds = 1;
	this.currentDealerId = 1;
	this.players = {};
};

MrauMrau.prototype.setInitObservers = function() {
	this.addNewPlayerButton.on("touchend", this.addNewPlayer.bind(this));
	this.addNewRoundButton.on("touchend", this.addNewRound.bind(this));
};

MrauMrau.prototype.addPlayer = function(id) {
	var scrollerHtml = this.scrollerTemplate.clone();
	scrollerHtml.attr("data-role", "scroller");
	scrollerHtml.attr("data-id", id);
	this.container.append(scrollerHtml);

	this.players[id] = new Player({
		playerId: id,
		scroller: new Scroller({
			scrollerId: id,
			itemHeight: this.itemHeight,
			values: this.scrollerValues,
		}),
	});
};

MrauMrau.prototype.addNewPlayer = function() {
	this.noOfPlayers++;
	this.addPlayer(this.noOfPlayers);
};

MrauMrau.prototype.addNewRound = function() {
	this.noOfRounds++;
	for (var i = 1; i <= this.noOfPlayers; i++) {
		this.players[i].addScore();
	}
	this.setCurrentDealerId();
	console.log(this.currentDealerId);
};

MrauMrau.prototype.setCurrentDealerId = function() {
	//TODO: this.currentDealerId = (this.noOfRounds % this.noOfPlayers) + 1;
};
