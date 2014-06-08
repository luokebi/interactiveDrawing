;(function(createjs, PB) {
	function Ellipse(conf) {
		PB.Rect.apply(this, arguments);
	}

	PB.Utils.extend(Ellipse, PB.Rect);

	Ellipse.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawEllipse(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
	}

	PB.Ellipse = Ellipse;
})(createjs, paintBoard || {});