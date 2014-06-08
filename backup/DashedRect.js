;
(function(createjs, PB) {
	function DashedRect(conf) {
		PB.Rect.apply(this, arguments);
	}

	PB.Utils.extend(DashedRect, PB.Rect);

	DashedRect.prototype.rePaint = function() {
		var z = this;
		if (z.shape.graphics.setLineDash) {
			z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").setLineDash([10]).beginStroke(this.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
		} else {
			z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawDashedRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height, 15);
		}
	};

	PB.DashedRect = DashedRect;
})(createjs, paintBoard || {});