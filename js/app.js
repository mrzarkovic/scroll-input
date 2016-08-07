$(document).ready(function() {
	var scrollerValues = [-20, -10];
	for (var i = 0; i <= 300; i++) {
		scrollerValues.push(i);
	}

	var mrauMrau = new MrauMrau({
		scrollerContainerId: "scrollers-container",
		controllsBarId: "controlls-bar",
		playerProfileHolderId: "player-profile",
		itemHeight: 40,
		values: scrollerValues
	});	
});
