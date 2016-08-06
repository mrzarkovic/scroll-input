$( document ).ready(function() {
	var scrollerValues = [-20, -10];
	for (var i = 0; i <= 300; i++) {
		scrollerValues.push(i);
	}

	var mrauMrau = new MrauMrau({
		containerId: "scrollers-container",
		noOfPlayers: 1,
		itemHeight: 50,
		values: scrollerValues
	});	
});
