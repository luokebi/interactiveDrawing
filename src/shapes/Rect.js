(function(createjs, PB) {
	function Rect(conf) {
		this.shape = new createjs.Shape();
		this.shape.hitArea = new createjs.Shape();
		this.shape.cursor = "move";
		PB.BoundShape.apply(this, arguments);
	}

	PB.Utils.extend(Rect, PB.BoundShape);

	Rect.prototype.rePaint = function() {
		var z = this;
		z.shape.graphics.clear().setStrokeStyle(z.strokeSize, "round", "round").beginStroke(z.strokeColor).drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
		z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
	};

	PB.Rect = Rect;
})(createjs, PB);