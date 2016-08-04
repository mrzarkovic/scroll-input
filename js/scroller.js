var Scroller = function (options) {
	this.options = options || {};
	this.scroller = $('#' + this.options['scrollerId']);
	this.itemHeight = this.options['itemHeight'];
	this.scrollerInner = this.scroller.find("[data-role='scroller-inner']");
	this.scrollerValues = this.options['values'];
	this.inputHolder = $('#' + this.options['inputHolder']);

	this.init();
};

Scroller.prototype.init = function() {
	this.populateScrollerItems();
	this.setInitValues();
	this.setCurrentItem();
	this.setInitObservers();
};

Scroller.prototype.setInitValues = function() {
	this.scrollerInnerHeight = parseInt(this.scrollerInner.css("height"));
	this.maxMargin = 2 * this.itemHeight;
	this.minMagin = -this.scrollerInnerHeight + 3 * this.itemHeight;
	this.currentItemId = 0;
	this.started = false;
	this.timeSwipeStarted = 0;
	this.startY = 0;
	this.step = this.itemHeight / 4;
	this.currentMarginTop = 0;
	this.delta = 0;
	this.itemStartY = 0;
};

Scroller.prototype.setInitObservers = function() {
	var _this = this;

	this.scroller.on("touchstart", this.handleScrollerTouchStart.bind(this));
	this.scroller.on("touchmove", this.handleScrollerTouchMove.bind(this));
	this.scroller.on("touchend", this.handleScrollerTouchEnd.bind(this));
	this.scrollerInner.find("[data-role='scroller-item']").each(function(i) {
		$(this).on("touchstart", _this.handleItemTouchStart.bind(_this));
		$(this).on("touchend", _this.handleItemTouchEnd.bind(_this));
	});
};

Scroller.prototype.handleItemTouchStart = function (evt) {
	this.itemStartY = evt.changedTouches[0].pageY;
};

Scroller.prototype.handleItemTouchEnd = function (evt) {
	var taget = evt.target,
		itemCurrentY = evt.changedTouches[0].pageY,
		delta = this.itemStartY - itemCurrentY;

	if ($(taget).data("order") == this.currentItemId && delta == 0) {
		// Selected item is clicked
		this.inputHolder.addClass("show");
	}
};

Scroller.prototype.handleScrollerTouchStart = function (evt) {
	evt.preventDefault();
	var date = new Date();
	this.started = true;
	this.scrollerInner.stop();
	this.startY = evt.changedTouches[0].pageY;
	this.timeSwipeStarted = date.getTime();
};

Scroller.prototype.handleScrollerTouchMove = function (evt) {
	evt.preventDefault();
	var touches = evt.changedTouches;
	var currentY = touches[0].pageY;
	var diff = this.startY - currentY;
	var marginTop = Math.ceil(this.currentMarginTop - diff);

	this.scrollerInner.css({
		marginTop: marginTop + "px",
	});
};

Scroller.prototype.handleScrollerTouchEnd = function (evt) {
	evt.preventDefault();
	var date = new Date(),
		timeSwipeEnded = date.getTime(),
		timeDiff = timeSwipeEnded - this.timeSwipeStarted,
		currentY = evt.changedTouches[0].pageY,
		momentumStep = 10;

	console.log("time diff: " + timeDiff);

	this.started = false;
	this.currentMarginTop = parseInt(this.scrollerInner.css("marginTop"));
	this.delta = this.startY - currentY;

	console.log("swipe delta: " + this.delta);

	if (this.delta == 0) return;

	// Momentum scroll
	if (timeDiff < 150 && Math.abs(this.delta) > 200) {
		if (Math.abs(this.delta) > 300) momentumStep = 50;
		if (this.delta < 0) {
			this.currentMarginTop = this.currentMarginTop + momentumStep * this.itemHeight;
		} else {
			this.currentMarginTop = this.currentMarginTop - momentumStep * this.itemHeight;
		}
	}

	this.correctMargin();
	
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
	this.currentItemId = (- this.currentMarginTop + this.itemHeight * 3) / this.itemHeight;
	this.scrollerInner.find("[data-role='scroller-item']").each(function(index) {
		$(this).removeClass("current");
	});
	this.scrollerInner.find("[data-role='scroller-item'][data-order='" + this.currentItemId + "']").addClass("current");
	return;
};

Scroller.prototype.populateScrollerItems = function() {
	for (var i = 0; i < this.scrollerValues.length; i++) {
		var itemTemplate = this.scrollerInner.find("[data-role='scroller-item-template']").clone(),
			value = this.scrollerValues[i];
		itemTemplate.attr("data-role", "scroller-item");
		itemTemplate.attr("data-value", value);
		itemTemplate.attr("data-order", i + 1);
		itemTemplate.text(value);
		this.scrollerInner.append(itemTemplate);
	}
	return;
};

Scroller.prototype.correctMargin = function() {
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
	return;
};
