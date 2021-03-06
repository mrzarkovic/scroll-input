var Scroller = function (options) {
	this.options = options || {};
	this.scroller = $("[data-role='scroller'][data-id='" + this.options['scrollerId'] + "']");
	this.scrollerInner = this.scroller.find("[data-role='scroller-inner']");
	this.scrollerOuter = this.scroller.find("[data-role='scroller-outer']");
	this.inputHolder = this.scroller.find("[data-role='input-holder']");
	this.theInput = this.inputHolder.find("[data-role='the-input']")
	this.itemHeight = this.options["itemHeight"];
	this.scrollerValues = this.options["values"];

	this.init();
};

/**
 * Call the initial functions (methods) to set everything up
 */
Scroller.prototype.init = function() {
	this.populateScrollerItems();
	this.setInitValues();
	this.setCurrentItemIdByMargin();
	this.setCurrentItemStyle();
	this.setInitObservers();
};

/**
 * Set the initial scroller variables (initial state)
 */
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

/**
 * Set the initial observers (event listeners) on the scroller elements
 */
Scroller.prototype.setInitObservers = function() {
	var _this = this;

	this.scrollerOuter.on("touchstart", this.handleScrollerTouchStart.bind(this));
	this.scrollerOuter.on("touchmove", this.handleScrollerTouchMove.bind(this));
	this.scrollerOuter.on("touchend", this.handleScrollerTouchEnd.bind(this));
	this.scrollerInner.find("[data-role='scroller-item']").each(function(i) {
		$(this).on("touchstart", _this.handleItemTouchStart.bind(_this));
		$(this).on("touchend", _this.handleItemTouchEnd.bind(_this));
	});
	this.theInput.on("blur", this.setScrollerPositionByValue.bind(this));
	this.theInput.on("keydown", function(evt) {
		if (evt.keyCode == 13 || evt.keyCode == 9) {
			evt.preventDefault();
			_this.setScrollerPositionByValue();
		}
	});
};

/**
 * Set the new element in focus (current item) based on the input value
 */
Scroller.prototype.setScrollerPositionByValue = function () {
	this.inputHolder.removeClass("show");
	this.setCurrentItemIdByInput();
	this.setCurrentItemStyle();
	this.setMarginByCurrentItem();
	this.scrollerInner.css({
		marginTop: this.currentMarginTop + "px",
	});
};

/**
 * Set the initial values for the touch event
 * @param  {event}
 */
Scroller.prototype.handleItemTouchStart = function (evt) {
	this.itemStartY = evt.changedTouches[0].pageY;
};

/**
 * Show the input field if the item in focus is clicked
 * @param  {event}
 */
Scroller.prototype.handleItemTouchEnd = function (evt) {
	evt.preventDefault();
	var taget = evt.target,
		itemCurrentY = evt.changedTouches[0].pageY,
		delta = this.itemStartY - itemCurrentY;

	if ($(taget).data("order") == this.currentItemId && Math.abs(delta) < 5) {
		// Selected item is clicked
		this.inputHolder.addClass("show");
		evt.stopPropagation();
		this.theInput.select();
	}
};

/**
 * Set the initial values for the drag event
 * @param  {event}
 */
Scroller.prototype.handleScrollerTouchStart = function (evt) {
	var date = new Date();
	this.started = true;
	this.scrollerInner.stop();
	this.startY = evt.changedTouches[0].pageY;
	this.timeSwipeStarted = date.getTime();
};

/**
 * Set the scroller inner position (margin-top) while dragging
 * @param  {event}
 */
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

/**
 * Calculate and set the snap point after drag event has ended
 * @param  {event}
 */
Scroller.prototype.handleScrollerTouchEnd = function (evt) {
	var date = new Date(),
		timeSwipeEnded = date.getTime(),
		timeDiff = timeSwipeEnded - this.timeSwipeStarted,
		currentY = evt.changedTouches[0].pageY,
		momentumStep = 50;

	//console.log("time diff: " + timeDiff);

	this.started = false;
	this.currentMarginTop = parseInt(this.scrollerInner.css("marginTop"));
	this.delta = this.startY - currentY;

	//console.log("swipe delta: " + this.delta);

	if (this.delta == 0) return;

	// Momentum scroll
	if (timeDiff < 150 && Math.abs(this.delta) > 150) {
		if (Math.abs(this.delta) > 200) momentumStep = 100;
		if (Math.abs(this.delta) > 250) momentumStep = 150;
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

	this.setCurrentItemIdByMargin();
	this.setCurrentItemStyle();
};

/**
 * If the item in focus is between two snap points
 * it snaps to the next (higher) point.
 * @return {int} Snap point (margin-top)
 */
Scroller.prototype.snapToHigher = function() {
	var snapPoint = (Math.ceil(Math.abs(this.currentMarginTop) / this.itemHeight) * this.itemHeight);
	return snapPoint;
};

/**
 * If the item in focus is between two snap points
 * it snaps to the previous (lower) point.
 * @return {int} Snap point (margin-top)
 */
Scroller.prototype.snapToLower = function() {
	var snapPoint = ((Math.ceil(Math.abs(this.currentMarginTop) / this.itemHeight) - 1 ) * this.itemHeight);
	return snapPoint;
};

/**
 * Create scroller item for every value in the scrollerValues array 
 */
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
	//$(document).trigger("mrau:hideloader", ["populateScrollerItems"]);
};

/**
 * Set the margin top value to match the snap points
 */
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
};

/**
 * Set the current item ID based on the scroll position
 */
Scroller.prototype.setCurrentItemIdByMargin = function() {
	this.currentItemId = (- this.currentMarginTop + this.itemHeight * 3) / this.itemHeight;
};

/**
 * Set the current item ID based on the input value
 */
Scroller.prototype.setCurrentItemIdByInput = function() {
	var inputValue = parseInt(this.theInput.val());
	if (this.scrollerValues.indexOf(inputValue) !== -1) {
		this.currentItemId = this.scrollerValues.indexOf(inputValue) + 1;
	}
};

/**
 * Set the current margin based on the current item ID
 */
Scroller.prototype.setMarginByCurrentItem = function() {
	this.currentMarginTop = - (this.currentItemId - 3) * this.itemHeight;
};

/**
 * Set the style for the current item in focus
 */
Scroller.prototype.setCurrentItemStyle = function() {
	this.scrollerInner.find("[data-role='scroller-item']").each(function(index) {
		$(this).removeClass("current");
	});
	this.scrollerInner.find("[data-role='scroller-item'][data-order='" + this.currentItemId + "']").addClass("current");
};

/**
 * Get the current scroller value
 * @return {int} Current scroller value
 */
Scroller.prototype.getCurrentValue = function() {
	return this.scrollerValues[this.currentItemId - 1];
};

/**
 * Remove the scroller from the DOM
 */
Scroller.prototype.removeScroller = function() {
	this.scroller.remove();
};

/**
 * Reset scroller to initial state
 */
Scroller.prototype.resetScroller = function() {
	this.currentMarginTop = 0;
	this.theInput.val("");
	this.scrollerInner.css({
		marginTop: this.currentMarginTop + "px",
	});
	this.setCurrentItemIdByMargin();
	this.setCurrentItemStyle();
};
