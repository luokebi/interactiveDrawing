var shapeType = null;
var lastShape = null;

var elements = [];

var shapes = ['rect', 'ellipse', 'r-rect'];



$('#actions').find('.btn').on('click', function() {
	shapeType = $(this).siblings('.btn').removeClass('active').end().addClass('active').attr('id');
	if (shapeType == 'text') {
		$(canvas).on('click', function(e) {
			if (modifyText == true) {
				return;
			}
			if (!$('#temp-input').is(':visible')) {
				mouseX = e.clientX;
				mouseY = e.clientY;
				$('#temp-input').show().css({
					left: stage.mouseX,
					top: stage.mouseY
				}).focus();
			} else {
				if ($('#temp-input').val() != '') {
					var content = $('#temp-input').val();
					drawText(content, stageX, stageY);

					$('#temp-input').hide().val('');
				} else {
					$('#temp-input').hide();
				}
			}
		});
	} else {
		$(canvas).off('click');
	}
});

$('#insert-pic').on('click', function() {
	var image = new Image();
	image.src = "assets/tick-off.png";
	image.width = "100px";
	image.height = '200px;'
	image.crossOrigin = "Anonymous";
	image.onload = insert;

	function insert() {
		var bitmap = new createjs.Bitmap(image);
		bitmap.x = 100;
		bitmap.y = 100;
		bitmap.regX = 50;
		bitmap.regY = 50;
		bitmap.scaleX = 0.5;
		bitmap.scaleY = 0.5;
		bitmap.cursor = 'move';
		bitmap.addEventListener('mousedown', smouseDown, false);
		bitmap.addEventListener('pressmove', pressMove, false);
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			bitmap.shadow = null;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}

});

$('#insert-svg').on('click', function() {
	var image = new Image();
	image.src = "assets/check.svg";
	image.width = "100px";
	image.height = '200px;'
	image.crossOrigin = "Anonymous";
	image.onload = insert;

	function insert() {
		var bitmap = new createjs.Bitmap(image);
		bitmap.x = 100;
		bitmap.y = 100;
		/*bitmap.regX = 50;
	bitmap.regY = 50;*/
		bitmap.cursor = 'move';
		bitmap.addEventListener('mousedown', smouseDown);
		bitmap.addEventListener('pressmove', pressMove);
		bitmap.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			stage.update();
		}, false);

		bitmap.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			bitmap.shadow = null;
			stage.update();
		}, false);

		stage.addChild(bitmap);
		stage.update();
	}

});


$('#switcher').find('.btn').on('click', function() {
	$(this).siblings('.btn').removeClass('active').end().addClass('active');

});

var canvas = document.querySelector('#test');
var stage = new createjs.Stage("test");
stage.enableMouseOver(10);
var creating = false;
var hoverShape = false;
var modifyText = false;
var mouseX = 0;
var mouseY = 0;
var stageX = 0;
var stageY = 0;


var image = new Image();
image.src = "assets/test.png";
image.crossOrigin = "Anonymous";
image.onload = function() {
	var bitmap = new createjs.Bitmap(image);
	bitmap.on('mousedown', function(e) {
		console.log('image mous', e);
		removeOutline(lastShape);
	});
	stage.addChild(bitmap);
	stage.update();

};

stage.addEventListener('stagemousedown', mouseDown, false);

document.querySelector('#off').addEventListener('click', function() {
	console.log('off');
	stage.off('stagemousedown', mouseDown, false);
});

document.querySelector('#on').addEventListener('click', function() {
	console.log('on');
	stage.addEventListener('stagemousedown', mouseDown, false);
});



//stage.addEventListener('click', onStageClick, false);

function onStageClick(e) {
	console.log(e, stage);
	if (shapeType == 'text') {
		$('#temp-input').show().css({
			left: stage.mouseX,
			top: stage.mouseY
		});
	}
}


function drawText(content, x, y) {
	var text = new createjs.Text(content, "20px Arial", "#ff7700");
	text.x = stageX;
	text.y = stageY;
	text.addEventListener('mousedown', smouseDown, false);
	text.addEventListener('pressmove', pressMove, false);

	hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, text.getMeasuredWidth(), text.getMeasuredHeight());
	text.hitArea = hitArea;
	text.cursor = 'move';
	text.addEventListener('mouseover', function(e) {
		console.log('mouseover', e);
		hoverShape = true;
		//canvas.classList.remove('normal');
		//document.body.style.cursor = 'move';
		text.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		stage.update();
	}, false);

	text.addEventListener('mouseout', function() {
		console.log('mouseout');
		hoverShape = false;
		//canvas.classList.add('normal');
		//document.body.style.cursor = 'auto';
		text.shadow = null;
		stage.update();
	}, false);

	text.addEventListener('dblclick', function(e) {
		var contnet = text.text;
		modifyText = true;
		console.log(text);
		$('#temp-input').val(contnet).show().css({
			left: e.stageX,
			top: e.stageY
		})
			.focus()
			.on('blur', function() {
				text.text = $(this).val();
				hitArea.graphics.clear().beginFill("#FFF").drawRect(0, 0, text.getMeasuredWidth(), text.getMeasuredHeight());
				modifyText = false;
				$(this).val('').off('blur');
				stage.update();
			});
	}, false);
	stage.addChild(text);
	stage.update();
}

$('#on').trigger('click');
$('#rect').trigger('click');


function mouseDown(e) {
	console.log('stagemousedown', e);

	if (shapeType == 'text') {
		if (!$('#temp-input').is(':visible')) {
			stageX = e.stageX;
			stageY = e.stageY;
			return;
		}
	}

	if (hoverShape) {

		return;
	};

	var originalX = _oX = e.stageX;
	var originalY = _oY = e.stageY;

	if (shapeType == 'blur') {
		creating = true;
		var image = new Image();
		image.src = "assets/test.png";
		image.crossOrigin = "Anonymous";

		image.onload = insert;

		var bitmap = new createjs.Bitmap(image);

		function insert() {

			var blurFilter = new createjs.BlurFilter(10, 10, 1);
			bitmap.filters = [blurFilter];
			bitmap.cursor = 'move';


			/*bitmap.sourceRect = new createjs.Rectangle(ori, 100, 100, 100);
		bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
		bitmap.x = 100;
		bitmap.y = 100;
		bitmap.cache(0, 0, 100, 100);*/
			bitmap.x = originalX;
			bitmap.y = originalY;
			bitmap.cache(0, 0, 0, 0);
			bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			bitmap.addEventListener('mousedown', smouseDown);
			bitmap.addEventListener('pressmove', function(e) {
				if (creating) {
					return;
				}
				var z = e.target;
				z.x = e.stageX + z.offset.x;
				z.y = e.stageY + z.offset.y;
				z.sourceRect = new createjs.Rectangle(z.x, z.y, z.width, z.height);
				z.cache(0, 0, z.width, z.height);
				stage.update();
			});
			bitmap.addEventListener('mouseover', function(e) {
				if (creating) {
					return;
				}
				console.log('mouseover', e);
				hoverShape = true;
				bitmap.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
				stage.update();
			}, false);

			bitmap.addEventListener('mouseout', function() {
				console.log('mouseout');
				hoverShape = false;
				bitmap.shadow = null;
				stage.update();
			}, false);

			stage.addChild(bitmap);
			stage.update();
		}

	} else {

		var shape = new createjs.Shape();
		//shape.graphics.beginStroke("#000").setStrokeStyle(8,"round").drawEllipse(e.stageX, e.stageY, 0, 0);
		creating = true;
		shape.addEventListener('mousedown', smouseDown, false);
		shape.addEventListener('pressmove', pressMove, false);
		shape.addEventListener('pressup', function(e) {
			if (e.currentTarget._startX != e.stageX && e.currentTarget._startY != e.stageY) {
				undoManager.createUndo({
					target: e.currentTarget,
					x: e.currentTarget.backup.x,
					y: e.currentTarget.backup.y,
					bounds: cloneObj(e.currentTarget.backup.bounds)

				});
			}
		});
		stage.addChild(shape);
		shape.cursor = 'move';
		shape._points = [];
		shape._handlers = {};

		shape._type = shapeType;


		//hitArea.graphics.beginFill("#FFF").drawEllipse(e.stageX, e.stageY, 1, 1);

		shape.addEventListener('mouseover', function(e) {
			if (creating) {
				return;
			}
			console.log('mouseover', e);
			hoverShape = true;
			shape.shadow = new createjs.Shadow("#FF1414", 0, 0, 10);
			stage.update();
		}, false);

		shape.addEventListener('mouseout', function() {
			console.log('mouseout');
			hoverShape = false;
			shape.shadow = null;
			stage.update();
		}, false);

		if ($.inArray(shapeType, shapes) != -1) {
			var hitArea = new createjs.Shape();
			shape.hitArea = hitArea;
		}

	}



	stage.addEventListener('stagemousemove', smouseMove, false);

	function smouseMove(e) {
		switch (shapeType) {
			case 'rect':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'r-rect':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawRoundRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY, 10);
				break;
			case 'ellipse':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawEllipse(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'circle':
				shape.graphics.clear().beginFill("rgba(0,0,0,0)").beginStroke("#000").setStrokeStyle(8, "round").drawCircle(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				break;
			case 'line':
				shape.graphics.clear().setStrokeStyle(8, "round").beginStroke("#000").moveTo(originalX, originalY).lineTo(e.stageX, e.stageY);
				shape.linePoint = {
					startX: originalX,
					startY: originalY,
					endX: e.stageX,
					endY: e.stageY
				};
				break;
			case 'arrow':
				var angle = Math.atan2(e.stageY - originalY, e.stageX - originalX) * 180 / Math.PI;
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000").lineTo(originalX, originalY).lineTo(e.stageX, e.stageY).setStrokeStyle(8).beginStroke("#000").beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 1.5, 3, 0.5, angle);
				shape.linePoint = {
					startX: originalX,
					startY: originalY,
					endX: e.stageX,
					endY: e.stageY
				};
				break;
			case 'free-arrow':
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000");
				//shape.graphics/*.moveTo(_oX, _oY)*/.lineTo(e.stageX, e.stageY);
				shape._points.push({
					x: e.stageX,
					y: e.stageY
				});
				var angle = Math.atan2(e.stageY - _oY, e.stageX - _oX) * 180 / Math.PI;

				setTimeout(function() {
					_oX = e.stageX;
					_oY = e.stageY;
				}, 100)

				for (var i = 0; i < shape._points.length; i++) {
					var p = shape._points[i];

					shape.graphics.lineTo(p.x, p.y);
				}

				shape.graphics.endStroke().setStrokeStyle(8).beginStroke('#000').beginFill("#000").endStroke().drawPolyStar(e.stageX, e.stageY, 8 * 2.5, 3, 0.5, angle);
				break;
			case 'free-line':
				shape.graphics.clear().setStrokeStyle(8, "round", "round").beginStroke("#000");
				//shape.graphics/*.moveTo(_oX, _oY)*/.lineTo(e.stageX, e.stageY);
				shape._points.push({
					x: e.stageX,
					y: e.stageY
				});
				_oX = e.stageX;
				_oY = e.stageY

				for (var i = 0; i < shape._points.length; i++) {
					var p = shape._points[i];

					shape.graphics.lineTo(p.x, p.y);
				}
				break;
			case 'blur':
				bitmap.sourceRect = new createjs.Rectangle(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
				bitmap.cache(0, 0, e.stageX - originalX, e.stageY - originalY);
				bitmap.width = e.stageX - originalX;
				bitmap.height = e.stageY - originalY;
				stage.update();
				break;
		}

		if (shapeType != 'free-line' && shapeType != 'free-arrow') {
			if (shapeType == 'blur') {
				return;
			}
			shape.setBounds(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
			if ($.inArray(shapeType, shapes) != -1) {
				shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
			}

		} else {

			var max = {
				x: 0,
				y: 0
			};

			var min = {
				x: 99999,
				y: 99999
			};

			for (var i = 0, n = shape._points.length; i < n; i++) {
				var p = shape._points[i];
				if (p.x > max.x) {
					max.x = p.x;
				}
				if (p.y > max.y) {
					max.y = p.y;
				}
				if (p.x < min.x) {
					min.x = p.x;
				}
				if (p.y < min.y) {
					min.y = p.y;
				}
			}


			shape.setBounds(0, 0, 0, 0);
			//shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(min.x, min.y, max.x - min.x, max.y - min.y);
		}

		stage.update();
	}

	stage.addEventListener('stagemouseup', function(e) {
		console.log("stagemouseup");
		if (stage.mouseInBounds) {
			if (e.stageX == originalX && e.stageY == originalY) {
				stage.removeChild(shape);
			}
			creating = false;
			stage.off('stagemousemove', smouseMove, false);
			if (bitmap) {
				bitmap.shadow = null;
			}

		}

	}, false);
	stage.update();
}

function smouseDown(e) {
	var z = e.target;
	bringToTop(z);
	z.backup = {
		bounds: z.getBounds().clone(),
		x: z.x,
		y: z.y
	};
	console.log("smouseDown", e);
	z._startX = e.stageX;
	z._startY = e.stageY;
	var offsetX = z.x - e.stageX;
	var offsetY = z.y - e.stageY;
	z.offset = {
		x: offsetX,
		y: offsetY
	};
	//$('#off').trigger('click');

	z.previous_bounds = z.getBounds().clone();
	z.prev_linePoint = cloneObj(z.linePoint);

	removeOutline(lastShape);
	lastShape = z;

	//if (e.target._type == 'rect' || e.target._type == 'ellipse' || e.target._type == 'r-rect') {
	drawOutline(z);
	//}
}


    
function pressMove(e) {
	if (creating) {
		return;
	}
	var z = e.currentTarget;
	var bounds = z.previous_bounds;
	var moveX = e.stageX - z._startX;
	var moveY = e.stageY - z._startY;
	//console.log('pressmove',bounds);
	//console.log(moveX);

	z.x = e.stageX + z.offset.x;
	z.y = e.stageY + z.offset.y;
	if ($.inArray(z._type, shapes) != -1) {
		z.setBounds(bounds.x + moveX, bounds.y + moveY, bounds.width, bounds.height);
	}


	if (z.linePoint) {
		z.linePoint.startX = z.prev_linePoint.startX + moveX;
		z.linePoint.endX = z.prev_linePoint.endX + moveX;
		z.linePoint.startY = z.prev_linePoint.startY + moveY;
		z.linePoint.endY = z.prev_linePoint.endY + moveY;
	}

	//console.log(bounds.x, moveX, z.getBounds().clone());

	if (e.target._type == 'rect' || e.target._type == 'ellipse' || e.target._type == 'r-rect' || e.target._type == 'line' || e.target._type == 'arrow') {
		drawOutline(z);
	} else {
		stage.update();
	}
	//shape.setBounds(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
	//shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(originalX, originalY, e.stageX - originalX, e.stageY - originalY);
	//stage.update();

}

function removeOutline(shape) {
	console.log(shape);
	if (shape && shape._handlers && (shape._handlers.lt || shape._handlers.start)) {
		for (var i in shape._handlers) {
			stage.removeChild(shape._handlers[i]);
		}
		stage.update();
	}
}


function drawOutline(shape) {
	//console.log(shape);

	if (shape._type == 'line' || shape._type == 'arrow') {
		var p = shape.linePoint;
		handlers = [{
			name: 'start',
			cursor: 'move',
			x: p.startX,
			y: p.startY
		}, {
			name: 'end',
			cursor: 'move',
			x: p.endX,
			y: p.endY
		}];

		$.each(handlers, function(i, h) {
			var r = shape._handlers[h.name];
			if (!r) {
				var r = new createjs.Shape();
				r._type = 'handler';
				r.name = h.name;
				r.cursor = h.cursor;
				shape._handlers[h.name] = r;

				r.on('pressmove', function(e) {
					var sx, sy, ex, ey;
					var p = cloneObj(shape.linePoint);
					if (r.name == 'end') {
						sx = p.startX;
						sy = p.startY;
						ex = e.stageX;
						ey = e.stageY;
					} else {
						sx = e.stageX;
						sy = e.stageY;
						ex = p.endX;
						ey = p.endY;
					}
					rePaintLine(shape, sx, sy, ex, ey);
					drawOutline(shape);
				});

				r.on('mouseover', function() {
					hoverShape = true;
				});
				r.on('mouseout', function() {
					hoverShape = false;
				});


			}
			stage.addChild(r);

			r.center = {
				x: h.x,
				y: h.y
			};

			r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('#fff').drawCircle(h.x, h.y, 6);
		});
	} else {
		var bounds = shape.getBounds().clone(),
			x = bounds.x,
			y = bounds.y,
			width = bounds.width,
			height = bounds.height,
			handlers = [{
				name: 'lt',
				cursor: 'nwse-resize',
				x: x,
				y: y
			}, {
				name: 'rt',
				cursor: 'nesw-resize',
				x: x + width,
				y: y
			}, {
				name: 'lb',
				cursor: 'nesw-resize',
				x: x,
				y: y + height
			}, {
				name: 'rb',
				cursor: 'nwse-resize',
				x: x + width,
				y: y + height
			}];

		$.each(handlers, function(i, h) {
			var r = shape._handlers[h.name];
			if (!r) {
				var r = new createjs.Shape();
				r._type = 'handler';
				r.name = h.name;
				r.cursor = h.cursor;
				shape._handlers[h.name] = r;

				r.on('pressmove', function(e) {
					var bounds = shape.getBounds().clone();
					var rx, ry, rw, rh;
					if (r.name == 'rb') {
						rx = bounds.x;
						ry = bounds.y;
						rw = e.stageX - bounds.x;
						rh = e.stageY - bounds.y
					} else if (r.name == 'lb') {
						rx = e.stageX;
						ry = bounds.y;
						rw = bounds.x - e.stageX + bounds.width;
						rh = e.stageY - bounds.y;
					} else if (r.name == 'lt') {
						rx = e.stageX;
						ry = e.stageY;
						rw = bounds.x - e.stageX + bounds.width;
						rh = bounds.y - e.stageY + bounds.height;
					} else if (r.name == 'rt') {
						rx = bounds.x;
						ry = e.stageY;
						rw = e.stageX - bounds.x;
						rh = bounds.y - e.stageY + bounds.height;
					}
					rePaint(shape, rx, ry, rw, rh);
					drawOutline(shape);
				});

				r.on('mouseover', function() {
					hoverShape = true;
				});
				r.on('mouseout', function() {
					hoverShape = false;
				});

				r.on('mousedown', function() {
					var z = shape;
					z.backup = {
						bounds: z.getBounds().clone(),
						x: z.x,
						y: z.y
					};
				});

				r.on('pressup', function(e) {

					undoManager.createUndo({
						target: shape,
						x: shape.backup.x,
						y: shape.backup.y,
						bounds: cloneObj(shape.backup.bounds)

					});
				});


			}

			stage.addChild(r);

			r.center = {
				x: h.x,
				y: h.y
			};

			r.graphics.clear().setStrokeStyle(1).beginStroke('#000').beginFill('#fff').drawCircle(h.x, h.y, 6);



		});
	}


	stage.update();


}

function rePaint(shape, x, y, w, h) {
	hoverShape = true;
	var sg = shape.graphics.clear().beginStroke("#000").setStrokeStyle(8, "round");

	if (shape._type == 'rect') {
		sg.drawRect(x - shape.x, y - shape.y, w, h);
	} else if (shape._type == 'ellipse') {
		sg.drawEllipse(x - shape.x, y - shape.y, w, h);
	} else if (shape._type == 'r-rect') {
		sg.drawRoundRect(x - shape.x, y - shape.y, w, h, 10);
	}

	shape.hitArea.graphics.clear().beginFill("#FFF").drawRect(x - shape.x, y - shape.y, w, h);
	shape.setBounds(x, y, w, h);
	stage.update();
}


function rePaintLine(shape, sx, sy, ex, ey) {
	hoverShape = true;
	var sg = shape.graphics.clear().setStrokeStyle(8, "round").beginStroke("#000");
	if (shape._type == 'line') {
		sg.moveTo(sx - shape.x, sy - shape.y).lineTo(ex - shape.x, ey - shape.y);
	} else if (shape._type == 'arrow') {
		var angle = Math.atan2(ey - sy, ex - sx) * 180 / Math.PI;
		sg.lineTo(sx - shape.x, sy - shape.y).lineTo(ex - shape.x, ey - shape.y).setStrokeStyle(8).beginStroke("#000").beginFill("#000").endStroke().drawPolyStar(ex - shape.x, ey - shape.y, 8 * 1.5, 3, 0.5, angle);
	}


	shape.linePoint = {
		startX: sx,
		startY: sy,
		endX: ex,
		endY: ey
	};

}

function cloneObj(obj) {
	var newObj = {};
	for (var i in obj) {
		newObj[i] = obj[i];
	}

	return newObj;
}


function bringToTop(shape) {
	var index = stage.getChildIndex(shape);
	var num = stage.getNumChildren();
	stage.addChildAt(shape, num);
	if (shape._handlers && (shape._handlers.lt || shape._handlers.start)) {
		for (var i in shape._handlers) {
			var h = shape._handlers[i];
			stage.addChildAt(h, num);
		}
	}
}

var undoManager = (function() {
	var undos = [],
		redos = [];

	return {
		createUndo: function(o) {
			/*var children = [];
			for (var i = 0,n = stage.children.length;i < n;i++) {
				var c = stage.children[i].clone();
				c._bounds = cloneObj(stage.children[i]._bounds);
				c._type = stage.children[i]._type;
				c.previous_bounds = cloneObj(stage.children[i].previous_bounds);
				c.prev_linePoint = cloneObj(stage.children[i].linePoint);
				c.offset = cloneObj(stage.children[i].offset);
				c._startX = stage.children[i]._startX;
				c._startY = stage.children[i]._startY;
				c._listeners = cloneObj(stage.children[i]._listeners);
				c.hitArea = new createjs.Shape().graphics.beginFill("#FFF").drawRect(c._bounds.x, c._bounds.x, c._bounds.width, c._bounds.height);
				children.push(c);
			}*/

			undos.push(o);
		},

		undo: function() {
			removeOutline(lastShape);
			var u = undos.pop().undo;
			u.target.x = u.x;
			u.target.y = u.y;
			u.target.setBounds(u.bounds.x, u.bounds.y, u.bounds.width, u.bounds.height);
			u.target.graphics.clear().setStrokeStyle(8, "round").beginStroke("#000").drawRect(u.bounds.x - u.x, u.bounds.y - u.y, u.bounds.width, u.bounds.height);
			u.target.hitArea.graphics.clear().beginFill("#FFF").drawRect(u.bounds.x, u.bounds.y, u.bounds.width, u.bounds.height);
			stage.update();
			if (this.onChangeHandler) {
				this.onChangeHandler.call(null, undos.length, redos.length);
			}
		},

		redo: function() {
			var u = redos.pop();
			stage.children = u.children;
			stage.update();
			undos.push(u);
			if (this.onChangeHandler) {
				this.onChangeHandler.call(null, undos.length, redos.length);
			}
		},

		onChange: function(callback) {
			this.onChangeHandler = callback;
		},

		getUndos: function() {
			return undos;
		}
	};
})();