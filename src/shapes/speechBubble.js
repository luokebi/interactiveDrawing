;
(function(createjs, PB) {
	function SpeechBubble(conf) {
		this.shape = new createjs.Shape();
		this.shape.cursor = "move";
		PB.BoundShape.apply(this, arguments);
		this.cpX1 = this.cpY1 = 0;
		this.sAngle = 135 / 180 * Math.PI;
		this.eAngle = 475 / 180 * Math.PI;
		this.content = '';
		this.subType = "callout";
		this.shape.shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
	}

	PB.Utils.extend(SpeechBubble, PB.BoundShape);

	SpeechBubble.prototype.rePaint = function() {
		var z = this;
		var cx = z.bounds.width / 2 + z.bounds.x,
			cy = z.bounds.height / 2 + z.bounds.y;
		z.shape.graphics.clear().beginFill(z.strokeColor).drawEllipseByAngle(cx, cy, z.bounds.width / 2, z.bounds.height / 2, 0, z.sAngle, z.eAngle, false).lineTo(z.cpX1, z.cpY1).closePath();
	};

	SpeechBubble.prototype.drawOutline = function() {
		var z = this;
		if (!z.outline) {
			z.outline = new createjs.Shape();
			z.outline._type = 'outline';
			z.outline.shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
		}
		if (!z.selected) {
			var stage = this.shape.getStage();
			var index = stage.getChildIndex(this.shape);
			var oindex = index === 0 ? 0 : index - 1;
			stage.addChildAt(z.outline, index);
		}

		var cx = z.bounds.width / 2 + z.bounds.x,
			cy = z.bounds.height / 2 + z.bounds.y;

		z.outline.graphics.clear().beginFill('#fff').drawEllipseByAngle(cx, cy, z.bounds.width / 2 + 6, z.bounds.height / 2 + 6, 0, z.sAngle, z.eAngle, false).lineTo(z.cpX1 - 6, z.cpY1 + 6).closePath();
	};

	PB.SpeechBubble = SpeechBubble;
})(createjs, paintBoard || {});