$( document ).ready(function() {
	$("[data-role='scroller-outer']").on("touchstart", handleTouchStart);
	$("[data-role='scroller-outer']").on("touchmove", handleTouchMove);
	$("[data-role='scroller-outer']").on("touchend", handleTouchEnd);
	var startY = 0,
		currentMarginTop = 0,
		lastDiff = 0,
		scrollerInner = $("[data-role='scroller-inner']")
		itemHeight = 50;

	function handleTouchStart(evt) {
		evt.preventDefault();
		var touches = evt.changedTouches;

		startY = touches[0].pageY;
	}

	function handleTouchMove(evt) {
		evt.preventDefault();
		var touches = evt.changedTouches;
		var currentY = touches[0].pageY;
		var diff = startY - currentY;
		console.log(diff);
		var marginTop = Math.ceil(currentMarginTop - diff / 2);

		scrollerInner.css({
			marginTop: marginTop + "px",
		});
	}

	function handleTouchEnd(evt) {
		evt.preventDefault();
		var touches = evt.changedTouches;
		currentMarginTop = parseInt(scrollerInner.css("marginTop"));
		if (Math.abs(currentMarginTop % itemHeight) > 0 ) {
			scrollerInner.stop();
			currentMarginTop = Math.round(currentMarginTop / itemHeight) * itemHeight;
			scrollerInner.animate({
				marginTop: currentMarginTop + "px",
			}, 100);
		}
	}
});
