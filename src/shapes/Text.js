;(function(createjs, PB) {
	function Text(conf, content, x, y) {
		this.fontSize = conf.fontSize;
		this.fontFamily = conf.fontFamily;
		this.content = content;
		this.bounds = {
			x: x,
			y: y,
			width: 0,
			height: 0
		},
		this.shape = new createjs.Text(content, conf.fontSize + " " + conf.fontFamily, conf.strokeColor);
		this.shape.cursor = 'move';
		this.shape.x = x;
		this.shape.y = y;
		this.shape.hitArea = new createjs.Shape();

		PB.Shape.apply(this, arguments);

	}

	PB.Utils.extend(Text, PB.Shape);

	Text.prototype.rePaint = function() {
		var z = this;
		var text = z.shape;
		console.log(this);
		text.color = z.strokeColor;

		text.text = z.content;
		console.log(z.content);
		text.font = z.fontSize + " " + z.fontFamily;
		text.lineHeight = parseInt(z.fontSize);

		text.hitArea.graphics.clear().beginFill("#f00").drawRect(0, 0, z.bounds.width, z.bounds.height);
	};

	Text.prototype.select = function() {
		this.selected = true;
		this.shape.shadow = new createjs.Shadow(this.strokeColor, 0, 0, 10);
	};

	PB.Text = Text;
})(createjs, paintBoard || {});