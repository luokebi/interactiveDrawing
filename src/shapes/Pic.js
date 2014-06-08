;(function(createjs, PB) {
	function Pic(conf, image, x, y) {
		this.shape = new createjs.Bitmap(image);
		this.shape.cursor = "move";
		this.shape.x = x;
		this.shape.y = y;
		this.shape.width = image.width;
		this.shape.height = image.height;
		this.subType = 'pic';
		this.shape.hitArea = new createjs.Shape();
		PB.BoundShape.apply(this, arguments);
		this.bounds = {
			x: x,
			y: y,
			width: image.width,
			height: image.height
		}
		this.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, this.bounds.width, this.bounds.height);

	}

	PB.Utils.extend(Pic, PB.BoundShape);

	Pic.prototype.rePaint = function() {
		var z = this;
		z.shape.x = z.bounds.x;
		z.shape.y = z.bounds.y;
		z.shape.scaleX = z.bounds.width / z.shape.width;
		z.shape.scaleY = z.bounds.height / z.shape.height;
		z.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, z.bounds.width/z.shape.scaleX, z.bounds.height/z.shape.scaleY);
	};

	Pic.prototype.select = function() {
		this.drawHandlers();
		this.selected = true;
	};

	PB.Pic = Pic;
})(createjs, paintBoard || {});