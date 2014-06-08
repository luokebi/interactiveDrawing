/** 
 * Normal rectangle.
 =================================================*/

    
;(function(createjs, PB) {
	function Rect(conf) {
		this.shape = new createjs.Shape();
		//this.shape.hitArea = new createjs.Shape();
		this.shape.cursor = "move";
		PB.BoundShape.apply(this, arguments);
	}

	PB.Utils.extend(Rect, PB.BoundShape);

	Rect.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
		//z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
	};

	PB.Rect = Rect;
})(createjs, paintBoard || {});


/** 
 * Dashed rectangele.
 =================================================*/

    
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

/** 
 * Round rectangle.
 =================================================*/

(function(createjs, PB) {
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