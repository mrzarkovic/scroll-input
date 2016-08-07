var MrauMrau = function (options) {
	this.options = options || {};
	this.scrollerContainer = $("#" + this.options['scrollerContainerId']);
	this.controllsBar = $("#" + this.options['controllsBarId']);
	this.playerProfile = $("#" + this.options['playerProfileHolderId']);
	this.scrollerTemplate = this.scrollerContainer.find("[data-role='scroller-template']");
	this.newPlayerNameInput = this.controllsBar.find("[data-role='new-player-name']");
	this.addNewPlayerButton = this.controllsBar.find("[data-role='add-new-player']");
	this.addNewRoundButton = this.controllsBar.find("[data-role='add-new-round']");
	this.noOfPlayers = this.options["noOfPlayers"] || 0;
	this.itemHeight = this.options["itemHeight"];
	this.scrollerValues = this.options["values"];
	
	this.init();
};

MrauMrau.prototype.init = function() {
	this.setInitValues();
	if (this.noOfPlayers > 0) {
		for (var i = 1; i <= this.noOfPlayers; i++) {
			this.addPlayer(i);
		}
		this.addNewRound();
	}
	this.setInitObservers();
};

MrauMrau.prototype.setInitValues = function() {
	this.noOfRounds = 0;
	this.lastPlayerId = 0;
	this.currentDealerPosition = 0;
	this.players = [];
};

MrauMrau.prototype.setInitObservers = function() {
	this.addNewPlayerButton.on("touchend", this.addNewPlayer.bind(this));
	this.addNewRoundButton.on("touchend", this.addNewRound.bind(this));
	this.playerProfile.find("[data-role='save-player']").on("touchend", this.savePlayer.bind(this));
	this.playerProfile.find("[data-role='remove-player']").on("touchend", this.removePlayer.bind(this));
	this.playerProfile.on("touchend", this.handleProfileClick.bind(this));
	$(document).on("mrau:showplayerprofile", this.showPlayerProfile.bind(this));
};

MrauMrau.prototype.handleProfileClick = function(evt) {
	var target = evt.target,
		targetRole = $(target).attr("data-role");
	if ($(target).attr("id") == "player-profile" || targetRole == "close-profile") {
		this.closePlayerProfile();
	}
};

MrauMrau.prototype.addPlayer = function(id) {
	var scrollerHtml = this.scrollerTemplate.clone();
	scrollerHtml.attr("data-role", "scroller");
	scrollerHtml.attr("data-id", id);
	this.scrollerContainer.append(scrollerHtml);

	this.players.push(new Player({
		playerId: id,
		name: this.newPlayerNameInput.val(),
		scrollerObject: new Scroller({
			scrollerId: id,
			itemHeight: this.itemHeight,
			values: this.scrollerValues,
		}),
	}));
	this.newPlayerNameInput.val("");
};

MrauMrau.prototype.addNewPlayer = function() {
	this.noOfPlayers++;
	this.lastPlayerId++;
	this.addPlayer(this.lastPlayerId);
	if (this.noOfPlayers == 1) {
		this.setCurrentDealer();
	}
};

MrauMrau.prototype.addNewRound = function() {
	this.noOfRounds++;
	for (var i = 0; i < this.noOfPlayers; i++) {
		this.players[i].addScore();
		//TODO:
		var redZone = 400,
			yellowZone = 250,
			greenZone = 0,
			blueZone = -20;
		if (this.players[i].score >= redZone) {
			this.players[i].scrollerObject.scroller.addClass("red");
			this.players[i].scrollerObject.scroller.removeClass("yellow");
			this.players[i].scrollerObject.scroller.removeClass("green");
			this.players[i].scrollerObject.scroller.removeClass("blue");
		} else if (this.players[i].score >= yellowZone) {
			this.players[i].scrollerObject.scroller.addClass("yellow");
			this.players[i].scrollerObject.scroller.removeClass("red");
			this.players[i].scrollerObject.scroller.removeClass("green");
			this.players[i].scrollerObject.scroller.removeClass("blue");
		} else if (this.players[i].score >= greenZone) {
			this.players[i].scrollerObject.scroller.addClass("green");
			this.players[i].scrollerObject.scroller.removeClass("red");
			this.players[i].scrollerObject.scroller.removeClass("yellow");
			this.players[i].scrollerObject.scroller.removeClass("blue");
		} else {
			this.players[i].scrollerObject.scroller.addClass("blue");
			this.players[i].scrollerObject.scroller.removeClass("red");
			this.players[i].scrollerObject.scroller.removeClass("yellow");
			this.players[i].scrollerObject.scroller.removeClass("green");
		}
	}
	this.setCurrentDealer();
	this.resetScrollers();
};

MrauMrau.prototype.setCurrentDealer = function() {
	this.setCurrentDealerPosition();
	for (var i = 0; i < this.noOfPlayers; i++) {
		this.players[i].scrollerObject.scroller.removeClass("dealer");
		this.players[this.currentDealerPosition - 1].scrollerObject.scroller.addClass("dealer");
	}
}

MrauMrau.prototype.setCurrentDealerPosition = function() {
	var newDealerPosition = this.currentDealerPosition + 1;
	if (newDealerPosition > this.noOfPlayers) newDealerPosition = 1;
	this.currentDealerPosition = newDealerPosition;
};

MrauMrau.prototype.removePlayer = function() {
	var playerId = this.playerProfile.attr("data-player-id");
	for (var i = 0; i < this.noOfPlayers; i++) {
		if (this.players[i].id == playerId) {
			if (i <= this.currentDealerPosition - 1) {
				this.currentDealerPosition = this.currentDealerPosition - 1;
			}
			this.players[i].removePlayer();
			this.players.splice(i, 1);
			this.noOfPlayers--;
			this.closePlayerProfile();
			return;
		}
	}
};

MrauMrau.prototype.savePlayer = function() {
	var playerId = this.playerProfile.attr("data-player-id");
	for (var i = 0; i < this.noOfPlayers; i++) {
		if (this.players[i].id == playerId) {
			var player = this.players[i];
			player.name = this.playerProfile.find("[data-role='edit-player-name']").val();
			player.score = parseInt(this.playerProfile.find("[data-role='edit-player-score']").val());
			player.addPlayerScoreToScroller();
			player.addPlayerNameToScroller();
			this.closePlayerProfile();
			return;
		}
	}
};

MrauMrau.prototype.resetScrollers = function() {
	for (var i = 0; i < this.noOfPlayers; i++) {
		this.players[i].scrollerObject.resetScroller();
	}
};

MrauMrau.prototype.showPlayerProfile = function(evt, playerId) {
	for (var i = 0; i < this.noOfPlayers; i++) {
		if (this.players[i].id == playerId) {
			var player = this.players[i];
			this.playerProfile.attr("data-player-id", player.id);
			this.playerProfile.find("[data-role='edit-player-name']").val(player.name);
			this.playerProfile.find("[data-role='edit-player-score']").val(player.score);
			this.playerProfile.addClass("open");
			return;
		}
	}
};

MrauMrau.prototype.closePlayerProfile = function() {
	this.playerProfile.removeClass("open");
	this.playerProfile.attr("data-player-id", 0);
	this.playerProfile.find("[data-role='edit-player-name']").val("");
};
