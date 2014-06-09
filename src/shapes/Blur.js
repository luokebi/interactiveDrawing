;(function(createjs, PB) {
	function Blur(conf) {
		var image = new Image();
		image.src = "assets/test.png";
		this.shape = new createjs.Bitmap(image);
		this.shape.filters = [new createjs.BlurFilter(10, 10, 1)];
		this.shape.cache(0,0,0,0);
		this.shape.cursor = 'move';
		this.subType = 'blur';

		PB.BoundShape.apply(this, arguments);
	}

	PB.Utils.extend(Blur, PB.BoundShape);

	Blur.prototype.rePaint = function() {
		var z = this,
			s = z.shape;

		s.sourceRect = new createjs.Rectangle(z.bounds.x, z.bounds.y, z.bounds.width, z.bounds.height);
		s.image.x = z.bounds.x;
		s.image.y = z.bounds.y;
		s.x = z.bounds.x;
		s.y = z.bounds.y;
		s.cache(-2 , -2, z.bounds.width, z.bounds.height);
		s.width = z.bounds.width;
		s.height = z.bounds.height;
	};

	PB.Blur = Blur;
})(createjs, paintBoard || {});