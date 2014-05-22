var paintBoard = PB = {};
PB.strokeColor = '#f00';
PB.color = '#f00';
PB.textSize = '24px';
PB.textFamily = "Arial";
PB.strokeSize = 8;
PB.creating = false;
PB.hoverShape = false;
PB.modifyText = false;
PB.shapeType = null;
PB.mouseX = 0;
PB.mouseY = 0;
PB.stageX = 0;
PB.stageY = 0;


(function(PB) {
	var Utils = {};

	Utils.extend = function(Child, Parent) {
		var F = function() {};　　　　
		F.prototype = Parent.prototype;　　　　
		Child.prototype = new F();　　　　
		Child.prototype.constructor = Child;　　　　
		Child.uber = Parent.prototype;
	};

	Utils.cloneObj = function(obj) {
		var newObj = {};
		for (var i in obj) {
			newObj[i] = obj[i];
		}

		return newObj;
	};

	Utils.cloneArray = function(arr) {
		var newArr = [];
		for (var i = 0, n = arr.length; i < n; i++) {
			newArr.push(arr[i]);
		}

		return newArr;
	};

	PB.Utils = Utils;
})(paintBoard || {});

(function(PB) {
	function Board(canvasId) {
		this.stage = new createjs.Stage(canvasId);
		this.init();

		return PB;
	}

	Board.prototype.init = function() {
		var z = this;

		PB.temp_input = document.createElement('textarea');
		PB.temp_input.id = 'temp_input';
		PB.temp_input.style.position = 'absolute';
		PB.temp_input.style.display = 'none';
		document.body.appendChild(PB.temp_input);

		/*document.getElementById('test').addEventListener('mousedown', function(e) {
			console.log(e.pageX, e.pageY);
			z.docX = e.pageX;
			z.docY = e.pageY;

			drawText(e.pageX, e.pageY);

		}, false);*/
		z.stage.enableMouseOver(10);

		z.stage.on('stagemousedown', mouseDown, false);

		function mouseDown(e) {
			if (!PB.shapeType) {
				return;
			} else if (PB.hoverShape) {
				return;
			}

			PB.creating = true;

			var originalX = e.stageX,
				originalY = e.stageY;

			switch (PB.shapeType) {
				case 'rect':
					var s = new PB.Rect(e.stageX, e.stageY);
					break;
				case 'ellipse':
					var s = new PB.Ellipse(e.stageX, e.stageY);
					break;
				case 'r-rect':
					var s = new PB.RoundRect(e.stageX, e.stageY);
					break;
				case 'line':
					var s = new PB.Line(e.stageX, e.stageY);
					break;
				case 'arrow':
					var s = new PB.Arrow(e.stageX, e.stageY);
					break;
				case 'free-line':
					var s = new PB.FreeLine(e.stageX, e.stageY);
					break;
				case 'free-arrow':
					var s = new PB.FreeArrow(e.stageX, e.stageY);
					break;
				case 'text':
					if (document.getElementById('temp_input').style.display == 'none') {
						z.textX = e.stageX;
						z.textY = e.stageY;
					}
					PB.creating = false;
					break;
			}

			if (!s) {
				return;
			}

			console.log(s);

			z.stage.addChild(s.shape);

			z.stage.addEventListener('stagemousemove', mousemove, false);
			z.stage.addEventListener('stagemouseup', mouseup, false);

			function mousemove(e) {

				if (s._type == 'shape') {
					s.bounds.width = e.stageX - s.bounds.x;
					s.bounds.height = e.stageY - s.bounds.y;
				} else if (s._type == 'line') {
					s.endX = e.stageX;
					s.endY = e.stageY;
				} else if (s._type == 'free') {
					s.points.push({
						x: e.stageX,
						y: e.stageY
					});
					var angle = Math.atan2(e.stageY - s._oY, e.stageX - s._oX) * 180 / Math.PI;

					setTimeout(function() {
						s._oX = e.stageX;
						s._oY = e.stageY;
					}, 100);

					s.endX = e.stageX;
					s.endY = e.stageY;
				}

				s.rePaint(angle);



				z.stage.update();
			}

			function mouseup(e) {
				if (z.stage.mouseInBounds) {
					if (e.stageX == originalX && e.stageY == originalY) {
						z.stage.removeChild(s);
					}
					PB.creating = false;

					z.stage.off('stagemousemove', mousemove, false);
				}
			}

		}

		function drawText(x, y) {
			if (PB.hoverShape) {
				return;
			}
			var temp_input = document.getElementById('temp_input');

			if (temp_input.style.display != 'none') {
				var content = temp_input.value;
				console.log(z);
				var text = new PB.Text(content, z.textX, z.textY);

				z.stage.addChild(text.shape);
				z.stage.update();

				temp_input.value = '';
				temp_input.style.display = 'none';
			} else {
				temp_input.style.left = x + 'px';
				temp_input.style.top = y + 'px';
				temp_input.style.display = 'block';

				setTimeout(function() {
					temp_input.focus();
				}, 10);
			}



		}
	};

	PB.Board = Board;
})(paintBoard || {});

/****Shape***/
(function(PB) {
	function Shape(x, y) {
		this.bounds = {
			x: x,
			y: y,
			width: 0,
			height: 0
		};

		this._startX = 0;
		this._startY = 0;
		this.shape = new createjs.Shape();
		this._type = 'shape';

		this.init();
	}

	Shape.prototype.init = function() {
		var z = this;

		z.strokeColor = PB.strokeColor;
		z.color = PB.color;
		z.strokeSize = PB.strokeSize;

		z.shape.cursor = 'move';
		z.shape.hitArea = new createjs.Shape();

		z.shape.addEventListener('mouseover', function() {
			console.info('shape mouseover');
			PB.hoverShape = true;
			z.shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mouseout', function() {
			PB.hoverShape = false;
			z.shape.shadow = null;
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mousedown', function(e) {
			z.bringToTop();
			z.backup = {
				bounds: PB.Utils.cloneObj(z.bounds),
				x: z.shape.x,
				y: z.shape.y
			};

			z._startX = e.stageX;
			z._startY = e.stageY;

			var offsetX = z.shape.x - e.stageX;
			var offsetY = z.shape.y - e.stageY;
			z.offset = {
				x: offsetX,
				y: offsetY
			};

			PB.lastShape = z;
		}, false);

		z.shape.addEventListener('pressmove', function(e) {
			if (PB.creating) {
				return;
			}

			var moveX = e.stageX - z._startX;
			var moveY = e.stageY - z._startY;

			var prev_bounds = z.backup.bounds;
			z.setBounds(prev_bounds.x + moveX, prev_bounds.y + moveY, prev_bounds.width, prev_bounds.height);
			z.rePaint();
			z.shape.getStage().update();
		});
	};

	Shape.prototype.setBounds = function(x, y, w, h) {
		this.bounds = {
			x: x,
			y: y,
			width: w,
			height: h
		};
	}

	Shape.prototype.bringToTop = function() {
		var z = this,
			stage = z.shape.getStage(),
			index = stage.getChildIndex(z.shape),
			num = stage.getNumChildren();

		stage.addChildAt(z.shape, num);


	};

	Shape.prototype.drawHandlers = function() {

	};

	PB.Shape = Shape;
})(paintBoard || {});

/****Free shape******/
(function(PB) {
	function FreeShape(x, y) {
		this.points = [];
		this._type = 'free';
		this._oX = x;
		this._oY = y;
		this.shape = new createjs.Shape();

		this.init();
	};

	FreeShape.prototype.init = function() {
		var z = this;
		z.strokeColor = PB.strokeColor;
		z.color = PB.color;
		z.strokeSize = PB.strokeSize;
		z.shape.cursor = 'move';

		z.shape.addEventListener('mouseover', function() {
			if (PB.creating) {
				return;
			}
			PB.hoverShape = true;
			z.shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mouseout', function() {
			PB.hoverShape = false;
			z.shape.shadow = null;
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mousedown', function(e) {

			z.bringToTop();
			z.backup = {
				points: PB.Utils.cloneArray(z.points),
				x: z.shape.x,
				y: z.shape.y
			};

			var offsetX = z.shape.x - e.stageX;
			var offsetY = z.shape.y - e.stageY;
			z.offset = {
				x: offsetX,
				y: offsetY
			};
			z._startX = e.stageX;
			z._startY = e.stageY;
		}, false);

		z.shape.addEventListener('pressmove', function(e) {
			if (PB.creating) {
				return;
			}

			var moveX = e.stageX - z._startX;
			var moveY = e.stageY - z._startY;

			z.shape.x = e.stageX + z.offset.x;
			z.shape.y = e.stageY + z.offset.y;

			z.shape.getStage().update();
		});
	};

	FreeShape.prototype.bringToTop = function() {
		var z = this,
			stage = z.shape.getStage(),
			index = stage.getChildIndex(z.shape),
			num = stage.getNumChildren();

		stage.addChildAt(z.shape, num);


	};
	PB.FreeShape = FreeShape;
})(paintBoard || {});


/********Line shape*********/
(function(PB) {
	function LineShape(x, y) {
		this.startX = x;
		this.startY = y;
		this.endX = x;
		this.endY = y;
		this.shape = new createjs.Shape();
		this._type = 'line';

		this.init();
	}

	LineShape.prototype.init = function() {
		var z = this;

		z.strokeColor = PB.strokeColor;
		z.color = PB.color;
		z.strokeSize = PB.strokeSize;
		z.shape.cursor = 'move';

		z.shape.addEventListener('mouseover', function() {
			if (PB.creating) {
				return;
			}
			PB.hoverShape = true;
			z.shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mouseout', function() {
			PB.hoverShape = false;
			z.shape.shadow = null;
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mousedown', function(e) {
			z.bringToTop();
			z.backup = {
				startX: z.startX,
				startY: z.startY,
				endX: z.endX,
				endY: z.endY
			};

			z._startX = e.stageX;
			z._startY = e.stageY;
		}, false);

		z.shape.addEventListener('pressmove', function(e) {
			if (PB.creating) {
				return;
			}

			var moveX = e.stageX - z._startX;
			var moveY = e.stageY - z._startY;

			z.startX = z.backup.startX + moveX;
			z.startY = z.backup.startY + moveY;
			z.endX = z.backup.endX + moveX;
			z.endY = z.backup.endY + moveY;
			z.rePaint();

			z.shape.getStage().update();
		});



	};

	LineShape.prototype.bringToTop = function() {
		var z = this,
			stage = z.shape.getStage(),
			index = stage.getChildIndex(z.shape),
			num = stage.getNumChildren();

		stage.addChildAt(z.shape, num);


	};
	paintBoard.LineShape = LineShape;
})(paintBoard || {});


/***********Line***********/
(function(PB) {
	function Line(x, y) {
		PB.LineShape.call(this, x, y);
	};

	PB.Utils.extend(Line, PB.LineShape);

	Line.prototype.rePaint = function() {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).moveTo(this.startX, this.startY).lineTo(this.endX, this.endY);
	};

	Line.prototype.drawHandlers = function() {

	}

	PB.Line = Line;
})(paintBoard || {});


/***********Arrow***********/
(function(PB) {
	function Arrow(x, y) {
		PB.LineShape.call(this, x, y);
	};

	PB.Utils.extend(Arrow, PB.LineShape);

	Arrow.prototype.rePaint = function() {
		var angle = Math.atan2(this.endY - this.startY, this.endX - this.startX) * 180 / Math.PI;
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).lineTo(this.startX, this.startY).lineTo(this.endX, this.endY).setStrokeStyle(8).beginStroke(this.strokeColor).beginFill(this.strokeColor).endStroke().drawPolyStar(this.endX, this.endY, 8 * 1.5, 3, 0.5, angle);;
	};

	Arrow.prototype.drawHandlers = function() {

	}

	PB.Arrow = Arrow;
})(paintBoard || {});

/***********Free line***********/
(function(PB) {
	function FreeLine(x, y) {
		PB.FreeShape.call(this, x, y);
	};

	PB.Utils.extend(FreeLine, PB.FreeShape);

	FreeLine.prototype.rePaint = function() {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor);
		for (var i = 0; i < this.points.length; i++) {
			var p = this.points[i];

			this.shape.graphics.lineTo(p.x, p.y);
		}
	};

	FreeLine.prototype.drawHandlers = function() {

	}

	PB.FreeLine = FreeLine;
})(paintBoard || {});

/***********Free arrow***********/
(function(PB) {
	function FreeArrow(x, y) {
		PB.FreeShape.call(this, x, y);
	};

	PB.Utils.extend(FreeArrow, PB.FreeShape);

	FreeArrow.prototype.rePaint = function(angle) {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor);
		for (var i = 0; i < this.points.length; i++) {
			var p = this.points[i];

			this.shape.graphics.lineTo(p.x, p.y);
		}

		this.shape.graphics.endStroke().setStrokeStyle(this.strokeSize).beginStroke(this.strokeColor).beginFill(this.strokeColor).endStroke().drawPolyStar(this.endX, this.endY, 8 * 2.5, 3, 0.5, angle);
	};

	FreeArrow.prototype.drawHandlers = function() {

	}

	PB.FreeArrow = FreeArrow;
})(paintBoard || {});


/****Rectangle***/
(function(PB) {
	function Rect(x, y) {
		PB.Shape.call(this, x, y);
	};

	PB.Utils.extend(Rect, PB.Shape);

	Rect.prototype.rePaint = function() {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	};

	Rect.prototype.drawHandlers = function() {

	}

	PB.Rect = Rect;
})(paintBoard || {});


/****Round Rectangle***/
(function(PB) {
	function RoundRect(x, y) {
		PB.Shape.call(this, x, y);
	};

	PB.Utils.extend(RoundRect, PB.Shape);

	RoundRect.prototype.rePaint = function() {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawRoundRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, 10);
		this.shape.hitArea.graphics.clear().beginFill("#FFF").drawRoundRect(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height, 10);
	};

	RoundRect.prototype.drawHandlers = function() {

	}

	PB.RoundRect = RoundRect;
})(paintBoard || {});


/****ellipse***/
(function(PB) {
	function Ellipse(x, y) {
		PB.Shape.call(this, x, y);
	};

	PB.Utils.extend(Ellipse, PB.Shape);

	Ellipse.prototype.rePaint = function() {
		this.shape.graphics.clear().setStrokeStyle(this.strokeSize, "round", "round").beginStroke(this.strokeColor).drawEllipse(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
		this.shape.hitArea.graphics.clear().beginFill("#FFF").drawEllipse(this.bounds.x, this.bounds.y, this.bounds.width, this.bounds.height);
	};

	Ellipse.prototype.drawHandlers = function() {

	}

	PB.Ellipse = Ellipse;
})(paintBoard || {});


/****Text***/
(function(PB) {
	function Text(content, x, y) {
		this._type = 'text';
		this.content = content;
		this.x = x;
		this.y = y;

		this.init();
	};

	Text.prototype.init = function() {
		var z = this;

		this.strokeColor = PB.strokeColor;
		this.textSize = PB.textSize;
		this.textFamily = PB.textFamily;
		this.shape = new createjs.Text(this.content, this.textSize + " " + this.textFamily, this.strokeColor);
		this.shape.x = this.x;
		this.shape.y = this.y;
		this.shape.hitArea = new createjs.Shape();
		this.shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, this.shape.getMeasuredWidth(), this.shape.getMeasuredHeight());
		this.shape.cursor = 'move';

		z.shape.addEventListener('mouseover', function() {
			PB.hoverShape = true;
			z.shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mouseout', function() {
			PB.hoverShape = false;
			z.shape.shadow = null;
			z.shape.getStage().update();
		}, false);

		z.shape.addEventListener('mousedown', function(e) {
			//z.bringToTop();
			z.backup = {
				color: z.strokeColor,
				textSize: z.textSize,
				textFamily: z.textFamily,
				content: z.content,
				x: z.x,
				y: z.y
			};

			var offsetX = z.shape.x - e.stageX;
			var offsetY = z.shape.y - e.stageY;
			z.offset = {
				x: offsetX,
				y: offsetY
			};
			z._startX = e.stageX;
			z._startY = e.stageY;
		}, false);

		z.shape.addEventListener('pressmove', function(e) {
			if (PB.creating) {
				return;
			}

			var moveX = e.stageX - z._startX;
			var moveY = e.stageY - z._startY;

			z.shape.x = e.stageX + z.offset.x;
			z.shape.y = e.stageY + z.offset.y;

			z.shape.getStage().update();
		});


	};

	PB.Text = Text;
})(paintBoard || {});