;(function(createjs, PB) {
	function FreeArrow(conf) {
		PB.FreeLine.apply(this, arguments);
		this.endX = 0;
		this.endY = 0;
	}

	PB.Utils.extend(FreeArrow, PB.FreeLine);

	FreeArrow.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor);
		z.shape.graphics.moveTo(z.points[0].x, z.points[0].y);
		for (var i = 1, n = z.points.length - 3; i < n; i++) {
			var p = z.points[i];
			var xc = (p.x + z.points[i + 1].x) / 2;
			var yc = (z.points[i].y + z.points[i + 1].y) / 2;
			z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, xc, yc);

		}
		if (i > 1) {
			z.shape.graphics.quadraticCurveTo(z.points[i].x, z.points[i].y, z.points[i + 1].x, z.points[i + 1].y);
		}

		var angle = Math.atan2(z.endY - z._oY, z.endX - z._oX) * 180 / Math.PI;

		z.shape.graphics.endStroke().setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, 8 * 2.5, 3, 0.5, angle);
	};

	PB.FreeArrow = FreeArrow;
})(createjs, paintBoard || {});