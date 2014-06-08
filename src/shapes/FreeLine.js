;(function(createjs, PB) {
	function FreeLine(conf) {
		this.shape = new createjs.Shape();
		this.shape.cursor = "move";
		this.points = [];
		this.baseType = 'FreeShape';
		PB.Shape.apply(this, arguments);
	}

	PB.Utils.extend(FreeLine, PB.Shape);

	FreeLine.prototype.select = function() {
		this.selected = true;
		this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
	};

	FreeLine.prototype.rePaint = function() {
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
	};

	PB.FreeLine = FreeLine;
})(createjs, paintBoard || {});