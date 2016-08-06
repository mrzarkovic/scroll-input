var scrollerValues = [-20, -10];
for (var i = 0; i <= 300; i++) {
	scrollerValues.push(i);
}

var mrauMrau = new MrauMrau({
	containerId: "container",
	noOfScrollers: 1,
	itemHeight: 50,
	values: scrollerValues
});

$( document ).ready(function() {
	
});
