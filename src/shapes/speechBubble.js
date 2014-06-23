;
(function(createjs, PB) {
	function SpeechBubble(conf) {
		this.shape = new createjs.Container();
		this.bubble = new createjs.Shape();
		this.text = new createjs.Text(this.content, "24px Arial", '#fff');

		this.shape.addChild(this.bubble);
		this.shape.addChild(this.text);
		this.shape.cursor = "move";
		PB.BoundShape.apply(this, arguments);
		this.cpX1 = this.cpY1 = 0;
		this.sAngle = 135 / 180 * Math.PI;
		this.eAngle = 475 / 180 * Math.PI;
		this.content = '';
		this.subType = "callout";
		this.bubble.shadow = new createjs.Shadow('rgba(0,0,0,.4)', 0, 3, 4);
		this.text.shadow = null;
	}

	PB.Utils.extend(SpeechBubble, PB.BoundShape);

	SpeechBubble.prototype.rePaint = function() {
		var z = this;
		var cx = z.bounds.width / 2 + z.bounds.x,
			cy = z.bounds.height / 2 + z.bounds.y,
			sx = -Math.sqrt(2) * z.bounds.width / 4 + cx,
			sy = -Math.sqrt(2) * z.bounds.height / 4 + cy;
		z.text.x = sx + 10;
		z.text.y = sy + 10;
		z.bubble.graphics.clear().beginFill(z.strokeColor).drawEllipseByAngle(cx, cy, z.bounds.width / 2, z.bounds.height / 2, 0, z.sAngle, z.eAngle, false).lineTo(z.cpX1, z.cpY1).closePath();
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

		z.outline.graphics.clear().beginFill('#fff').drawEllipseByAngle(cx, cy, z.bounds.width / 2 + 6, z.bounds.height / 2 + 6, 0, z.sAngle + 0.02, z.eAngle - 0.02, false).lineTo(z.cpX1, z.cpY1).closePath();
	};

	PB.SpeechBubble = SpeechBubble;
})(createjs, paintBoard || {});