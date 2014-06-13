;
(function(createjs, PB) {
	function Blur(conf) {
		var image = new Image();
		image.src = "assets/test2.jpg";

		this.shape = new createjs.Bitmap(blurCanvas);
		this.shape.cursor = 'move';
		this.subType = 'blur';

		PB.BoundShape.apply(this, arguments);
		var z = this;
		this.shape.sourceRect = new createjs.Rectangle(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
	}

	PB.Utils.extend(Blur, PB.BoundShape);

	Blur.prototype.rePaint = function() {
		var z = this,
			s = z.shape;

		s.sourceRect = new createjs.Rectangle(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
		s.x = z.bounds.x;
		s.y = z.bounds.y;
		
		s.width = z.bounds.width;
		s.height = z.bounds.height;
	};

	Blur.prototype.drawOutline = function() {
		var z = this;
		if (!z.outline) {
			z.outline = new createjs.Shape();
			z.outline._type = 'outline';
		}
		if (!z.selected) {
			var stage = this.shape.getStage();
			var index = stage.getChildIndex(this.shape);
			var oindex = index === 0 ? 0 : index - 1;
			stage.addChildAt(z.outline, index);
		}

		z.outline.graphics.clear().setStrokeStyle(2, "round", "round").setLineDash([3,3]).beginStroke('rgba(0,0,0,.6)').drawRect(z.bounds.x - 1, z.bounds.y - 1, z.bounds.width + 2, z.bounds.height + 2);
	};

	PB.Blur = Blur;
})(createjs, paintBoard || {});