var MarginScroller = function (options) {
	this.options = options || {};
	this.scroller = $('#' + this.options['scrollerId']);
	this.itemHeight = this.options['itemHeight'];
	this.scrollerInner = this.scroller.find("[data-role='scroller-inner']");
	this.scrollerInnerHeight = parseInt(this.scrollerInner.css("height"));
	
	this.started = false;
	this.startY = 0;
	this.currentMarginTop = 0;
	this.lastDiff = 0;

	this.init();
};

MarginScroller.prototype.init = function() {
	this.setInitObservers();
};

MarginScroller.prototype.setInitObservers = function() {
	$("[data-role='scroller-outer']").on("touchstart", this.handleTouchStart.bind(this));
	$("[data-role='scroller-outer']").on("touchmove", this.handleTouchMove.bind(this));
	$("[data-role='scroller-outer']").on("touchend", this.handleTouchEnd.bind(this));
};

MarginScroller.prototype.handleTouchStart = function (evt) {
	evt.preventDefault();
	this.started = true;
	this.scrollerInner.stop();
	this.startY = evt.changedTouches[0].pageY;
};

MarginScroller.prototype.handleTouchMove = function (evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	var currentY = touches[0].pageY;
	var diff = this.startY - currentY;
	var marginTop = Math.ceil(this.currentMarginTop - diff / 2);

	this.scrollerInner.css({
		marginTop: marginTop + "px",
	});
};

MarginScroller.prototype.handleTouchEnd = function (evt) {
	evt.preventDefault();
	this.started = false;
	this.currentMarginTop = parseInt(this.scrollerInner.css("marginTop"));

	if (this.currentMarginTop > 0) {
		// Max margin
		this.currentMarginTop = 0;
	} else if (this.currentMarginTop < -this.scrollerInnerHeight + this.itemHeight ) {
		// Min margin
		this.currentMarginTop = -this.scrollerInnerHeight + this.itemHeight;
	} else if (Math.abs(this.currentMarginTop % this.itemHeight) > 0 ) {
		// Correct margin
		this.currentMarginTop = Math.round(this.currentMarginTop / this.itemHeight) * this.itemHeight;
	}
	this.scrollerInner.animate({
		marginTop: this.currentMarginTop + "px",
	}, 100);
};
