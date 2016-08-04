$( document ).ready(function() {
	var scrollerValues = [-20, -10];
	for (var i = 0; i <= 300; i++) {
		scrollerValues.push(i);
	}

	var scroller = new Scroller({
		scrollerId: 'scroller',
		itemHeight: 50,
		values: scrollerValues,
	});
});
