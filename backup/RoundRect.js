;(function(createjs, PB) {
	function RoundRect(conf) {
		PB.Rect.apply(this, arguments);
	}

	PB.Utils.extend(RoundRect, PB.Rect);

	RoundRect.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).drawRoundRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height, 10);
	};

	PB.RoundRect = RoundRect;
})(createjs, paintBoard || {});