var Scroller = function (options) {
	this.options = options || {};
	this.scroller = $('#' + this.options['scrollerId']);
	this.itemHeight = this.options['itemHeight'];
	this.scrollerInner = this.scroller.find("[data-role='scroller-inner']");
	this.scrollerInnerHeight = parseInt(this.scrollerInner.css("height"));
	this.scrollerValues = this.options['values'];
	
	this.currentItem = 0;
	this.started = false;
	this.timeSwipeStarted = 0;
	this.startY = 0;
	this.step = this.itemHeight / 4;
	this.currentMarginTop = 0;
	this.delta = 0;
	this.maxMargin = 2 * this.itemHeight;
	this.minMagin = -this.scrollerInnerHeight + 3 * this.itemHeight;

	this.init();
};

Scroller.prototype.init = function() {
	this.setInitObservers();
	this.setCurrentItem();
};

Scroller.prototype.setInitObservers = function() {
	$("[data-role='scroller-outer']").on("touchstart", this.handleTouchStart.bind(this));
	$("[data-role='scroller-outer']").on("touchmove", this.handleTouchMove.bind(this));
	$("[data-role='scroller-outer']").on("touchend", this.handleTouchEnd.bind(this));
};

Scroller.prototype.handleTouchStart = function (evt) {
	evt.preventDefault();
	var date = new Date();
	this.started = true;
	this.scrollerInner.stop();
	this.startY = evt.changedTouches[0].pageY;
	this.timeSwipeStarted = date.getTime();
};

Scroller.prototype.handleTouchMove = function (evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	var currentY = touches[0].pageY;
	var diff = this.startY - currentY;
	var marginTop = Math.ceil(this.currentMarginTop - diff);

	this.scrollerInner.css({
		marginTop: marginTop + "px",
	});
};

Scroller.prototype.handleTouchEnd = function (evt) {
	evt.preventDefault();
	var date = new Date(),
		timeSwipeEnded = date.getTime(),
		timeDiff = timeSwipeEnded - this.timeSwipeStarted,
		currentY = evt.changedTouches[0].pageY;

	console.log("time diff: " + timeDiff);

	this.started = false;
	this.currentMarginTop = parseInt(this.scrollerInner.css("marginTop"));
	this.delta = this.startY - currentY;

	console.log("swipe delta: " + this.delta);

	if (this.delta == 0) return;

	if (timeDiff < 150 && Math.abs(this.delta) > 200) {
		if (this.delta < 0) {
			this.currentMarginTop = this.currentMarginTop + 3 * this.itemHeight;
		} else {
			this.currentMarginTop = this.currentMarginTop - 3 * this.itemHeight;
		}
	}

	//console.log(this.delta);

	if (this.currentMarginTop > this.maxMargin) {
		// Max margin
		this.currentMarginTop = this.maxMargin;
	} else if (this.currentMarginTop < this.minMagin) {
		// Min margin
		this.currentMarginTop = this.minMagin;
	} else {
		if (this.delta < 0) {
			// Up
			//console.log("going up");
			if (this.currentMarginTop < 0) {
				if (Math.abs(this.currentMarginTop) % this.itemHeight < this.itemHeight - this.step) {
					//console.log("snap to prev");
					this.currentMarginTop = - this.snapToLower();
				} else {
					//console.log("snap to next");
					this.currentMarginTop = - this.snapToHigher();
				}
			} else {
				if (Math.abs(this.currentMarginTop) % this.itemHeight < this.step) {
					//console.log("snap to prev");
					this.currentMarginTop = this.snapToLower();
				} else {
					//console.log("snap to nexta");
					this.currentMarginTop = this.snapToHigher();
				}
			}
		} else {
			// Down
			//console.log("going down");

			if (this.currentMarginTop < 0) {
				if (Math.abs(this.currentMarginTop) % this.itemHeight > this.step) {
					//console.log("snap to next");
					this.currentMarginTop = - this.snapToHigher();
				} else {
					//console.log("snap to prev");
					this.currentMarginTop = - this.snapToLower();
				}
			} else {
				if (Math.abs(this.currentMarginTop) % this.itemHeight > this.itemHeight - this.step) {
					//console.log("snap to nexta");
					this.currentMarginTop = this.snapToHigher();
				} else {
					//console.log("snap to prev");
					this.currentMarginTop = this.snapToLower();
				}
			}
		}
	}
	
	this.scrollerInner.animate({
		marginTop: this.currentMarginTop + "px",
	}, 100);

	this.setCurrentItem();
};

Scroller.prototype.snapToHigher = function() {
	return (Math.ceil(Math.abs(this.currentMarginTop) / this.itemHeight) * this.itemHeight);
};

Scroller.prototype.snapToLower = function() {
	return ((Math.ceil(Math.abs(this.currentMarginTop) / this.itemHeight) - 1 ) * this.itemHeight);
};

Scroller.prototype.setCurrentItem = function() {
	this.currentItem = (- this.currentMarginTop + this.itemHeight * 3) / this.itemHeight;
	this.scrollerInner.find("[data-role='scroller-item']").each(function(index) {
		$(this).removeClass("current");
	});
	this.scrollerInner.find("[data-role='scroller-item'][data-order='" + this.currentItem + "']").addClass("current");
	return;
}

Scroller.populateScrollerItems = function() {
	//
};