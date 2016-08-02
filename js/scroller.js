var Scroller = function (options) {
	this.options = options || {};
	this.scroller = $('#' + this.options['scrollerId']);
	this.itemHeight = this.options['itemHeight'];
	this.scrollerInner = this.scroller.find("[data-role='scroller-inner']");
	this.scrollerInnerHeight = parseInt(this.scrollerInner.css("height"));
	
	this.started = false;
	this.startY = 0;
	this.step = this.itemHeight / 4;
	this.currentScrollTop = 0;
	this.lastDiff = 0;
	this.delta = 0;

	this.init();
};

Scroller.prototype.init = function() {
	this.setInitObservers();
};

Scroller.prototype.setInitObservers = function() {
	$("[data-role='scroller-outer']").on("touchstart", this.handleTouchStart.bind(this));
	$("[data-role='scroller-outer']").on("touchmove", this.handleTouchMove.bind(this));
	$("[data-role='scroller-outer']").on("touchend", this.handleTouchEnd.bind(this));
};

Scroller.prototype.handleTouchStart = function (evt) {
	//evt.preventDefault();
	this.started = true;
	this.scrollerInner.stop();
	this.startY = evt.changedTouches[0].pageY;
};

Scroller.prototype.handleTouchMove = function (evt) {
	//evt.preventDefault();
	
};

Scroller.prototype.handleTouchEnd = function (evt) {
	//evt.preventDefault();
	this.started = false;
	this.currentScrollTop = this.scroller.scrollTop();

	//TODO: find element and get his parent offset that scroll parent to that element
	//TODO: 

	var touches = evt.changedTouches;
	var currentY = touches[0].pageY;
	this.delta = this.startY - currentY;
	console.log(this.currentScrollTop);

	if (this.delta < 0) {
		// Up
		console.log("going up");
		if (this.currentScrollTop % this.itemHeight < this.itemHeight - this.step) {
			console.log("move up");
			this.currentScrollTop = Math.ceil(this.currentScrollTop / this.itemHeight) * this.itemHeight;
		}
	} else {
		// Down
		console.log("going down");
		if (this.currentScrollTop % this.itemHeight > this.step) {
			console.log("move down");
			this.currentScrollTop = Math.ceil(this.currentScrollTop / this.itemHeight) * this.itemHeight;
		}
	}
	this.currentScrollTop = this.currentScrollTop - Math.ceil(this.currentScrollTop / this.itemHeight);
	console.log("final: " + this.currentScrollTop);
	this.scroller.animate({
		scrollTop: this.currentScrollTop + "px",
	}, 100);
};
