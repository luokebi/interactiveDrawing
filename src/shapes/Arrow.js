/** 
 * Normal arrow.
 =================================================*/

;
(function(createjs, PB) {
	function Arrow(conf) {
		PB.Line.apply(this, arguments);
	}

	PB.Utils.extend(Arrow, PB.Line);

	Arrow.prototype.rePaint = function() {
		var z = this;
		var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
		if (z.type === 'outline') {
			size = z.strokeSize * 1.5;
		} else {
			size = z.strokeSize * 2;
		}
		this.shape.graphics.clear().setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle).endStroke().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY);
	};

	PB.Arrow = Arrow;
})(createjs, paintBoard || {});


/** 
 * Dashed arrow.
 =================================================*/

(function(createjs, PB) {
	function DashedArrow(conf) {
		PB.Line.apply(this, arguments);
	}

	PB.Utils.extend(DashedArrow, PB.Line);

	DashedArrow.prototype.rePaint = function() {
		var z = this;
		var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
		if (z.type === 'outline') {
			size = z.strokeSize * 1.5;
		} else {
			size = z.strokeSize * 2;
		}
		if (z.shape.graphics.setLineDash) {
			this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle);
		} else {
			this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle);
		}
	};

	PB.DashedArrow = DashedArrow;
})(createjs, paintBoard || {});


/** 
 * Double arrow.
 =================================================*/

(function(createjs, PB) {
	function DoubleArrow(conf) {
		PB.Line.apply(this, arguments);
	}

	PB.Utils.extend(DoubleArrow, PB.Line);

	DoubleArrow.prototype.rePaint = function() {
		var z = this;
		var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
		if (z.type === 'outline') {
			size = z.strokeSize * 1.5;
		} else {
			size = z.strokeSize * 2;
		}
		this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, size, 3, 0.5, 180 + angle);
	};

	PB.DoubleArrow = DoubleArrow;
})(createjs, paintBoard || {});


/** 
 * Double dashed arrow.
 =================================================*/

(function(createjs, PB) {
	function DoubleDashedArrow(conf) {
		PB.Line.apply(this, arguments);
	}

	PB.Utils.extend(DoubleDashedArrow, PB.Line);

	DoubleDashedArrow.prototype.rePaint = function() {
		var z = this;
		var angle = Math.atan2(z.endY - z.startY, z.endX - z.startX) * 180 / Math.PI;
		if (z.type === 'outline') {
			size = z.strokeSize * 1.5;
		} else {
			size = z.strokeSize * 2;
		}
		if (z.shape.graphics.setLineDash) {
			this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").setLineDash([10]).beginStroke(z.strokeColor).lineTo(z.startX, z.startY).lineTo(z.endX, z.endY).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, size, 3, 0.5, 180 + angle);
		} else {
			this.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).dashedLineTo(z.startX, z.startY, z.endX, z.endY, 10).setStrokeStyle(z.strokeSize).beginStroke(z.strokeColor).beginFill(z.strokeColor).endStroke().drawPolyStar(z.endX, z.endY, size, 3, 0.5, angle).drawPolyStar(z.startX, z.startY, size, 3, 0.5, 180 + angle);
		}
	};

	PB.DoubleDashedArrow = DoubleDashedArrow;
})(createjs, paintBoard || {});