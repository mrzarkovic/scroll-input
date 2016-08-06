var MrauMrau = function (options) {
	this.options = options || {};
	this.container = $("#" + this.options['containerId']);
	this.noOfScrollers = this.options['noOfScrollers'];
	this.itemHeight = this.options['itemHeight'];
	this.scrollerValues = this.options['values'];
	this.scrollerTemplate = $("[data-role='scroller-template']");
	this.scrollers = {};

	this.init();
};

MrauMrau.prototype.init = function() {
	for (var i = 1; i <= this.noOfScrollers; i++) {
		this.addScroller(i);
	}
};

MrauMrau.prototype.addScroller = function(id) {
	var scrollerHtml = this.scrollerTemplate.clone();
	scrollerHtml.attr("data-role", "scroller");
	scrollerHtml.attr("data-id", id);
	this.container.append(scrollerHtml);

	this.scrollers[id] = new Scroller({
		scrollerId: id,
		itemHeight: this.itemHeight,
		values: this.scrollerValues,
	});
};

MrauMrau.prototype.addNewScroller = function() {
	this.noOfScrollers++;
	this.addScroller(this.noOfScrollers);
};
