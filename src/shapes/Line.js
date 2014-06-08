/** 
 * Normal line.
 =================================================*/

;
(function(createjs, PB) {
	function Line(conf) {
		this.shape = new createjs.Shape();
		this.shape.cursor = "move";
		PB.LineShape.apply(this, arguments);
	}

	PB.Utils.extend(Line, PB.LineShape);

	Line.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).moveTo(z.startX, z.startY).lineTo(z.endX, z.endY);
	};

	PB.Line = Line;
})(createjs, paintBoard || {});

/** 
 * Dashed line.
 =================================================*/

(function(createjs, PB) {
	function DashedLine(conf) {
		PB.Line.apply(this, arguments);
	}

	PB.Utils.extend(DashedLine, PB.Line);

	DashedLine.prototype.rePaint = function() {
		var z = this;
		if (z.shape.graphics.setLineDash) {
			z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).moveTo(z.startX, z.startY).lineTo(z.endX, z.endY);
		} else {
			z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10);
		}
	};

	PB.DashedLine = DashedLine;
})(createjs, paintBoard || {});